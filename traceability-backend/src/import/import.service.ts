import { Injectable, BadRequestException } from '@nestjs/common';
import { chunk } from 'lodash';
import { FarmerService } from '@/farmer/farmer.service';
import { LandDocumentService } from '@/land-document/land-document.service';
import { FarmPlotService } from '@/farm-plot/farm-plot.service';
import { PlotGeometryService } from '@/plot-geometry/plot-geometry.service';
import { ImportMasterDTO } from './dto/Input-import-master';
import { ResultImportRow } from './dto/Result-ImportRow';
import { ResultImportSummary } from './dto/Result-ImportSummary';


import { Coord, Coordinates } from '@/common/interfaces/coordinate.interface'; // ปรับ Path ให้ถูกต้อง


@Injectable()
export class ImportService {
    constructor(
        private farmerService: FarmerService,
        private landDocService: LandDocumentService,
        private plotService: FarmPlotService,
        private geometryService: PlotGeometryService,
    ) { }

    /** ==========================================
     *  Import แบบ Batch (default: 20 rows / batch)
     *  ========================================== */
    async importRowsInBatch(rows: ImportMasterDTO[], batchSize = 20): Promise<ResultImportSummary> {
        if (!rows || rows.length === 0) {
            throw new BadRequestException('rows is empty');
        }

        console.log(`Starting import of ${rows.length} rows in batches of ${batchSize}...`);

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

    /** ==========================================
     *  ประมวลผล rows ใน 1 batch
     *  ========================================== */
    private async processBatch(batchRows: ImportMasterDTO[]): Promise<ResultImportRow[]> {
        const promises = batchRows.map(row => this.processSingleRow(row));
        console.log(`Processing batch of ${batchRows.length} rows...`);
        const settled = await Promise.allSettled(promises);

        return settled.map((r, index) => ({
            rowIndex: index,
            status: r.status,
            data: r.status === 'fulfilled' ? r.value : undefined,
            error: r.status === 'rejected' ? r.reason : undefined,
        }));
    }

    /** ==========================================
     *  ประมวลผล row เดียว
     *  ========================================== */
    private async processSingleRow(row: ImportMasterDTO) {
        console.log(`Processing row for citizen ID: ${row.citizenId}`);
        const farmer = await this.farmerService.create({
            citizenId: row.citizenId || '',
            firstName: row.firstName || '',
            lastName: row.lastName || '',
            phone: row.phone || '',
            address: row.address || '',
        });
        console.log(`Processed farmer ID: ${farmer}`);

        const landDoc = await this.landDocService.create({
            documentType: row.documentType || '',
            documentNumber: row.documentNumber || ''
        });

        const plot = await this.plotService.create({
            farmerId: farmer.farmerId,
            landDocumentId: landDoc.landDocumentId,
            areaRai: row.areaRai || 0,
            areaNgan: row.areaNgan || 0,
            areaWah: row.areaWah || 0,
            provinceId: row.provinceId ?? null,
            districtId: row.districtId ?? null,
        });

        if (row.coords?.length) {
            await Promise.all(
                row.coords.map((c: Coord) =>
                    this.geometryService.create({
                        plotId: plot.plotId,
                        coordinates: JSON.stringify({
                            lat: c.lat,
                            lng: c.lng,
                        }),
                    }),
                ),
            );
        }

        return {
            farmer,
            landDoc,
            plot,
            geometryCount: row.coords?.length ?? 0,
        };
    }
}
