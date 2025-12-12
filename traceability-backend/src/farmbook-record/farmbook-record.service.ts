import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class FarmbookRecordService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.farmbookRecord.findMany({
            include: {
                farmer: true,
                farmbookType: true,
            },
        });
    }

    async findById(farmbookId: bigint) {
        return this.prisma.farmbookRecord.findUnique({
            where: { farmbookId },
            include: { farmer: true, farmbookType: true },
        });
    }

    async create(data: {
        farmerId: bigint;
        farmbookTypeId: bigint;
        farmbookNumber?: string;
    }) {
        return this.prisma.farmbookRecord.create({
            data,
            include: { farmer: true, farmbookType: true },
        });
    }
}
