import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// GET /api/business/[business_id]/reviews
export async function GET(
  req: NextRequest,
  { params }: { params: { business_id: string } }
): Promise<NextResponse> {
  // Supports optional review_id and filter_by query params; just pass through
  const { searchParams } = new URL(req.url);
  const review_id = searchParams.get('review_id') ?? undefined;
  const filter_by = searchParams.get('filter_by') ?? undefined;
  const path = `/businesses/${params.business_id}/reviews/`;
  return forward(req, 'GET', path, {
    query: { review_id, filter_by },
  });
}

// POST /api/business/[business_id]/reviews
export async function POST(
  req: NextRequest,
  { params }: { params: { business_id: string } }
): Promise<NextResponse> {
  return forward(req, 'POST', `/businesses/${params.business_id}/reviews/add/`, { auth: true, contentType: 'json' });
}
