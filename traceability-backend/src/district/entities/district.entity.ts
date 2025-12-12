// district/entities/district.entity.ts
export class DistrictEntity {
    districtId: bigint;
    provinceId: bigint | null;
    nameTh: string | null;

    constructor(data: { districtId: bigint; provinceId: bigint | null; nameTh?: string | null }) {
        Object.assign(this, data);
    }
}
