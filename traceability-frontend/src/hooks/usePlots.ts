import { useState, useEffect } from "react";
import { getFarmers, Farmer } from "@/services/farmerService";

export const useFarmers = (filters?: { citizenId?: string; firstName?: string; lastName?: string }) => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFarmers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFarmers(filters);
      setFarmers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, [filters?.citizenId, filters?.firstName, filters?.lastName]);

  return { farmers, loading, error, refetch: fetchFarmers };
};
