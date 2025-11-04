import {
    getDB,
    loadBaseDB,
    seedToBase,
    resetDB,
    exportDB,
    importDB
} from "./db.js";

// 🧩 ป้องกัน XSS
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, c =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c])
    );
}

// 📋 แสดงข้อมูลแต่ละตาราง
function renderTable(title, rows) {
    const container = document.createElement("section");
    container.className = "border border-slate-200 rounded-lg shadow-sm p-4 bg-white mb-4";
    container.innerHTML = `
    <h3 class="text-lg font-semibold text-slate-700 mb-2">${title}</h3>
    ${rows.length === 0
            ? `<div class="text-slate-400 text-sm">ไม่มีข้อมูล</div>`
            : `<div class="overflow-x-auto border border-slate-200 rounded-lg">
            <table class="min-w-full border-collapse text-sm">
              <thead>
                <tr>${Object.keys(rows[0])
                .map(k => `<th class="bg-slate-100 border border-slate-200 px-3 py-2 text-left">${escapeHTML(k)}</th>`)
                .join("")}</tr>
              </thead>
              <tbody>
                ${rows
                .map(
                    row => `
                    <tr class="hover:bg-slate-50">
                      ${Object.values(row)
                            .map(v => `<td class="border border-slate-200 px-3 py-2">${escapeHTML(String(v))}</td>`)
                            .join("")}
                    </tr>`
                )
                .join("")}
              </tbody>
            </table>
          </div>`
        }
  `;
    return container;
}

// 📊 โหลดและแสดงฐานข้อมูล
async function showDatabase() {
    const dbContainer = document.getElementById("db-container");
    dbContainer.innerHTML = `<div class="text-slate-400 text-center p-4 animate-pulse">⏳ กำลังโหลดข้อมูล...</div>`;

    const db = await getDB();
    dbContainer.innerHTML = "";
    for (const [name, rows] of Object.entries(db)) {
        dbContainer.appendChild(renderTable(name, rows));
    }
}

// ⚙️ ตั้งค่าปุ่มทั้งหมด
function setupButtons() {
    document.getElementById("btnBase").addEventListener("click", async () => {
        await loadBaseDB();
        Swal.fire("🧱 โหลดฐานข้อมูลหลักสำเร็จ", "", "success");
        showDatabase();
    });

    document.getElementById("btnSeed").addEventListener("click", async () => {
        await seedToBase();
        Swal.fire("🌱 เติมข้อมูลตั้งต้นเรียบร้อย", "", "success");
        showDatabase();
    });

    document.getElementById("btnReset").addEventListener("click", async () => {
        const confirm = await Swal.fire({
            title: "⚠️ ล้างฐานข้อมูลทั้งหมด?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ล้างเลย",
            cancelButtonText: "ยกเลิก"
        });
        if (confirm.isConfirmed) {
            await resetDB();
            Swal.fire("✅ ล้างฐานข้อมูลสำเร็จ", "", "success");
            showDatabase();
        }
    });

    document.getElementById("btnExport").addEventListener("click", exportDB);

    document.getElementById("btnImport").addEventListener("change", e => {
        if (e.target.files.length) importDB(e.target.files[0]);
    });
}

// 🚀 เริ่มต้นระบบ
(async () => {
    setupButtons();
    await showDatabase();
})();
