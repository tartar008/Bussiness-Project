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
