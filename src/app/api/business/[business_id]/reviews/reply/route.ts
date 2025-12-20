import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../../_lib/backend';

// POST /api/business/[business_id]/reviews/reply
export async function POST(
  req: NextRequest,
  { params }: { params: { business_id: string } }
): Promise<NextResponse> {
  return forward(req, 'POST', `/businesses/${params.business_id}/reviews/reply/`, {
    auth: true,
    contentType: 'json',
  });
}
