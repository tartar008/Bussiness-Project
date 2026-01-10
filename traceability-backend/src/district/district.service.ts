// src/district/district.service.ts

import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { DistrictEntity } from "./entities/district.entity";


@Injectable()
export class DistrictService {
  constructor(private prisma: PrismaService) { }

  /**
   * สร้างอำเภอใหม่
   * @param name ชื่ออำเภอ (nameTh)
   * @returns DistrictEntity
   */
  async create(name: string, provinceId: number): Promise<DistrictEntity> {
    const raw = await this.prisma.district.create({
      data: {
        nameTh: name,
        provinceId: provinceId
      }
    });

    const entity = new DistrictEntity({
      districtId: raw.districtId,
      provinceId: raw.provinceId,
      nameTh: raw.nameTh
    });

    return entity;
  }


  findByName(name: string) {
    return this.prisma.district.findFirst({
      where: { nameTh: name }
    });
  }
}