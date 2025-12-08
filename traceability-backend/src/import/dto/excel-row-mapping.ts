import { ExcelRowDto } from "./excel-row.dto";
import { CreateFarmerDto } from "src/farmer/dto/create-farmer.dto";
import { CreateLandDocumentDto } from "src/land-document/dto/create-land-document.dto";
import { CreateFarmPlotDto } from "src/farm-plot/dto/create-farm-plot.dto";
import { CreateGeometryDto } from "src/plot-geometry/dto/create-geometry.dto";

export class ExcelRowMapping {

    static toFarmerDto(row: ExcelRowDto): CreateFarmerDto {
        return {
            prefix: row.prefix ?? '',
            firstName: row.firstName ?? '',
            lastName: row.lastName ?? '',
            citizenId: row.citizenId ?? '',
            phone: row.phone ?? '',
            address: row.address ?? '',
        };
    }

    static toLandDocDto(row: ExcelRowDto): CreateLandDocumentDto {
        return {
            documentType: row.documentType ?? '',
            documentNumber: row.documentNumber ?? '',
        };
    }

    static toFarmPlotDto(
        row: ExcelRowDto,
        farmerId: bigint,
        landDocumentId: bigint,
        provinceId?: bigint,
        districtId?: bigint,
    ): CreateFarmPlotDto {
        return {
            farmerId,
            landDocumentId,   // ต้องไม่ undefined
            provinceId,
            districtId,
            areaRai: row.areaRai ?? 0,
            areaNgan: row.areaNgan ?? 0,
            areaWah: row.areaWah ?? 0,
            geometryType: row.geometryType ?? '',
            isOwnedBefore2020: row.isOwnedBefore2020 ?? false,
        };
    }

    static toGeometryDto(plotId: bigint, row: ExcelRowDto): CreateGeometryDto {
        return {
            plotId,
            coordinates: row.coordinate ?? '',
        };
    }
}
