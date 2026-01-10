export class FarmbookRecordResponseDto {
    farmbookId: string; // stringify BigInt
    farmbookNumber?: string;

    farmbookType?: {
        farmbookTypeId: string;
        nameTh?: string;
    };

    farmer?: {
        farmerId: string;
        firstNameTh?: string;
        lastNameTh?: string;
    };

    createdAt?: Date;

    constructor(record: any) {
        this.farmbookId = record.farmbookId?.toString();
        this.farmbookNumber = record.farmbookNumber;
        this.createdAt = record.createdAt;

        if (record.farmbookType) {
            this.farmbookType = {
                farmbookTypeId: record.farmbookType.farmbookTypeId.toString(),
                nameTh: record.farmbookType.nameTh,
            };
        }

        if (record.farmer) {
            this.farmer = {
                farmerId: record.farmer.farmerId.toString(),
                firstNameTh: record.farmer.firstNameTh,
                lastNameTh: record.farmer.lastNameTh,
            };
        }
    }
}
