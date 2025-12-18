// src/app/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/serverProductStore';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const p = await getProductById(id);
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(p);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  try {
    const body = await request.json();
    const { name, price, description } = body;
    const existing = await getProductById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const updated = {
      ...existing,
      name: name ?? existing.name,
      price: price ?? existing.price,
      description: description ?? existing.description,
    };
    const res = await updateProduct(updated);
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  await deleteProduct(id);
  return new NextResponse(null, { status: 204 });
}