import { useEffect, useRef, useCallback } from "react"

type UseChatSocketOpts = {
  businessId: number | string
  chatId?: number | string | null
  token: string
  onMessage?: (payload: any) => void
  onImages?: (payload: any) => void
  onOpen?: () => void
  onClose?: (ev?: CloseEvent) => void
  baseUrl?: string
}

export function useChatSocket({
  businessId,
  chatId,
  token,
  onMessage,
  onImages,
  onOpen,
  onClose,
  baseUrl,
}: UseChatSocketOpts) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectRef = useRef<number>(0)
  const shouldReconnect = useRef(true)

  // Use the provided production/test socket host; keep scheme matching current page protocol
  const SOCKET_HOST = "134.209.19.132:8000"
  const resolvedBase = baseUrl ?? (typeof window !== "undefined" && window.location.protocol === "https:" ? `wss://${SOCKET_HOST}` : `ws://${SOCKET_HOST}`)

  const buildUrl = useCallback(() => {
    const biz = encodeURIComponent(String(businessId))
    if (chatId)
      return `${resolvedBase}/chat/${biz}/${encodeURIComponent(String(chatId))}/?token=${encodeURIComponent(token)}`
    return `${resolvedBase}/chat/${biz}/?token=${encodeURIComponent(token)}`
  }, [businessId, chatId, token, resolvedBase])

  const connect = useCallback(() => {
    if (!businessId || !token) return
    const url = buildUrl()
    try {
      wsRef.current = new WebSocket(url)
    } catch (err) {
      return
    }

    wsRef.current.onopen = () => {
      reconnectRef.current = 0
      onOpen?.()
    }

    wsRef.current.onmessage = (ev) => {
      try {
        const raw = JSON.parse(ev.data)
        const d = raw.data ?? raw
        if (d?.message_type === "text") {
          onMessage?.(d)
        } else if (d?.message_type === "images" || Array.isArray(d?.image_urls)) {
          onImages?.(d)
        } else {
          onMessage?.(d)
        }
      } catch (err) {
        // ignore non-json messages
      }
    }

    wsRef.current.onclose = (ev) => {
      onClose?.(ev)
      if (shouldReconnect.current) {
        // simple incremental backoff + jitter
        reconnectRef.current = Math.min(30000, reconnectRef.current + 1000 + Math.floor(Math.random() * 2000))
        setTimeout(() => connect(), reconnectRef.current)
      }
    }

    wsRef.current.onerror = () => {
      try { wsRef.current?.close() } catch {}
    }
  }, [buildUrl, onMessage, onImages, onOpen, onClose])

  useEffect(() => {
    shouldReconnect.current = true
    connect()
    return () => {
      shouldReconnect.current = false
      try { wsRef.current?.close() } catch {}
    }
  }, [connect])

  const send = useCallback((payload: unknown) => {
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload as any))
        return true
      }
    } catch (err) {}
    return false
  }, [])

  return {
    send,
    socket: wsRef.current,
    reconnect: connect,
  }
}
