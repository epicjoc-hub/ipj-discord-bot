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

    if (!botApiUrl || !verifySecret) {
      console.error('BOT_API_URL or VERIFY_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const response = await fetch(`${botApiUrl}/cereri-evenimente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-verify-secret': verifySecret,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Eroare la crearea cererii' }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating cerere:', error);
    return NextResponse.json({ error: 'Eroare la crearea cererii' }, { status: 500 });
  }
}

