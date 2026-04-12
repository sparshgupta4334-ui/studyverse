'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Shield } from 'lucide-react';
import { authApi } from '@/lib/api';
import { saveToken, saveUser } from '@/lib/auth';
import LoginForm, { type LoginFormData } from '@/components/LoginForm';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
      const res = await authApi.adminLogin(data.phone, data.password);
      if (res.data.success && res.data.data) {
        if (res.data.data.user.role !== 'admin') {
          setError('Access denied. Admin account required.');
          return;
        }
        saveToken(res.data.data.token);
        saveUser(res.data.data.user);
        router.push('/admin');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-3 relative">
            <BookOpen className="w-7 h-7 text-white" />
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Gupta Paper Stores — Admin Access</p>
        </div>

        <LoginForm onSubmit={onSubmit} error={error} submitLabel="Admin Login" />
      </div>
    </div>
  );
}
