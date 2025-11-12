import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/chat/user - chats for authenticated customer/user
export async function GET(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'GET', '/chat/user/', { auth: true });
}
