// src/import/dto/ResultImportRow.dto.ts
import { Farmer } from '@/farmer/dto/create-farmer.dto';
import { FarmPlot } from '@/farm-plot/entities/farm-plot.entity';

export class ResultImportRowDTO {
    farmer: Farmer;
    landDocId: bigint;
    plot: FarmPlot;
    geometryCount: number;
}
