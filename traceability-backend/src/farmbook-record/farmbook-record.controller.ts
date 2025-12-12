import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { FarmbookRecordService } from './farmbook-record.service';

@Controller('farmbook-record')
export class FarmbookRecordController {
    constructor(private readonly service: FarmbookRecordService) { }

    @Get()
    async getAll() {
        return this.service.findAll();
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return this.service.findById(BigInt(id));
    }

    @Post()
    async create(@Body() body: { farmerId: bigint; farmbookTypeId: bigint; farmbookNumber?: string }) {
        return this.service.create(body);
    }
}
