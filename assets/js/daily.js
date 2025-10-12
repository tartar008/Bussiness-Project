import { getDB, saveDB } from './db.js';

export async function init() {
    console.log("📆 Daily page loaded");
    const db = await getDB();
    db.validations ??= [];
    db.daily ??= [];

    const form = document.getElementById('form-daily');
    const list = document.getElementById('daily-list');
    const sel = form.querySelector('select[name="plotValidationId"]');

    const passVals = db.validations.filter(v => v.Result === 'PASS');
    sel.innerHTML = passVals.map(v => `<option value="${v.PlotValidationID}">${v.PlotValidationID} – ${v.Unique}</option>`).join('');

    const render = () => {
        list.innerHTML = db.daily.length
            ? db.daily.map(d => `<div class="border p-2 rounded-lg">${d.Do_No} • ${d.Date} • ${d.DailyWeight}kg</div>`).join('')
            : '<div class="text-slate-400">ยังไม่มีข้อมูล</div>';
    };

    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        const d = {
            Do_No: fd.get('doNo'),
            Date: fd.get('date'),
            PlotValidationID: fd.get('plotValidationId'),
            DailyWeight: parseFloat(fd.get('weight')),
        };
        db.daily.push(d);
        saveDB(db);
        render();
        alert(`✅ บันทึก Do_No ${d.Do_No}`);
    });

    render();
}
