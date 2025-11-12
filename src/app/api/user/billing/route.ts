import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/user/billing
export async function GET(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'GET', '/user/billing/', { auth: true });
}
