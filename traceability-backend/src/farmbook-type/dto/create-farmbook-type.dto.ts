import { IsOptional, IsString } from 'class-validator';

export class CreateFarmbookTypeDto {
    @IsOptional()
    @IsString()
    nameTh?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
