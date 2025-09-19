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

    console.log('formData: ', formData);
    // pull out business_id
    const businessId = formData.get('business_id') as string | null;

    if (!businessId) {
      return NextResponse.json(
        { error: 'Missing business_id' },
        { status: 400 }
      );
    }

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: file ->`, value.name, value.type, value.size);
      } else {
        console.log(`${key}:`, value);
      }
    }
    const res = await fetch(
      `${process.env['API_BASE_URL']}/business/${businessId}/upload-image/ `,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
        body: formData, // ✅ forward the same FormData
      }
    );

    console.log('res.json(); ', res);

    const data = await res.json();

    if (!res.ok) {
      console.log(' error: data.message: ', data.message);

      return NextResponse.json({ error: data.message }, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}

// data
// :
// {id: 5, owner: {id: 6, email: "ekong.emmanuel@lmu.edu.ng", first_name: "James", last_name: "Alice",…},…}
// address
// :
// ""
// amenities
// :
// []
// approved
// :
// false
// average_review_rating
// :
// 0
// category
// :
// null
// created_at
// :
// "2025-09-13T17:48:50.480941+01:00"
// description
// :
// "My business is great!"
// email
// :
// null
// facebook_link
// :
// null
// id
// :
// 5
// images
// :
// []
// instagram_link
// :
// null
// is_active
// :
// true
// logo
// :
// "http://res.cloudinary.com/the-proton-guy/image/upload/v1757782131/delve/images/business_images/logo/rclpfm6glkojei4yqosj.jpg"
// name
// :
// "My new business"
// owner
// :
// {id: 6, email: "ekong.emmanuel@lmu.edu.ng", first_name: "James", last_name: "Alice",…}
// phone_number
// :
// null
// registration_number
// :
// null
// state
// :
// null
// subcategories
// :
// []
// thumbnail
// :
// ""
// tiktok_link
// :
// null
// twitter_link
// :
// null
// video_url
// :
// null
// website
// :
// "https://man.com"
// whatsapp_link
// :
// null
// message
// :
// "Business created successfully."
// status
// :
// true
