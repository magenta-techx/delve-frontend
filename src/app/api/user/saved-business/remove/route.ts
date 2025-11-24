import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../../_lib/backend';

// DELETE /api/user/saved-business/remove  Body: { business_id }
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'DELETE', '/user/saved-business/remove/', { auth: true, contentType: 'json' });
}
