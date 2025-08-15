import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') ?? 'World';

  return NextResponse.json({
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
    success: true,
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { name?: string };
    const name = body.name ?? 'Anonymous';

    return NextResponse.json({
      message: `Hello, ${name}! This is a POST request.`,
      timestamp: new Date().toISOString(),
      success: true,
    });
  } catch (_error) {
    return NextResponse.json(
      {
        error: 'Invalid JSON body',
        success: false,
      },
      { status: 400 }
    );
  }
}
