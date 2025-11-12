import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// POST /api/notifications/mark-all  Body: { business_id?: number }
export async function POST(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'POST', '/notifications/mark-all/', { auth: true, contentType: 'json' });
}
