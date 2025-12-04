import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as XLSX from 'xlsx';

@Injectable()
export class ImportService {
    constructor(private prisma: PrismaService) { }

    async importMaster(file: Express.Multer.File) {
        if (!file) throw new BadRequestException('File is required');

        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);

        return await this.prisma.$transaction(async (tx) => {
            for (const row of rows) {
                //
                // =====================================================
                // 1) CREATE FARMER
                // =====================================================
                //
                const farmer = await tx.farmer.create({
                    data: {
                        farmerName: row['ชื่อ'] ?? null,
                        farmerSurname: row['นามสกุล'] ?? null,
                        citizenId: row['รหัสบัตรประจำตัวประชาชน']?.toString() ?? null,
                        phone: row['เบอร์โทรติดต่อ']?.toString() ?? null,
                        address: row['ที่อยู่'] ?? null,
                        createdAt: new Date(),
                    },
                });

                //
                // =====================================================
                // 2) LOOKUP Province / District
                // =====================================================
                //
                const province = await tx.province.findFirst({
                    where: { nameTh: row['จังหวัด']?.toString() },
                });

                const district = await tx.district.findFirst({
                    where: { nameTh: row['อำเภอ']?.toString() },
                });

                //
                // =====================================================
                // 3) CREATE LAND DOCUMENT
                // =====================================================
                //
                const landDocument = await tx.landDocumentRecord.create({
                    data: {
                        documentNumber: row['เลขที่เอกสาร']?.toString(),
                        documentType: row['ประเภทเอกสารสิทธิ']?.toString(),
                        createdAt: new Date(),
                    },
                });

                //
                // =====================================================
                // 4) CREATE FARM PLOT
                // =====================================================
                //
                const plot = await tx.farmPlot.create({
                    data: {
                        farmerId: farmer.farmerId,
                        landCode: row['แปลงที่']?.toString(),

                        provinceId: province?.provinceId ?? null,
                        districtId: district?.districtId ?? null,

                        landDocumentId: landDocument.landDocumentId,

                        deedType: row['ประเภทเอกสารสิทธิ'] ?? null,

                        areaRai: Number(row['ไร่'] ?? 0),
                        areaNgan: Number(row['งาน'] ?? 0),
                        areaWah: Number(row['ตารางวา'] ?? 0),

                        geometryType: row['ประเภทพิกัด'] ?? null,

                        isOwnedBefore2020:
                            row['มีสวนก่อนปี พ.ศ. 2563'] === 'ใช่' ||
                            row['มีสวนก่อนปี พ.ศ. 2563'] === true,

                        createdAt: new Date(),
                    },
                });

                //
                // =====================================================
                // 5) CREATE GEOMETRY POINT
                // =====================================================
                //
                await tx.plotGeometryPoint.create({
                    data: {
                        plotId: plot.plotId,
                        coordinates: row['ค่าพิกัดแปลง']?.toString() ?? null,
                        createdAt: new Date(),
                    },
                });

                //
                // =====================================================
                // 6) CREATE FARMBOOK
                // =====================================================
                //
                const farmbook = await tx.farmbookRecord.create({
                    data: {
                        farmerId: farmer.farmerId,
                        farmbookTypeId: 1, // default type
                        farmbookNumber: landDocument.documentNumber,
                        createdAt: new Date(),
                    },
                });

                //
                // =====================================================
                // 7) LINK FARMBOOK ↔ PLOT
                // =====================================================
                //
                await tx.farmbookPlotOwnership.create({
                    data: {
                        farmbookId: farmbook.farmbookId,
                        plotId: plot.plotId,
                        createdAt: new Date(),
                    },
                });
            }

            return {
                ok: true,
                total: rows.length,
            };
        });
    }
}
