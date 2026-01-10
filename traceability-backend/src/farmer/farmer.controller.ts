import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { FarmerService } from './farmer.service';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { FarmerResponseDTO } from './dto/farmer-response.dto';

@Controller('farmers')
export class FarmerController {
    constructor(private readonly farmerService: FarmerService) { }

    /** สร้าง Farmer */
    @Post()
    async create(@Body() dto: CreateFarmerDto): Promise<FarmerResponseDTO> {
        return this.farmerService.create(dto);
    }

    /** ดึง Farmer ทั้งหมด หรือ filter ด้วย query params */
    @Get()
    async findAll(
        @Query('citizenId') citizenId?: string,
        @Query('firstName') firstName?: string,
        @Query('lastName') lastName?: string,
    ): Promise<FarmerResponseDTO[]> {
        console.log('📦 Query Params:', { citizenId, firstName, lastName });
        return this.farmerService.findAll({ citizenId, firstName, lastName });
    }

    /** ดึง Farmer ตาม ID */
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<FarmerResponseDTO | null> {
        return this.farmerService.findOne(id);
    }
}
