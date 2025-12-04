import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../../_lib/backend';

// PATCH /api/collaboration/[collab_id]/businesses/replace
export async function PATCH(
  req: NextRequest,
  { params }: { params: { collab_id: string } }
): Promise<NextResponse> {
  return forward(req, 'PATCH', `/collab/${params.collab_id}/business/`, {
    auth: true,
    contentType: 'json',
  });
}
