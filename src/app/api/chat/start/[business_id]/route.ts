import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// POST /api/chat/start/[business_id] - Create or retrieve a chat with a business
export async function POST(
  req: NextRequest,
  contextPromise: Promise<{ params: { business_id: string } }>
): Promise<NextResponse> {
  const { params } = await contextPromise;
  return forward(req, 'POST', `/chat/create/${params.business_id}/`, { auth: true });
}
