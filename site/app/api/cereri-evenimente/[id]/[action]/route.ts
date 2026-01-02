import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  try {
    const { id, action } = await params;
    const { mesaj, adminUser } = await request.json();

    if (action !== 'aprobare' && action !== 'respingere') {
      return NextResponse.json({ error: 'Acțiune invalidă' }, { status: 400 });
    }

    const botApiUrl = process.env.BOT_API_URL;
    const verifySecret = process.env.VERIFY_SECRET;

    if (!botApiUrl || !verifySecret) {
      console.error('BOT_API_URL or VERIFY_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    // Get current cerere
    const getCerereResponse = await fetch(`${botApiUrl}/cereri-evenimente`, {
      headers: { 'x-verify-secret': verifySecret },
    });

    if (!getCerereResponse.ok) {
      return NextResponse.json({ error: 'Eroare la citirea cererii' }, { status: 500 });
    }

    const cereri = await getCerereResponse.json();
    const cerere = cereri.find((c: any) => c.id === id);

    if (!cerere) {
      return NextResponse.json({ error: 'Cerere negăsită' }, { status: 404 });
    }

    const newStatus = action === 'aprobare' ? 'approved' : 'rejected';

    // Add to history
    if (!cerere.istoric) {
      cerere.istoric = [];
    }

    cerere.istoric.push({
      data: new Date().toISOString(),
      actiune: action,
      status: newStatus,
      mesaj: mesaj || '',
      admin: adminUser,
    });

    cerere.status = newStatus;

    // Update cerere
    const updateResponse = await fetch(`${botApiUrl}/cereri-evenimente/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-verify-secret': verifySecret,
      },
      body: JSON.stringify(cerere),
    });

    if (!updateResponse.ok) {
      return NextResponse.json({ error: 'Eroare la actualizarea cererii' }, { status: 500 });
    }

    // If approved, create anunt automatically
    if (action === 'aprobare') {
      try {
        const anuntData = {
          titlu: cerere.tipEveniment === 'Altul' ? (cerere.tipCustom || cerere.tipEveniment) : cerere.tipEveniment,
          data: cerere.data,
          ora: cerere.ora,
          locatie: 'Los Santos',
          descriere: cerere.descriere,
          status: 'aprobat',
          imagine: '/images/events/default.jpg',
        };

        await fetch(`${botApiUrl}/anunturi-evenimente`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-verify-secret': verifySecret,
          },
          body: JSON.stringify(anuntData),
        });
      } catch (error) {
        console.error('Error creating anunt:', error);
        // Continue even if anunt creation fails
      }
    }

    // Generate email for Discord
    const emailContent = generateEmailContent(cerere, newStatus, mesaj, adminUser);

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

    return NextResponse.json({ success: true, cerere });
  } catch (error) {
    console.error('Error updating cerere:', error);
    return NextResponse.json({ error: 'Eroare la actualizarea cererii' }, { status: 500 });
  }
}

function generateEmailContent(cerere: any, status: string, mesaj: string, adminUser: any) {
  const numeComplet = `${cerere.prenume} ${cerere.nume}`;
  const email = `${cerere.nume.toLowerCase()}.${cerere.prenume.toLowerCase()}@bzone.ro`;
  const data = new Date().toLocaleDateString('ro-RO');
  const subiect = status === 'approved' ? 'APROBARE' : 'RESPINGERE';

  return `
📧 MODEL E-MAIL

📤 Expeditor: relatiipublice@ipjbz.ro
📅 Data: ${data}
📎 Către: ${email}
📌 Subiect: ${subiect} CERERE EVENIMENT

-------------------------------------------------------------

Mesaj:

${mesaj || (status === 'approved' ? 'Cererea dvs. pentru eveniment a fost aprobată.' : 'Cererea dvs. pentru eveniment a fost respinsă.')}

-------------------------------------------------------------

Cu stimă,
${adminUser?.grad || ''} ${adminUser?.nume || 'Admin'}
Biroul Relații Publice

🔁 Răspunde | ➡️ Redirecționează
  `.trim();
}

