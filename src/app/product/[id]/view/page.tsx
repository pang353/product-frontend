'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types/product';

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          alert('ไม่พบสินค้า');
          router.push('/product');
        }
      } catch (error) {
        alert('เกิดข้อผิดพลาดขณะดึงข้อมูล');
        router.push('/product');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  const handleDelete = async () => {
    if (!id) return;
    const confirmDelete = confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?');
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/products/${id}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        router.push('/product');
      } else {
        alert('ลบไม่สำเร็จ');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดขณะลบ');
    }
  };

  if (!id) return <div className="p-6">ไม่พบรหัสสินค้า</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">รายละเอียดสินค้า</h1>
        <div className="flex gap-2">
          <Link
            href={`/product/${id}`}
            className="inline-flex items-center rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
          >
            แก้ไข
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            ลบ
          </button>
          <Link
            href="/product"
            className="inline-flex items-center rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            กลับไปหน้ารายการ
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
      ) : !product ? (
        <div className="rounded-md border border-dashed p-10 text-center text-gray-600">ไม่พบสินค้า</div>
      ) : (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">รหัสสินค้า</dt>
              <dd className="text-lg font-medium text-gray-900">{product.id}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">ชื่อสินค้า</dt>
              <dd className="text-lg font-medium text-gray-900">{product.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">ราคา</dt>
              <dd className="text-lg font-medium text-gray-900">{Number(product.price).toLocaleString()}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-gray-500">รายละเอียด</dt>
              <dd className="text-base text-gray-800 whitespace-pre-wrap">{product.description || '-'}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
