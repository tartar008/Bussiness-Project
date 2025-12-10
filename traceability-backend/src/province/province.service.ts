import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { ProvinceEntity } from "./entities/province.entity";


@Injectable()
export class ProvinceService {
  constructor(private prisma: PrismaService) { }

  async create(name: string): Promise<ProvinceEntity> {
    const province = await this.prisma.province.create({
      data: {
        nameTh: name,
      }
    });

    return province as ProvinceEntity;
  }

  async findOrCreateByName(name: string): Promise<ProvinceEntity> {
    throw new Error('Method not implemented.');
  }

  findByName(name: string) {
    return this.prisma.province.findFirst({
      where: { nameTh: name }
    });
  }
}