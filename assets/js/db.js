// // db.js — mock database loader
// export async function getDB() {
//     const res = await fetch('data/db.json');
//     if (!res.ok) throw new Error('❌ โหลด db.json ไม่สำเร็จ');
//     return await res.json();
// }

// // บันทึก (ในที่นี้เขียนทับไม่ได้จริง แต่จำลองได้)
// export async function saveDB(db) {
//     console.warn('💡 saveDB(): จำลองการบันทึกเท่านั้น — ไม่ได้เขียนไฟล์จริง');
//     console.log('data:', db);
// }


export async function saveDB(db) {
    localStorage.setItem("mockDB", JSON.stringify(db));
    console.log("💾 บันทึกข้อมูลลง localStorage แล้ว");
}

export async function getDB() {
    // ถ้ามีใน localStorage → ใช้นั้นก่อน
    const saved = localStorage.getItem("mockDB");
    if (saved) {
        return JSON.parse(saved);
    }

    // ถ้าไม่มี → โหลดจาก db.json (ค่าเริ่มต้น)
    const res = await fetch('data/db.json');
    if (!res.ok) throw new Error('❌ โหลด db.json ไม่สำเร็จ');
    const db = await res.json();
    // บันทึกสำเนาเริ่มต้นลง localStorage
    localStorage.setItem("mockDB", JSON.stringify(db));
    return db;
}
