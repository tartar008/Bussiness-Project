import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { FarmerResponseDTO } from './dto/farmer-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FarmerService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateFarmerDto): Promise<FarmerResponseDTO> {
    console.log('📦 create FarmerDTO:', dto);

    const data: Prisma.FarmerCreateInput = {
      prefix: dto.prefix,
      farmerName: dto.firstName,  
      farmerSurname: dto.lastName,
      citizenId: dto.citizenId,
      phone: dto.phone,
      address: dto.address,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const farmer = await this.prisma.farmer.create({ data });

    return {
      farmerId: farmer.farmerId,
      prefix: farmer.prefix,
      firstName: farmer.farmerName,
      lastName: farmer.farmerSurname,
      citizenId: farmer.citizenId,
      phone: farmer.phone,
      address: farmer.address,
      createdAt: farmer.createdAt,
      updatedAt: farmer.updatedAt,
    };
  }
}
