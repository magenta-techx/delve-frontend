import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../../_lib/backend';

// GET /api/business/categories/[categoryId]/subcategories
export async function GET(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
): Promise<NextResponse> {
  return forward(req, 'GET', `/business/categories/${params.categoryId}/subcategories/`);
}