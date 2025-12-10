import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateLandDocumentDto } from "./dto/create-land-document.dto";


@Injectable()
export class LandDocumentService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateLandDocumentDto) {
        const newDoc = await this.prisma.landDocumentRecord.create({
            data: {
                documentNumber: dto.documentNumber,
                documentType: dto.documentType,
            }
        });

        return newDoc;
    }

    async findOrCreate(dto: CreateLandDocumentDto) {
        let doc = await this.prisma.landDocumentRecord.findFirst({
            where: {
                documentNumber: dto.documentNumber,
                documentType: dto.documentType,
            }
        });

        if (!doc) {
            doc = await this.prisma.landDocumentRecord.create({
                data: {
                    documentNumber: dto.documentNumber,
                    documentType: dto.documentType,
                }
            });
        }

        return doc;
    }
}
