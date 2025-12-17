import { useEffect, useRef, useCallback } from 'react';
import { apiRequest } from '@/utils/apiHandler';
import { useUserContext } from '@/contexts/UserContext';

type UseChatSocketOpts = {
  businessId: number | string;
  chatId?: number | string | null;
  token: string;
  onMessage?: (payload: unknown) => void;
  onImages?: (payload: unknown) => void;
  onOpen?: () => void;
  onClose?: (ev?: CloseEvent) => void;
  /** Enable verbose console logging and internal debug recording */
  debug?: boolean;
  /** Callback invoked whenever a debug entry is recorded */
  onDebug?: (entry: ChatDebugEntry) => void;
  baseUrl?: string;
  /** maximum number of reconnect attempts before giving up (default: 20) */
  maxReconnectAttempts?: number;
};

export type ChatConnectionState = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

export interface ChatDebugEntry {
  ts: number;
  type:
    | 'connect_attempt'
    | 'open'
    | 'close'
    | 'error'
    | 'message_received'
    | 'message_sent'
    | 'reconnect_scheduled'
    | 'upload_start'
    | 'upload_success'
    | 'upload_error';
  detail?: Record<string, unknown>;
}

export function useChatSocket({
  businessId,
  chatId,
  token,
  onMessage,
  onImages,
  onOpen,
  onClose,
  debug = false,
  onDebug,
  baseUrl,
  maxReconnectAttempts,
}: UseChatSocketOpts) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<number>(0);
  const reconnectTimerRef = useRef<number | null>(null);
  const shouldReconnect = useRef(true);
  const debugLogsRef = useRef<ChatDebugEntry[]>([]);
  const statsRef = useRef({ messagesReceived: 0, messagesSent: 0, reconnects: 0 });
  const stateRef = useRef<ChatConnectionState>('idle');
  const reconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttemptsDefault = 20;
  type QueuedSend = {
    payload: Record<string, unknown>;
    resolve?: (value: boolean) => void;
    reject?: (reason?: unknown) => void;
  };
  const sendQueueRef = useRef<QueuedSend[]>([]);

  // Use the provided `baseUrl` when available; otherwise fall back to SOCKET_HOST
  // and pick `ws` vs `wss` depending on the current page protocol.
  const SOCKET_HOST = 'backend.delve.ng';
 
  const resolvedBase = baseUrl
    ? baseUrl.replace(/\/$/, '')
    : `wss://${SOCKET_HOST}`;

  const buildUrl = useCallback(() => {
    const biz = encodeURIComponent(String(businessId));
    if (chatId)
      return `${resolvedBase}/chat/${biz}/${encodeURIComponent(String(chatId))}/?token=${encodeURIComponent(token)}`;
    return `${resolvedBase}/chat/${biz}/?token=${encodeURIComponent(token)}`;
  }, [businessId, chatId, token, resolvedBase]);

  const pushDebug = useCallback((entry: ChatDebugEntry) => {
    try {
      debugLogsRef.current.push(entry);
      // update stats
      if (entry.type === 'message_received') statsRef.current.messagesReceived += 1;
      if (entry.type === 'message_sent') statsRef.current.messagesSent += 1;
      if (entry.type === 'reconnect_scheduled') statsRef.current.reconnects += 1;
      if (debug) console.log('[chat-debug]', entry.type, entry.detail ?? '');
      try {
        onDebug?.(entry);
      } catch (e) {
        // swallow
      }
    } catch (e) {
      // ignore
    }
  }, [debug, onDebug]);

  const connect = useCallback(() => {
    if (!businessId || !token) return;
    const maxAttempts = typeof maxReconnectAttempts !== 'undefined' ? maxReconnectAttempts : maxReconnectAttemptsDefault;
    // If we already have a socket open or connecting, don't start another one
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      pushDebug({ ts: Date.now(), type: 'error', detail: { message: 'connect_skipped_already_open_or_connecting' } });
      return;
    }
    // If we've exceeded reconnect attempts, stop trying
    if (reconnectAttemptsRef.current >= maxAttempts) {
      stateRef.current = 'error';
      pushDebug({ ts: Date.now(), type: 'error', detail: { message: 'max_reconnect_attempts_reached', attempts: reconnectAttemptsRef.current } });
      return;
    }
    stateRef.current = 'connecting';
    const url = buildUrl();
    pushDebug({ ts: Date.now(), type: 'connect_attempt', detail: { url } });
    try {
      wsRef.current = new WebSocket(url);
    } catch (err) {
      pushDebug({ ts: Date.now(), type: 'error', detail: { message: 'websocket_construct_failed' } });
      return;
    }

    wsRef.current.onopen = () => {
      // clear any pending reconnect timer
      if (reconnectTimerRef.current !== null) {
        try {
          clearTimeout(reconnectTimerRef.current as unknown as number);
        } catch (e) {}
        reconnectTimerRef.current = null;
      }
      reconnectRef.current = 0;
      reconnectAttemptsRef.current = 0;
      stateRef.current = 'open';
      pushDebug({ ts: Date.now(), type: 'open' });
      onOpen?.();
      // flush any queued sends (resolve promises when sent)
      try {
        while (sendQueueRef.current.length > 0 && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const item = sendQueueRef.current.shift();
          if (item) {
            try {
              wsRef.current.send(JSON.stringify(item.payload));
              pushDebug({ ts: Date.now(), type: 'message_sent', detail: { payload: item.payload, queued: true } });
              item.resolve?.(true);
            } catch (err) {
              item.reject?.(err);
            }
          }
        }
      } catch (e) {
        // ignore
      }
    };

    wsRef.current.onmessage = ev => {
      try {
        const raw = JSON.parse(ev.data);
        const d = raw.data ?? raw;
        pushDebug({ ts: Date.now(), type: 'message_received', detail: { raw } });
        if (d?.message_type === 'text') {
          onMessage?.(d);
        } else if (
          d?.message_type === 'images' ||
          Array.isArray(d?.image_urls)
        ) {
          onImages?.(d);
        } else {
          onMessage?.(d);
        }
      } catch (err) {
        pushDebug({ ts: Date.now(), type: 'error', detail: { message: 'parse_error' } });
      }
    };

    wsRef.current.onclose = ev => {
      stateRef.current = 'closed';
      pushDebug({ ts: Date.now(), type: 'close', detail: { code: ev?.code, reason: ev?.reason } });
      onClose?.(ev);
      if (shouldReconnect.current) {
        // simple incremental backoff + jitter
        reconnectRef.current = Math.min(30000, reconnectRef.current + 1000 + Math.floor(Math.random() * 2000));
        reconnectAttemptsRef.current += 1;
        statsRef.current.reconnects += 1;
        pushDebug({ ts: Date.now(), type: 'reconnect_scheduled', detail: { wait: reconnectRef.current, attempt: reconnectAttemptsRef.current } });
        // clear any existing timer then schedule
        if (reconnectTimerRef.current !== null) {
          try {
            clearTimeout(reconnectTimerRef.current as unknown as number);
          } catch (e) {}
          reconnectTimerRef.current = null;
        }
        reconnectTimerRef.current = window.setTimeout(() => {
          reconnectTimerRef.current = null;
          connect();
        }, reconnectRef.current);
      }
    };

    wsRef.current.onerror = () => {
      pushDebug({ ts: Date.now(), type: 'error', detail: { message: 'socket_error' } });
      try {
        wsRef.current?.close();
      } catch {}
    };
  }, [buildUrl, onMessage, onImages, onOpen, onClose, businessId, token, pushDebug, maxReconnectAttempts]);

  useEffect(() => {
    shouldReconnect.current = true;
    connect();
    return () => {
      shouldReconnect.current = false;
      try {
        wsRef.current?.close();
      } catch {}
      // clear scheduled reconnect timer on unmount
      if (reconnectTimerRef.current !== null) {
        try {
          clearTimeout(reconnectTimerRef.current as unknown as number);
        } catch (e) {}
        reconnectTimerRef.current = null;
      }
    };
  }, [connect]);

  const send = useCallback((payload: Record<string, unknown>): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      try {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          try {
            wsRef.current.send(JSON.stringify(payload));
            pushDebug({ ts: Date.now(), type: 'message_sent', detail: { payload } });
            resolve(true);
            return;
          } catch (err) {
            // sending failed synchronously
            reject(err);
            return;
          }
        }
      } catch (err) {
        // fallthrough to queue
      }

      // socket is not open — queue payload for retry when socket opens
      try {
        sendQueueRef.current.push({ payload, resolve, reject });
        pushDebug({ ts: Date.now(), type: 'message_sent', detail: { payload, queued: true } });
      } catch (e) {
        // if queueing fails, reject
        try {
          reject(e);
        } catch {}
      }
    });
  }, [pushDebug]);

  // Attempt to read sender id from user context; returns null if provider not present
  const userCtx = useUserContext();

  const sendText = useCallback(
    (message: string, senderId?: number | string): Promise<boolean> => {
      const resolvedSender = typeof senderId !== 'undefined' ? senderId : userCtx?.userId;
      const payload: Record<string, unknown> = {
        message_type: 'text',
        message,
      };
      if (typeof resolvedSender !== 'undefined' && resolvedSender !== null)
        payload['sender_id'] = resolvedSender;
      return send(payload);
    },
    [send, userCtx]
  );

  return {
    send,
    sendText,
    socket: wsRef.current,
    socketRef: wsRef,
    reconnect: connect,
    // debug helpers
    getDebugLogs: () => debugLogsRef.current.slice(),
    clearDebugLogs: () => {
      debugLogsRef.current.length = 0;
    },
    getStats: () => ({ ...statsRef.current }),
    getState: () => stateRef.current,
  };
}

export async function uploadChatImages({
  chatId,
  images,
}: {
  chatId: number | string;
  images: File[];
}, token?: string) {
  const fd = new FormData();
  fd.append('chat_id', String(chatId));
  for (const img of images) {
    fd.append('images', img);
  }

  const res = await apiRequest(`/api/chat/add-image/`, { method: 'POST', body: fd }, token, {
    skipAuthRedirect: true,
  });
  let data: { error?: string; message?: string } = {};
  try {
    data = await res.json();
  } catch (e) {
    throw new Error('Failed to parse upload response');
  }
  if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to upload images');
  return data;
}
