// // prisma/seed.ts
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//     console.log('🌱 Seeding...');

//     const provinceName = 'ตรัง';

//     const province = await prisma.province.upsert({
//         where: { nameTh: provinceName },
//         update: {},
//         create: {
//             nameTh: provinceName,
//         },
//     });

//     const districts = ['เมืองตรัง', 'กันตัง', 'ย่านตาขาว'];

//     for (const name of districts) {
//         await prisma.district.upsert({
//             where: {
//                 nameTh_provinceId: {
//                     nameTh: name,
//                     provinceId: province.provinceId,
//                 },
//             },
//             update: {},
//             create: {
//                 nameTh: name,
//                 provinceId: province.provinceId,
//             },
//         });
//     }

//     console.log('✅ Seed complete');
// }

// main()
//     .catch((e) => {
//         console.error('❌ Seed error', e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });
