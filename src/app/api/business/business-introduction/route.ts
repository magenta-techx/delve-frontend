import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const token = await getToken({ req });

    if (!token?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 👇 Works only if frontend sends multipart/form-data
    const formData = await req.formData();

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: file ->`, value.name, value.type, value.size);
      } else {
        console.log(`${key}:`, value);
      }
    }

    const res = await fetch(`${process.env['API_BASE_URL']}/business/create/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
      body: formData, // ✅ forward the same FormData
    });

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
