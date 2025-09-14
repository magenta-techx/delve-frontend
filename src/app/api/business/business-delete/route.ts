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

    if (!business_id) {
      return NextResponse.json(
        { error: 'business_id is required' },
        { status: 400 }
      );
    }

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

    // backend might return no content
    let data = null;
    if (res.status !== 204) {
      try {
        data = await res.json();
      } catch {
        data = null;
      }
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || 'Failed to delete business' },
        { status: res.status }
      );
    }

    return NextResponse.json(
      data || { message: 'Business deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}
