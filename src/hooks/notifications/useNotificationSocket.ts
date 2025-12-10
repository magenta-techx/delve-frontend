import { useEffect, useRef, useCallback } from 'react';

type UseNotificationSocketOpts = {
  businessId?: number | string | null;
  token: string;
  onNotification?: (payload: NotificationPayload) => void;
  onOpen?: () => void;
  onClose?: (ev?: CloseEvent) => void;
  /** Enable verbose console logging and internal debug recording */
  debug?: boolean;
  /** Callback invoked whenever a debug entry is recorded */
  onDebug?: (entry: NotificationDebugEntry) => void;
  baseUrl?: string;
  /** maximum number of reconnect attempts before giving up (default: 20) */
  maxReconnectAttempts?: number;
};

export type NotificationConnectionState = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

export interface NotificationDebugEntry {
  ts: number;
  type:
    | 'connect_attempt'
    | 'open'
    | 'close'
    | 'error'
    | 'notification_received'
    | 'reconnect_scheduled';
  detail?: Record<string, unknown>;
}

export type NotificationType = 'review_prompt' | 'review_received' | 'review_replied';

export interface NotificationPayload {
  type: NotificationType;
  business?: number;
  user?: number;
  attached_object_id: number;
  is_seen: boolean;
  message: string;
  created_when: string;
  title?: string;
  body?: string;
}

export function useNotificationSocket({
  businessId,
  token,
  onNotification,
  onOpen,
  onClose,
  debug = false,
  onDebug,
  baseUrl,
  maxReconnectAttempts,
}: UseNotificationSocketOpts) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<number>(0);
  const shouldReconnect = useRef(true);
  const debugLogsRef = useRef<NotificationDebugEntry[]>([]);
  const statsRef = useRef({ notificationsReceived: 0, reconnects: 0 });
  const stateRef = useRef<NotificationConnectionState>('idle');
  const reconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttemptsDefault = 20;

  // Use the provided `baseUrl` when available; otherwise fall back to SOCKET_HOST
  // and pick `ws` vs `wss` depending on the current page protocol.
  const SOCKET_HOST = '134.209.19.132:8003';
  const scheme = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss' : 'ws';
  const resolvedBase = baseUrl
    ? baseUrl.replace(/\/$/, '')
    : `${scheme}://${SOCKET_HOST}`;

  const buildUrl = useCallback(() => {
    if (businessId) {
      return `${resolvedBase}/notification/${encodeURIComponent(String(businessId))}/?token=${encodeURIComponent(token)}`;
    }
    return `${resolvedBase}/notification/?token=${encodeURIComponent(token)}`;
  }, [businessId, token, resolvedBase]);

  const pushDebug = useCallback((entry: NotificationDebugEntry) => {
    try {
      debugLogsRef.current.push(entry);
      // update stats
      if (entry.type === 'notification_received') statsRef.current.notificationsReceived += 1;
      if (entry.type === 'reconnect_scheduled') statsRef.current.reconnects += 1;
      if (debug) console.log('[notification-debug]', entry.type, entry.detail ?? '');
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
    if (!token) return;
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
      reconnectRef.current = 0;
      reconnectAttemptsRef.current = 0;
      stateRef.current = 'open';
      pushDebug({ ts: Date.now(), type: 'open' });
      onOpen?.();
    };

    wsRef.current.onmessage = ev => {
      try {
        const raw = JSON.parse(ev.data);
        const payload = raw.data ?? raw;
        pushDebug({ ts: Date.now(), type: 'notification_received', detail: { raw } });
        onNotification?.(payload);
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
        reconnectRef.current = Math.min(
          30000,
          reconnectRef.current + 1000 + Math.floor(Math.random() * 2000)
        );
        reconnectAttemptsRef.current += 1;
        statsRef.current.reconnects += 1;
        pushDebug({ ts: Date.now(), type: 'reconnect_scheduled', detail: { wait: reconnectRef.current, attempt: reconnectAttemptsRef.current } });
        setTimeout(() => connect(), reconnectRef.current);
      }
    };

    wsRef.current.onerror = () => {
      pushDebug({ ts: Date.now(), type: 'error', detail: { message: 'socket_error' } });
      try {
        wsRef.current?.close();
      } catch {}
    };
  }, [buildUrl, onNotification, onOpen, onClose, token, pushDebug, maxReconnectAttempts]);

  useEffect(() => {
    shouldReconnect.current = true;
    connect();
    return () => {
      shouldReconnect.current = false;
      try {
        wsRef.current?.close();
      } catch {}
    };
  }, [connect]);

  return {
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
