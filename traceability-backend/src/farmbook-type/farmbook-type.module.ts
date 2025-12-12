import { Module } from '@nestjs/common';
import { FarmbookTypeService } from './farmbook-type.service';
import { FarmbookTypeController } from './farmbook-type.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
    controllers: [FarmbookTypeController],
    providers: [FarmbookTypeService, PrismaService],
})
export class FarmbookTypeModule { }
