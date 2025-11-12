import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// PATCH /api/user/deactivate
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'PATCH', '/user/deactivate/', { auth: true, contentType: 'json' });
}
