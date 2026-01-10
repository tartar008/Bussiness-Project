import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateFarmbookRecordDto } from './dto/create-farmbook-record.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FarmbookRecordService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.farmbookRecord.findMany({
            include: {
                farmer: true,
            },
        });
    }

    async findById(farmbookId: bigint) {
        return this.prisma.farmbookRecord.findUnique({
            where: { farmbookId },
            include: {
                farmer: true,
            },
        });
    }

    async create(dto: CreateFarmbookRecordDto) {
        const data: Prisma.FarmbookRecordUncheckedCreateInput = {
            farmerId: BigInt(dto.farmerId),
            farmbookNumber: dto.farmbookNumber,
            farmbookType: dto.farmbookType,
        };

        return this.prisma.farmbookRecord.create({
            data,
            include: {
                farmer: true,
            },
        });
    }
}
