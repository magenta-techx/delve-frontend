import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// PATCH /api/business/[business_id]/update-category
export async function PATCH(
  req: NextRequest,
  { params }: { params: { business_id: string } }
): Promise<NextResponse> {
  // Body: { category_id: number, subcategory_ids: number[] }
  return forward(req, 'PATCH', `/businesses/${params.business_id}/set-category-subcategories/`, {
    auth: true,
    contentType: 'json',
  });
}
