import { Module } from '@nestjs/common';
import { LandDocumentService } from './land-document.service';
// import { LandDocumentController } from './land-document.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [LandDocumentService],
    // controllers: [LandDocumentController],
    exports: [LandDocumentService],
})
export class LandDocumentModule { }
