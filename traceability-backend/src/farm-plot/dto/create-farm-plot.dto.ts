export class CreateFarmPlotDto {
    farmerId: bigint;
    landDocumentId: bigint;
    provinceId?: number | null;
    districtId?: number | null;
    areaRai?: number;
    areaNgan?: number;
    areaWah?: number;
    geometryType?: string;
    isOwnedBefore2020?: boolean;
}
