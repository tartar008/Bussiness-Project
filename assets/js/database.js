import { getDB } from "./db.js";

// ===== ป้องกัน XSS เวลา render raw data =====
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, c =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])
    );
}

// ===== แสดงผลแต่ละตาราง =====
function renderTable(title, dataArray) {
    const container = document.createElement("section");
    container.className = "border border-slate-200 rounded-lg shadow-sm p-4 bg-white";

    container.innerHTML = `
    <h3 class="text-lg font-semibold text-slate-700 mb-2">${title}</h3>
    ${dataArray.length === 0
            ? `<div class="text-slate-400 text-sm mb-4">ไม่มีข้อมูล</div>`
            : `<div class="overflow-x-auto border border-slate-200 rounded-lg shadow-sm mb-4">
            <table class="min-w-full border-collapse text-sm">
              <thead>
                <tr>${Object.keys(dataArray[0])
                .map(k => `<th class="bg-slate-100 border border-slate-200 px-3 py-2 text-left">${k}</th>`)
                .join("")}</tr>
              </thead>
              <tbody>
                ${dataArray
                .map(row => `
                    <tr class="hover:bg-slate-50">
                      ${Object.values(row)
                        .map(v => `<td class="border border-slate-200 px-3 py-2">${escapeHTML(String(v))}</td>`)
                        .join("")}
                    </tr>
                  `)
                .join("")}
              </tbody>
            </table>
          </div>`
        }
  `;
    return container;
}

// ===== แสดง Database =====
async function showDatabase() {
    const dbContainer = document.getElementById("db-container");
    if (!dbContainer) return;

    try {
        const db = await getDB();
        console.log("📦 Internal DB loaded:", db);
        for (const [tableName, rows] of Object.entries(db)) {
            dbContainer.appendChild(renderTable(tableName, rows));
        }
    } catch (err) {
        console.error("❌ Error loading DB:", err);
        dbContainer.innerHTML = `<div class="text-red-500 font-medium">ไม่สามารถโหลดข้อมูลได้ (${err.message})</div>`;
    }
}

// ===== แสดง Popup ก่อนเข้าดู Database =====
async function askPassword() {
    const { value: password } = await Swal.fire({
        title: "🔐 ใส่รหัสเข้าดูข้อมูล",
        input: "password",
        inputLabel: "สำหรับผู้ดูแลระบบเท่านั้น",
        inputPlaceholder: "กรอกรหัสผ่าน...",
        confirmButtonText: "เข้าสู่ระบบ",
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        allowOutsideClick: false,
        backdrop: true,
        inputAttributes: {
            maxlength: 32,
            autocapitalize: "off",
            autocorrect: "off"
        }
    });

    if (!password) {
        await Swal.fire("❌ ยกเลิกการเข้าถึง", "คุณไม่ได้ใส่รหัส", "error");
        return false;
    }

    // ✅ ตรวจรหัสตรงนี้ (สามารถเปลี่ยนได้)
    const ADMIN_PASS = "1234"; // ← แก้เป็นรหัสจริงของคุณ
    if (password === ADMIN_PASS) {
        await Swal.fire("✅ เข้าสู่ระบบสำเร็จ", "ยินดีต้อนรับผู้ดูแลระบบ", "success");
        return true;
    } else {
        await Swal.fire("🚫 รหัสไม่ถูกต้อง", "โปรดลองอีกครั้ง", "error");
        return false;
    }
}

// ===== ปุ่ม Clear Database =====
function setupClearButton() {
    const clearBtn = document.getElementById("clearBtn");
    clearBtn.addEventListener("click", async () => {
        const confirmClear = confirm("⚠️ แน่ใจหรือไม่ที่จะล้างข้อมูลทั้งหมด?");
        if (!confirmClear) return;

        // ถ้าใช้ localStorage → ล้างข้อมูลจำลอง
        if (localStorage.getItem("mockDB")) {
            localStorage.removeItem("mockDB");
            alert("🧹 เคลียร์ข้อมูลจำลองเรียบร้อย");
        }

        // รีโหลดใหม่จาก db.json
        await renderDatabase();
    });
}

// ===== เริ่มทำงานเมื่อโหลด component นี้ =====
(async () => {
    const granted = await askPassword();
    setupClearButton();
    if (granted) showDatabase();
})();
