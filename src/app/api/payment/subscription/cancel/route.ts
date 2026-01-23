import { forward } from '@/app/api/_lib/backend';
import { NextRequest, NextResponse } from 'next/server';

// DELETE /api/payment/subscription/cancel
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'DELETE', '/payment/subscription/cancel/', { auth: true });
}
