import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// PATCH /api/business/[business_id]/update-amenities
export async function PATCH(
  req: NextRequest,
  { params }: { params: { business_id: string } }
): Promise<NextResponse> {
  // Body: { amenities_ids: number[] }
  return forward(req, 'PATCH', `/businesses/${params.business_id}/set-amenities/`, {
    auth: true,
    contentType: 'json',
  });
}
