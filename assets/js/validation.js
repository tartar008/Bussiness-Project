import { getDB, saveDB } from "./db.js";
import { nowLocal } from "./utils.js";

export async function init() {
    console.log("📑 Validation page loaded");

    // ---------------------------
    // 📦 โหลดข้อมูลทั้งหมด
    // ---------------------------
    const db = await getDB();
    db.farmers ??= [];
    db.plots ??= [];
    db.validations ??= [];

    const form = document.getElementById("form-validation");
    const plotSelect = form.querySelector('select[name="plotId"]');
    const geomInput = form.querySelector('textarea[name="geom"]');
    const historyDiv = document.getElementById("val-history");
    const btnRe = document.getElementById("btn-revalidate");

    // ---------------------------
    // 🗺️ สร้างแผนที่
    // ---------------------------
    const map = L.map("map-validation").setView([13.736717, 100.523186], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
    }).addTo(map);
    let drawnLayer = null;

    // ---------------------------
    // 🧭 โหลดรายชื่อ Plot ทั้งหมด
    // ---------------------------
    plotSelect.innerHTML = db.plots.length
        ? db.plots
            .map(
                (p) =>
                    `<option value="${p.PlotID}">${p.PlotID} — ${p.Province}/${p.District} (${p.LandCode})</option>`
            )
            .join("")
        : `<option disabled>❗ ไม่มีข้อมูลแปลง</option>`;

    // ---------------------------
    // 🧾 แสดงประวัติการตรวจ
    // ---------------------------
    const renderHistory = (plotId) => {
        const vals = db.validations.filter((v) => v.PlotID === plotId);
        historyDiv.innerHTML = vals.length
            ? vals
                .map(
                    (v) => `
          <div class="border p-2 rounded-lg bg-slate-50">
            <b>${v.PlotValidationID}</b> • ${v.Result}
            <br><small>${v.EffectiveAt} (${v.Unique})</small>
          </div>`
                )
                .join("")
            : `<div class="text-slate-400 text-sm">ยังไม่มีประวัติการตรวจ</div>`;
    };

    // ---------------------------
    // 🗺️ เมื่อเลือกแปลง → ดึง geometry จาก db.plots
    // ---------------------------
    plotSelect.addEventListener("change", (e) => {
        const plotId = e.target.value;
        const plot = db.plots.find((p) => p.PlotID === plotId);
        if (!plot) return;

        // ล้างเลเยอร์เดิม
        if (drawnLayer) map.removeLayer(drawnLayer);

        // วาด geometry
        if (plot.GeometryType === "Point") {
            const pt = plot.Coordinates[0];
            drawnLayer = L.marker([pt.lat, pt.lng]).addTo(map);
            map.setView([pt.lat, pt.lng], 14);
        } else if (plot.GeometryType === "Polygon") {
            const latlngs = plot.Coordinates.map((c) => [c.lat, c.lng]);
            drawnLayer = L.polygon(latlngs, { color: "blue", fillOpacity: 0.3 }).addTo(map);
            map.fitBounds(drawnLayer.getBounds());
        }

        // แสดง geometry ใน input (read-only)
        geomInput.value = JSON.stringify(plot.Coordinates, null, 2);

        // โหลดประวัติการตรวจ
        renderHistory(plotId);
    });

    // ---------------------------
    // 🔄 เปิดรอบตรวจใหม่
    // ---------------------------
    btnRe.addEventListener("click", () => {
        form.querySelector('input[name="effective"]').value = nowLocal();
    });

    // ---------------------------
    // 💾 บันทึกผลตรวจ
    // ---------------------------
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(form);

        const plot = db.plots.find((p) => p.PlotID === fd.get("plotId"));
        if (!plot) return alert("🚫 ไม่พบข้อมูลแปลง");

        const farmer = db.farmers.find((f) => f.FarmerID === plot.FarmerID);
        const newId = "VAL" + String(db.validations.length + 1).padStart(4, "0");

        const record = {
            PlotValidationID: newId,
            PlotID: plot.PlotID,
            Unique: `${farmer?.FarmerID || "UNK"}-${plot.PlotID}`,
            Geometry: JSON.stringify(plot.Coordinates),
            Result: fd.get("result"),
            EffectiveAt: fd.get("effective") || nowLocal(),
        };

        db.validations.push(record);
        saveDB(db);

        renderHistory(plot.PlotID);
        alert(`✅ บันทึกผลตรวจ ${newId} สำเร็จ`);
    });
}
