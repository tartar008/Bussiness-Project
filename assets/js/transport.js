import { getDB, saveDB } from './db.js';

export async function init() {
    console.log("🚛 Transport page loaded");
    const db = await getDB();
    db.daily ??= [];
    db.transports ??= [];

    const form = document.getElementById('form-transport');
    const doList = document.getElementById('doList');
    const sumLoad = document.getElementById('sumLoad');
    const warn = document.getElementById('warn');

    doList.innerHTML = db.daily.map((d, i) => `
    <label class="bg-slate-100 rounded-lg px-2 py-1">
      <input type="checkbox" data-idx="${i}" class="mr-1 doChk"> ${d.Do_No} (${d.DailyWeight} kg)
    </label>`).join('');

    document.addEventListener('change', e => {
        if (!e.target.classList.contains('doChk')) return;
        const total = Array.from(document.querySelectorAll('.doChk:checked'))
            .reduce((sum, el) => sum + db.daily[el.dataset.idx].DailyWeight, 0);
        sumLoad.textContent = total.toFixed(1);
        const cap = parseFloat(form.capacity.value || 0);
        warn.classList.toggle('hidden', !(cap && total > cap));
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        const selected = Array.from(document.querySelectorAll('.doChk:checked'))
            .map(el => db.daily[el.dataset.idx]);
        const total = selected.reduce((s, d) => s + d.DailyWeight, 0);
        const tp = {
            Transport_No: fd.get('tpNo'),
            Date: fd.get('date'),
            Truck_Code: fd.get('truck'),
            Capacity: parseFloat(fd.get('capacity') || 0),
            Loads: selected.map(d => d.Do_No),
            TotalLoad: total,
        };
        if (tp.Capacity && total > tp.Capacity) return alert('🚫 โหลดเกินความจุ');
        db.transports.push(tp);
        saveDB(db);
        alert(`✅ บันทึก Transport ${tp.Transport_No}`);
    });
}
