import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../_lib/backend';

// GET /api/notifications?notification_for=user|business&business_id=12
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  return forward(req, 'GET', '/notifications/', {
    auth: true,
    query: {
      notification_for: searchParams.get('notification_for') ?? undefined,
      business_id: searchParams.get('business_id') ?? undefined,
    },
  });
}
