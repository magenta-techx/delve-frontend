import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// DELETE /api/business/image/delete  Body: { image_ids: number[] }
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  // The backend expects a JSON body with image_ids
  // Ensure body has image_ids as array
  try {
    const body = await req.json();
    if (!body || !Array.isArray(body.image_ids)) {
      return NextResponse.json({ error: 'image_ids (number[]) required' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  return forward(req, 'DELETE', `/business/image/delete/`, { auth: true, contentType: 'json' });
}
