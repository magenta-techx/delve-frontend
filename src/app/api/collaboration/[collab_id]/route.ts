import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/collaboration/[collab_id]
export async function GET(
  req: NextRequest,
  { params }: { params: { collab_id: string } }
): Promise<NextResponse> {
  return forward(req, 'GET', `/collaboration/${params.collab_id}/`, { auth: true });
}

// DELETE /api/collaboration/[collab_id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { collab_id: string } }
): Promise<NextResponse> {
  return forward(req, 'DELETE', `/collaboration/${params.collab_id}/`, { auth: true });
}

// PATCH /api/collaboration/[collab_id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { collab_id: string } }
): Promise<NextResponse> {
  return forward(req, 'PATCH', `/collaboration/${params.collab_id}/`, { auth: true, contentType: 'json' });
}
