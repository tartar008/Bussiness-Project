// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '@/prisma/prisma.service';
// import { CreateFarmbookTypeDto } from './dto/create-farmbook-type.dto';

// @Injectable()
// export class FarmbookTypeService {
//     constructor(private prisma: PrismaService) { }

//     async findAll() {
//         return this.prisma.farmbookType.findMany({
//             include: { farmbooks: true },
//         });
//     }

//     async findById(farmbookTypeId: bigint) {
//         return this.prisma.farmbookType.findUnique({
//             where: { farmbookTypeId },
//             include: { farmbooks: true },
//         });
//     }

//     async create(data: CreateFarmbookTypeDto) {
//         return this.prisma.farmbookType.create({
//             data,
//         });
//     }
// }
