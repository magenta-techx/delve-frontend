import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// POST /api/business/[business_id]/request-approval
export async function POST(
  req: NextRequest,
  { params }: { params: { business_id: string } }
): Promise<NextResponse> {
  return forward(req, 'POST', `/businesses/${params.business_id}/request-approval/`, { auth: true });
}
