export class CreateFarmerDto {
    citizenId: string;
    prefix: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    isOwnedBefore2020?: boolean;
    farmerRegisterNumber?: string; // เพิ่ม
    farmbookNumber?: string;       // เพิ่มถ้ายังไม่มี
}