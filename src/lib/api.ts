import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

export function getServerMessage(error: unknown): string | string[] | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const err = error as any;
  return err?.response?.data?.message;
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error)
);

export default api;
