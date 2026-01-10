export class FarmbookTypeResponseDto {
    farmbookTypeId: string;
    nameTh?: string;
    description?: string;

    constructor(type: any) {
        this.farmbookTypeId = type.farmbookTypeId.toString();
        this.nameTh = type.nameTh;
        this.description = type.description;
    }
}
