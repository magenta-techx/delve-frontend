import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/payment/premium-plans
export async function GET(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'GET', '/payment/premium-plans/', { auth: true });
}
