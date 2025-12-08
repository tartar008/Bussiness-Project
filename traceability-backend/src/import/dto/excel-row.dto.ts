import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class ExcelRowDto {
    @IsOptional()
    @IsString()
    prefix?: string; // คำนำหน้า

    @IsOptional()
    @IsString()
    firstName?: string; // ชื่อ

    @IsOptional()
    @IsString()
    lastName?: string; // นามสกุล

    @IsOptional()
    @IsString()
    address?: string; // ที่อยู่

    @IsOptional()
    @IsString()
    phone?: string; // เบอร์โทร

    @IsOptional()
    @IsString()
    farmerRegisterNumber?: string; // ทะเบียนเกษตร

    @IsOptional()
    @IsString()
    farmbookNumber?: string; // หมายเลขทะเบียน (เช่น เลขที่ในสมุดทะเบียน)

    @IsOptional()
    @IsString()
    citizenId?: string; // รหัสบัตรประชาชน

    @IsOptional()
    @IsNumber()
    plotCount?: number; // จำนวนแปลงที่ถือครอง

    @IsOptional()
    @IsNumber()
    plotNo?: number; // แปลงที่

    @IsOptional()
    @IsNumber()
    areaRai?: number; // ไร่

    @IsOptional()
    @IsNumber()
    areaNgan?: number; // งาน

    @IsOptional()
    @IsNumber()
    areaWah?: number; // ตารางวา

    @IsOptional()
    @IsNumber()
    areaAcre?: number; // จำนวนไร่ (acre)

    @IsOptional()
    @IsNumber()
    areaHa?: number; // พื้นที่ ha

    @IsOptional()
    @IsString()
    documentType?: string; // ประเภทเอกสารสิทธิ

    @IsOptional()
    @IsString()
    documentNumber?: string; // เลขที่เอกสาร

    @IsOptional()
    @IsString()
    subdistrict?: string; // ตำบล

    @IsOptional()
    @IsString()
    district?: string; // อำเภอ

    @IsOptional()
    @IsString()
    province?: string; // จังหวัด

    @IsOptional()
    @IsString()
    geometryType?: string; // ประเภทพิกัด

    @IsOptional()
    @IsString()
    coordinate?: string; // ค่าพิกัดแปลง

    @IsOptional()
    @IsString()
    coordinateAdj?: string; // ค่าพิกัดแปลง Adj

    @IsOptional()
    @IsBoolean()
    isOwnedBefore2020?: boolean; // มีสวนก่อนปี พ.ศ. 2563
}
