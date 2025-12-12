import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { FarmerResponseDTO } from './dto/farmer-response.dto';

@Injectable()
export class FarmerService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateFarmerDto): Promise<FarmerResponseDTO> {
    const farmer = await this.prisma.farmer.create({
      data: {
        citizenId: dto.citizenId,
        prefix: dto.prefix,
        farmerName: dto.firstName,
        farmerSurname: dto.lastName,
        phone: dto.phone,
        address: dto.address,
        // farmerRegisterNumber: dto.farmerRegisterNumber,
        // farmbookNumber: dto.farmbookNumber,
        // isOwnedBefore2020: dto.isOwnedBefore2020,
      },
    });

    // map result เป็น DTO
    return {
      farmerId: farmer.farmerId,
      citizenId: farmer.citizenId!,
      prefix: farmer.prefix ?? undefined,
      firstName: farmer.farmerName ?? '',
      lastName: farmer.farmerSurname ?? '',
      phone: farmer.phone ?? undefined,
      address: farmer.address ?? undefined,
      // farmerRegisterNumber: farmer.farmerRegisterNumber ?? undefined,
      // farmbookNumber: farmer.farmbookNumber ?? undefined,
      // isOwnedBefore2020: farmer.isOwnedBefore2020 ?? false,
      createdAt: farmer.createdAt!,
      updatedAt: farmer.updatedAt!,
    };
  }
}
