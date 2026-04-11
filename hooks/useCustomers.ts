'use client';

import { useState, useEffect } from 'react';
import { getCustomers, getCustomer } from '@/lib/api';
import type { Customer } from '@/lib/types';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .catch(() => setError('Failed to load customers'))
      .finally(() => setIsLoading(false));
  }, []);

  return { customers, isLoading, error, setCustomers };
}

export function useCustomer(id: string) {
  const [customer, setCustomer] = useState<Customer | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCustomer(id)
      .then(setCustomer)
      .finally(() => setIsLoading(false));
  }, [id]);

  return { customer, isLoading };
}
