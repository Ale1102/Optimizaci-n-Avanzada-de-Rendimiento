import { NextResponse } from 'next/server';
import { db, userFromRequest } from '../_data';
import type { Order, OrderItem } from '@/types';

// GET /api/mock/orders -> historial del usuario autenticado
export async function GET(request: Request) {
  const user = userFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
  }

  const orders = db.orders
    .filter((o) => o.user_id === user.id)
    .sort((a, b) => b.id - a.id);

  return NextResponse.json({ data: orders });
}

// POST /api/mock/orders -> crea una orden con los items recibidos
export async function POST(request: Request) {
  const user = userFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const items = (body as { items?: { product_id: number; quantity: number }[] }).items;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { message: 'La orden debe incluir al menos un producto.' },
      { status: 422 }
    );
  }

  const orderItems: OrderItem[] = [];
  let total = 0;

  for (const line of items) {
    const product = db.products.find((p) => p.id === Number(line.product_id));
    if (!product) {
      return NextResponse.json(
        { message: `Producto ${line.product_id} no encontrado.` },
        { status: 422 }
      );
    }
    const quantity = Number(line.quantity) || 1;
    total += product.price * quantity;
    orderItems.push({
      id: orderItems.length + 1,
      product_id: product.id,
      quantity,
      price: product.price,
      product,
    });
  }

  const order: Order = {
    id: db.orderSeq++,
    user_id: user.id,
    total: Math.round(total * 100) / 100,
    status: 'pending',
    items: orderItems,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.orders.push(order);

  return NextResponse.json(order, { status: 201 });
}
