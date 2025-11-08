import { loadSidebar } from "./sidebar.js";
import { getDB } from "./db.js";

const app = document.getElementById("app");

(async () => {
  try {
    
    const DB = await getDB();
    console.log("📦 DB loaded:", DB);

    await loadSidebar(DB);
    await loadPage("dashboard", DB); // โหลดหน้าแรก
  } catch (err) {
    console.error("❌ Error while initializing app:", err);
    app.innerHTML = `<div class="text-center text-red-500 py-10">
      ❌ โหลดระบบไม่สำเร็จ: ${err.message}
    </div>`;
  }
})();

// =======================================
// ✅ โหลดแต่ละหน้า (HTML + Script Module)
// =======================================
export async function loadPage(name, DB) {
  console.log("🔀 สลับไปหน้า:", name);
  console.log("🌐 ปัจจุบันอยู่ที่ URL:", window.location.href);
  console.log("📦 Container มีไหม:", !!document.getElementById("page-container"));  // ✅ โหลดเฉพาะใน #page-container เท่านั้น ไม่แทนทั้ง #app
  const container = document.getElementById("page-container");
  console.log("🧱 container ที่ใช้โหลด:", container.id);
  if (!container) {
    console.error("❌ ไม่พบ #page-container");
    return;
  }

  container.innerHTML = `
    <div class="text-center text-slate-400 py-10 animate-pulse">
      ⏳ กำลังโหลดหน้า <strong>${name}</strong>...
    </div>`;

  try {
    // ✅ หา base path (ใช้ได้ทั้ง Local และ GitHub Pages)
    const basePath = window.location.pathname.split("/")[1]
      ? `/${window.location.pathname.split("/")[1]}`
      : "";

    // ✅ โหลด JS module ของหน้า
    const res = await fetch(`${basePath}/pages/${name}.html`);
    if (!res.ok) throw new Error(`ไม่พบไฟล์ pages/${name}.html`);
    const html = await res.text();

    // 🧩 เพิ่ม log ตรงนี้
    console.log("Preview HTML:", html.slice(0, 200));

    // ✅ แทรกเฉพาะใน container (ไม่ทับ header)
    container.innerHTML = html;

    // ✅ โหลด JS module ของหน้า
    const module = await import(`${basePath}/assets/js/${name}.js`);
    if (module.init) await module.init(DB);

  } catch (err) {
    console.error(`❌ โหลดหน้า ${name} ล้มเหลว:`, err);
    container.innerHTML = `
      <div class="text-center text-red-500 py-10">
        ⚠️ ไม่สามารถโหลดหน้า <strong>${name}</strong><br/>
        ${err.message}
      </div>`;
  }

  // ✅ อัปเดต active sidebar link
  const allBtns = document.querySelectorAll(".sidebar-link, .nav-btn");
  allBtns.forEach(btn => {
    const active = btn.dataset.page === name;
    btn.classList.toggle("text-indigo-600", active);
    btn.classList.toggle("font-semibold", active);
  });
}

window.addEventListener("goToPage", async e => {
  const DB = await getDB();
  console.log("🔀 สลับไปหน้า:", e.detail);
  await loadPage(e.detail, DB);
});



window.loadPage = loadPage;
