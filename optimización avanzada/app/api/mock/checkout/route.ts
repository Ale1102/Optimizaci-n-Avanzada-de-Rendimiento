import { NextResponse } from 'next/server';
import { db, userFromRequest } from '../_data';

// POST /api/mock/checkout -> simula la creación de una sesión de pago Stripe.
// Devuelve una checkout_url que apunta a una pasarela simulada local.
export async function POST(request: Request) {
  const user = userFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const orderId = (body as { order_id?: number }).order_id;

  const order = db.orders.find((o) => o.id === Number(orderId) && o.user_id === user.id);
  if (!order) {
    return NextResponse.json({ message: 'Orden no encontrada.' }, { status: 422 });
  }

  // Marcamos la orden como "processing" mientras se "paga".
  order.status = 'processing';

  const base = new URL(request.url).origin;
  const sessionId = `cs_mock_${Date.now()}`;

  return NextResponse.json({
    checkout_url: `${base}/api/mock/checkout/pay?order_id=${order.id}&session_id=${sessionId}`,
    session_id: sessionId,
  });
}
