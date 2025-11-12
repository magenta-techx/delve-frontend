import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// POST /api/auth/facebook  Body: { token }
export async function POST(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'POST', '/auth/facebook/', { contentType: 'json' });
}
