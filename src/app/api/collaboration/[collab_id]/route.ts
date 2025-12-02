import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/collab/[collab_id]
export async function GET(
  req: NextRequest,
  { params }: { params: { collab_id: string } }
): Promise<NextResponse> {
  return forward(req, 'GET', `/collab/${params.collab_id}/`, { auth: true });
}

// DELETE /api/collab/[collab_id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { collab_id: string } }
): Promise<NextResponse> {
  return forward(req, 'DELETE', `/collab/${params.collab_id}/`, { auth: true });
}

// PATCH /api/collab/[collab_id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { collab_id: string } }
): Promise<NextResponse> {
  return forward(req, 'PATCH', `/collab/${params.collab_id}/`, { auth: true, contentType: 'json' });
}
