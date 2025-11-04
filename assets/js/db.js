// db.js
// ------------------------------------------------------------
// 💾 Database Manager — จำลองฐานข้อมูลจริง (Base + Seed + Runtime)
// ------------------------------------------------------------

const STORAGE_KEY = "db-cache";
const DB_BASE_URL = "../data/db.json"; // 🧱 ฐานข้อมูลหลัก (เหมือน production DB)

// ------------------------------------------------------------
// 🔹 บันทึกและโหลดข้อมูลใน LocalStorage
// ------------------------------------------------------------

// ✅ บันทึกฐานข้อมูลปัจจุบัน
export function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  console.log("💾 บันทึกข้อมูลลง localStorage แล้ว");
}

// ✅ โหลดฐานข้อมูล runtime จาก LocalStorage (ถ้ามี)
export async function getDB() {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    console.log("📦 โหลดข้อมูลจาก localStorage");
    return JSON.parse(cached);
  }

  console.warn("⚠️ ไม่มีข้อมูลใน localStorage — โหลดจากฐาน db.json");
  return await loadBaseDB();
}

// ------------------------------------------------------------
// 🔹 โหลดฐานข้อมูลหลัก (base) และข้อมูล seed (init)
// ------------------------------------------------------------

// ✅ โหลดฐานข้อมูลหลักจาก db.json (เหมือน Production Database)
export async function loadBaseDB() {
  try {
    const res = await fetch(DB_BASE_URL);
    if (!res.ok) throw new Error("โหลด db.json ไม่สำเร็จ");

    const db = await res.json();
    console.log("🧱 โหลดฐานข้อมูลหลัก (db.json) สำเร็จ");
    saveDB(db);
    return db;
  } catch (err) {
    console.error("❌ โหลดฐานข้อมูลล้มเหลว:", err);
    const empty = getEmptyDB();
    saveDB(empty);
    return empty;
  }
}

// ✅ โหลดข้อมูล seed จาก db-init.js
export async function loadSeedData() {
  const module = await import("./db-init.js");
  console.log("🌱 โหลดข้อมูล seed สำเร็จ");
  return module.default;
}

// ✅ เติมข้อมูล seed ลงในฐานหลัก (merge)
export async function seedToBase() {
  const base = await loadBaseDB();
  const seed = await loadSeedData();

  for (const key in seed) {
    if (Array.isArray(seed[key])) {
      // รวมข้อมูลใหม่ต่อท้ายของเก่า (ไม่มี unique check)
      base[key] = [...(base[key] || []), ...seed[key]];
    } else {
      base[key] = seed[key];
    }
  }

  saveDB(base);
  console.log("🌾 เติมข้อมูล seed ลงฐานเรียบร้อย");
  return base;
}

// ------------------------------------------------------------
// 🔹 ล้างฐานข้อมูลทั้งหมด
// ------------------------------------------------------------
export async function resetDB() {
  console.warn("🧹 กำลังล้างฐานข้อมูลทั้งหมด...");
  localStorage.removeItem(STORAGE_KEY);
  const empty = getEmptyDB();
  saveDB(empty);
  console.log("✅ ล้างฐานข้อมูลเสร็จสิ้น (ฐานว่าง)");
  return empty;
}

// ✅ คืนค่าโครงสร้างฐานว่าง (สำหรับ reset)
function getEmptyDB() {
  return {
    provinces: [],
    districts: [],
    farmers: [],
    plots: [],
    plotCoordinates: [],
    statuses: [],
    plotStatusLinks: [],
    plotDocuments: [],
    plotImages: [],
    farmbooks: [],
    farmbookPlots: [],
    validations: [],
    transports: [],
    daily: [],
    referenceLayers: []
  };
}

// ------------------------------------------------------------
// 📤 Export / 📂 Import DB (Backup & Restore)
// ------------------------------------------------------------

// ✅ ดาวน์โหลดฐานข้อมูลปัจจุบันเป็นไฟล์ JSON
export function exportDB() {
  const db = localStorage.getItem(STORAGE_KEY);
  if (!db) return alert("❌ ไม่มีข้อมูลในระบบ");

  const blob = new Blob([db], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "db-export.json";
  a.click();
  console.log("📤 export ฐานข้อมูลเรียบร้อย");
}

// ✅ อัปโหลดไฟล์ JSON แล้วนำเข้าเป็นฐานข้อมูลใหม่
export function importDB(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const db = JSON.parse(e.target.result);
      saveDB(db);
      alert("✅ นำเข้าฐานข้อมูลสำเร็จ");
      location.reload();
    } catch (err) {
      alert("❌ นำเข้าฐานข้อมูลล้มเหลว: " + err.message);
    }
  };
  reader.readAsText(file);
}
