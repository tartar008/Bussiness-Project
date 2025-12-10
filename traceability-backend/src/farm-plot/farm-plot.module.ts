import { Module } from '@nestjs/common';
import { FarmPlotService } from './farm-plot.service';
import { PrismaModule } from '@/prisma/prisma.module';
// import { LandDocumentController } from './land-document.controller';

@Module({
    imports: [PrismaModule],
    providers: [FarmPlotService],
    // controllers: [LandDocumentController],
    exports: [FarmPlotService],
})
export class FarmPlotModule { }
