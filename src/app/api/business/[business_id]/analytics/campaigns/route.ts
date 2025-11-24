import { forward } from '@/app/api/_lib/backend';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/business/[business_id]/analytics/campaigns?requested_metric=promotion|advert&filter_method=all_time|this_month|last_6_months|last_12_months
export async function GET(req: NextRequest, { params }: { params: { business_id: string } }): Promise<NextResponse> {
  const url = new URL(req.url);
  const query = url.search ? url.search : '';
  return forward(req, 'GET', `/businesses/${params.business_id}/analytics/campaigns/${query}`, { auth: true });
}
