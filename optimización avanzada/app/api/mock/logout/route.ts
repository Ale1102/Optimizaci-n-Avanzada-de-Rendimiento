import { NextResponse } from 'next/server';
import { db, getBearer } from '../_data';

// POST /api/mock/logout -> invalida el token actual
export async function POST(request: Request) {
  const token = getBearer(request);
  if (token) {
    const user = db.users.find((u) => u.token === token);
    if (user) {
      user.token = ''; // invalida el token
    }
  }
  return new NextResponse(null, { status: 204 });
}
