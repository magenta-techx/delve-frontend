import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/business/user - businesses owned by authenticated user
export async function GET(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'GET', '/businesses/my-businesses/', { auth: true });
}
