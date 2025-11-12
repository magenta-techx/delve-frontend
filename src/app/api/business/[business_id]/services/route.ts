import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// GET /api/business/[business_id]/services
export async function GET(
  req: NextRequest,
  { params }: { params: { business_id: string } }
): Promise<NextResponse> {
  return forward(req, 'GET', `/business/${params.business_id}/services/`, { auth: true });
}

// POST /api/business/[business_id]/services  (json or form per API; we'll send json)
export async function POST(
  req: NextRequest,
  { params }: { params: { business_id: string } }
): Promise<NextResponse> {
  // Supports both single service fields or services array
  return forward(req, 'POST', `/business/${params.business_id}/services/`, { auth: true, contentType: 'json' });
}
