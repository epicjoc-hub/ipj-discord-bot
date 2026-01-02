import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token lipsă' }, { status: 400 });
    }

    // Call bot API to verify token
    const botApiUrl = process.env.BOT_API_URL;
    const verifySecret = process.env.VERIFY_SECRET;

    if (!botApiUrl || !verifySecret) {
      console.error('BOT_API_URL or VERIFY_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const response = await fetch(`${botApiUrl}/verify?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'x-verify-secret': verifySecret,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || 'Token invalid sau expirat' },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.ok) {
      return NextResponse.json({ error: 'Token invalid sau expirat' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      discordId: data.discordId,
      user: data.user || null
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ error: 'Eroare la verificare token' }, { status: 500 });
  }
}

