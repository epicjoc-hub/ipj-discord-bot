import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const botApiUrl = process.env.BOT_API_URL;
    const verifySecret = process.env.VERIFY_SECRET;

    if (!botApiUrl || !verifySecret) {
      console.error('BOT_API_URL or VERIFY_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const data = await request.json();

    const response = await fetch(`${botApiUrl}/anunturi-evenimente/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-verify-secret': verifySecret,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Eroare la actualizarea anunțului' }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating anunt eveniment:', error);
    return NextResponse.json({ error: 'Eroare la actualizarea anunțului' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const botApiUrl = process.env.BOT_API_URL;
    const verifySecret = process.env.VERIFY_SECRET;

    if (!botApiUrl || !verifySecret) {
      console.error('BOT_API_URL or VERIFY_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const response = await fetch(`${botApiUrl}/anunturi-evenimente/${id}`, {
      method: 'DELETE',
      headers: {
        'x-verify-secret': verifySecret,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Eroare la ștergerea anunțului' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting anunt eveniment:', error);
    return NextResponse.json({ error: 'Eroare la ștergerea anunțului' }, { status: 500 });
  }
}
