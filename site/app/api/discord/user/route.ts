import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const discordId = searchParams.get('discordId');

    if (!discordId) {
      return NextResponse.json({ error: 'Discord ID lipsă' }, { status: 400 });
    }

    // Call bot API to get user data
    const botApiUrl = process.env.BOT_API_URL;
    const verifySecret = process.env.VERIFY_SECRET;

    if (!botApiUrl || !verifySecret) {
      console.error('Environment variables missing:', {
        hasBotApiUrl: !!botApiUrl,
        hasVerifySecret: !!verifySecret
      });
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const response = await fetch(`${botApiUrl}/user?discordId=${encodeURIComponent(discordId)}`, {
      method: 'GET',
      headers: {
        'x-verify-secret': verifySecret,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || 'Utilizator negăsit' },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.ok || !data.user) {
      return NextResponse.json({ error: 'Utilizator negăsit' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        discordId: data.user.discordId,
        grad: data.user.grad,
        nume: data.user.nume
      }
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json({ error: 'Eroare la obținere date utilizator' }, { status: 500 });
  }
}

