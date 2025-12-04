import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../../_lib/backend';

// DELETE /api/collaboration/[collab_id]/businesses/remove
export async function DELETE(
  req: NextRequest,
  { params }: { params: { collab_id: string } }
): Promise<NextResponse> {
  // Body: { business_id: number }
  return forward(req, 'DELETE', `/collab/${params.collab_id}/business/`, {
    auth: true,
    contentType: 'json',
  });
}
