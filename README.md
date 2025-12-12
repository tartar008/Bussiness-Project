# 📍 1. Overview

Traceability Backend คือระบบสำหรับการจัดการข้อมูลที่เกี่ยวข้องกับเกษตรกร
แปลงปลูก เอกสารสิทธิ์ และระบบตรวจสอบย้อนกลับ เพื่อรองรับมาตรฐานสูงอย่าง
EUDR และระบบตรวจสอบย้อนกลับของอุตสาหกรรมยางพารา

ระบบรองรับ: - การ Import Excel ไฟล์เดียว → แยกข้อมูลลงหลายตาราง - ระบบ
Farmer → Plot → PlotGeometry → FarmBook แบบสัมพันธ์กัน - รองรับ
Transaction แบบ Atomic - Prisma v7 ORM เชื่อมต่อฐานข้อมูล Supabase
(PostgreSQL) - NestJS ทำงานเป็น API Gateway

# 📦 2. Technology Stack

  Layer               Technology
  ------------------- ---------------------------------------
  Backend Framework   NestJS (TypeScript)
  ORM                 Prisma ORM v7
  Database            Supabase PostgreSQL (Regional Pooler)
  Runtime Driver      pgBouncer (6543)
  Migration Driver    Direct PostgreSQL (5432)
  Tools               ts-node, dotenv, class-validator

## 1. Prerequisites

- Windows / macOS / Linux
- [Volta](https://github.com/volta-cli/volta/releases/tag/v2.0.2) (เพื่อจัดการ Node.js เวอร์ชันเฉพาะโปรเจกต์)
- Git

---

## 2. Backend Setup

เนื่องจาก Prisma ต้องใช้ Node.js เวอร์ชัน 20 เราจะติดตั้ง Node.js โดยไม่กระทบเวอร์ชันปัจจุบันที่ใช้งานอยู่ ด้วย Volta

```bash
cd C:\Users\ASUS\Documents\Bussiness-Project\traceability-backend
volta pin node@20    # Pin Node.js เวอร์ชัน 20 ให้โปรเจกต์นี้
volta pin npm        # Pin npm เวอร์ชันล่าสุดตาม Node 20
```
   

# 3. Prisma Setup

 ## 3.1 Pull Database
  ดึง schema และข้อมูลจาก database ปัจจุบัน:

```
npx prisma db pull
```
 ## 3.2 Migrate Database
 สร้าง migration สำหรับ schema ใหม่:
 ```
 npx prisma migrate dev --name <migration_name>
 ```

  ## 3.3 Reset Database
  รีเซ็ต database ทั้งหมด (⚠️ ข้อมูลจะหายหมด):
  ```
  npx prisma migrate reset
  ```

  ## 3.4 Generate Prisma Client
  สร้าง Prisma Client เพื่อให้ใช้งานในโค้ด:
  ```
  npx prisma generate
  ```

 ## 3.5 Useful Commands
  ตรวจสอบสถานะ database:
  ```
  npx prisma studio
  ```

------------------------------------------------------------------------

# 🔧 4. Installation

## 4.1 Clone project

    git clone <repository-url>
    cd traceability-backend

## 4.2 Install dependencies

    npm install

## 4.3 Install NestJS CLI

    npm install -g @nestjs/cli

------------------------------------------------------------------------

# 🔐 5. Environment Variables (.env)

สร้างไฟล์ `.env`:

``` env
# Runtime (NestJS API)
DATABASE_URL="postgresql://postgres.<project-id>:PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Prisma (db pull + migration only)
DIRECT_URL="postgresql://postgres.<project-id>:PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

> ✔ DATABASE_URL → ใช้ runtime\
> ✔ DIRECT_URL → ใช้เฉพาะ Prisma (port 5432)

------------------------------------------------------------------------

# 🛠 6. Prisma v7 Configuration

Prisma v7 ปรับใหม่ทั้งหมด และ **ไม่อนุญาต url/directUrl อยู่ใน
schema.prisma**

------------------------------------------------------------------------

## 6.1 schema.prisma

``` prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}
```

------------------------------------------------------------------------

## 6.2 prisma.config.ts

``` ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
```

------------------------------------------------------------------------

# 🧱 7. Supabase Database Setup

Supabase model ใหม่ใช้ "Regional Pooler Host":

    aws-1-ap-southeast-1.pooler.supabase.com

### Ports

-   5432 → direct (Prisma migrate/db-pull)
-   6543 → pgbouncer (runtime API)

### Username Format

    postgres.<project-id>

------------------------------------------------------------------------

# 🧭 8. Prisma Commands

## ✔ ดึง schema จาก DB

    npx prisma db pull

## ✔ สร้าง Prisma Client

    npx prisma generate

## ✔ สร้าง migration ใหม่

    npx prisma migrate dev --name add_new_tables

## ✔ Deploy migration (Production)

    npx prisma migrate deploy

------------------------------------------------------------------------

# 🔗 9. NestJS + Prisma Integration

## prisma.service.ts

``` ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

## prisma.module.ts

``` ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

## app.module.ts

``` ts
@Module({
  imports: [PrismaModule],
})
export class AppModule {}
```

------------------------------------------------------------------------

# 🧪 10. Running Backend

    npm run start:dev

API default:

    http://localhost:3000

------------------------------------------------------------------------

# 🧭 11. Development Workflow (Recommended)

## 🔵 เมื่อเริ่มโปรเจกต์

    npx prisma db pull
    npx prisma generate

## 🟡 เมื่อเพิ่มตารางใหม่ใน schema.prisma

    npx prisma migrate dev --name add_new_table

## 🔴 เมื่อแก้ DB จากฝั่ง Supabase

    npx prisma db pull
    npx prisma generate

------------------------------------------------------------------------

# 📥 12. Import Feature Specification (Full Design)

ระบบ Import ถูกออกแบบแบบ **Single File → Multi-table Transaction**

## 12.1 Input File: Excel (.xlsx)

ตัวอย่างข้อมูล: - prefix - firstName - lastName - phone - plotNumber -
rai / ngan / wah - areaHa - deedType - deedNo - geometryType -
coordinates - adjCoordinates

------------------------------------------------------------------------

## 12.2 Flow ของ Import

### 1) Receive file

FE ส่งไฟล์ผ่าน endpoint:

    POST /import/master
    multipart/form-data

### 2) Parse file → JSON Rows

### 3) Validate ข้อมูล

### 4) Grouping

ระบบ grouping เป็น:

-   Farmer\
-   Plots\
-   PlotGeometry\
-   FarmBook\
-   FarmBookPlot

### 5) Start Transaction

    BEGIN
      Insert Farmer
      Insert Plot
      Insert Geometry
      Insert FarmBook
      Insert FarmBookPlot
    COMMIT

Error → Rollback ทั้งชุด

------------------------------------------------------------------------

# 🧩 13. ER Diagram (Concept)

    Farmer 1---N Plot
    Plot 1---1 PlotGeometry
    Plot N---N FarmBook (ผ่าน FarmBookPlot)

------------------------------------------------------------------------

# 🐞 14. Troubleshooting

### ❌ P1012: url/directUrl ไม่รองรับใน schema.prisma

✔ ย้ายไป prisma.config.ts

### ❌ P1001 / P1000: Cannot reach DB

✔ password ผิด\
✔ username format ผิด\
✔ ใช้ host เก่า db.`<project>`{=html}.supabase.co

### ❌ db pull ค้างนาน

✔ Prisma ใช้ 6543 อยู่\
✔ ต้องใช้ DIRECT_URL (5432)

### ❌ Cannot connect: username incorrect

ต้องใช้แบบใหม่:

    postgres.<project-id>

------------------------------------------------------------------------

# 📌 15. Future Features (Optional Roadmap)

-   Batch Import with queue worker\
-   Sync with QGIS\
-   Versioning for Plot Geometry\
-   Audit Log + Data Lineage\
-   EUDR Risk Mapping

------------------------------------------------------------------------

# 🎉 16. Conclusion

โปรเจกต์นี้พร้อมให้พัฒนาแล้ว\
- Prisma v7 config ถูกต้อง\
- Supabase รองรับทั้ง runtime + migration\
- Import feature พร้อมเริ่มเขียน\
- NestJS structure พร้อมขยาย

หากต้องการเอกสาร API Spec, ERD แบบเต็ม, ตัวอย่าง migration, หรือ flow
เพิ่มเติม แจ้งได้เลย!
