import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateFarmPlotDto } from "./dto/create-farm-plot.dto";


@Injectable()
export class FarmPlotService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFarmPlotDto) {
    return this.prisma.farmPlot.create({
      data: {
        farmerId: dto.farmerId,
        landDocumentId: dto.landDocumentId,
        provinceId: dto.provinceId,
        districtId: dto.districtId,
        areaRai: dto.areaRai,
        areaNgan: dto.areaNgan,
        areaWah: dto.areaWah,
        geometryType: dto.geometryType,
        isOwnedBefore2020: dto.isOwnedBefore2020,
      }
    });
  }
}
