import { NextResponse, type NextRequest } from 'next/server';
import { forward } from '../../_lib/backend';

// PATCH /api/user/update
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const body = await req.json().catch(() => ({}));
  return forward(req, 'PATCH', '/user/update/', {
    auth: true,
    body,
  });
}
