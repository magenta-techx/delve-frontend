import { forward } from '@/app/api/_lib/backend';
import { NextRequest, NextResponse } from 'next/server';

// DELETE /api/collaboration/member/[member_id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { member_id: string } }
): Promise<NextResponse> {
  return forward(req, 'DELETE', `/collab/member/${params.member_id}/remove/`, { auth: true });
}
