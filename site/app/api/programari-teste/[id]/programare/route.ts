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

    // Generate email for Discord
    const emailContent = generateEmailContent(programare, adminUser);

    // Send to Discord webhook (if configured)
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: emailContent,
          }),
        });
      } catch (error) {
        console.error('Error sending to Discord:', error);
      }
    }

    return NextResponse.json({ success: true, programare });
  } catch (error) {
    console.error('Error scheduling test:', error);
    return NextResponse.json({ error: 'Eroare la programarea testului' }, { status: 500 });
  }
}

function generateEmailContent(programare: any, adminUser: any) {
  const numeComplet = `${programare.prenume} ${programare.nume}`;
  const email = `${programare.nume?.toLowerCase()}.${programare.prenume?.toLowerCase()}@bzone.ro`;
  const data = new Date(programare.dataTest).toLocaleDateString('ro-RO');

  return `
📧 MODEL E-MAIL

📤 Expeditor: relatiipublice@ipjbz.ro
📅 Data: ${new Date().toLocaleDateString('ro-RO')}
📎 Către: ${email}
📌 Subiect: PROGRAMARE TEST ${programare.tipTest}

-------------------------------------------------------------

Mesaj:

Testarea dvs. pentru ${programare.tipTest} a fost programată pentru:
📅 Data: ${data}
🕐 Ora: ${programare.oraTest}
📞 Contact: ${programare.telefon}

Vă rugăm să vă prezentați la timp.

-------------------------------------------------------------

Cu stimă,
${adminUser?.grad || ''} ${adminUser?.nume || 'Admin'}
Biroul Relații Publice

🔁 Răspunde | ➡️ Redirecționează
  `.trim();
}

