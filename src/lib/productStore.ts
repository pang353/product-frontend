// src/lib/productStore.ts
import { Product } from '../types/product';

const STORAGE_KEY = 'products';

export function getProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as any[]) : [];
    // Normalize/paranoid conversion to ensure `id` is a number and `description` exists
    return parsed.map(p => ({
      id: Number(p.id),
      name: String(p.name ?? ''),
      price: Number(p.price ?? 0),
      description: String(p.description ?? '')
    } as Product));
  } catch {
    return [];
  }
}

export function saveProducts(list: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function ensureSampleProducts() {
  if (getProducts().length === 0) {
    const sample: Product[] = [
      { id: 1, name: 'ตัวอย่างสินค้า A', description: 'คำอธิบายสั้น', price: 100 },
      { id: 2, name: 'ตัวอย่างสินค้า B', description: 'คำอธิบายเพิ่มเติม', price: 250 }
    ];
    saveProducts(sample);
  }
}

export function addProduct(p: Product) {
  const all = getProducts();
  all.unshift(p);
  saveProducts(all);
}

export function getProductById(id: number) {
  return getProducts().find(p => p.id === id);
}

export function updateProduct(updated: Product) {
  const all = getProducts().map(p => (p.id === updated.id ? updated : p));
  saveProducts(all);
}

export function deleteProduct(id: number) {
  const all = getProducts().filter(p => p.id !== id);
  saveProducts(all);
}
