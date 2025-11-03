export function saveDB(db) {
  localStorage.setItem("db-cache", JSON.stringify(db));
  console.log("💾 บันทึกข้อมูลลง localStorage แล้ว");
}

export async function getDB() {
  // ลองอ่านจาก localStorage ก่อน
  const cached = localStorage.getItem("db-cache");
  if (cached) return JSON.parse(cached);

  // ถ้ายังไม่มี cache ให้โหลดจากไฟล์จริง
  const res = await fetch("data/db.json");
  const db = await res.json();

  db.provinces = db.provinces || [];
  db.farmers = db.farmers || [];
  db.farmbooks = db.farmbooks || [];
  db.plots = db.plots || [];
  db.validations = db.validations || [];
  db.daily = db.daily || [];
  db.transports = db.transports || [];
  db.referenceLayers = db.referenceLayers || [];

  return db;
}
