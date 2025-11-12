import { NextRequest } from 'next/server';
import { forward } from '../_lib/backend';

// GET /api/blog?category=Beauty
export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') ?? undefined;
  return forward(req, 'GET', '/blog/', { query: { category } });
}
