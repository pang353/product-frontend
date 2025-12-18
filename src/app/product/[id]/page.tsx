'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProduct() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // 1. ดึงข้อมูลเก่ามาแสดง
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setName(data.name ?? '');
          setPrice(data.price != null ? String(data.price) : '');
          setDescription(data.description ?? '');
        } else {
          alert('ไม่พบสินค้านี้');
          router.push('/product');
        }
      } catch (error) {
        alert('เกิดข้อผิดพลาดขณะดึงข้อมูล');
        router.push('/product');
      }
    })();
  }, [id, router]);

  // 2. บันทึกข้อมูลที่แก้ไข
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      const res = await fetch(`/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: Number(price), description }),
      });

      if (res.ok) {
        router.push('/product');
      } else {
        alert('แก้ไขไม่สำเร็จ');
      }
    } catch (error) {
      alert('Error updating product');
    }
  };

  if (!id) return <div className="p-6">ไม่พบรหัสสินค้า</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="mb-6 text-2xl font-semibold">แก้ไขสินค้า (ID: {id})</h1>
      <form onSubmit={handleUpdate} className="max-w-xl space-y-4">
        <div>
          <label className="mb-1 block text-sm text-gray-700">ชื่อ</label><br />
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-700">รายละเอียด</label><br />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="h-28 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-700">ราคา</label><br />
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">อัปเดต</button>
          <Link href="/product" className="inline-flex items-center rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50">ยกเลิก</Link>
        </div>
      </form>
    </div>
  );
}
