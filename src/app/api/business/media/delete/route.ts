import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// DELETE /api/business/media/delete  Body: { image_ids?: number[], video_business_id?: number }
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'DELETE', `/businesses/delete-media/`, { auth: true, contentType: 'json' });
}
