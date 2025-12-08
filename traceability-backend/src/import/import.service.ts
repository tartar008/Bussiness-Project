import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as XLSX from 'xlsx';
import { FarmerService } from 'src/farmer/farmer.service';
import { LandDocumentService } from 'src/land-document/land-document.service';
import { FarmPlotService } from 'src/farm-plot/farm-plot.service';
import { PlotGeometryService } from 'src/plot-geometry/plot-geometry.service';
import { ProvinceService } from 'src/province/province.service';
import { DistrictService } from 'src/district/district.service';
import { ExcelRowDto } from './dto/excel-row.dto';
import { ExcelRowMapping } from './dto/excel-row-mapping';

@Injectable()
export class ImportService {
    constructor(
        private farmerService: FarmerService,
        private landDocService: LandDocumentService,
        private plotService: FarmPlotService,
        private geometryService: PlotGeometryService,
        private provinceService: ProvinceService,
        private districtService: DistrictService,
    ) { }

    async importRow(row: ExcelRowDto) {

        // 1) Farmer
        const farmerDto = ExcelRowMapping.toFarmerDto(row);
        const farmer = await this.farmerService.findOrCreate(farmerDto);

        // 2) Province/District
        const province = await this.provinceService.findByName(row.province ?? '');
        const district = await this.districtService.findByName(row.district ?? '');

        // 3) Land Document
        const landDto = ExcelRowMapping.toLandDocDto(row);
        const landDoc = await this.landDocService.findOrCreate(landDto);

        // 4) Farm Plot
        const plotDto = ExcelRowMapping.toFarmPlotDto(
            row,
            farmer.farmerId,
            landDoc.landDocumentId,
            province?.provinceId,
            district?.districtId
        );
        const plot = await this.plotService.create(plotDto);

        // 5) Geometry
        if (row.coordinate) {
            const geoDto = ExcelRowMapping.toGeometryDto(plot.plotId, row);
            await this.geometryService.create(geoDto);
        }

        return plot;
    }



}
