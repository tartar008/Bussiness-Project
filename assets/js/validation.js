import { getDB, saveDB } from './db.js';
import { nowLocal } from './utils.js';

export async function init() {
    console.log("📑 Validation page loaded");
    const db = await getDB();
    db.plots ??= [];
    db.farmers ??= [];
    db.validations ??= [];

    const form = document.getElementById('form-validation');
    const plotSelect = form.querySelector('select[name="plotId"]');
    const historyDiv = document.getElementById('val-history');
    const btnRe = document.getElementById('btn-revalidate');

    plotSelect.innerHTML = db.plots.length
        ? db.plots.map(p => `<option value="${p.PlotID}">${p.PlotID} – ${p.PlotCode}</option>`).join('')
        : `<option disabled>❗ ไม่มีข้อมูลแปลง</option>`;

    const renderHistory = plotId => {
        const vals = db.validations.filter(v => v.PlotID === plotId);
        historyDiv.innerHTML = vals.length
            ? vals.map(v => `<div class="border p-2 rounded-lg">
          <b>${v.PlotValidationID}</b> • ${v.Result} <br>
          <small>${v.EffectiveAt} • ${v.Unique}</small>
        </div>`).join('')
            : '<div class="text-slate-400 text-sm">ยังไม่มีประวัติ</div>';
    };

    plotSelect.addEventListener('change', () => renderHistory(plotSelect.value));
    btnRe.addEventListener('click', () => {
        form.querySelector('input[name="effective"]').value = nowLocal();
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        const plot = db.plots.find(p => p.PlotID === fd.get('plotId'));
        if (!plot) return alert('🚫 ไม่พบข้อมูลแปลง');
        const farmer = db.farmers.find(f => f.FarmerID === plot.FarmerID);
        const pvId = 'V' + String(db.validations.length + 1).padStart(4, '0');

        const val = {
            PlotValidationID: pvId,
            PlotID: plot.PlotID,
            Unique: `${farmer?.FarmerID || 'UNK'}-${plot.PlotID}`,
            Geometry: fd.get('geom'),
            Result: fd.get('result'),
            EffectiveAt: fd.get('effective') || nowLocal(),
        };

        db.validations.push(val);
        saveDB(db);
        renderHistory(plot.PlotID);
        alert(`✅ บันทึก Validation ${pvId}`);
    });
}
