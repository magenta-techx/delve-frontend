// src/app/api/business/business-delete/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const token = await getToken({ req });

    if (!token?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // parse JSON body from frontend
    const body = await req.json();
    const { business_id } = body;

    // if (!business_id) {
    //   return NextResponse.json(
    //     { error: 'business_id is required' },
    //     { status: 400 }
    //   );
    // }

    // call your backend
    const res = await fetch(
      `${process.env['API_BASE_URL']}/business/${business_id}/delete/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      console.log('!res.o: ', res);
      return NextResponse.json({ message: res });
    }
    console.log('res.ok: ', res);
    return NextResponse.json({ message: res });
  } catch (error) {
    console.log('Delete error:');
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}
