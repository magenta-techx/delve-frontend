import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// PATCH /api/business/[business_id]/activation
export async function PATCH(
  req: NextRequest,
  { params }: { params: { business_id: string } }
): Promise<NextResponse> {
  return forward(req, 'PATCH', `/businesses/${params.business_id}/activation/`, {
    auth: true,
    contentType: 'json',
  });
}
