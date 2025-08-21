import { NextResponse } from 'next/server';

export async function POST(req: Request): Promise<NextResponse<unknown>> {
  try {
    const body = await req.json();

    const res = await fetch(
      `${process.env['API_BASE_URL']}/user/auth/reset-password/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || 'Pasword change failed' },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}
