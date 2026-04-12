'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter valid phone number').max(13),
  email: z.string().email('Enter valid email').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
export type SignupFormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: SignupFormData) => Promise<void>;
  error?: string;
}

export default function SignupForm({ onSubmit, error }: Props) {
  const [showPwd, setShowPwd] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div>
        <label className="label">Full Name</label>
        <input {...register('name')} type="text" placeholder="Ramesh Gupta" className="input-field" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="label">Phone Number</label>
        <input {...register('phone')} type="tel" placeholder="9876543210" className="input-field" />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="label">Email (optional)</label>
        <input {...register('email')} type="email" placeholder="you@example.com" className="input-field" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="label">Password</label>
        <div className="relative">
          <input
            {...register('password')}
            type={showPwd ? 'text' : 'password'}
            placeholder="••••••••"
            className="input-field pr-10"
          />
          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="label">Confirm Password</label>
        <input {...register('confirmPassword')} type="password" placeholder="••••••••" className="input-field" />
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 text-base">
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
