import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CollectionPoint } from '@/types/database';
import { toast } from 'sonner';

export function useCollectionPoints() {
  return useQuery({
    queryKey: ['collection_points'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collection_points')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CollectionPoint[];
    },
  });
}

export function useCreateCollectionPoint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (point: Omit<CollectionPoint, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('collection_points')
        .insert(point)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection_points'] });
      toast.success('เพิ่มจุดรับซื้อสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function useUpdateCollectionPoint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...point }: Partial<CollectionPoint> & { id: string }) => {
      const { data, error } = await supabase
        .from('collection_points')
        .update(point)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection_points'] });
      toast.success('อัปเดตข้อมูลสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function useDeleteCollectionPoint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('collection_points')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection_points'] });
      toast.success('ลบจุดรับซื้อสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}
