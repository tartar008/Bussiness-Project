import { getDB } from './db.js';

document.addEventListener("DOMContentLoaded", async () => {
    const db = await getDB();
    const tbody = document.getElementById("plotBody");

    if (!db.plots || db.plots.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-slate-400">ไม่มีข้อมูลแปลงที่ดิน</td></tr>`;
        return;
    }

    db.plots.forEach(p => {
        const tr = document.createElement("tr");
        tr.className = "border-b hover:bg-slate-50";
        tr.innerHTML = `
      <td class="px-4 py-2">${p.PlotID || '-'}</td>
      <td class="px-4 py-2">${p.LandCode || '-'}</td>
      <td class="px-4 py-2">${p.Province || '-'}</td>
      <td class="px-4 py-2">${p.District || '-'}</td>
      <td class="px-4 py-2">${p.DeedType || '-'}</td>
    `;
        tbody.appendChild(tr);
    });
});
