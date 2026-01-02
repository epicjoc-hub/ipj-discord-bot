import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { discordTag, message } = await request.json();

    if (!discordTag || !message) {
      return NextResponse.json({ error: 'Discord Tag și mesajul sunt obligatorii' }, { status: 400 });
    }

    const botApiUrl = process.env.BOT_API_URL;
    const verifySecret = process.env.VERIFY_SECRET;

    if (!botApiUrl || !verifySecret) {
      console.error('BOT_API_URL or VERIFY_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const response = await fetch(`${botApiUrl}/notify/discord`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-verify-secret': verifySecret,
      },
      body: JSON.stringify({ discordTag, message }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.json({ error: data.error || 'Eroare la trimiterea mesajului' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error('Error sending discord dm:', error);
    return NextResponse.json({ error: 'Eroare internă la trimitere DM' }, { status: 500 });
  }
}
