import { useState, useEffect } from "react";
import { Farmer } from "@/types/farmer";
import { fetchFarmers, createFarmer, updateFarmer, deleteFarmer } from "@/services/farmerService";

export const useFarmers = () => {
  const [data, setData] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFarmers = async () => {
    setLoading(true);
    const farmers = await fetchFarmers();
    setData(farmers);
    setLoading(false);
  };

  useEffect(() => { loadFarmers(); }, []);

  const addFarmer = async (farmer: Omit<Farmer, "id">) => {
    const newFarmer = await createFarmer(farmer);
    setData(prev => [...prev, newFarmer]);
  };

  const editFarmer = async (id: string, farmer: Partial<Farmer>) => {
    const updated = await updateFarmer(id, farmer);
    setData(prev => prev.map(f => f.id === id ? updated : f));
  };

  const removeFarmer = async (id: string) => {
    await deleteFarmer(id);
    setData(prev => prev.filter(f => f.id !== id));
  };

  return { data, loading, addFarmer, editFarmer, removeFarmer };
};
