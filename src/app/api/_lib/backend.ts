import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { is401Error } from '@/utils/apiHandler';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type ForwardOptions = {
  auth?: boolean; // add Bearer token from next-auth
  contentType?: 'json' | 'form' | 'none';
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown | FormData;
  cache?: RequestCache;
};

function buildUrl(path: string, query?: ForwardOptions['query']): string {
  const base = process.env['API_BASE_URL']?.replace(/\/$/, '') ?? '';
  const full = `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  if (!query) return full;
  const url = new URL(full);
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    url.searchParams.set(k, String(v));
  }
  return url.toString();
}

export async function forward(
  req: NextRequest,
  method: Method,
  path: string,
  opts: ForwardOptions = {}
): Promise<NextResponse> {
  try {
    const headers: Record<string, string> = {};
    let body: BodyInit | undefined;

    // Prefer any incoming Authorization header (client-attached bearer token)
    const incomingAuth = req.headers.get('authorization');
    if (incomingAuth) {
      headers['Authorization'] = incomingAuth;
    }

    // Forward cookie header from the incoming request (so upstream can read session cookies if needed)
    const incomingCookie = req.headers.get('cookie');
    if (incomingCookie) {
      headers['cookie'] = incomingCookie;
    }

    if (opts.auth && !headers['Authorization']) {
      // Use NextAuth's getToken which will run jwt callback and refresh if needed.
      const token = await getToken({ req });
      if (!token?.accessToken || token.error === 'RefreshAccessTokenError') {
        console.log(
          'forward: no token from getToken; incomingCookie present?',
          !!incomingCookie,
          token?.error ? `; token error: ${token.error}` : ''
        );
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Rely on NextAuth to refresh tokens via its jwt callback.
      headers['Authorization'] = `Bearer ${token.accessToken}`;
    }

    switch (opts.contentType) {
      case 'json': {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(
          opts.body ?? (await req.json().catch(() => ({})))
        );
        break;
      }
      case 'form': {
        // Forward raw FormData;
        body = (opts.body as FormData) ?? (await req.formData());
        break;
      }
      default: {
        body = undefined;
      }
    }

    const url = buildUrl(path, opts.query);
    console.log('Forwarding request to:', method, url);
    console.log(body, 'request body');
    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (body !== undefined) {
      fetchOptions.body = body;
    }

    if (opts.cache !== undefined) {
      fetchOptions.cache = opts.cache;
    }

    const res = await fetch(url, fetchOptions);

    const isJson = res.headers
      .get('content-type')
      ?.includes('application/json');
    const data: unknown = isJson
      ? await res.json().catch(() => ({}))
      : await res.text();

    if (!res.ok) {
      let message = 'Request failed';
      if (typeof data === 'object' && data !== null && 'message' in data) {
        const msg = (data as Record<string, unknown>)['message'];
        if (typeof msg === 'string') message = msg;
      }

      console.log('Request Failed From Backend:', res);
      if (res.status === 401 || is401Error(res, data)) {
        return NextResponse.json(
          {
            error: message,
            data,
            is401: true,
          },
          { status: 401 }
        );
      }
      console.log('Forwarded Error Response:', data);

      return NextResponse.json(
        { error: message, data },
        { status: res.status }
      );
    }

    // Handle 204 No Content responses
    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // console.log('Forwarded Success Response:', data);
    // console.log('url', url);

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.log('Error forwarding request:', err);

    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
