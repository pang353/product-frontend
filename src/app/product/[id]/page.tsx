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
        method: 'PATCH',
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

  if (!id) return <div style={{ padding: 20 }}>ไม่พบรหัสสินค้า</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>แก้ไขสินค้า (ID: {id})</h1>
      <form onSubmit={handleUpdate} style={{ maxWidth: 480 }}>
        <div style={{ marginBottom: 8 }}>
          <label>ชื่อ</label><br />
          <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} required />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>รายละเอียด</label><br />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>ราคา</label><br />
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%' }} required />
        </div>
        <div>
          <button type="submit">อัปเดต</button>
          <Link href="/product"><button type="button" style={{ marginLeft: 8 }}>ยกเลิก</button></Link>
        </div>
      </form>
    </div>
  );
}
