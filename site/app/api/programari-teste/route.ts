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

export async function GET() {
  try {
    const programari = readProgramari();
    return NextResponse.json(programari);
  } catch (error) {
    console.error('Error reading programari:', error);
    return NextResponse.json({ error: 'Eroare la citirea programărilor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const programari = readProgramari();

    const newProgramare = {
      id: Date.now().toString(),
      ...data,
      status: 'pending',
      dataCreare: new Date().toISOString(),
    };

    programari.push(newProgramare);
    writeProgramari(programari);

    return NextResponse.json({ success: true, programare: newProgramare }, { status: 201 });
  } catch (error) {
    console.error('Error creating programare:', error);
    return NextResponse.json({ error: 'Eroare la crearea programării' }, { status: 500 });
  }
}

