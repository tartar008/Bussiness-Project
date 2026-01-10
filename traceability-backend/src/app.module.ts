import { Module } from '@nestjs/common';
import { ImportModule } from './import/import.module';
import { PrismaModule } from './prisma/prisma.module';
import { DistrictModule } from './district/district.module';
import { FarmPlotModule } from './farm-plot/farm-plot.module';
import { FarmbookRecordModule } from './farmbook-record/farmbook-record.module';
import { FarmerModule } from './farmer/farmer.module';

@Module({
  imports: [
    FarmbookRecordModule,
    PrismaModule,
    ImportModule,
    DistrictModule,
    FarmPlotModule,
    ImportModule,
    FarmerModule,
  ],
})
export class AppModule { }
