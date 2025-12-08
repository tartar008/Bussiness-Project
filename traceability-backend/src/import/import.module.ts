import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FarmerModule } from 'src/farmer/farmer.module';

@Module({
  imports: [
    FarmerModule,       
    LandDocumentModule,
    FarmPlotModule,
    PlotGeometryModule,
    ProvinceModule,
    DistrictModule,
  ],
  providers: [ImportService],
})
export class ImportModule {}

