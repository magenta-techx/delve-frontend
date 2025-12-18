import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// DELETE /api/businesses/delete-image  Body: { image_ids: number[]}
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'DELETE', `/businesses/delete-image/`, { auth: true, contentType: 'json' });
}
