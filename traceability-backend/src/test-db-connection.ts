import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// ใช้ DATABASE_URL ของ pooler runtime
const prisma = new PrismaClient({
    adapter: new PrismaPg(process.env.DATABASE_URL!)
});

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
