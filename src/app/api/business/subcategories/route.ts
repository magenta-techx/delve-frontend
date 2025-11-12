import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/business/subcategories?category_id=2
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const category_id = searchParams.get('category_id') ?? undefined;
  const category = searchParams.get('category') ?? undefined; // Keep backward compatibility
  return forward(req, 'GET', '/businesses/subcategories/', { 
    query: { 
      category_id,
      category 
    } 
  });
}
