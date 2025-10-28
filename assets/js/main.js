import { loadSidebar } from "./sidebar.js";
import { getDB } from "./db.js";

const app = document.getElementById("app");

(async () => {
  try {
    const DB = await getDB();
    console.log("📦 DB loaded:", DB);

    await loadSidebar(DB);
    await loadPage("dashboard", DB);
  } catch (err) {
    console.error("❌ Error while initializing app:", err);
    app.innerHTML = `<div class="text-center text-red-500 py-10">
      ❌ โหลดระบบไม่สำเร็จ: ${err.message}
    </div>`;
  }
})();

export async function loadPage(name, DB) {
  app.innerHTML = `<div class="text-center text-slate-400 py-10 animate-pulse">
    ⏳ กำลังโหลดหน้า <strong>${name}</strong>...
  </div>`;

  try {
    const res = await fetch(`pages/${name}.html`);
    if (!res.ok) throw new Error(`ไม่พบไฟล์ pages/${name}.html`);
    const html = await res.text();
    app.innerHTML = html;

    // ✅ โหลด script ตามชนิดของหน้า
    if (name === "insert") {
      const { init } = await import(`./insert.js`);
      await init(DB);
    } else {
      // ✅ ใช้ path assets/js/ เสมอ
      const module = await import(`./${name}.js`);
      if (module.init) module.init(DB);
    }
  } catch (err) {
    console.error(`❌ โหลดหน้า ${name} ล้มเหลว:`, err);
    app.innerHTML = `<div class="text-center text-red-500 py-10">
      ⚠️ ไม่สามารถโหลดหน้า <strong>${name}</strong><br/>
      ${err.message}
    </div>`;
  }

  const allBtns = document.querySelectorAll(".sidebar-link, .nav-btn");
  allBtns.forEach(btn => {
    const active = btn.dataset.page === name;
    btn.classList.toggle("text-indigo-600", active);
    btn.classList.toggle("font-semibold", active);
  });
}

window.loadPage = loadPage;
