import { loadSidebar } from "./sidebar.js";
import { getDB } from "./db.js";

const app = document.getElementById("app");

(async () => {
    try {
        // โหลดฐานข้อมูล
        const DB = await getDB();
        console.log("📦 DB loaded:", DB);

        // โหลด Sidebar เข้ามาในหน้า
        await loadSidebar(DB);

        // โหลดหน้าเริ่มต้น
        const defaultPage = "dashboard";
        await loadPage(defaultPage, DB);
    } catch (err) {
        console.error("❌ Error while initializing app:", err);
        app.innerHTML = `<div class="text-center text-red-500 py-10">
      ❌ โหลดระบบไม่สำเร็จ: ${err.message}
    </div>`;
    }
})();

async function loadPage(name, DB) {
    app.innerHTML = `<div class="text-center text-slate-400 py-10 animate-pulse">
    ⏳ กำลังโหลดหน้า <strong>${name}</strong>...
  </div>`;

    try {
        const res = await fetch(`pages/${name}.html`);
        if (!res.ok) throw new Error(`ไม่พบไฟล์ pages/${name}.html`);

        const html = await res.text();
        app.innerHTML = html;

        const module = await import(`./${name}.js`);
        console.log("🧠 imported module:", module);
        if (module.init) module.init(DB);
    } catch (err) {
        console.error(`❌ โหลดหน้า ${name} ล้มเหลว:`, err);
        app.innerHTML = `<div class="text-center text-red-500 py-10">
      ⚠️ ไม่สามารถโหลดหน้า <strong>${name}</strong><br/>
      ${err.message}
    </div>`;
    }

    // Highlight ปุ่ม active
    const allBtns = document.querySelectorAll(".sidebar-link, .nav-btn");
    allBtns.forEach(btn => {
        const active = btn.dataset.page === name;
        btn.classList.toggle("text-indigo-600", active);
        btn.classList.toggle("font-semibold", active);
    });
}

// ✅ เปิดให้เรียก loadPage() ได้จาก console หรือ component อื่น
window.loadPage = loadPage;
