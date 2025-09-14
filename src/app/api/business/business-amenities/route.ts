import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const token = await getToken({ req });

    if (!token?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(
      `${process.env['API_BASE_URL']}/business/amenities/`,
      {
        method: 'GET',
        // headers: {
        //   Authorization: `Bearer ${token.accessToken}`,
        // },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message }, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}
