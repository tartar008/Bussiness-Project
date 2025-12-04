import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // IMPORTANT: ต้องใช้ DIRECT_URL (5432) สำหรับ migrate / db pull
    url: env("DIRECT_URL"),
  },
});
