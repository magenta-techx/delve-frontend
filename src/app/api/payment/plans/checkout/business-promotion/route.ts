
import { NextRequest } from 'next/server';
import { forward } from '../../../../_lib/backend';

export async function POST(req: NextRequest) {
  return forward(req, 'POST', '/payment/plans/checkout/business-promotion/', {
    auth: true,
    contentType: 'json',
  });
}
