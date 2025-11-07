// assets/js/insert.js
import { loadNavbar } from "./navbar.js";
import { getDB, saveDB } from "./db.js";
import { formatDate } from "./utils.js";

// ------------------------------------------------------------
// 🧠 เก็บข้อมูลระหว่างขั้นตอน
// ------------------------------------------------------------
let currentSession = {
  farmer: null,
  plot: null,
  validation: null,
  step: 1, // 1=Farmer, 2=Plot, 3=Validation, 3.5=QGIS
};

// ------------------------------------------------------------
// 🚀 เริ่มต้นระบบ Insert Page
// ------------------------------------------------------------
export async function init() {
  console.log("📥 Insert main page loaded");

  const DB = await getDB();
  window.DB = DB;
  window.loadStep = loadStep;

  // ✅ โหลด Navbar
  await loadNavbar("#navbar-placeholder");
  if (window.renderProgressBar) window.renderProgressBar(1);

  // ✅ หลังจากโหลด navbar เสร็จ — แสดง progress แรก
  if (window.renderProgressBar) window.renderProgressBar(1);

  // ✅ เตรียม content
  const content = document.getElementById("insert-content");
  renderStatusBar(DB);

  // ✅ เริ่มโหลดขั้นตอนแรก
  await loadStep("farmer", DB, content);
}


// ------------------------------------------------------------
// 🔄 โหลดแต่ละขั้นตอน (Farmer → Plot → Validation → QGIS)
// ------------------------------------------------------------
export async function loadStep(page, DB, content) {
  if (!content) content = document.getElementById("insert-content");
  if (!DB) DB = window.DB;

  content.innerHTML = `
    <div class="text-center text-slate-400 py-6 animate-pulse">
      ⏳ กำลังโหลด ${page}...
    </div>`;

  try {
    const res = await fetch(`pages/${page}.html`);
    const html = await res.text();
    content.innerHTML = html;

    const module = await import(`./${page}.js`);

    // ✅ ให้แต่ละหน้าเรียก callback หลัง save เสร็จ
    if (module.init) {
      module.init(DB, async (result) => {
        console.log(`✅ ${page} saved:`, result);

        if (page === "farmer") {
          currentSession.farmer = result;
          currentSession.step = 2;
          await loadStep("plot", DB, content);
        } else if (page === "plot") {
          currentSession.plot = result;
          currentSession.step = 3;
          await loadStep("validation", DB, content);
        } else if (page === "validation") {
          currentSession.validation = result;
          currentSession.step = 3.5;
          await loadStep("qgis", DB, content);
        } else if (page === "qgis") {
          await finalizeTransaction(DB);
        }
      });
    }

    // ✅ อัปเดตสถานะ
    renderStatusBar(DB);

    // ✅ แจ้ง navbar ให้ progress bar ขยับ step ปัจจุบัน
    if (window.renderProgressBar) window.renderProgressBar(currentSession.step);

  } catch (err) {
    console.error(`❌ โหลดหน้า ${page} ล้มเหลว`, err);
    content.innerHTML = `
      <div class="text-center text-red-500 py-10">
        ⚠️ โหลดไม่สำเร็จ: ${err.message}
      </div>`;
  }
}

// ------------------------------------------------------------
// 📦 สรุปและบันทึก Transaction หลังครบทุกขั้นตอน
// ------------------------------------------------------------
async function finalizeTransaction(DB) {
  const txId = `TX${Date.now()}`;
  const now = new Date().toISOString();

  const tx = {
    TransactionID: txId,
    FarmerID: currentSession.farmer?.FarmerID,
    PlotID: currentSession.plot?.PlotID,
    ValidationID: currentSession.validation?.ValidationID,
    Steps: [
      { step: "REGISTER_FARMER", at: currentSession.farmer?.CreatedAt },
      { step: "CREATE_PLOT", at: currentSession.plot?.CreatedAt },
      { step: "VALIDATE_PLOT", at: currentSession.validation?.CreatedAt },
      { step: "FINALIZE_QGIS", at: now },
    ],
    CompletedAt: now,
    Version: DB.transactions ? DB.transactions.length + 1 : 1,
  };

  if (!DB.transactions) DB.transactions = [];
  DB.transactions.push(tx);
  saveDB(DB);

  document.getElementById("insert-content").innerHTML = `
    <div class="text-center text-green-700 py-10 space-y-2">
      <div class="text-2xl font-semibold">🎉 บันทึก Transaction สำเร็จ!</div>
      <p>รหัสธุรกรรม: <b>${txId}</b></p>
      <button id="btn-new" class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg">
        ➕ เริ่มรายการใหม่
      </button>
    </div>`;

  document.getElementById("btn-new").addEventListener("click", async () => {
    currentSession = { farmer: null, plot: null, validation: null, step: 1 };
    await loadStep("farmer", DB, document.getElementById("insert-content"));
  });

  renderStatusBar(DB);
  if (window.renderProgressBar) window.renderProgressBar(4);
}

// ------------------------------------------------------------
// ✅ Header Bar แสดงสถานะระบบ
// ------------------------------------------------------------
function renderStatusBar(DB) {
  const barContainer = document.getElementById("insert-status-bar");
  if (!barContainer) return;

  const totalFarmers = DB.farmers.length;
  const totalPlots = DB.plots.length;
  const totalValid = DB.validations.filter(v => v.Result === "PASS").length;
  const totalTx = DB.transactions ? DB.transactions.length : 0;
  const lastUpdate = formatDate(new Date());

  const stepLabel =
    currentSession.step === 1 ? "🧑‍🌾 ลงทะเบียนเกษตรกร" :
      currentSession.step === 2 ? "🗺️ เพิ่มแปลงที่ดิน" :
        currentSession.step === 3 ? "🔍 ตรวจสอบข้อมูล" :
          currentSession.step === 3.5 ? "🧭 ตรวจสอบแผนที่ (QGIS)" :
            "✅ เสร็จสิ้น";

  barContainer.innerHTML = `
    <div class="flex flex-wrap items-center justify-between bg-indigo-50 border border-indigo-100 rounded-md px-4 py-2 text-sm text-indigo-700 mb-3">
      <div class="flex items-center gap-2">
        <span class="font-semibold">สถานะ:</span>
        <span class="text-indigo-600 font-medium">${stepLabel}</span>
      </div>
      <div class="flex items-center gap-4">
        <span>👩‍🌾 เกษตรกร: <b>${totalFarmers}</b></span>
        <span>🌾 แปลง: <b>${totalPlots}</b></span>
        <span>✅ ตรวจแล้ว: <b>${totalValid}</b></span>
        <span>🧾 ธุรกรรม: <b>${totalTx}</b></span>
        <span>🕒 อัปเดตล่าสุด: ${lastUpdate}</span>
      </div>
    </div>`;
}
