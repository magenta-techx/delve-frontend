
import { NextRequest, NextResponse } from 'next/server';
import { forward } from '../_lib/backend';

// GET /api/events?state=Lagos
export async function GET(req: NextRequest): Promise<NextResponse> {

  return forward(req, 'GET', '/sponsored-add/');
}


export async function PATCH (req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const advertisementId = searchParams.get('advertisement_id');
  if (!advertisementId) {
    return NextResponse.json({ error: 'advertisement_id is required' }, { status: 400 });
  }
  return forward(req, 'PATCH', `/sponsored-add/${advertisementId}/edit`, {
    contentType: 'form',
  });
}