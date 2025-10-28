// assets/js/insert.js
import { loadNavbar } from "./navbar.js";
import { getDB } from "./db.js";
import { formatDate } from "./utils.js"; // ✅ แนะนำเพิ่ม util สำหรับจัดรูปวันที่

export async function init() {
    console.log("📥 Insert main page loaded");

    const DB = await getDB();

    // ✅ โหลด Navbar สำหรับการนำเข้าข้อมูล
    await loadNavbar("#navbar-placeholder");

    // ✅ ส่วนที่จะแสดงเนื้อหาแต่ละโมดูล
    const content = document.getElementById("insert-content");

    // ✅ แทรก Header Bar แสดงสถานะระบบ
    renderStatusBar(DB);

    // ✅ ผูก event ให้ปุ่มใน navbar เรียก mini-router
    document.querySelectorAll("#navbar-placeholder [data-page]").forEach(btn => {
        btn.addEventListener("click", async e => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            console.log("📦 Insert subpage clicked:", page);

            // Highlight active
            document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // แสดงสถานะโหลด
            content.innerHTML = `<div class="text-center text-slate-400 py-6 animate-pulse">
        ⏳ กำลังโหลด ${page}...
      </div>`;

            try {
                // โหลด HTML ภายในเฉพาะ sub-page
                const res = await fetch(`pages/${page}.html`);
                const html = await res.text();
                content.innerHTML = html;

                // โหลด script เฉพาะหน้านั้น
                const module = await import(`./${page}.js`);
                if (module.init) module.init(DB);

                // อัปเดตสถานะหลังจากบันทึกข้อมูล
                renderStatusBar(DB);
            } catch (err) {
                console.error(`❌ โหลดหน้า ${page} ภายใน insert ล้มเหลว`, err);
                content.innerHTML = `<div class="text-center text-red-500 py-10">
          ⚠️ โหลดไม่สำเร็จ: ${err.message}
        </div>`;
            }
        });
    });

    // ✅ แสดงค่า summary ข้างล่าง
    document.getElementById("ins-farmer").textContent = DB.farmers.length;
    document.getElementById("ins-plot").textContent = DB.plots.length;
    document.getElementById("ins-valid").textContent = DB.validations.filter(v => v.Result === "PASS").length;
}

// ✅ Header Bar (สถานะระบบ)
function renderStatusBar(DB) {
    const barContainer = document.getElementById("insert-status-bar");
    if (!barContainer) return;

    const totalFarmers = DB.farmers.length;
    const totalPlots = DB.plots.length;
    const lastUpdate = formatDate(new Date());

    barContainer.innerHTML = `
    <div class="flex flex-wrap items-center justify-between bg-indigo-50 border border-indigo-100 rounded-md px-4 py-2 text-sm text-indigo-700 mb-3">
      <div class="flex items-center gap-2">
        <span class="font-semibold">สถานะระบบ:</span>
        <span class="text-green-600 font-medium">✅ พร้อมบันทึกข้อมูล</span>
      </div>
      <div class="flex items-center gap-4">
        <span>👩‍🌾 เกษตรกร: <b>${totalFarmers}</b></span>
        <span>🌾 แปลงที่ดิน: <b>${totalPlots}</b></span>
        <span>🕒 อัปเดตล่าสุด: ${lastUpdate}</span>
      </div>
    </div>
  `;
}
