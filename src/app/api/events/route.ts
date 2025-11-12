import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../_lib/backend';

// GET /api/events?state=Lagos
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state') ?? undefined;
  return forward(req, 'GET', '/events/', { query: { state } });
}
