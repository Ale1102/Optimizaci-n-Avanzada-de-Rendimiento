import { NextResponse } from 'next/server';
import { db } from '../../_data';

// GET /api/mock/products/{id} -> detalle de un producto
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = db.products.find((p) => p.id === Number(id));

  if (!product) {
    return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
  }

  return NextResponse.json(product);
}
