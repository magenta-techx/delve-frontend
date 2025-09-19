import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const token = await getToken({ req });

    if (!token?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';

    let res: Response;

    if (contentType.includes('application/json')) {
      // ✅ Multiple services mode
      const jsonBody = await req.json();

      console.log(' JSON payload:', jsonBody);

      const { business_id } = jsonBody;

      res = await fetch(
        `${process.env['API_BASE_URL']}/business/${business_id}/create-service/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonBody),
        }
      );
    } else if (contentType.includes('multipart/form-data')) {
      // ✅ Single service mode
      const formData = await req.formData();

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: file ->`, value.name, value.type, value.size);
        } else {
          console.log(`${key}:`, value);
        }
      }

      const business_id = formData.get('business_id');

      res = await fetch(
        `${process.env['API_BASE_URL']}/business/${business_id}/create-service/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
          body: formData, // ✅ Forward raw formData
        }
      );
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 400 }
      );
    }

    const data = await res.json();

    if (!res.ok) {
      console.error('❌ API Error:', data);
      return NextResponse.json({ error: data.message }, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
