import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { PrismaModule } from '@/prisma/prisma.module';
// import { LandDocumentController } from './land-document.controller';

@Module({
    imports: [PrismaModule],
    providers: [ProvinceService],
    // controllers: [LandDocumentController],
    exports: [ProvinceService],
})
export class ProvinceModule { }
