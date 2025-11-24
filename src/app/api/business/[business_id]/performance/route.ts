import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// GET /api/business/[business_id]/performance?filter=&metric=
export async function GET(
  req: NextRequest,
  { params }: { params: { business_id: string } }
): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get('filter') ?? undefined;
  const metric = searchParams.get('metric') ?? undefined;
  return forward(req, 'GET', `/businesses/${params.business_id}/performance/`, {
    auth: true,
    query: { filter, metric },
  });
}
