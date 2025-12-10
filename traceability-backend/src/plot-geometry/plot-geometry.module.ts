import { Module } from '@nestjs/common';
import { PlotGeometryService } from './plot-geometry.service';
import { PrismaModule } from '@/prisma/prisma.module';
// import { LandDocumentController } from './land-document.controller';

@Module({
    imports: [PrismaModule],
    providers: [PlotGeometryService],
    // controllers: [LandDocumentController],
    exports: [PlotGeometryService],
})
export class PlotGeometryModule { }
