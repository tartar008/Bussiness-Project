import { FarmbookRecord } from '@prisma/client';
import { Buyer } from '@prisma/client';

export class FarmerResponseDTO {
    farmerId: bigint;
    prefix: string;
    firstName: string;
    lastName: string;
    citizenId: string;
    phone: string;
    address: string;
    buyerId?: bigint;
    createdAt: Date;
    updatedAt: Date;
    buyer?: Buyer;               // optional include relation
    farmbooks?: FarmbookRecord[]; // optional include relation
}
