import { loadNavbar } from "./navbar.js";
import { getDB } from "./db.js";

export async function init() {
    console.log("📥 Insert main page loaded");

    const DB = await getDB();

    // ✅ โหลด Navbar สำหรับการนำเข้าข้อมูล
    await loadNavbar("#navbar-placeholder");

    // ✅ ส่วนที่จะแสดงเนื้อหาแต่ละโมดูล
    const content = document.getElementById("insert-content");

    // ✅ ผูก event ให้ปุ่มใน navbar เรียก mini-router
    document.querySelectorAll("#navbar-placeholder [data-page]").forEach(btn => {
        btn.addEventListener("click", async e => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            console.log("📦 Insert subpage clicked:", page);

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
