import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class ProvinceService {
  constructor(private prisma: PrismaService) {}

  findByName(name: string) {
    return this.prisma.province.findFirst({
      where: { nameTh: name }
    });
  }
}