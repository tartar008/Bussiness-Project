import { getDB, saveDB } from './db.js';

export function init() {
    const db = getDB();
    const form = document.getElementById('form-plot');
    const sel = form.querySelector('select[name="farmerId"]');
    sel.innerHTML = db.farmers.map(f => `<option value="${f.FarmerID}">${f.FarmerID} – ${f.Name} ${f.SurName}</option>`).join('');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        const plot = {
            PlotID: 'P' + String(db.plots.length + 1).padStart(4, '0'),
            FarmerID: fd.get('farmerId'),
            PlotCode: fd.get('plotCode'),
            DeedType: fd.get('deed'),
            AreaRai: fd.get('areaRai'),
            Lat: fd.get('lat'),
            Lng: fd.get('lng'),
        };
        db.plots.push(plot);
        saveDB(db);
        alert(`✅ บันทึก Plot ${plot.PlotID} แล้ว`);
    });
}
