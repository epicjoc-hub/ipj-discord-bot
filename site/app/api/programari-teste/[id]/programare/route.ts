import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const filePath = path.join(process.cwd(), 'data', 'programari-teste.json');

function readProgramari() {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return [];
  }
}

function writeProgramari(programari: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(programari, null, 2));
}

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

    const programari = readProgramari();
    const programareIndex = programari.findIndex((p: any) => p.id === id);

    if (programareIndex === -1) {
      return NextResponse.json({ error: 'Programare negăsită' }, { status: 404 });
    }

    const programare = programari[programareIndex];
    programare.status = 'scheduled';
    programare.dataTest = dataTest;
    programare.oraTest = oraTest;
    programare.telefon = telefon;
    programare.grad = grad;
    programare.nume = nume;
    programare.adminUser = adminUser;
    programare.dataProgramare = new Date().toISOString();

    programari[programareIndex] = programare;
    writeProgramari(programari);

    // Generează email pentru Discord
    const emailContent = generateEmailContent(programare, adminUser);

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

