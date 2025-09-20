import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const token = await getToken({ req });
    const formData = await req.formData();

    const business_id = formData.get('business_id');

    if (!token?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(
      `${process.env['API_BASE_URL']}/business/${business_id}/create-service/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
        body: formData, // ✅ Forward raw formData
      }
    );
    // } else {
    //   return NextResponse.json(
    //     { error: 'Unsupported content type' },
    //     { status: 400 }
    //   );
    // }

    const data = await res.json();

    if (!res.ok) {
      console.log('❌ API Error:', data);
      return NextResponse.json({ error: data.message }, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.log('Upload error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
