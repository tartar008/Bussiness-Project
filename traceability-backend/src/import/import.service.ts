import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as XLSX from 'xlsx';

@Injectable()
export class ImportService {
    constructor(private prisma: PrismaService) { }

    async importMaster(file: any) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        return rows;
    }
}
