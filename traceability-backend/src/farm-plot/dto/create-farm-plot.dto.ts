export class CreateFarmPlotDto {
    farmerId: bigint;
    landDocumentId: bigint;
    provinceId?: bigint;
    districtId?: bigint;
    areaRai?: number;
    areaNgan?: number;
    areaWah?: number;
    geometryType?: string;
    isOwnedBefore2020?: boolean;
}
