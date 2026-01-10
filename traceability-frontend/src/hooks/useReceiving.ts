import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReceivingTransaction, Validation } from '@/types/database';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export function useReceivingTransactions(filters?: { date?: string; farmerId?: string }) {
  return useQuery({
    queryKey: ['receiving_transactions', filters],
    queryFn: async () => {
      let query = supabase
        .from('receiving_transactions')
        .select(`
          *,
          farmers(*),
          plots(*),
          collection_points(*),
          vehicles(*),
          drivers(*)
        `)
        .order('transaction_date', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (filters?.date) {
        query = query.eq('transaction_date', filters.date);
      }
      if (filters?.farmerId) {
        query = query.eq('farmer_id', filters.farmerId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as ReceivingTransaction[];
    },
  });
}

export function useCreateReceivingTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transaction: Omit<ReceivingTransaction, 'id' | 'created_at' | 'updated_at' | 'farmer' | 'plot' | 'collection_point' | 'vehicle' | 'driver'>) => {
      const { data, error } = await supabase
        .from('receiving_transactions')
        .insert(transaction)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receiving_transactions'] });
      queryClient.invalidateQueries({ queryKey: ['validations'] });
      toast.success('บันทึกการรับซื้อสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function useDeleteReceivingTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('receiving_transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receiving_transactions'] });
      toast.success('ลบรายการสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function useValidations(year?: number) {
  return useQuery({
    queryKey: ['validations', year],
    queryFn: async () => {
      let query = supabase
        .from('validations')
        .select(`
          *,
          plots(*)
        `)
        .order('is_over_limit', { ascending: false })
        .order('actual_yield_ytd', { ascending: false });
      
      if (year) {
        query = query.eq('year', year);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as (Validation & { plots: unknown })[];
    },
  });
}

export function useImportBatches() {
  return useQuery({
    queryKey: ['import_batches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('import_batches')
        .select('*')
        .order('import_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateImportBatch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (batch: { batch_code: string; file_name?: string; import_date?: string; total_rows?: number; success_rows?: number; failed_rows?: number; status?: string; error_log?: Json }) => {
      const { data, error } = await supabase
        .from('import_batches')
        .insert([batch])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import_batches'] });
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function useBulkCreateTransactions() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transactions: Omit<ReceivingTransaction, 'id' | 'created_at' | 'updated_at' | 'farmer' | 'plot' | 'collection_point' | 'vehicle' | 'driver'>[]) => {
      const { data, error } = await supabase
        .from('receiving_transactions')
        .insert(transactions)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['receiving_transactions'] });
      queryClient.invalidateQueries({ queryKey: ['validations'] });
      toast.success(`นำเข้าสำเร็จ ${data.length} รายการ`);
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}
