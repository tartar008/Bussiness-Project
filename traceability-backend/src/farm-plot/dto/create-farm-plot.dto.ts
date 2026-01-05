export class CreateFarmPlotDto {
    farmerId: bigint;
    landDocumentId: bigint | null;

    provinceId: number;
    districtId: number;

    areaRai: number;
    areaNgan: number;
    areaWah: number;

    areaAcre?: number;

    geometryType: string;
    isOwnedBefore2020: boolean;
    landCode?: string;
}
