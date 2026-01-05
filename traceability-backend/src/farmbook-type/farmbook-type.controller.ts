// import { Controller, Get, Post, Param, Body } from '@nestjs/common';
// import { FarmbookTypeService } from './farmbook-type.service';
// import { CreateFarmbookTypeDto } from './dto/create-farmbook-type.dto';
// import { FarmbookTypeResponseDto } from './dto/farmbook-type-response.dto';

// @Controller('farmbook-type')
// export class FarmbookTypeController {
//     constructor(private readonly service: FarmbookTypeService) { }

//     @Get()
//     async getAll() {
//         const result = await this.service.findAll();
//         return result.map((type) => new FarmbookTypeResponseDto(type));
//     }

//     @Get(':id')
//     async getById(@Param('id') id: string) {
//         const result = await this.service.findById(BigInt(id));
//         return new FarmbookTypeResponseDto(result);
//     }

//     @Post()
//     async create(@Body() dto: CreateFarmbookTypeDto) {
//         const created = await this.service.create(dto);
//         return new FarmbookTypeResponseDto(created);
//     }
// }
