import { Farmer } from "@/types/farmer";

let mockFarmers: Farmer[] = [];

export const fetchFarmers = async (): Promise<Farmer[]> => {
    return new Promise(res => setTimeout(() => res(mockFarmers), 300));
};

export const createFarmer = async (data: Omit<Farmer, "id">): Promise<Farmer> => {
    const newFarmer: Farmer = { ...data, id: Date.now().toString() };
    mockFarmers.push(newFarmer);
    return newFarmer;
};

export const updateFarmer = async (id: string, data: Partial<Farmer>): Promise<Farmer> => {
    const index = mockFarmers.findIndex(f => f.id === id);
    if (index === -1) throw new Error("Farmer not found");
    mockFarmers[index] = { ...mockFarmers[index], ...data };
    return mockFarmers[index];
};

export const deleteFarmer = async (id: string): Promise<void> => {
    mockFarmers = mockFarmers.filter(f => f.id !== id);
};
