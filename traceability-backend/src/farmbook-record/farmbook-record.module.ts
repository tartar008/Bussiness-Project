import { Module } from '@nestjs/common';
import { FarmbookRecordService } from './farmbook-record.service';
import { FarmbookRecordController } from './farmbook-record.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
    controllers: [FarmbookRecordController],
    providers: [FarmbookRecordService, PrismaService],
})
export class FarmbookRecordModule { }
