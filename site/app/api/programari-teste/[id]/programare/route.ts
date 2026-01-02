import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { dataTest, oraTest, telefon, grad, nume, adminUser } = await request.json();

    if (!dataTest || !oraTest || !telefon || !grad || !nume) {
      return NextResponse.json({ error: 'Toate câmpurile sunt obligatorii' }, { status: 400 });
    }

    const botApiUrl = process.env.BOT_API_URL;
    const verifySecret = process.env.VERIFY_SECRET;

    if (!botApiUrl || !verifySecret) {
      console.error('BOT_API_URL or VERIFY_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    // Get current programare
    const getProgramareResponse = await fetch(`${botApiUrl}/programari-teste`, {
      headers: { 'x-verify-secret': verifySecret },
    });

    if (!getProgramareResponse.ok) {
      return NextResponse.json({ error: 'Eroare la citirea programării' }, { status: 500 });
    }

    const programari = await getProgramareResponse.json();
    const programare = programari.find((p: any) => p.id === id);

    if (!programare) {
      return NextResponse.json({ error: 'Programare negăsită' }, { status: 404 });
    }

    programare.status = 'scheduled';
    programare.dataTest = dataTest;
    programare.oraTest = oraTest;
    programare.telefon = telefon;
    programare.grad = grad;
    programare.nume = nume;
    programare.adminUser = adminUser;
    programare.dataProgramare = new Date().toISOString();

    // Update programare
    const updateResponse = await fetch(`${botApiUrl}/programari-teste/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-verify-secret': verifySecret,
      },
      body: JSON.stringify(programare),
    });

    if (!updateResponse.ok) {
      return NextResponse.json({ error: 'Eroare la programarea testului' }, { status: 500 });
    }

    const dmPayload = {
      discordTag: programare.discordTag,
      message: generateEmailContent(programare, adminUser),
    };

    try {
      await fetch(`${botApiUrl}/notify/discord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-verify-secret': verifySecret,
        },
        body: JSON.stringify(dmPayload),
      });
    } catch (error) {
      console.error('Error sending DM via bot:', error);
      // continue even if DM fails
    }

    return NextResponse.json({ success: true, programare, notified: !!programare.discordTag });
  } catch (error) {
    console.error('Error scheduling test:', error);
    return NextResponse.json({ error: 'Eroare la programarea testului' }, { status: 500 });
  }
}

function generateEmailContent(programare: any, adminUser: any) {
  const now = new Date();
  const greeting = now.getHours() >= 18 ? 'Bună seara' : 'Bună ziua';
  const solicitant = `${programare.prenume} ${programare.nume}`.trim();
  const dataGenerarii = now.toLocaleDateString('ro-RO');
  const dataTest = programare.dataTest
    ? new Date(programare.dataTest).toLocaleDateString('ro-RO')
    : '—';

  const mesaj = [
    `${greeting}, ${solicitant},`,
    '',
    `Programarea pentru testul "${programare.tipTest}" a fost CONFIRMATĂ.`,
    `📅 Data: ${dataTest}`,
    `🕐 Ora: ${programare.oraTest || '—'}`,
    `📍 Locație: Sediul IPJ Los Santos`,
    '',
    'Vă rugăm să vă prezentați cu 10 minute înainte pentru formalități și verificarea documentelor.',
  ].join('\n');

  return [
    '📧 MODEL E-MAIL',
    '',
    '📤 Expeditor: relatiipublice@ipjbz.ro',
    `📅 Data: ${dataGenerarii}`,
    `📎 Către: ${solicitant} @ Discord (${programare.discordTag || 'fără tag'})`,
    '📌 Subiect: APROBARE PROGRAMARE',
    '-------------------------------------------------------------',
    '',
    'Mesaj:',
    mesaj,
    '',
    '-------------------------------------------------------------',
    '',
    'Cu stimă,',
    `${adminUser?.grad || ''} ${adminUser?.nume || 'Admin'}`.trim(),
    'Biroul Relații Publice',
    '',
    '🔁 Răspunde | ➡️ Redirecționează',
  ].join('\n');
}

