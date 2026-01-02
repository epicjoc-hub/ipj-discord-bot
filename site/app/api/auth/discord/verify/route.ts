import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TOKENS_FILE = path.join(process.cwd(), 'data', 'discord-tokens.json');
const USERS_FILE = path.join(process.cwd(), 'data', 'discord-users.json');

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token lipsă' }, { status: 400 });
    }

    // Citește token-urile
    let tokens = [];
    if (fs.existsSync(TOKENS_FILE)) {
      const tokensData = fs.readFileSync(TOKENS_FILE, 'utf8');
      tokens = JSON.parse(tokensData);
    }

    // Elimină token-urile expirate (doar in-memory — nu persistăm aici)
    const now = new Date();
    const validTokens = tokens.filter((t: any) => new Date(t.expiresAt) > now);

    // Caută token-ul
    const tokenData = validTokens.find((t: any) => t.token === token);

    if (!tokenData) {
      return NextResponse.json({ error: 'Token invalid sau expirat' }, { status: 401 });
    }

    // Obține datele utilizatorului
    let users = [];
    if (fs.existsSync(USERS_FILE)) {
      const usersData = fs.readFileSync(USERS_FILE, 'utf8');
      users = JSON.parse(usersData);
    }

    const user = users.find((u: any) => u.discordId === tokenData.discordId);

    return NextResponse.json({
      success: true,
      discordId: tokenData.discordId,
      user: user || null
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ error: 'Eroare la verificare token' }, { status: 500 });
  }
}

