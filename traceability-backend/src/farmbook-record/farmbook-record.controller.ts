import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { FarmbookRecordService } from './farmbook-record.service';
import { CreateFarmbookRecordDto } from './dto/create-farmbook-record.dto';

@Controller('farmbook-record')
export class FarmbookRecordController {
    constructor(private readonly service: FarmbookRecordService) { }

    @Get()
    async getAll() {
        return this.service.findAll();
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        // แปลงเป็น BigInt ก่อนส่งให้ service
        return this.service.findById(BigInt(id));
    }

    @Post()
    async create(@Body() body: CreateFarmbookRecordDto) {
        return this.service.create(body);
    }
}
