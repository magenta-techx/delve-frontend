import { NextRequest, NextResponse } from 'next/server';
import { forward } from '@/app/api/_lib/backend';

// POST /api/contact/
// Send a contact message
export async function POST(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'POST', '/contact/', {
    auth: false,
    contentType: 'json',
  });
}
