import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '..', '.env') }); // ชี้ไปไฟล์ .env ใน root

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // 🔹 ปิด SSL สำหรับ pooler
});

async function test() {
    try {
        await client.connect();
        console.log('PostgreSQL connected ✅');
    } catch (err) {
        console.error('PostgreSQL connection failed ❌', err);
    } finally {
        await client.end();
    }
}
async function testQuery() {
    try {
        await client.connect();

        const res = await client.query('SELECT NOW()');
        console.log('Server time:', res.rows[0]);

    } catch (err) {
        console.error('Query failed ❌', err);
    } finally {
        await client.end();
    }
}

testQuery();
// test();