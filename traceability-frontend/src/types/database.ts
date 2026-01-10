// src/types/database.ts

export type PlotStatus = 'active' | 'inactive' | 'archived';

export interface Plot {
    id: string;

    plot_code: string;
    plot_name: string | null;

    area_rai: number | null;
    area_hectare: number | null;
    tree_count: number | null;
    planting_year: number | null;

    rubber_variety: string | null;

    province: string | null;
    district: string | null;
    subdistrict: string | null;

    expected_yield_per_year: number | null;

    status: PlotStatus;

    created_at?: string;
    updated_at?: string;
}
