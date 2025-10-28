// ✅ โหลด Chart.js แบบ ESM และ register ทุกอย่าง
import {
    Chart,
    ArcElement,
    BarElement,
    LineElement,
    PointElement,
    DoughnutController,
    BarController,
    LineController,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/+esm";

// ✅ ต้อง register ก่อนใช้งาน
Chart.register(
    ArcElement,
    BarElement,
    LineElement,
    PointElement,
    DoughnutController,
    BarController,
    LineController,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);

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
    db.referenceLayers ??= [];

    // ✅ ตัวเลขสรุป
    const totalFarmers = db.farmers.length;
    const totalPlots = db.plots.length;
    const totalValidPass = db.validations.filter(v => v.Result === "PASS").length;
    const totalFail = db.validations.filter(v => v.Result === "FAIL").length;
    const totalTransports = db.transports.length;
    const totalRefs = db.referenceLayers.length;
    const passRate = totalPlots
        ? ((totalValidPass / totalPlots) * 100).toFixed(1)
        : 0;

    // ✅ แสดงผลบนหน้า
    document.getElementById("dash-farmer").textContent = totalFarmers;
    document.getElementById("dash-plot").textContent = totalPlots;
    document.getElementById("dash-valid").textContent = totalValidPass;
    document.getElementById("dash-transport").textContent = totalTransports;
    document.getElementById("dash-ref").textContent = totalRefs;
    document.getElementById("dash-passrate").textContent = `${passRate}%`;

    // ✅ กราฟสรุปผลการตรวจสอบ
    const chartEl = document.getElementById("dash-chart");
    if (chartEl) {
        const hasData = totalValidPass > 0 || totalFail > 0;
        const chart = new Chart(chartEl, {
            type: "doughnut",
            data: {
                labels: ["ผ่านตรวจสอบ", "ไม่ผ่าน"],
                datasets: [
                    {
                        data: hasData ? [totalValidPass, totalFail] : [1, 1],
                        backgroundColor: hasData
                            ? ["#22c55e", "#ef4444"]
                            : ["#e5e7eb", "#cbd5e1"],
                        borderWidth: 0,
                    },
                ],
            },
            options: {
                plugins: {
                    legend: { position: "bottom" },
                    title: {
                        display: !hasData,
                        text: hasData ? "" : "ไม่มีข้อมูลการตรวจสอบ",
                        color: "#9ca3af",
                        font: { size: 14 },
                    },
                },
            },
        });
    }

    // ✅ กิจกรรมล่าสุด
    const activityList = [
        ...db.farmers.slice(-2).map(f => ({
            icon: "👩‍🌾",
            text: `เพิ่มเกษตรกร ${f.Name ?? ""} ${f.SurName ?? ""}`,
            time: f.CreatedAt ?? new Date().toLocaleString("th-TH"),
        })),
        ...db.referenceLayers.slice(-2).map(r => ({
            icon: "📍",
            text: `เพิ่มพื้นที่อ้างอิง ${r.layerName ?? ""}`,
            time: new Date().toLocaleString("th-TH"),
        })),
    ];

    const listEl = document.getElementById("dash-activity");
    listEl.innerHTML = activityList.length
        ? activityList
            .map(
                a => `
      <li class="py-2 flex items-start justify-between">
        <span>${a.icon} ${a.text}</span>
        <span class="text-xs text-slate-400">${a.time}</span>
      </li>`
            )
            .join("")
        : `<li class="text-slate-400 py-2">ยังไม่มีข้อมูล</li>`;

    // ✅ โหลดข้อมูลพื้นที่อ้างอิง
    await renderAreaSummary(db);
}

// ✅ โหลดและแสดงข้อมูลพื้นที่
export async function renderAreaSummary(db) {
    const areaListEl = document.getElementById("area-list");
    console.log("🧭 referenceLayers ที่โหลดได้:", db.referenceLayers);

    if (!db.referenceLayers || db.referenceLayers.length === 0) {
        document.getElementById("area-total").textContent = 0;
        document.getElementById("area-hectare").textContent = "0 ha";
        document.getElementById("area-avg").textContent = "0 ha";
        areaListEl.innerHTML = `<li class="py-2 text-slate-400">ยังไม่มีข้อมูลพื้นที่</li>`;
        return;
    }

    let countPoly = 0,
        countLine = 0,
        countPoint = 0,
        totalArea = 0;

    function polygonArea(coords) {
        if (!Array.isArray(coords)) return 0;
        let area = 0;
        for (let i = 0; i < coords.length - 1; i++) {
            const [lng1, lat1] = coords[i];
            const [lng2, lat2] = coords[i + 1];
            area += lng1 * lat2 - lng2 * lat1;
        }
        return Math.abs(area / 2);
    }

    for (const ref of db.referenceLayers) {
        const geom = ref.geometry;
        if (!geom) continue;
        if (geom.type === "Polygon") {
            countPoly++;
            totalArea += polygonArea(geom.coordinates[0]);
        } else if (geom.type === "LineString") countLine++;
        else if (geom.type === "Point") countPoint++;
    }

    const hectare = (totalArea * 12365.16).toFixed(2);
    const avg = countPoly ? (hectare / countPoly).toFixed(2) : 0;

    document.getElementById("area-total").textContent =
        db.referenceLayers.length;
    document.getElementById("area-hectare").textContent = `${hectare} ha`;
    document.getElementById("area-avg").textContent = `${avg} ha`;

    const chartEl = document.getElementById("area-chart");
    if (chartEl) {
        new Chart(chartEl, {
            type: "bar",
            data: {
                labels: ["Polygon", "Polyline", "Point"],
                datasets: [
                    {
                        data: [countPoly, countLine, countPoint],
                        backgroundColor: ["#8b5cf6", "#f97316", "#10b981"],
                        borderRadius: 6,
                    },
                ],
            },
            options: {
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
            },
        });
    }

    areaListEl.innerHTML = db.referenceLayers
        .slice(-5)
        .reverse()
        .map(
            a => `
      <li class="py-2 flex items-start justify-between">
        <span>📍 ${a.layerName ?? "ไม่ทราบชื่อ"} 
          <span class="text-slate-400">(${a.geometry?.type ?? "?"})</span></span>
        <span class="text-xs text-slate-400">${new Date().toLocaleString(
                "th-TH"
            )}</span>
      </li>`
        )
        .join("");
}

// ✅ รันเมื่อโหลด DOM ครบ
window.addEventListener("DOMContentLoaded", () => init());
