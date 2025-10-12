import { getDB } from "./db.js";

export async function init() {
    console.log("📊 Dashboard page loaded");
    const db = await getDB();

    // ✅ ค่าเริ่มต้น
    db.farmers ??= [];
    db.plots ??= [];
    db.validations ??= [];
    db.transports ??= [];
    db.daily ??= [];

    // ✅ อัปเดตตัวเลขบนหน้า
    document.getElementById("dash-farmer").textContent = db.farmers.length;
    document.getElementById("dash-plot").textContent = db.plots.length;
    document.getElementById("dash-valid").textContent = db.validations.filter(v => v.Result === "PASS").length;
    document.getElementById("dash-transport").textContent = db.transports.length;

    // ✅ สร้างรายการกิจกรรมล่าสุด (จำลอง)
    const activityList = [
        ...db.farmers.slice(-2).map(f => `👩‍🌾 เพิ่มเกษตรกร ${f.Name} ${f.SurName}`),
        ...db.plots.slice(-2).map(p => `🗺️ เพิ่มแปลง ${p.PlotCode}`),
        ...db.daily.slice(-2).map(d => `📅 บันทึกข้อมูลรายวัน ${d.Do_No}`),
        ...db.transports.slice(-2).map(t => `🚛 ขนส่ง ${t.Transport_No}`),
    ];

    const listEl = document.getElementById("dash-activity");
    listEl.innerHTML = activityList.length
        ? activityList.map(a => `<li class="border-b border-slate-100 pb-1">${a}</li>`).join("")
        : `<li class="text-slate-400">ยังไม่มีข้อมูล</li>`;
}
