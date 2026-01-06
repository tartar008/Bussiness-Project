import { useState, useEffect } from "react";
import { getFarmers, createFarmer, updateFarmer, deleteFarmer } from "@/services/farmerService";
import { Farmer } from "@/types/farmer";

export const useFarmers = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFarmers = async () => {
    setLoading(true);
    try {
      const data = await getFarmers();
      setFarmers(data.map((f: any) => ({
        id: f.farmerId,
        prefix: f.prefix,
        firstName: f.firstName,
        lastName: f.lastName,
        citizenId: f.citizenId,
        phone: f.phone,
        address: f.address,
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFarmers(); }, []);

  const addFarmer = async (form: any) => {
    const created = await createFarmer(form);
    setFarmers(prev => [...prev, { ...created, id: created.farmerId }]);
  };

  const editFarmer = async (id: string, form: any) => {
    const updated = await updateFarmer(id, form);
    setFarmers(prev => prev.map(f => f.id === id ? { ...f, ...updated } : f));
  };

  const removeFarmer = async (id: string) => {
    await deleteFarmer(id);
    setFarmers(prev => prev.filter(f => f.id !== id));
  };

  return { farmers, loading, addFarmer, editFarmer, removeFarmer };
};
