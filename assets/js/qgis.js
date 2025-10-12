import { getDB, saveDB } from './db.js';

export async function init() {
    console.log("🗺️ QGIS page loaded");
    const db = await getDB();
    db.plots ??= [];
    db.qgis ??= [];

    const form = document.getElementById('form-qgis');
    const list = document.getElementById('qgis-list');
    const sel = form.querySelector('select[name="plotId"]');

    sel.innerHTML = db.plots.map(p => `<option value="${p.PlotID}">${p.PlotID} – ${p.PlotCode}</option>`).join('');

    const render = () => {
        list.innerHTML = db.qgis.length
            ? db.qgis.map(q => `<div class="border p-2 rounded-lg">${q.PlotID} • ${q.Layer} <br><small>${q.Summary}</small></div>`).join('')
            : '<div class="text-slate-400">ยังไม่มีผล</div>';
    };

    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        db.qgis.push({
            QGISID: 'Q' + String(db.qgis.length + 1).padStart(4, '0'),
            PlotID: fd.get('plotId'),
            Layer: fd.get('layer'),
            Summary: fd.get('summary'),
        });
        saveDB(db);
        render();
    });

    render();
}
