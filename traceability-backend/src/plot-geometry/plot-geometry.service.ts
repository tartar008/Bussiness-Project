import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateGeometryDto } from "./dto/create-geometry.dto";


@Injectable()
export class PlotGeometryService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateGeometryDto) {
        return this.prisma.plotGeometry.create({
            data: dto,
        });
    }
}

