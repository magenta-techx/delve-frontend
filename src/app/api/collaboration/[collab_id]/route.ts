import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/collab/[collab_id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ collab_id: string }> }
): Promise<NextResponse> {
  const { collab_id } = await params;
  return forward(req, 'GET', `/collab/${collab_id}/`, { auth: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ collab_id: string }> }
): Promise<NextResponse> {
  const { collab_id } = await params;
  return forward(req, 'DELETE', `/collab/${collab_id}/delete`, {
    auth: true,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ collab_id: string }> }
): Promise<NextResponse> {
  const { collab_id } = await params;
  return forward(req, 'PATCH', `/collab/${collab_id}/edit`, {
    auth: true,
    contentType: 'json',
  });
}
