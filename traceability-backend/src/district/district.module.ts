import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { PrismaModule } from '@/prisma/prisma.module';
// import { LandDocumentController } from './land-document.controller';

@Module({
    imports: [PrismaModule],
    providers: [DistrictService],
    // controllers: [LandDocumentController],
    exports: [DistrictService],
})
export class DistrictModule { }
