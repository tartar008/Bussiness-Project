import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';

@Controller('import')
export class ImportController {
    constructor(private importService: ImportService) { }

    @Post('master')
    @UseInterceptors(FileInterceptor('file'))
    async importMaster(@UploadedFile() file: any) {
        return this.importService.importMaster(file);
    }
}
