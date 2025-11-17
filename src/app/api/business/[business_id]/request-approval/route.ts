import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// POST /api/business/[business_id]/request-approval
export async function POST(
  req: NextRequest,
  context: { params: { business_id: string } }
): Promise<NextResponse> {
  const { params } = await Promise.resolve(context);
  return forward(req, 'POST', `/businesses/${params.business_id}/request-approval/`, { auth: true });
}
