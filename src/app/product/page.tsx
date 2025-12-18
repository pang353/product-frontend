'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product'; // เรียกใช้ Interface กลาง

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const API_URL = '/products';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        // อัปเดตรายการทันทีโดยไม่ต้องเรียกทั้งรายการใหม่
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('ลบไม่สำเร็จ');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">รายการสินค้า</h1>
        <Link
          href="/product/create"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
        >
          + เพิ่มสินค้าใหม่
        </Link>
      </div>

      {loading ? (
        <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
      ) : products.length === 0 ? (
        <div className="rounded-md border border-dashed p-10 text-center text-gray-600">
          ยังไม่มีสินค้า
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ชื่อสินค้า</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ราคา</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">รายละเอียด</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{p.id}</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{Number(p.price).toLocaleString()}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 max-w-[320px] truncate">{p.description}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/product/${p.id}/view`}
                        className="inline-flex items-center rounded-md border px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                      >
                        รายละเอียด
                      </Link>
                      <Link
                        href={`/product/${p.id}`}
                        className="inline-flex items-center rounded-md bg-amber-500 px-3 py-1.5 text-white hover:bg-amber-600"
                      >
                        แก้ไข
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
