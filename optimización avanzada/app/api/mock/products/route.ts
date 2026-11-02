import { NextResponse } from 'next/server';
import { db } from '../_data';

// GET /api/mock/products -> listado público de productos
export async function GET() {
  return NextResponse.json({ data: db.products });
}
