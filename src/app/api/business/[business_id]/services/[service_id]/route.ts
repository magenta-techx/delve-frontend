import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../../_lib/backend';

// GET /api/business/[business_id]/services/[service_id]
export async function GET(
  req: NextRequest,
  { params }: { params: { business_id: string; service_id: string } }
): Promise<NextResponse> {
  return forward(req, 'GET', `/business/${params.business_id}/services/${params.service_id}/`, { auth: true });
}

// PATCH /api/business/[business_id]/services/[service_id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { business_id: string; service_id: string } }
): Promise<NextResponse> {
  return forward(req, 'PATCH', `/businesses/${params.business_id}/services/${params.service_id}/`, {
    auth: true,
    contentType: 'json',
  });
}

// DELETE /api/business/[business_id]/services/[service_id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { business_id: string; service_id: string } }
): Promise<NextResponse> {
  return forward(req, 'DELETE', `/business/${params.business_id}/services/${params.service_id}/`, { auth: true });
}
