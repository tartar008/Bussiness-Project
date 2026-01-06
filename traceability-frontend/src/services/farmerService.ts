import { apiClient } from "@/utils/apiClient";

export type Farmer = {
    farmerId: string;
    prefix: string;
    firstName: string;
    lastName: string;
    citizenId: string;
    phone?: string;
    address?: string;
    createdAt: string;
    updatedAt: string;
};

// services/farmerService.ts
export const getFarmers = async () => {
    try {
        const res = await fetch("http://localhost:8081/farmers");
        console.log("[Service] GET /farmers response status:", res.status);
        const data = await res.json();
        console.log("[Service] GET /farmers data:", data);
        return data;
    } catch (err) {
        console.error("[Service] GET /farmers error:", err);
        return [];
    }
};


export const createFarmer = (data: Partial<Farmer>) => apiClient<Farmer>("/farmers", "POST", data);

export const updateFarmer = (id: string, data: Partial<Farmer>) =>
    apiClient<Farmer>(`/farmers/${id}`, "PUT", data);

export const deleteFarmer = (id: string) => apiClient<void>(`/farmers/${id}`, "DELETE");
