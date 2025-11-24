import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/payment/verify?reference_id=ref
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const reference_id = searchParams.get('reference_id') ?? undefined;
  return forward(req, 'GET', '/payment/verify/', { auth: true, query: { reference_id } });
}
