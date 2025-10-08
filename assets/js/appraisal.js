import { getDB } from './db.js';

export function init() {
    const db = getDB();
    const div = document.getElementById('appraisal-summary');

    const totalFarmers = db.farmers.length;
    const totalPlots = db.plots.length;
    const passCount = db.validations.filter(v => v.Result === 'PASS').length;
    const dailyTotal = db.daily.reduce((a, d) => a + d.DailyWeight, 0);
    const tpTotal = db.transports.length;

    div.innerHTML = `
    <p>👩‍🌾 Farmers: <b>${totalFarmers}</b></p>
    <p>🌾 Plots: <b>${totalPlots}</b></p>
    <p>✅ Validations PASS: <b>${passCount}</b></p>
    <p>🧾 Daily Collections: <b>${db.daily.length}</b> (${dailyTotal} kg)</p>
    <p>🚛 Transports: <b>${tpTotal}</b></p>
    <p class="mt-3 text-indigo-600 font-medium">🎯 ระบบ EUDR Traceability Flow สมบูรณ์</p>
  `;
}
