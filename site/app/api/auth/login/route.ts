import { NextResponse } from 'next/server';
import adminUsers from '@/data/admin-users.json';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username și parolă sunt obligatorii' }, { status: 400 });
    }

    const user = adminUsers.find((u) => u.username === username);

    if (!user) {
      return NextResponse.json({ error: 'Credențiale invalide' }, { status: 401 });
    }

    // Pentru demo, verificăm parola simplă (în producție folosește bcrypt)
    // const isValid = await bcrypt.compare(password, user.password);
    // Pentru moment, folosim parolă simplă pentru testare
    const isValid = password === 'admin123' || password === 'ipj2024';

    if (!isValid) {
      return NextResponse.json({ error: 'Credențiale invalide' }, { status: 401 });
    }

    // Returnează datele user-ului (fără parolă)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Eroare la autentificare' }, { status: 500 });
  }
}

