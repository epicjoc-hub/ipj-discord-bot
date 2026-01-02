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

export async function GET() {
  try {
    const cereri = readCereri();
    return NextResponse.json(cereri);
  } catch (error) {
    console.error('Error reading cereri:', error);
    return NextResponse.json({ error: 'Eroare la citirea cererilor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const cereri = readCereri();

    const newCerere = {
      id: Date.now().toString(),
      ...data,
      status: 'pending',
      dataCreare: new Date().toISOString(),
      istoric: [],
    };

    cereri.push(newCerere);
    writeCereri(cereri);

    return NextResponse.json({ success: true, cerere: newCerere }, { status: 201 });
  } catch (error) {
    console.error('Error creating cerere:', error);
    return NextResponse.json({ error: 'Eroare la crearea cererii' }, { status: 500 });
  }
}

