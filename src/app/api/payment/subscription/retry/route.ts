import { forward } from '@/app/api/_lib/backend';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/payment/subscription/retry
export async function POST(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'POST', '/payment/subscription/retry/', { auth: true });
}
