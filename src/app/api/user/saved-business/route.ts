import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/user/saved-business
export async function GET(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'GET', '/user/business/saved', { auth: true });
}

// POST /api/user/saved-business  Body: { business_id }
export async function POST(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'POST', '/user/business/saved/', { auth: true, contentType: 'json' });
}
