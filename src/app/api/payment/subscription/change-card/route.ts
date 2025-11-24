import { forward } from '@/app/api/_lib/backend';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/payment/subscription/change-card
export async function POST(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'POST', '/payment/subscription/change-card/', { auth: true });
}
