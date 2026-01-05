import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') }); // <- ชี้ไป root ของ backend

import { PrismaService } from './prisma/prisma.service';

async function test() {
    const prisma = new PrismaService();

    try {
        await prisma.$connect();
        console.log('✅ Connected');
        console.log('DIRECT_URL:', process.env.DIRECT_URL);

        const farmers = await prisma.farmer.findMany();
        console.log('Farmers:', farmers);
    } catch (err) {
        console.error('prisma:error', err);
    } finally {
        await prisma.$disconnect();
    }
}

test();
