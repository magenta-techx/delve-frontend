import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// POST /api/auth/google  Body: { token }
export async function POST(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'POST', '/auth/google/', { contentType: 'json' });
}
