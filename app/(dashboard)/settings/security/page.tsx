'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Smartphone } from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

export default function SecuritySettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleChangeMPin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success('OTP sent to your registered phone number');
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/settings" className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"><ArrowLeft size={20} /></Link>
        <h1 className="text-xl font-bold text-gray-900">Security Settings</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg"><Shield size={18} className="text-green-600" /></div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Phone Verification</p>
              <p className="text-xs text-green-600 font-medium">✓ Verified</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg"><Smartphone size={18} className="text-blue-600" /></div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Change MPIN</p>
              <p className="text-xs text-gray-500">Update your 4-digit security PIN</p>
            </div>
          </div>
          <Button size="sm" variant="outline" isLoading={loading} onClick={handleChangeMPin}>Change</Button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">Security Tip:</span> Never share your OTP or MPIN with anyone. Our team will never ask for it.
        </p>
      </div>
    </div>
  );
}
