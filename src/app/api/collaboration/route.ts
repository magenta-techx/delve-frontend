import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../_lib/backend';

// POST /api/collaboration (create)
export async function POST(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'POST', '/collaboration/', { auth: true, contentType: 'json' });
}

// GET /api/collaboration (list for user)
export async function GET(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'GET', '/collaboration/', { auth: true });
}
