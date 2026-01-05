// src/import/dto/ResultImportRow.dto.ts
import { CreateFarmerDto } from '@/farmer/dto/create-farmer.dto';
import { CreateFarmPlotDto } from '@/farm-plot/dto/create-farm-plot.dto';

export class ResultImportRowDTO {
    farmer: CreateFarmerDto;
    landDocId: bigint;
    plot: CreateFarmPlotDto;
    geometryCount: number;
}
