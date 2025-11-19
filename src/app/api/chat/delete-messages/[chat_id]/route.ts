import { NextRequest } from 'next/server';
import { forward } from '@/app/api/_lib/backend';

export async function DELETE(req: NextRequest, { params }: { params: { chat_id: string } }) {
  const { chat_id } = params;
  return forward(req, 'DELETE', `/api/chat/delete-messages/${chat_id}/`, {
    auth: true,
  });
}
