import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateGeometryDto } from "./dto/create-geometry.dto";


@Injectable()
export class PlotGeometryService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateGeometryDto) {
        return this.prisma.plot_geometry.create({
            data: {
                plot_id: dto.plotId,
                coordinates: dto.coordinates,
                created_at: new Date(),  // required
            },
        });
    }


}

