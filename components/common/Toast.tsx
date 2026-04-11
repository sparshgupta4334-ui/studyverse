'use client';

import { Toaster } from 'react-hot-toast';

export function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#374151',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: '10px',
          fontSize: '14px',
        },
        success: {
          iconTheme: { primary: '#16a34a', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#dc2626', secondary: '#fff' },
        },
      }}
    />
  );
}
