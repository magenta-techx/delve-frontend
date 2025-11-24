import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../../_lib/backend';

// DELETE /api/user/delete
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  return forward(req, 'DELETE', '/user/delete/', { auth: true });
}
