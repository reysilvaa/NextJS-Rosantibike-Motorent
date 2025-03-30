import { useState, useEffect, useCallback } from 'react';
import { fetchTransactions, fetchTransactionById, fetchTransactionHistory, createTransaction, completeTransaction } from '@/lib/api';
import { useLoading } from '../ui/use-loading';
import { toast } from '../ui/use-toast';
import type { Transaction, TransactionFormData } from '@/lib/types';

/**
 * Hook untuk mengambil daftar transaksi
 * @param filter - Filter untuk mengambil data transaksi
 * @returns Data transaksi, status loading, error, dan fungsi refetch
 */
export function useTransactions(filter?: Record<string, any>) {
  const [data, setData] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isLoading, withLoading } = useLoading(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await withLoading(fetchTransactions(filter));
      setData(Array.isArray(result) ? result : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data transaksi');
      setData([]);
    }
  }, [filter, withLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook untuk mengambil riwayat transaksi
 * @returns Data riwayat transaksi, status loading, error, dan fungsi refetch
 */
export function useTransactionHistory() {
  const [data, setData] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isLoading, withLoading } = useLoading(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await withLoading(fetchTransactionHistory());
      setData(Array.isArray(result) ? result : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat riwayat transaksi');
      setData([]);
    }
  }, [withLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook untuk mengambil detail transaksi berdasarkan ID
 * @param id - ID transaksi
 * @returns Data detail transaksi, status loading, error, dan fungsi refetch
 */
export function useTransaction(id?: string) {
  const [data, setData] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isLoading, withLoading } = useLoading(!!id);

  const fetchData = useCallback(async () => {
    if (!id) return;
    
    try {
      const result = await withLoading(fetchTransactionById(id));
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat detail transaksi');
      setData(null);
    }
  }, [id, withLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook untuk membuat transaksi baru
 * @returns Fungsi execute untuk membuat transaksi, status loading, dan error
 */
export function useCreateTransaction() {
  const { isLoading, withLoading } = useLoading(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (data: TransactionFormData) => {
    try {
      const result = await withLoading(createTransaction(data));
      
      toast({
        title: "Transaksi Berhasil",
        description: "Transaksi berhasil dibuat",
      });
      
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Gagal membuat transaksi';
      setError(errorMsg);
      
      toast({
        title: "Transaksi Gagal",
        description: errorMsg,
        variant: "destructive",
      });
      
      throw err;
    }
  }, [withLoading]);

  return { execute, isLoading, error };
}

/**
 * Hook untuk menyelesaikan transaksi
 * @returns Fungsi execute untuk menyelesaikan transaksi, status loading, dan error
 */
export function useCompleteTransaction() {
  const { isLoading, withLoading } = useLoading(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (id: string) => {
    try {
      const result = await withLoading(completeTransaction(id));
      
      toast({
        title: "Transaksi Selesai",
        description: "Transaksi berhasil diselesaikan",
      });
      
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Gagal menyelesaikan transaksi';
      setError(errorMsg);
      
      toast({
        title: "Gagal Menyelesaikan Transaksi",
        description: errorMsg,
        variant: "destructive",
      });
      
      throw err;
    }
  }, [withLoading]);

  return { execute, isLoading, error };
} 