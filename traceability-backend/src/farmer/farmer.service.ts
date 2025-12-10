import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateFarmerDto } from './dto/create-farmer.dto';

@Injectable()
export class FarmerService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateFarmerDto) {
    const newFarmer = await this.prisma.farmer.create({
      data: {
        farmerName: dto.firstName,
        farmerSurname: dto.lastName,
        citizenId: dto.citizenId,
        phone: dto.phone,
        address: dto.address,
      }
    });

    return newFarmer;
  }

  // async findOrCreate(dto: CreateFarmerDto) {
  //   console.log('Searching for farmer DTO:', dto);
  //   // let farmer = await this.prisma.farmer.findFirst({
  //   //   where: { citizenId: dto.citizenId }
  //   // });
  //   console.log('Farmer found:', farmer);


  //   if (!farmer) {
  //     farmer = await this.prisma.farmer.create({
  //       data: {
  //         farmerName: dto.firstName,
  //         farmerSurname: dto.lastName,
  //         citizenId: dto.citizenId,
  //         phone: dto.phone,
  //         address: dto.address,
  //       }
  //     });
  //   }

  //   return farmer;
  // }
}

