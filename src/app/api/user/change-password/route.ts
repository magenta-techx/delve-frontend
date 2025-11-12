import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const token = await getToken({ req });
    if (!token?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await req.json();
    // TODO: Wire to real backend endpoint once available
    // Example:
    // const res = await fetch(`${process.env['API_BASE_URL']}/user/auth/password/change/`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token.accessToken}`,
    //   },
    //   body: JSON.stringify(body),
    // });
    // const data = await res.json();
    // if (!res.ok) return NextResponse.json({ error: data.message || 'Password change failed' }, { status: res.status });
    // return NextResponse.json({ data }, { status: 200 });

    return NextResponse.json(
      { error: 'Not implemented. Please connect to backend.' },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}
