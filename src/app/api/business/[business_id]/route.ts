import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/business/[business_id]?page=dashboard
export async function GET(
  req: NextRequest,
  { params }: { params: { business_id: string } }
): Promise<NextResponse> {
  const { business_id } = params;
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') ?? undefined;
  return forward(req, 'GET', `/businesses/${business_id}/`, { query: { page }, auth: !!page });
}

// DELETE /api/business/[business_id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { business_id: string } }
): Promise<NextResponse> {
  const { business_id } = params;
  return forward(req, 'DELETE', `/businesses/${business_id}/`, { auth: true });
}

// PATCH /api/business/[business_id] - edit business details (name, description, website, logo, thumbnail_image_id)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ business_id: string }> }
): Promise<NextResponse> {
  const { business_id } = await params;
  return forward(req, 'PATCH', `/businesses/${business_id}/edit/`, { auth: true, contentType: 'form' });
}
