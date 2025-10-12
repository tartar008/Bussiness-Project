// db.js — mock database loader
export async function getDB() {
    const res = await fetch('data/db.json');
    if (!res.ok) throw new Error('❌ โหลด db.json ไม่สำเร็จ');
    return await res.json();
}

// บันทึก (ในที่นี้เขียนทับไม่ได้จริง แต่จำลองได้)
export async function saveDB(db) {
    console.warn('💡 saveDB(): จำลองการบันทึกเท่านั้น — ไม่ได้เขียนไฟล์จริง');
    console.log('data:', db);
}
