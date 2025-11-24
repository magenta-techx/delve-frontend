import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../_lib/backend';

// POST /api/collab (create)
export async function POST(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'POST', '/collab/create', { auth: true, contentType: 'json' });
}

// GET /api/collab (list for user)
export async function GET(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'GET', '/collab/me', { auth: true });
}
