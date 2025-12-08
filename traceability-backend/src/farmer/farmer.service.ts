import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFarmerDto } from './dto/create-farmer.dto';

@Injectable()
export class FarmerService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(dto: CreateFarmerDto) {
    let farmer = await this.prisma.farmer.findFirst({
      where: { citizenId: dto.citizenId }
    });

    if (!farmer) {
      farmer = await this.prisma.farmer.create({
        data: {
          farmerName: dto.firstName,
          farmerSurname: dto.lastName,
          citizenId: dto.citizenId,
          phone: dto.phone,
          address: dto.address,
        }
      });
    }

    return farmer;
  }
}

