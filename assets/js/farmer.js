import { getDB, saveDB } from './db.js';

export function init() {
    const form = document.getElementById('form-farmer');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        const db = getDB();
        const farmer = {
            FarmerID: 'F' + String(db.farmers.length + 1).padStart(4, '0'),
            Name: fd.get('name'),
            SurName: fd.get('surname'),
            FarmBookNumber: fd.get('farmbook'),
            Province: fd.get('province'),
            Address: fd.get('address'),
        };
        db.farmers.push(farmer);
        saveDB(db);
        alert(`✅ บันทึก Farmer ${farmer.FarmerID} สำเร็จ`);
    });
}
