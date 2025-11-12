import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// PATCH /api/business/[business_id]/update-location
export async function PATCH(
  req: NextRequest,
  { params }: { params: { business_id: string } }
): Promise<NextResponse> {
  // Body: { address, state, longitude, latitude, phone_number, registration_number, whatsapp_link, ... }
  return forward(req, 'PATCH', `/businesses/${params.business_id}/set-location-and-contact-info/`, {
    auth: true,
    contentType: 'json',
  });
}
