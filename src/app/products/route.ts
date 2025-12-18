// src/app/products/route.ts
import { NextResponse } from 'next/server';
import { getProducts, addProduct, getNextId } from '@/lib/serverProductStore';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, description } = body;
    if (!name || typeof price !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const id = await getNextId();
    const newProduct = { id, name: String(name), price: Number(price), description: String(description ?? '') };
    await addProduct(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}