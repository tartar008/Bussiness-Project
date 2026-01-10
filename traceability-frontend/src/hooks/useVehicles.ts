import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle, Driver, VehicleDriver } from '@/types/database';
import { toast } from 'sonner';

// Vehicles
export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Vehicle[];
    },
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('vehicles')
        .insert(vehicle)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('เพิ่มรถสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...vehicle }: Partial<Vehicle> & { id: string }) => {
      const { data, error } = await supabase
        .from('vehicles')
        .update(vehicle)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('อัปเดตข้อมูลรถสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('ลบรถสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

// Drivers
export function useDrivers() {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Driver[];
    },
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (driver: Omit<Driver, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('drivers')
        .insert(driver)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('เพิ่มคนขับสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function useUpdateDriver() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...driver }: Partial<Driver> & { id: string }) => {
      const { data, error } = await supabase
        .from('drivers')
        .update(driver)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('อัปเดตข้อมูลคนขับสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function useDeleteDriver() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('ลบคนขับสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

// Vehicle-Driver Assignments
export function useVehicleDrivers() {
  return useQuery({
    queryKey: ['vehicle_drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_drivers')
        .select(`
          *,
          vehicles(*),
          drivers(*)
        `)
        .order('assignment_date', { ascending: false });
      
      if (error) throw error;
      return data as (VehicleDriver & { vehicles: Vehicle; drivers: Driver })[];
    },
  });
}

export function useCreateVehicleDriver() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assignment: Omit<VehicleDriver, 'id' | 'created_at' | 'vehicle' | 'driver'>) => {
      const { data, error } = await supabase
        .from('vehicle_drivers')
        .insert(assignment)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle_drivers'] });
      toast.success('มอบหมายคนขับสำเร็จ');
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}
