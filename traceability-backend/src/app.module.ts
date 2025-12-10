import { Module } from '@nestjs/common';
import { ImportModule } from './import/import.module';
import { PrismaModule } from './prisma/prisma.module';
import { DistrictModule } from './district/district.module';
import { FarmPlotModule } from './farm-plot/farm-plot.module';

@Module({
  imports: [
    PrismaModule,
    ImportModule,
    DistrictModule,
    FarmPlotModule,

  ],
})
export class AppModule { }
