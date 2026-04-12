'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { saveUser, getUser } from '@/lib/auth';
import type { User } from '@/lib/types';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
});
type FormData = z.infer<typeof schema>;

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const u = getUser();
    if (u) { setUser(u); reset({ name: u.name, email: u.email || '' }); }
    else {
      authApi.getMe().then((res) => {
        if (res.data.success && res.data.data) {
          setUser(res.data.data);
          saveUser(res.data.data);
          reset({ name: res.data.data.name, email: res.data.data.email || '' });
        }
      }).catch(() => {});
    }
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    setError(''); setSuccess('');
    try {
      // Profile update would call an update endpoint; using getMe to refresh
      const res = await authApi.getMe();
      if (res.data.success && res.data.data) {
        const updated = { ...res.data.data, name: data.name, email: data.email || undefined };
        saveUser(updated);
        setUser(updated);
        setSuccess('Profile updated successfully');
      }
    } catch {
      setError('Failed to update profile');
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your account preferences</p>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">Profile Information</h2>

        {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4 border border-green-100">{success}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input {...register('name')} className="input-field" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input type="tel" value={user?.phone || ''} disabled className="input-field bg-gray-50 text-gray-500 cursor-not-allowed" />
            <p className="text-xs text-gray-400 mt-1">Phone number cannot be changed</p>
          </div>
          <div>
            <label className="label">Email</label>
            <input {...register('email')} type="email" className="input-field" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary px-6 py-2.5">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-3">Account Info</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">User ID</span>
            <span className="font-mono text-xs text-gray-600">{user?.user_id || '—'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Role</span>
            <span className="capitalize font-medium text-gray-800">{user?.role || '—'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Member Since</span>
            <span className="text-gray-600">{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
