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
      farmerId: farmer.farmerId.toString(),
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

  /** ดึง Farmer ทั้งหมด หรือ filter ด้วย query params */
  async findAll(filters?: {
    citizenId?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<FarmerResponseDTO[]> {
    const where: any = {};

    if (filters?.citizenId) where.citizenId = filters.citizenId;
    if (filters?.firstName) where.farmerName = filters.firstName;
    if (filters?.lastName) where.farmerSurname = filters.lastName;

    const farmers = await this.prisma.farmer.findMany({ where });
    return farmers.map(this.formatFarmer);
  }

  /** ดึง Farmer ตาม ID */
  async findOne(farmerId: string): Promise<FarmerResponseDTO | null> {
    const farmer = await this.prisma.farmer.findUnique({
      where: { farmerId: BigInt(farmerId) },
    });
    return farmer ? this.formatFarmer(farmer) : null;
  }

  /** Helper แปลง BigInt → string และ map field */
  private formatFarmer(farmer: any): FarmerResponseDTO {
    return {
      farmerId: farmer.farmerId.toString(),
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