import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/business/trending
export async function GET(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'GET', '/businesses/trending-business/');
}
