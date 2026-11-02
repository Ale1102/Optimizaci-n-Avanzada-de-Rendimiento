import { NextResponse } from 'next/server';
import { db, generateToken } from '../_data';

// POST /api/mock/register -> { user, token }
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { name, email, password, password_confirmation } = body as {
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
  };

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: 'Todos los campos son requeridos.' },
      { status: 422 }
    );
  }

  if (password !== password_confirmation) {
    return NextResponse.json(
      {
        message: 'Las contraseñas no coinciden.',
        errors: { password: ['La confirmación de contraseña no coincide.'] },
      },
      { status: 422 }
    );
  }

  if (db.users.some((u) => u.email === email)) {
    return NextResponse.json(
      {
        message: 'El correo ya está registrado.',
        errors: { email: ['El correo ya está en uso.'] },
      },
      { status: 422 }
    );
  }

  const token = generateToken();
  const newUser = {
    id: db.userSeq++,
    name,
    email,
    password,
    token,
    created_at: new Date().toISOString(),
  };
  db.users.push(newUser);

  return NextResponse.json(
    {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at,
      },
      token,
      message: 'Registro exitoso.',
    },
    { status: 201 }
  );
}
