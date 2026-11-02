import { NextResponse } from 'next/server';
import { db, generateToken } from '../_data';

// POST /api/mock/login -> { user, token }
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json(
      { message: 'El correo y la contraseña son requeridos.' },
      { status: 422 }
    );
  }

  const user = db.users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return NextResponse.json(
      { message: 'Credenciales inválidas.' },
      { status: 401 }
    );
  }

  // Rotamos el token en cada login (como haría Sanctum al crear uno nuevo).
  user.token = generateToken();

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at },
    token: user.token,
    message: 'Inicio de sesión exitoso.',
  });
}
