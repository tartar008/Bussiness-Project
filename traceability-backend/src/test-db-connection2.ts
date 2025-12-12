import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    host: "aws-1-ap-southeast-1.pooler.supabase.com",
    port: 6543,
    database: "postgres",
    user: "postgres",
    password: "GeoProject123T",
    // pgbouncer settings, ถ้าจำเป็นต้องใช้แบบ object
    connectionLimit: 10,
});

const prisma = new PrismaClient({ adapter });

async function test() {
    try {
        await prisma.$connect();
        console.log("Database connected ✅");
    } catch (err) {
        console.error("Database connection failed ❌", err);
    } finally {
        await prisma.$disconnect();
    }
}

test();
