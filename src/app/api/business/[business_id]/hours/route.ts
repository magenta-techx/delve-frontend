import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// POST /api/business/[business_id]/hours/
// Create or update business hours
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ business_id: string }> }
): Promise<NextResponse> {
  const { business_id } = await params;
  return forward(req, 'POST', `/businesses/${business_id}/hours/`, { auth: true });
}
