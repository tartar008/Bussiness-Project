// src/import/import.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { ImportService } from './import.service';
import { ImportMasterDTO } from './dto/Input-import-master';
import { ApiBody, ApiTags } from '@nestjs/swagger';
// import { MasterImportExamples } from './examples/import-master.examples';
import { ResultImportSummary } from './dto/Result-ImportSummary';

interface ImportRowResult { /* ... */ }

@ApiTags('Import')
@Controller('import')
export class ImportController {
    constructor(private importService: ImportService) { }

    @Post('master')
    @ApiBody({
        type: [ImportMasterDTO],
        description: 'รายการข้อมูล Master (Array ของ ImportMasterDTO)',
        // examples: MasterImportExamples,
    })
    async importMaster(@Body() importData: ImportMasterDTO[]): Promise<ResultImportSummary> {
        
        return this.importService.importRowsInBatch(importData);
    }
}