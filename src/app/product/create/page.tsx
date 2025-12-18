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
    <div style={{ padding: 20 }}>
      <h1>เพิ่มสินค้าใหม่ (Zod Validation)</h1>

      {serverError && (
        <div style={{ color: 'red', border: '1px solid red', padding: '10px', marginBottom: '10px' }}>
          Server Error: {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 480 }}>
        <div style={{ marginBottom: 8 }}>
          <label>ชื่อ</label><br />
          <input type="text" {...register('name')} />
          {errors.name && <span style={{ color: 'red' }}> * {String(errors.name.message)}</span>}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>ราคา</label><br />
          <input type="number" {...register('price')} />
          {errors.price && <span style={{ color: 'red' }}> * {String(errors.price.message)}</span>}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>รายละเอียด</label><br />
          <textarea {...register('description')} />
        </div>

        <div>
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}</button>{' '}
          <Link href="/product"><button type="button" style={{ marginLeft: 8 }}>ยกเลิก</button></Link>
        </div>
      </form>
    </div>
  );
}
