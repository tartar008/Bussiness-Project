import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FarmBook, FarmBookPlot } from '@/types/database';
import { toast } from 'sonner';

export function useFarmBooks(farmerId?: string) {
  return useQuery({
    queryKey: ['farm_books', farmerId],
    queryFn: async () => {
      let query = supabase
        .from('farm_books')
        .select(`
          *,
          farmers(*)
        `)
        .order('created_at', { ascending: false });
      
      if (farmerId) {
        query = query.eq('farmer_id', farmerId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as FarmBook[];
    },
  });
}

export function useCreateFarmBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (farmBook: Omit<FarmBook, 'id' | 'created_at' | 'updated_at' | 'farmer'>) => {
      const { data, error } = await supabase
        .from('farm_books')
        .insert(farmBook)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farm_books'] });
      toast.success('เพิ่มทะเบียนเกษตรกรสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function useUpdateFarmBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...farmBook }: Partial<FarmBook> & { id: string }) => {
      const { data, error } = await supabase
        .from('farm_books')
        .update(farmBook)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farm_books'] });
      toast.success('อัปเดตข้อมูลสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function useDeleteFarmBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('farm_books')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farm_books'] });
      toast.success('ลบทะเบียนเกษตรกรสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

// Farm Book Plots mapping
export function useFarmBookPlots(farmBookId?: string) {
  return useQuery({
    queryKey: ['farm_book_plots', farmBookId],
    queryFn: async () => {
      let query = supabase
        .from('farm_book_plots')
        .select(`
          *,
          farm_books(*),
          plots(*)
        `)
        .order('created_at', { ascending: false });
      
      if (farmBookId) {
        query = query.eq('farm_book_id', farmBookId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as FarmBookPlot[];
    },
    enabled: !!farmBookId || farmBookId === undefined,
  });
}

export function useCreateFarmBookPlot() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (mapping: Omit<FarmBookPlot, 'id' | 'created_at' | 'farm_book' | 'plot'>) => {
      const { data, error } = await supabase
        .from('farm_book_plots')
        .insert(mapping)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farm_book_plots'] });
      toast.success('เชื่อมโยงแปลงสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function useDeleteFarmBookPlot() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('farm_book_plots')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farm_book_plots'] });
      toast.success('ยกเลิกการเชื่อมโยงสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}
