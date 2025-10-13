import { getDB, saveDB } from './db.js';

export function init() {
    const form = document.getElementById('form-farmer');
    form.addEventListener('submit', async e => {
        e.preventDefault();

        const fd = new FormData(form);

        // ✅ โหลดฐานข้อมูลแบบ async
        const db = await getDB();

        // ✅ สร้าง object เกษตรกรใหม่
        const farmer = {
            FarmerID: 'F' + String(db.farmers.length + 1).padStart(4, '0'),
            Name: fd.get('name'),
            SurName: fd.get('surname'),
            FarmBookNumber: fd.get('farmbook'),
            Province: fd.get('province'),
            Address: fd.get('address'),
        };

        // ✅ เพิ่มข้อมูลเข้า array
        db.farmers.push(farmer);

        // ✅ จำลองการบันทึก
        await saveDB(db);

        // ✅ แจ้งเตือนสำเร็จ
        alert(`✅ บันทึก Farmer ${farmer.FarmerID} สำเร็จ`);

        // ✅ ล้างฟอร์มหลังบันทึก
        form.reset();
    });
}
