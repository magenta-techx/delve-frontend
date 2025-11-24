import { useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MessageHandler = (data: any) => void;

export function useWebsocket(url?: string, onMessage?: MessageHandler) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) return undefined;
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      ws.onopen = () => {
        // console.log('ws open', url);
      };
      ws.onmessage = (ev) => {
        try {
          const parsed = JSON.parse(ev.data);
          onMessage?.(parsed);
        } catch (e) {
          onMessage?.(ev.data);
        }
      };
      ws.onclose = () => {
        wsRef.current = null;
      };
      ws.onerror = () => {
        // noop
      };

      return () => {
        try {
          ws.close();
        } catch (e) {
          // ignore
        }
      };
    } catch (err) {
      // ignore
      return undefined;
    }
  }, [url, onMessage]);

  function send(data: any) {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return false;
    try {
      wsRef.current.send(typeof data === 'string' ? data : JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  return { send, ws: wsRef } as const;
}
