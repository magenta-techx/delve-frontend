import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// PATCH /api/collaboration/invite/[member_id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { member_id: string } }
): Promise<NextResponse> {
  return forward(req, 'PATCH', `/collaboration/invite/${params.member_id}/`, {
    auth: true,
    contentType: 'json',
  });
}
