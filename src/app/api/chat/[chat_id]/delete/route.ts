import { forward } from '@/app/api/_lib/backend';
import { NextRequest, NextResponse } from 'next/server';

// DELETE /api/chat/[chat_id]/delete
export async function DELETE(
  req: NextRequest,
  { params }: { params: { chat_id: string } }
): Promise<NextResponse> {
  return forward(req, 'DELETE', `/chat/${params.chat_id}/delete/`, { auth: true });
}
