import { forward } from '@/app/api/_lib/backend';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/businesses/[business_id]/upload-media (JSON: { images: [{url, public_id}][], video_url? })
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ business_id: string }> }
): Promise<NextResponse> {
  const { business_id } = await params;
  return forward(req, 'POST', `/businesses/${business_id}/upload-media/`, {
    auth: true,
    contentType: 'json',
  });
}
