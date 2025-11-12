import { forward } from '@/app/api/_lib/backend';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/payment/subscription/change-card
export async function GET(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'GET', '/payment/subscription/change-card/', { auth: true });
}
