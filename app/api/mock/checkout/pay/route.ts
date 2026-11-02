import { NextResponse } from 'next/server';
import { db } from '../../_data';

// GET /api/mock/checkout/pay?order_id=...&session_id=...
// Simula el retorno de Stripe tras un pago exitoso: marca la orden como
// pagada y redirige a la página de confirmación del frontend.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = Number(url.searchParams.get('order_id'));

  const order = db.orders.find((o) => o.id === orderId);
  if (order) {
    order.status = 'paid';
    order.updated_at = new Date().toISOString();
  }

  return NextResponse.redirect(new URL('/checkout/success', url.origin));
}
