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
  /** Whether to enable the socket connection (default: true) */
  enabled?: boolean;
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

export type NotificationType = 
  | 'review_prompt' 
  | 'review_received' 
  | 'review_replied'
  | 'message_notification'
  | 'profile_views'
  | 'free_trial_enabled'
  | 'free_trial_expiring'
  | 'free_trial_disabled'
  | 'payment_received'
  | 'subscription_created'
  | 'business_created'
  | string;

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
  enabled = true,
}: UseNotificationSocketOpts) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectDelayRef = useRef<number>(0);
  const shouldReconnect = useRef(true);
  const debugLogsRef = useRef<NotificationDebugEntry[]>([]);
  const statsRef = useRef({ notificationsReceived: 0, reconnects: 0 });
  const stateRef = useRef<NotificationConnectionState>('idle');
  const reconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttemptsDefault = 20;
  const isConnectingRef = useRef(false);

  // Store callbacks in refs to avoid dependency changes triggering reconnects
  const onNotificationRef = useRef(onNotification);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  const onDebugRef = useRef(onDebug);

  // Update refs when callbacks change
  useEffect(() => {
    onNotificationRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    onDebugRef.current = onDebug;
  }, [onDebug]);

  // Use the provided `baseUrl` when available; otherwise fall back to SOCKET_HOST
  // and pick `ws` vs `wss` depending on the current page protocol.
  const SOCKET_HOST = 'backend.delve.ng';
  const resolvedBase = baseUrl
    ? baseUrl.replace(/\/$/, '')
    : `wss://${SOCKET_HOST}`;

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
        onDebugRef.current?.(entry);
      } catch (e) {
        // swallow
      }
    } catch (e) {
      // ignore
    }
  }, [debug]);

  const disconnect = useCallback(() => {
    // Clear any pending reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Close existing socket
    if (wsRef.current) {
      try {
        wsRef.current.onclose = null; // Prevent onclose handler from triggering reconnect
        wsRef.current.onerror = null;
        wsRef.current.onmessage = null;
        wsRef.current.onopen = null;
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }
    
    isConnectingRef.current = false;
    stateRef.current = 'closed';
  }, []);

  const connect = useCallback(() => {
    if (!token || !enabled) return;
    
    const maxAttempts = typeof maxReconnectAttempts !== 'undefined' ? maxReconnectAttempts : maxReconnectAttemptsDefault;
    
    // If we're already connecting or connected, skip
    if (isConnectingRef.current) {
      pushDebug({ ts: Date.now(), type: 'error', detail: { message: 'connect_skipped_already_connecting' } });
      return;
    }
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      pushDebug({ ts: Date.now(), type: 'error', detail: { message: 'connect_skipped_already_open' } });
      return;
    }
    
    // If we've exceeded reconnect attempts, stop trying
    if (reconnectAttemptsRef.current >= maxAttempts) {
      stateRef.current = 'error';
      pushDebug({ ts: Date.now(), type: 'error', detail: { message: 'max_reconnect_attempts_reached', attempts: reconnectAttemptsRef.current } });
      return;
    }
    
    // Clean up any existing socket before creating new one
    disconnect();
    
    isConnectingRef.current = true;
    stateRef.current = 'connecting';
    const url = buildUrl();
    pushDebug({ ts: Date.now(), type: 'connect_attempt', detail: { url } });
    
    try {
      wsRef.current = new WebSocket(url);
    } catch (err) {
      isConnectingRef.current = false;
      pushDebug({ ts: Date.now(), type: 'error', detail: { message: 'websocket_construct_failed' } });
      return;
    }

    wsRef.current.onopen = () => {
      isConnectingRef.current = false;
      reconnectDelayRef.current = 0;
      reconnectAttemptsRef.current = 0;
      stateRef.current = 'open';
      pushDebug({ ts: Date.now(), type: 'open' });
      onOpenRef.current?.();
    };

    wsRef.current.onmessage = ev => {
      try {
        const raw = JSON.parse(ev.data);
        const payload = raw.data ?? raw;
        pushDebug({ ts: Date.now(), type: 'notification_received', detail: { raw } });
        onNotificationRef.current?.(payload);
      } catch (err) {
        pushDebug({ ts: Date.now(), type: 'error', detail: { message: 'parse_error' } });
      }
    };

    wsRef.current.onclose = ev => {
      isConnectingRef.current = false;
      stateRef.current = 'closed';
      pushDebug({ ts: Date.now(), type: 'close', detail: { code: ev?.code, reason: ev?.reason } });
      onCloseRef.current?.(ev);
      
      if (shouldReconnect.current && enabled) {
        // simple incremental backoff + jitter
        reconnectDelayRef.current = Math.min(
          30000,
          reconnectDelayRef.current + 1000 + Math.floor(Math.random() * 2000)
        );
        reconnectAttemptsRef.current += 1;
        statsRef.current.reconnects += 1;
        pushDebug({ ts: Date.now(), type: 'reconnect_scheduled', detail: { wait: reconnectDelayRef.current, attempt: reconnectAttemptsRef.current } });
        
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectTimeoutRef.current = null;
          connect();
        }, reconnectDelayRef.current);
      }
    };

    wsRef.current.onerror = () => {
      pushDebug({ ts: Date.now(), type: 'error', detail: { message: 'socket_error' } });
      // Don't close here - let onclose handle it
    };
  }, [buildUrl, token, pushDebug, maxReconnectAttempts, enabled, disconnect]);

  // Main effect to manage connection lifecycle
  useEffect(() => {
    if (!enabled || !token) {
      disconnect();
      return;
    }
    
    shouldReconnect.current = true;
    connect();
    
    return () => {
      shouldReconnect.current = false;
      disconnect();
    };
  }, [token, enabled, businessId, connect, disconnect]);

  return {
    socket: wsRef.current,
    socketRef: wsRef,
    reconnect: connect,
    disconnect,
    // debug helpers
    getDebugLogs: () => debugLogsRef.current.slice(),
    clearDebugLogs: () => {
      debugLogsRef.current.length = 0;
    },
    getStats: () => ({ ...statsRef.current }),
    getState: () => stateRef.current,
  };
}
