import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateFarmPlotDto } from "./dto/create-farm-plot.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class FarmPlotService {
  constructor(private prisma: PrismaService) { }

  private generateLandCode(): string {
    return `LC${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }

  private calcAreaAcre(rai: number, ngan: number, wah: number): number {
    const totalRai = rai + ngan / 4 + wah / 400;
    return Math.round(totalRai * 0.395 * 100) / 100;
  }

  async create(dto: CreateFarmPlotDto) {
    const data: Prisma.FarmPlotUncheckedCreateInput = {
      farmerId: dto.farmerId,
      landCode: this.generateLandCode(),
      provinceId: BigInt(dto.provinceId),
      districtId: BigInt(dto.districtId),
      landDocumentId: dto.landDocumentId ? BigInt(dto.landDocumentId) : null,
      areaRai: dto.areaRai,
      areaNgan: dto.areaNgan,
      areaWah: dto.areaWah,
      areaAcre: dto.areaAcre ?? this.calcAreaAcre(dto.areaRai, dto.areaNgan, dto.areaWah),
      geometryType: dto.geometryType,
      isOwnedBefore2020: dto.isOwnedBefore2020,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return this.prisma.farmPlot.create({ data });
  }
}
