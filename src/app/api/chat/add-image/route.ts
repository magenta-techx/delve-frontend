import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// POST /api/chat/add-image  (FormData: chat_id, images[])
export async function POST(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'POST', '/chat/add-image/', { auth: true, contentType: 'form' });
}
