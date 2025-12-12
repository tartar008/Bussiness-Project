import { Injectable, BadRequestException } from '@nestjs/common';
import { chunk } from 'lodash';
import { FarmerService } from '@/farmer/farmer.service';
import { LandDocumentService } from '@/land-document/land-document.service';
import { FarmPlotService } from '@/farm-plot/farm-plot.service';
import { PlotGeometryService } from '@/plot-geometry/plot-geometry.service';
import { ImportMasterDTO } from './dto/Input-import-master';
import { ResultImportRow } from './dto/Result-ImportRow';
import { ResultImportSummary } from './dto/Result-ImportSummary';
import { Coord } from '@/common/interfaces/coordinate.interface';

import { CreateFarmPlotDto } from '@/farm-plot/dto/create-farm-plot.dto';
import { CreateLandDocumentDto } from '@/land-document/dto/create-land-document.dto';
import { CreateGeometryDto } from '@/plot-geometry/dto/create-geometry.dto';

@Injectable()
export class ImportService {
    constructor(
        private farmerService: FarmerService,
        private landDocService: LandDocumentService,
        private plotService: FarmPlotService,
        private geometryService: PlotGeometryService,
    ) { }

    /** Import แบบ Batch */
    async importRowsInBatch(rows: ImportMasterDTO[], batchSize = 20): Promise<ResultImportSummary> {
        if (!rows || rows.length === 0) {
            throw new BadRequestException('rows is empty');
        }

        const batches = chunk(rows, batchSize);
        const allResults: ResultImportRow[] = [];

        for (const b of batches) {
            const batchResults = await this.processBatch(b);
            allResults.push(...batchResults);
        }

        return {
            message: 'Import completed with batch processing',
            total: rows.length,
            batches: batches.length,
            results: allResults,
        };
    }

    private async processBatch(batchRows: ImportMasterDTO[]): Promise<ResultImportRow[]> {
        const promises = batchRows.map(row => this.processSingleRow(row));
        const settled = await Promise.allSettled(promises);

        return settled.map((r, index) => ({
            rowIndex: index,
            status: r.status,
            data: r.status === 'fulfilled' ? r.value : undefined,
            error: r.status === 'rejected' ? r.reason : undefined,
        }));
    }

    private async processSingleRow(row: ImportMasterDTO) {
        // 1️⃣ สร้าง Farmer
        const farmer = await this.farmerService.create({
            citizenId: row.citizenId || '',
            prefix: row.prefix || undefined,
            firstName: row.firstName || '',
            lastName: row.lastName || '',
            phone: row.phone || undefined,
            address: row.address || undefined,
            farmerRegisterNumber: row.farmerRegisterNumber ?? undefined,
            farmbookNumber: row.farmbookNumber ?? undefined,
            isOwnedBefore2020: row.isOwnedBefore2020 ?? false,
        });

        // 2️⃣ สร้าง LandDocument
        const landDocDTO: CreateLandDocumentDto = {
            documentType: row.documentType ?? undefined,
            documentNumber: row.documentNumber ?? undefined,
        };
        const landDoc = await this.landDocService.create(landDocDTO);

        // 3️⃣ สร้าง FarmPlot
        const plotDTO: CreateFarmPlotDto = {
            farmerId: farmer.farmerId,
            landDocumentId: landDoc.landDocumentId,
            // plotCount: row.plotCount ?? 1,
            // plotNo: row.plotNo ?? 1,
            areaRai: row.areaRai ?? 0,
            areaNgan: row.areaNgan ?? 0,
            areaWah: row.areaWah ?? 0,
            areaAcre: row.areaAcre ?? 0,
            areaHa: row.areaHa ?? 0,
            provinceId: row.provinceId,
            districtId: row.districtId,
            geometryType: row.geometryType,
            subdistrictId: row.subdistrict
        };
        const plot = await this.plotService.create(plotDTO);

        // 4️⃣ สร้าง PlotGeometry (ถ้ามี coords)
        if (row.coords?.length) {
            const geometryPromises = row.coords.map((c: Coord) => {
                const plotGeometryDTO: CreateGeometryDto = {
                    plotId: plot.plotId,
                    coordinates: JSON.stringify({ lat: c.lat, lng: c.lng }),
                };
                return this.geometryService.create(plotGeometryDTO);
            });
            await Promise.all(geometryPromises);
        }

        return {
            farmer,
            landDocId: landDoc.landDocumentId,
            plot,
            geometryCount: row.coords?.length ?? 0,
        };
    }
}
