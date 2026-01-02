import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TOKENS_FILE = path.join(process.cwd(), 'data', 'discord-tokens.json');
const ADMIN_ROLE_ID = '1179052940351246357';

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

    // Verifică role-ul prin Discord API
    // Notă: Pentru verificare completă, ar trebui să folosim Discord OAuth
    // Pentru moment, verificăm doar token-ul generat de bot

    return NextResponse.json({
      success: true,
      discordId: tokenData.discordId,
      redirect: '/admin/dashboard'
    });
  } catch (error) {
    console.error('Error in Discord auth:', error);
    return NextResponse.json({ error: 'Eroare la autentificare' }, { status: 500 });
  }
}

