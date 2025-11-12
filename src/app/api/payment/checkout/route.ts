import { NextResponse } from 'next/server';

// Deprecated: /api/payment/checkout has been removed. Use subscription endpoints instead.
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { status: false, message: 'The /payment/checkout endpoint has been removed. Use /payment/premium-plans and /payment/subscription/* endpoints instead.' },
    { status: 410 }
  );
}
