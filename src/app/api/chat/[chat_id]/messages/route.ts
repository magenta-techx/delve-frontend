import { forward } from '@/app/api/_lib/backend';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/chat/[chat_id]/messages
export async function GET(
  req: NextRequest,
  contextPromise: Promise<{ params: { chat_id: string } }>
): Promise<NextResponse> {
  const { params } = await contextPromise;
  return forward(req, 'GET', `/chat/${params.chat_id}/messages/`, { auth: true });
}
