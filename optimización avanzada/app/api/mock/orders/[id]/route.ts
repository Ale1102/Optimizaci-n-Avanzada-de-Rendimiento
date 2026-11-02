import { NextResponse } from 'next/server';
import { db, userFromRequest } from '../../_data';

// GET /api/mock/orders/{id} -> detalle de una orden del usuario autenticado
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = userFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
  }

  const { id } = await params;
  const order = db.orders.find((o) => o.id === Number(id) && o.user_id === user.id);

  if (!order) {
    return NextResponse.json({ message: 'Orden no encontrada.' }, { status: 404 });
  }

  return NextResponse.json(order);
}
