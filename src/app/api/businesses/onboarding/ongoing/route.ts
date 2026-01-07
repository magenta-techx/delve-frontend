import { NextRequest, NextResponse } from 'next/server';
import { forward } from '@/app/api/_lib/backend';

// GET /api/businesses/onboarding/ongoing/
// Retrieve the current business onboarding process for the authenticated user
export async function GET(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'GET', '/businesses/onboarding/ongoing/', {
    auth: true,
  });
}
