import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFarmbookRecordDto {
    @IsNumber()
    @Type(() => Number)
    farmerId: number;

    @IsNumber()
    @Type(() => Number)
    farmbookTypeId: number;

    @IsOptional()
    @IsString()
    farmbookNumber?: string;
}
