import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class DistrictService {
  constructor(private prisma: PrismaService) {}

  findByName(name: string) {
    return this.prisma.district.findFirst({
      where: { nameTh: name }
    });
  }
}