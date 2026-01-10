import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FarmerModule } from '@/farmer/farmer.module';
import { LandDocumentModule } from '@/land-document/land-document.module';
import { FarmPlotModule } from '@/farm-plot/farm-plot.module';
import { PlotGeometryModule } from '@/plot-geometry/plot-geometry.module';
// import { ProvinceModule } from '@/province/province.module';
// import { DistrictModule } from '@/district/district.module';
import { FarmbookRecordModule } from '@/farmbook-record/farmbook-record.module';
// import { FarmbookTypeModule } from '@/farmbook-type/farmbook-type.module';

@Module({
  imports: [
    FarmerModule,
    LandDocumentModule,
    FarmPlotModule,
    PlotGeometryModule,
    PrismaModule,
    FarmbookRecordModule,

  ],
  providers: [ImportService],
  controllers: [ImportController],
  exports: [ImportService],
})
export class ImportModule { }
