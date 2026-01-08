import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// GET /api/businesses/[business_id]/all-services
export async function GET(
  req: NextRequest,
  { params }: { params: { business_id: string } }
): Promise<NextResponse> {
  return forward(
    req,
    'GET',
    `/businesses/${params.business_id}/all-services/`,
    { auth: true }
  );
}

// POST /api/businesses/[business_id]/create-service
export async function POST(
  req: NextRequest,
  { params }: { params: { business_id: string } }
): Promise<NextResponse> {
  return forward(
    req,
    'POST',
    `/businesses/${params.business_id}/create-service/`,
    { auth: true, contentType: 'form' }
  );
}
