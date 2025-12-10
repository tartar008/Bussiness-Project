// province/entities/province.entity.ts

import { Prisma } from '@prisma/client';


export class ProvinceEntity {
    provinceId: bigint;

    nameTh: string | null;

    constructor(data: Prisma.ProvinceCreateInput | any) {
        Object.assign(this, data);
    }
}