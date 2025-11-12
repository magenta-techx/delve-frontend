import { forward } from '@/app/api/_lib/backend';
import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/notifications/[notification_id]/seen
export async function PATCH(
  req: NextRequest,
  { params }: { params: { notification_id: string } }
): Promise<NextResponse> {
  return forward(req, 'PATCH', `/notifications/${params.notification_id}/seen/`, { auth: true });
}
