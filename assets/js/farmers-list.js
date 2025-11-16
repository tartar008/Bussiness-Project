import { getDB } from './db.js';

document.addEventListener("DOMContentLoaded", async () => {
    const db = await getDB();
    const tbody = document.getElementById("farmerBody");

    if (!db.farmers || db.farmers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-slate-400">ไม่มีข้อมูลเกษตรกร</td></tr>`;
        return;
    }

    db.farmers.forEach(f => {
        const tr = document.createElement("tr");
        tr.className = "border-b hover:bg-slate-50";
        tr.innerHTML = `
      <td class="px-4 py-2">${f.FarmerID || '-'}</td>
      <td class="px-4 py-2">${f.Name || ''} ${f.SurName || ''}</td>
      <td class="px-4 py-2">${f.ProvinceName || '-'}</td>
      <td class="px-4 py-2">${f.Phone || '-'}</td>
    `;
        tbody.appendChild(tr);
    });
});
