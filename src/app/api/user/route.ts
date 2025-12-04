import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../_lib/backend';

// GET /api/user?email=
// If email provided, fetch that user's details (public); else authenticated user's details
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (email) {
    return forward(req, 'GET', `/user/?email=${email}`, { query: { email } });
  }
  return forward(req, 'GET', `/user/`, { auth: true });
}
