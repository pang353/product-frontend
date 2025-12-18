// src/lib/serverProductStore.ts
import fs from 'fs/promises';
import path from 'path';
import { Product } from '../types/product';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'products.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch {
    const sample: Product[] = [
      { id: 1, name: 'ตัวอย่างสินค้า A', price: 100, description: 'คำอธิบายสั้น' },
      { id: 2, name: 'ตัวอย่างสินค้า B', price: 250, description: 'คำอธิบายเพิ่มเติม' },
    ];
    await fs.writeFile(DATA_FILE, JSON.stringify(sample, null, 2), 'utf8');
  }
}

export async function readProducts(): Promise<Product[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(raw) as any[];
  return parsed.map((p) => ({
    id: Number(p.id),
    name: String(p.name ?? ''),
    price: Number(p.price ?? 0),
    description: String(p.description ?? ''),
  } as Product));
}

export async function writeProducts(list: Product[]) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

export async function getProducts(): Promise<Product[]> {
  return readProducts();
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const all = await readProducts();
  return all.find((p) => p.id === id);
}

export async function getNextId(): Promise<number> {
  const all = await readProducts();
  const max = all.reduce((m, p) => (p.id > m ? p.id : m), 0);
  return max + 1;
}

export async function addProduct(p: Product): Promise<Product> {
  const all = await readProducts();
  all.unshift(p);
  await writeProducts(all);
  return p;
}

export async function updateProduct(updated: Product): Promise<Product | null> {
  const all = await readProducts();
  const idx = all.findIndex((p) => p.id === updated.id);
  if (idx === -1) return null;
  all[idx] = updated;
  await writeProducts(all);
  return updated;
}

export async function deleteProduct(id: number): Promise<void> {
  const all = await readProducts();
  const next = all.filter((p) => p.id !== id);
  await writeProducts(next);
}
