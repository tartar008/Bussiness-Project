// district/entities/district.entity.ts

import { District, Prisma } from '@prisma/client';


export class DistrictEntity implements District {
    districtId: bigint;

    provinceId: bigint;

    nameTh: string | null;

    // Constructor
    constructor(data: Prisma.DistrictCreateInput | any) {
        Object.assign(this, data);
        this.districtId = data.districtId;
    }
}