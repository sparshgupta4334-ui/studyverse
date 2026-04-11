'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/lib/types';

const MOCK_USER: User = {
  id: 'u1',
  name: 'Raj Gupta',
  phone: '9999999999',
  email: 'raj@guptapaper.com',
  businessName: 'Gupta Paper Stores',
  role: 'user',
  createdAt: '2023-01-01',
  isActive: true,
};

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, login, logout, setLoading } = useAuthStore();

  const signIn = async (phone: string, otp: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (otp === '1234' || otp.length === 4) {
      login({ ...MOCK_USER, phone });
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const signOut = () => {
    logout();
    router.push('/');
  };

  return { user, isAuthenticated, isLoading, signIn, signOut };
}
