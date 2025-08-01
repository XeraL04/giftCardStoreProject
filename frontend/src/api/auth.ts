import api from './client';
import type { User } from '../types/User';

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function register(name: string, email: string, password: string, phoneNumber?: string): Promise<User> {
  const { data } = await api.post('/auth/register', { name, email, password, phoneNumber });
  return data;
}
