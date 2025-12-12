export class CreateFarmPlotDto {
    farmerId: bigint;
    landDocumentId: bigint | null;
    provinceId?: number | null;
    districtId?: number | null;
    subdistrictId?: number | null;
    areaRai?: number;
    areaNgan?: number;
    areaWah?: number;
    areaAcre?: number;
    areaHa?: number;
    geometryType?: string;
    isOwnedBefore2020?: boolean;
}
