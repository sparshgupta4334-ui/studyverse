'use client';

import { useState, useEffect } from 'react';
import { getTransactions, getTransaction } from '@/lib/api';
import type { Transaction } from '@/lib/types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .catch(() => setError('Failed to load transactions'))
      .finally(() => setIsLoading(false));
  }, []);

  return { transactions, isLoading, error, setTransactions };
}

export function useTransaction(id: string) {
  const [transaction, setTransaction] = useState<Transaction | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTransaction(id)
      .then(setTransaction)
      .finally(() => setIsLoading(false));
  }, [id]);

  return { transaction, isLoading };
}
