import { NextResponse, type NextRequest } from 'next/server';
import { forward } from '../../_lib/backend';

// PATCH /api/user/update
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'PATCH', '/user/update/', {
    auth: true,
    contentType: 'form',
  });
}
