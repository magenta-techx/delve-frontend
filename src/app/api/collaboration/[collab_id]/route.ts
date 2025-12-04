import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/collab/[collab_id]
export async function GET(
  req: NextRequest,
  context: { params: { collab_id: string } }
): Promise<NextResponse> {
  const { params } = await Promise.resolve(context);
  return forward(req, 'GET', `/collab/${params.collab_id}/`, { auth: true });
}

export async function DELETE(
  req: NextRequest,
  context: { params: { collab_id: string } }
): Promise<NextResponse> {
  const { params } = await Promise.resolve(context);
  return forward(req, 'DELETE', `/collab/${params.collab_id}/deleted`, { auth: true });
}

export async function PATCH(
  req: NextRequest,
  context: { params: { collab_id: string } }
): Promise<NextResponse> {
  const { params } = await Promise.resolve(context);
  return forward(req, 'PATCH', `/collab/${params.collab_id}/edit`, { auth: true, contentType: 'json' });
}
