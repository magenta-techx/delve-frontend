import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/business/categories
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const is_nav = searchParams.get('is_nav') ?? undefined;
  return forward(req, 'GET', '/businesses/categories/', { query: { is_nav } });
}
