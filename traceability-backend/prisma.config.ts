import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DIRECT_URL ใช้สำหรับ migrate / db pull (ไม่ต้องผ่าน adapter)
    url: env("DIRECT_URL"),
  },
});
