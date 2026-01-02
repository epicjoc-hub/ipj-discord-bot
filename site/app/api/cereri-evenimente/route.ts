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

    const response = await fetch(`${botApiUrl}/cereri-evenimente`, {
      method: 'GET',
      headers: {
        'x-verify-secret': verifySecret,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Eroare la citirea cererilor' }, { status: 500 });
    }

    const cereri = await response.json();
    return NextResponse.json(cereri);
  } catch (error) {
    console.error('Error reading cereri:', error);
    return NextResponse.json({ error: 'Eroare la citirea cererilor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const botApiUrl = process.env.BOT_API_URL;
    const verifySecret = process.env.VERIFY_SECRET;

    console.log('[POST /api/cereri-evenimente] Received request');
    console.log('[POST /api/cereri-evenimente] BOT_API_URL:', botApiUrl ? 'SET' : 'NOT SET');
    console.log('[POST /api/cereri-evenimente] VERIFY_SECRET:', verifySecret ? 'SET' : 'NOT SET');

    if (!botApiUrl || !verifySecret) {
      console.error('BOT_API_URL or VERIFY_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    console.log('[POST /api/cereri-evenimente] Sending to bot:', `${botApiUrl}/cereri-evenimente`);

    const response = await fetch(`${botApiUrl}/cereri-evenimente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-verify-secret': verifySecret,
      },
      body: JSON.stringify(data),
    });

    console.log('[POST /api/cereri-evenimente] Bot response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[POST /api/cereri-evenimente] Bot error response:', errorText);
      return NextResponse.json({ error: 'Eroare la crearea cererii' }, { status: 500 });
    }

    const result = await response.json();
    console.log('[POST /api/cereri-evenimente] Success:', result);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('[POST /api/cereri-evenimente] Error:', error);
    return NextResponse.json({ error: 'Eroare la crearea cererii', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

