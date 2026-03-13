import { forward } from '@/app/api/_lib/backend';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/chat/[chat_id]/pin
export async function POST(
    req: NextRequest,
    { params }: { params: { chat_id: string } }
): Promise<NextResponse> {
    const body = await req.json().catch(() => ({}));
    return forward(req, 'POST', `/chat/${params.chat_id}/pin/`, {
        auth: true,
        contentType: 'json',
        body
    });
}
