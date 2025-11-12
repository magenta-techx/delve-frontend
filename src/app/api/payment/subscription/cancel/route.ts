import { forward } from '@/app/api/_lib/backend';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/payment/subscription/cancel
export async function POST(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'POST', '/payment/subscription/cancel/', { auth: true });
}
