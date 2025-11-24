import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// GET /api/payment/subscription/checkout
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const planId = searchParams.get('plan_id');
  
  if (!planId) {
    return NextResponse.json(
      { 
        status: false, 
        message: 'plan_id is required' 
      },
      { status: 400 }
    );
  }
  
  return forward(req, 'GET', `/payment/subscription/checkout/?plan_id=${encodeURIComponent(planId)}`, { auth: true });
}