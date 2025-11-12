import { NextRequest } from 'next/server';
import { forward } from '../../_lib/backend';

export async function POST(request: NextRequest) {
 

  return forward(request, 'POST', `/businesses/create/`, {
    auth: true,
    contentType: 'form',
  });
}
