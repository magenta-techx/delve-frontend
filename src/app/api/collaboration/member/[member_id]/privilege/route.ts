import { forward } from '@/app/api/_lib/backend';
import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/collaboration/member/[member_id]/privilege
export async function PATCH(
  req: NextRequest,
  { params }: { params: { member_id: string } }
): Promise<NextResponse> {
  return forward(req, 'PATCH', `/collab/member/${params.member_id}/edit-privilege/`, {
    auth: true,
    contentType: 'json',
  });
}
