import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// PATCH /api/collaboration/invite/[member_id]
// Update collaboration invite status (accept or decline)
export async function PATCH(
  req: NextRequest,
  context: { params: { member_id: string } }
): Promise<NextResponse> {
  const { params } = await Promise.resolve(context);
  return forward(req, 'PATCH', `/collab/member/invite/${params.member_id}/`, { auth: true, contentType: 'json' });
}
