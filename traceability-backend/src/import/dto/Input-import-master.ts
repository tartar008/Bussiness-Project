import { Coord } from '@/common/interfaces/coordinate.interface';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class ImportMasterDTO {
    @IsOptional()
    @IsString()
    prefix?: string; // คำนำหน้า   //farmer info

    @IsOptional()
    @IsString()
    firstName?: string; // ชื่อ   // farmer info

    @IsOptional()
    @IsString()
    lastName?: string; // นามสกุล    // farmer info

    @IsOptional()
    @IsString()
    address?: string; // ที่อยู่    // farmer info

    @IsOptional()
    @IsString()
    phone?: string; // เบอร์โทร  // farmer info

    @IsOptional()
    @IsString()
    citizenId?: string; // รหัสบัตรประชาชน // farmer info

    @IsOptional()
    @IsString()
    farmerRegisterNumber?: string; // ทะเบียนเกษตร   // farmer info

    @IsOptional()
    @IsString()
    farmbookNumber?: string; // หมายเลขทะเบียน (เช่น เลขที่ในสมุดทะเบียน) // farmer info

    @IsOptional()
    @IsNumber()
    plotCount?: number; // จำนวนแปลงที่ถือครอง // Plot info

    @IsOptional()
    @IsNumber()
    plotNo?: number; // แปลงที่      // Plot info

    @IsOptional()
    @IsNumber()
    areaRai?: number; // ไร่     // Plot info

    @IsOptional()
    @IsNumber()
    areaNgan?: number; // งาน       // Plot info

    @IsOptional()
    @IsNumber()
    areaWah?: number; // ตารางวา        // Plot info

    @IsOptional()
    @IsNumber()
    areaAcre?: number; // จำนวนไร่ (acre)     // Plot info

    @IsOptional()
    @IsNumber()
    areaHa?: number; // พื้นที่ ha      // Plot info

    @IsOptional()
    @IsString()
    documentType?: string; // ประเภทเอกสารสิทธิ   // Land Document info

    @IsOptional()
    @IsString()
    documentNumber?: string; // เลขที่เอกสาร  สิทธิ   // Land Document info

    @IsOptional()
    @IsString()
    subdistrict?: number; // ตำบล    // SubDistrict info

    @IsOptional()
    @IsString()
    districtId?: number; // อำเภอ  // District info

    @IsOptional()
    @IsString()
    provinceId?: number; // จังหวัด  // Province info

    @IsOptional()
    @IsString()
    geometryType?: string; // ประเภทพิกัด (เช่น Point, Polygon)    //plot geometry info

    @IsOptional()
    @IsString()
    coordinate?: string; // ค่าพิกัดแปลง       // plot geometry info

    @IsOptional()
    @IsString()
    coordinateAdj?: string; // ค่าพิกัดแปลง Adj        // plot geometry info

    @IsOptional()
    @IsBoolean()
    isOwnedBefore2020?: boolean; // มีสวนก่อนปี พ.ศ. 2563      //farmer info

    coords?: Coord[];
}   
