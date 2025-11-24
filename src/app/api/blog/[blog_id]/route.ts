import { NextRequest } from 'next/server';
import { forward } from '../../_lib/backend';

// GET /api/blog/[blog_id]
export async function GET(req: NextRequest, { params }: { params: { blog_id: string } }): Promise<Response> {
  const { blog_id } = params;
  return forward(req, 'GET', `/blog/${blog_id}/`);
}
