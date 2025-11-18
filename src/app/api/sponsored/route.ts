
import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../_lib/backend';

// GET /api/events?state=Lagos
export async function GET(req: NextRequest): Promise<NextResponse> {

  return forward(req, 'GET', '/sponsored-add/');
}
