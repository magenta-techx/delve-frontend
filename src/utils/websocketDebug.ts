/**
 * WebSocket debugging utilities
 */

export function logWebSocketConnectionDetails() {
  console.log('[websocket-debug] Browser environment:', {
    userAgent: navigator.userAgent,
    protocol: window.location.protocol,
    host: window.location.host,
    origin: window.location.origin,
    webSocketSupported: typeof WebSocket !== 'undefined',
    secureContext: window.isSecureContext,
  });
}

export function createDebugWebSocket(url: string) {
  console.log('[websocket-debug] Creating WebSocket connection:', {
    url,
    timestamp: new Date().toISOString(),
  });

  const ws = new WebSocket(url);
  
  // Add detailed event listeners for debugging
  ws.addEventListener('open', (event) => {
    console.log('[websocket-debug] Connection opened:', {
      readyState: ws.readyState,
      protocol: ws.protocol,
      url: ws.url,
      extensions: ws.extensions,
      event,
    });
  });

  ws.addEventListener('error', (event) => {
    console.log('[websocket-debug] Connection error:', {
      readyState: ws.readyState,
      url: ws.url,
      event,
      timestamp: new Date().toISOString(),
    });
  });

  ws.addEventListener('close', (event) => {
    console.log('[websocket-debug] Connection closed:', {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean,
      readyState: ws.readyState,
      timestamp: new Date().toISOString(),
      // Common close codes
      codeExplanation: getCloseCodeExplanation(event.code),
    });
  });

  return ws;
}

function getCloseCodeExplanation(code: number): string {
  switch (code) {
    case 1000: return 'Normal Closure';
    case 1001: return 'Going Away';
    case 1002: return 'Protocol Error';
    case 1003: return 'Unsupported Data';
    case 1005: return 'No Status Received';
    case 1006: return 'Abnormal Closure (often CORS/network issue)';
    case 1007: return 'Invalid frame payload data';
    case 1008: return 'Policy Violation';
    case 1009: return 'Message Too Big';
    case 1010: return 'Mandatory Extension';
    case 1011: return 'Internal Server Error';
    case 1015: return 'TLS Handshake';
    default: return `Unknown code: ${code}`;
  }
}

/**
 * Test WebSocket connection with detailed logging
 */
export async function testWebSocketConnection(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    console.log('[websocket-test] Testing connection to:', url);
    
    const ws = createDebugWebSocket(url);
    let resolved = false;
    
    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        try {
          ws.close();
        } catch (e) {}
      }
    };
    
    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      if (!resolved) {
        console.log('[websocket-test] Connection test timed out');
        cleanup();
        resolve(false);
      }
    }, 10000);
    
    ws.addEventListener('open', () => {
      console.log('[websocket-test] Connection successful!');
      clearTimeout(timeout);
      cleanup();
      resolve(true);
    });
    
    ws.addEventListener('error', () => {
      console.log('[websocket-test] Connection failed');
      clearTimeout(timeout);
      cleanup();
      resolve(false);
    });
    
    ws.addEventListener('close', (event) => {
      if (event.code !== 1000) {
        console.log('[websocket-test] Connection closed unexpectedly');
        clearTimeout(timeout);
        cleanup();
        resolve(false);
      }
    });
  });
}