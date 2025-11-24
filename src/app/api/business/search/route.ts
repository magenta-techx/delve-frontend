import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/business/search?q=&category=&state=&longitude=&latitude=
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  return forward(req, 'GET', '/businesses/search/', {
    query: {
      q: searchParams.get('q') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      state: searchParams.get('state') ?? undefined,
      longitude: searchParams.get('longitude') ?? undefined,
      latitude: searchParams.get('latitude') ?? undefined,
    },
  });
}
