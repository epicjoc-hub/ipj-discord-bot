import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const botApiUrl = process.env.BOT_API_URL;
    const verifySecret = process.env.VERIFY_SECRET;

    if (!botApiUrl || !verifySecret) {
      console.error('BOT_API_URL or VERIFY_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const response = await fetch(`${botApiUrl}/programari-teste`, {
      method: 'GET',
      headers: {
        'x-verify-secret': verifySecret,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Eroare la citirea programărilor' }, { status: 500 });
    }

    const programari = await response.json();
    return NextResponse.json(programari);
  } catch (error) {
    console.error('Error reading programari:', error);
    return NextResponse.json({ error: 'Eroare la citirea programărilor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { nume, prenume, discordTag, telefon, tipTest } = data || {};

    if (!nume || !prenume || !discordTag || !telefon || !tipTest) {
      return NextResponse.json({ error: 'Toate câmpurile sunt obligatorii' }, { status: 400 });
    }

    const payload = {
      ...data,
      discordTag: typeof discordTag === 'string' ? discordTag.trim() : discordTag,
      status: 'pending',
      dataCreare: new Date().toISOString(),
    };
    const botApiUrl = process.env.BOT_API_URL;
    const verifySecret = process.env.VERIFY_SECRET;

    if (!botApiUrl || !verifySecret) {
      console.error('BOT_API_URL or VERIFY_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const response = await fetch(`${botApiUrl}/programari-teste`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-verify-secret': verifySecret,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Eroare la crearea programării' }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating programare:', error);
    return NextResponse.json({ error: 'Eroare la crearea programării' }, { status: 500 });
  }
}

