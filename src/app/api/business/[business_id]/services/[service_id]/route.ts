import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../../_lib/backend';

// GET /api/businesses/[business_id]/service/[service_id]
export async function GET(
  req: NextRequest,
  { params }: { params: { business_id: string; service_id: string } }
): Promise<NextResponse> {
  const { business_id, service_id } = await params;
  return forward(req, 'GET', `/businesses/${business_id}/service/${service_id}/`, { auth: true });
}
// PATCH /api/businesses/[business_id]/update-services/[service_id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { business_id: string; service_id: string } }
): Promise<NextResponse> {
  const { business_id, service_id } = await params;
  return forward(req, 'PATCH', `/businesses/${business_id}/update-service/${service_id}/`, {
    auth: true,
    contentType: 'form',
  });
}
// DELETE /api/businesses/[business_id]/services/[service_id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { business_id: string; service_id: string } }
): Promise<NextResponse> {
  const { business_id, service_id } = await params;
  return forward(req, 'DELETE', `/businesses/${business_id}/delete-service/${service_id}/`, { auth: true });
}
