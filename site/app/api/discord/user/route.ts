import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'discord-users.json');

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const discordId = searchParams.get('discordId');

    if (!discordId) {
      return NextResponse.json({ error: 'Discord ID lipsă' }, { status: 400 });
    }

    // Citește utilizatorii
    let users = [];
    if (fs.existsSync(USERS_FILE)) {
      const usersData = fs.readFileSync(USERS_FILE, 'utf8');
      users = JSON.parse(usersData);
    }

    const user = users.find((u: any) => u.discordId === discordId);

    if (!user) {
      return NextResponse.json({ error: 'Utilizator negăsit' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        discordId: user.discordId,
        grad: user.grad,
        nume: user.nume
      }
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json({ error: 'Eroare la obținere date utilizator' }, { status: 500 });
  }
}

