import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plot, PlotGeometry, PlotStatusLink } from '@/types/database';
import { toast } from 'sonner';

export function usePlots() {
  return useQuery({
    queryKey: ['plots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plots')
        .select(`
          *,
          plot_geometry(*),
          plot_status_links(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function usePlot(id: string) {
  return useQuery({
    queryKey: ['plot', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plots')
        .select(`
          *,
          plot_geometry(*),
          plot_status_links(*),
          plot_documents(*)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePlot() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (plot: Omit<Plot, 'id' | 'created_at' | 'updated_at' | 'geometry' | 'status_links'>) => {
      const { data, error } = await supabase
        .from('plots')
        .insert(plot)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plots'] });
      toast.success('เพิ่มแปลงยางสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function useUpdatePlot() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...plot }: Partial<Plot> & { id: string }) => {
      const { data, error } = await supabase
        .from('plots')
        .update(plot)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plots'] });
      toast.success('อัปเดตแปลงยางสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function useDeletePlot() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('plots')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plots'] });
      toast.success('ลบแปลงยางสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function useCreatePlotGeometry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (geometry: Omit<PlotGeometry, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('plot_geometry')
        .insert(geometry)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plots'] });
      toast.success('บันทึกพิกัดสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function useUpdatePlotStatusLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (statusLink: Omit<PlotStatusLink, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('plot_status_links')
        .upsert(statusLink, { onConflict: 'plot_id,status_type' })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plots'] });
      toast.success('อัปเดตสถานะสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}
