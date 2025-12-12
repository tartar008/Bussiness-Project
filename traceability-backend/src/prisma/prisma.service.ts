// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        // สร้าง adapter แบบ object แยก host/port/user/password
        const adapter = new PrismaPg({
            host: process.env.DB_HOST || "aws-1-ap-southeast-1.pooler.supabase.com",
            port: Number(process.env.DB_PORT) || 6543,
            database: process.env.DB_NAME || "postgres",
            user: process.env.DB_USER || "postgres",
            password: process.env.DB_PASSWORD || "GeoProject123T",
            connectionLimit: 10, // ปรับได้ตามต้องการ
        });

        super({ adapter }); // ส่ง adapter ให้ PrismaClient v7
    }

    async onModuleInit() {
        try {
            await this.$connect();
            console.log("Database connected ✅");
        } catch (err) {
            console.error("Database connection failed ❌", err);
            process.exit(1);
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
