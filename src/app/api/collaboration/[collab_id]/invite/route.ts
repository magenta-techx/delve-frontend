import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// POST /api/collab/[collab_id]/add-member
export async function POST(
  req: NextRequest,
  { params }: { params: { collab_id: string } }
): Promise<NextResponse> {
  return forward(req, 'POST', `/collab/${params.collab_id}/add-member/`, {
    auth: true,
    contentType: 'json',
  });
}
