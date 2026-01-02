import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const filePath = path.join(process.cwd(), 'data', 'cereri-evenimente.json');

function readCereri() {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return [];
  }
}

function writeCereri(cereri: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(cereri, null, 2));
}

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

    const cereri = readCereri();
    const cerereIndex = cereri.findIndex((c: any) => c.id === id);

    if (cerereIndex === -1) {
      return NextResponse.json({ error: 'Cerere negăsită' }, { status: 404 });
    }

    const cerere = cereri[cerereIndex];
    const newStatus = action === 'aprobare' ? 'approved' : 'rejected';

    // Adaugă în istoric
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

    cereri[cerereIndex] = cerere;
    writeCereri(cereri);

    // Generează email pentru Discord
    const emailContent = generateEmailContent(cerere, newStatus, mesaj, adminUser);

    // Trimite la Discord webhook (dacă e configurat)
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

