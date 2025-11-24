import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/ads/active
export async function GET(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'GET', '/ads/active/');
}
