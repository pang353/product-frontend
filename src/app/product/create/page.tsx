'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api, { getServerMessage } from '../../../lib/api';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const productSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อสินค้า'),
  price: z.coerce
    .number()
    .min(1, 'กรุณากรอกราคา')
    .refine((val) => !isNaN(val), 'ราคาต้องเป็นตัวเลข')
    .nonnegative('ราคาต้องไม่เป็นลบ')
    .lt(5000, 'ราคาต้องน้อยกว่า 5000'),
  description: z.string().optional(),
});

type ProductFormInputs = z.infer<typeof productSchema>; 

export default function CreateProduct() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInputs>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: { name: '', price: undefined as any, description: '' },
  });

  const onSubmit: SubmitHandler<ProductFormInputs> = async (data) => {
    setServerError(null);

    try {
      await api.post('/products', data);
      router.push('/product');
    } catch (error: any) {
      const msg = getServerMessage(error);
      setServerError(Array.isArray(msg) ? msg.join(', ') : msg || 'Error connecting to server');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="mb-6 text-2xl font-semibold">เพิ่มสินค้าใหม่ (Zod Validation)</h1>

      {serverError && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-red-700">
          Server Error: {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
        <div>
          <label className="mb-1 block text-sm text-gray-700">ชื่อ</label>
          <input type="text" {...register('name')} className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.name && <div className="mt-1 text-sm text-red-600">* {String(errors.name.message)}</div>}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">ราคา</label>
          <input type="number" {...register('price')} className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.price && <div className="mt-1 text-sm text-red-600">* {String(errors.price.message)}</div>}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">รายละเอียด</label>
          <textarea {...register('description')} className="h-28 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
          <Link href="/product" className="inline-flex items-center rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50">ยกเลิก</Link>
        </div>
      </form>
    </div>
  );
}
