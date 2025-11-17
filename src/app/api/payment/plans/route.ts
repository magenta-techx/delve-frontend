import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/payment/plans
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const planType = searchParams.get('plan_type') || 'subscription';
  
  // Validate plan_type parameter
  const validPlanTypes = ['subscription', 'advertisment', 'business promotion'];
  if (!validPlanTypes.includes(planType)) {
    return NextResponse.json(
      { 
        status: false, 
        message: 'Invalid plan type provided. Valid types: subscription, advertisment, business promotion' 
      },
      { status: 400 }
    );
  }
  
  return forward(req, 'GET', `/payment/plans/?plan_type=${encodeURIComponent(planType)}`);
}