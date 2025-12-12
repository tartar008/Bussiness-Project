// src/farmer/dto/farmer-response.dto.ts
export class FarmerResponseDTO {
    farmerId: bigint;           // id ของ farmer
    citizenId: string;          // รหัสบัตรประชาชน
    prefix?: string;            // คำนำหน้า
    firstName: string;          // ชื่อ
    lastName: string;           // นามสกุล
    phone?: string;             // เบอร์โทร
    address?: string;           // ที่อยู่
    createdAt: Date;            // วันสร้าง
    updatedAt: Date;            // วันแก้ไขล่าสุด
}
