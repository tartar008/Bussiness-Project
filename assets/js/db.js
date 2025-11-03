export function saveDB(db) {
  localStorage.setItem("db-cache", JSON.stringify(db));
  console.log("💾 บันทึกข้อมูลลง localStorage แล้ว");
}

export async function getDB() {
  // 🧠 1. พยายามอ่านจาก localStorage ก่อน
  const cached = localStorage.getItem("db-cache");
  if (cached) {
    const db = JSON.parse(cached);
    ensureDBSchema(db);
    return db;
  }

  // 🌐 2. ถ้าไม่มี cache → โหลดจากไฟล์ data/db.json
  const res = await fetch("data/db.json");
  const db = await res.json();

  ensureDBSchema(db);
  return db;
}

// ------------------------------------------------------------
// 🧩 ฟังก์ชันตรวจสอบและเติมตารางให้ครบ (Schema Validation)
// ------------------------------------------------------------
function ensureDBSchema(db) {
  db.provinces ??= [];
  db.farmers ??= [];
  db.farmbooks ??= [];
  db.farmbookPlots ??= [];
  db.plots ??= [];
  db.statuses ??= [];
  db.validations ??= [];
  db.daily ??= [];
  db.transports ??= [];
  db.referenceLayers ??= [];

  // ✅ เติมค่าเริ่มต้นใน statuses ถ้ายังไม่มี
  if (db.statuses.length === 0) {
    db.statuses = [
      { StatusID: 1, Name: "ถือครองก่อนปี 2020", Description: "แปลงที่ดินถือครองก่อนปี 2020" },
      { StatusID: 2, Name: "อยู่ระหว่างตรวจสอบ", Description: "อยู่ในขั้นตอนการยืนยันสิทธิ์" },
      { StatusID: 3, Name: "ยืนยันสิทธิ์แล้ว", Description: "ผ่านการตรวจสอบโดยหน่วยงานแล้ว" }
    ];
  }
}
