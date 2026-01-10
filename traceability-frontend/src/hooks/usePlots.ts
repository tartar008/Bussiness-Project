import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/utils/apiClient';
import { Plot, PlotGeometry, PlotStatusLink } from '@/types/database';

/* =======================
   QUERY
======================= */

export function usePlots() {
  return useQuery<Plot[]>({
    queryKey: ['plots'],
    queryFn: () =>
      apiClient('/plots'), // GET /plots
  });
}

export function usePlot(id?: string) {
  return useQuery<Plot>({
    queryKey: ['plot', id],
    queryFn: () => apiClient(`/plots/${id}`),
    enabled: !!id,
  });
}

/* =======================
   MUTATION: CREATE
======================= */

export function useCreatePlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Plot>) =>
      apiClient<Plot>('/plots', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plots'] });
      toast.success('เพิ่มแปลงสำเร็จ');
    },
    onError: (e: Error) => {
      toast.error(e.message);
    },
  });
}

/* =======================
   MUTATION: UPDATE
======================= */

export function useUpdatePlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Plot>) =>
      apiClient<Plot>(`/plots/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plots'] });
      toast.success('อัปเดตแปลงสำเร็จ');
    },
    onError: (e: Error) => {
      toast.error(e.message);
    },
  });
}

/* =======================
   MUTATION: DELETE
======================= */

export function useDeletePlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/plots/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plots'] });
      toast.success('ลบแปลงสำเร็จ');
    },
    onError: (e: Error) => {
      toast.error(e.message);
    },
  });
}

/* =======================
   GEOMETRY
======================= */

export function useCreatePlotGeometry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<PlotGeometry, 'id' | 'createdAt' | 'updatedAt'>) =>
      apiClient('/plot-geometry', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plots'] });
      toast.success('บันทึกพิกัดสำเร็จ');
    },
    onError: (e: Error) => {
      toast.error(e.message);
    },
  });
}

/* =======================
   EUDR STATUS
======================= */

export function useUpdatePlotStatusLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<PlotStatusLink, 'id' | 'createdAt' | 'updatedAt'>
    ) =>
      apiClient('/plot-status-links', {
        method: 'POST', // หรือ PUT / UPSERT
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plots'] });
      toast.success('อัปเดตสถานะ EUDR สำเร็จ');
    },
    onError: (e: Error) => {
      toast.error(e.message);
    },
  });
}
