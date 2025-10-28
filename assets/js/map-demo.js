import { getDB, saveDB } from "./db.js";

// ==============================
// 🗺️ ตั้งค่าแผนที่พื้นฐาน
// ==============================
const map = L.map("map").setView([13.75, 100.5], 6);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
}).addTo(map);

// ==============================
// 👩‍🌾 Mock ข้อมูลเกษตรกร
// ==============================
const farmers = [
    { id: "F001", name: "สมชาย", lat: 14.076, lng: 100.608 },
    { id: "F002", name: "สุนีย์", lat: 13.902, lng: 100.531 },
];
L.layerGroup(
    farmers.map((f) =>
        L.marker([f.lat, f.lng]).bindPopup(`👩‍🌾 <b>${f.name}</b> (${f.id})`)
    )
).addTo(map);

// ==============================
// 📦 กลุ่มเก็บทุกฟีเจอร์ที่วาด
// ==============================
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// ==============================
// 💾 ปุ่ม Export GeoJSON
// ==============================
document.getElementById("exportBtn").addEventListener("click", () => {
    const data = drawnItems.toGeoJSON();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "map_data.geojson";
    a.click();
    URL.revokeObjectURL(a.href);
});

// ==============================
// ✏️ ส่วนเพิ่มเลเยอร์อ้างอิง (Manual Reference Layer)
// ==============================
const manualLayers = [];
const refList = document.getElementById("ref-list");
let activeDrawCtrl = null;
let activeHint = null;

// ฟังก์ชันโหลดข้อมูล referenceLayers จาก db.json
async function loadReferenceLayers() {
    try {
        const db = await getDB();
        if (!db.referenceLayers || db.referenceLayers.length === 0) {
            console.log("ℹ️ No reference layers found in DB.");
            return;
        }

        db.referenceLayers.forEach((ref) => {
            const { layerId, layerName, geometry, color = "#8b5cf6" } = ref;
            let layer = null;

            if (geometry.type === "Point") {
                const [lng, lat] = geometry.coordinates;
                layer = L.marker([lat, lng]);
            } else if (geometry.type === "Polygon") {
                const coords = geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
                layer = L.polygon(coords, { color });
            } else if (geometry.type === "LineString" || geometry.type === "Polyline") {
                const coords = geometry.coordinates.map(([lng, lat]) => [lat, lng]);
                layer = L.polyline(coords, { color });
            }

            if (layer) {
                const group = new L.FeatureGroup([layer]);
                map.addLayer(group);
                drawnItems.addLayer(layer);
                layer.bindPopup(
                    `🟣 <b>${layerName}</b><br><small>📁 Loaded from DB</small>`
                );

                manualLayers.push({ id: layerId, name: layerName, color, group });
            }
        });

        updateList();
        console.log("✅ Reference layers loaded from DB.");
    } catch (err) {
        console.error("❌ Failed to load referenceLayers:", err);
    }
}

// โหลดข้อมูล referenceLayers ทันทีเมื่อหน้าเว็บเปิด
loadReferenceLayers();

// ฟังก์ชันเมื่อกด "เพิ่มเลเยอร์ใหม่"
document.getElementById("addRefBtn").addEventListener("click", () => {
    const name = document.getElementById("refName").value.trim();
    const color = document.getElementById("refColor").value;

    if (!name) return alert("⚠️ กรุณากรอกชื่อพื้นที่ก่อนวาด");

    // ปิด DrawControl และ Hint เดิม (ถ้ามี)
    if (activeDrawCtrl) map.removeControl(activeDrawCtrl);
    if (activeHint) map.removeControl(activeHint);
    activeDrawCtrl = null;
    activeHint = null;

    // กลุ่มใหม่สำหรับพื้นที่นี้
    const newGroup = new L.FeatureGroup();
    map.addLayer(newGroup);

    // เพิ่มข้อความช่วยด้านบนขวา
    activeHint = L.control({ position: "topright" });
    activeHint.onAdd = function () {
        const div = L.DomUtil.create(
            "div",
            "bg-indigo-600 text-white text-sm px-3 py-1 rounded shadow-md"
        );
        div.innerHTML = `✏️ <b>โหมดวาดพื้นที่:</b> ${name} <span style="color:${color}">●</span>`;
        return div;
    };
    activeHint.addTo(map);

    // สร้าง DrawControl
    const drawCtrl = new L.Control.Draw({
        edit: { featureGroup: newGroup },
        draw: {
            polygon: { shapeOptions: { color } },
            polyline: { shapeOptions: { color } },
            rectangle: { shapeOptions: { color } },
            circle: false,
            marker: { icon: new L.Icon.Default() },
        },
    });
    map.addControl(drawCtrl);
    activeDrawCtrl = drawCtrl;

    // เมื่อวาดเสร็จ
    map.once(L.Draw.Event.CREATED, async (ev) => {
        const layer = ev.layer;
        newGroup.addLayer(layer);
        drawnItems.addLayer(layer);

        layer.bindPopup(
            `🟣 <b>${name}</b><br><small>${new Date().toLocaleString("th-TH")}</small>`
        );

        // ✅ สร้างข้อมูล Reference Layer
        const geojson = layer.toGeoJSON().geometry;
        const layerId = `layer_${Date.now()}`;
        const newRef = {
            layerId,
            layerName: name,
            geometry: geojson,
            color,
        };

        // ✅ บันทึกลงฐานข้อมูล
        const db = await getDB();
        if (!db.referenceLayers) db.referenceLayers = [];
        db.referenceLayers.push(newRef);
        await saveDB(db);
        console.log("✅ Saved to DB:", newRef);

        manualLayers.push({ id: layerId, name, color, group: newGroup });
        updateList();

        // ปิด toolbar
        map.removeControl(activeDrawCtrl);
        map.removeControl(activeHint);
        activeDrawCtrl = null;
        activeHint = null;

        alert(`✅ เพิ่มพื้นที่ "${name}" สำเร็จและบันทึกลงฐานข้อมูลแล้ว!`);
    });
});

// ==============================
// 📋 แสดงรายการเลเยอร์
// ==============================
function updateList() {
    refList.innerHTML = "";
    manualLayers.forEach((l, i) => {
        const layers = Object.values(l.group._layers);
        let coordText = "–";
        let geomType = "Unknown";
        let targetLayer = null;

        if (layers.length > 0) {
            const layer = layers[0];
            targetLayer = layer;
            if (layer instanceof L.Marker) geomType = "Point";
            else if (layer instanceof L.Polygon) geomType = "Polygon";
            else if (layer instanceof L.Polyline) geomType = "Polyline";

            if (layer.getLatLng) {
                const { lat, lng } = layer.getLatLng();
                coordText = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            } else if (layer.getLatLngs) {
                const latlngs = layer.getLatLngs().flat(2);
                if (latlngs.length > 0) {
                    const avgLat =
                        latlngs.reduce((sum, p) => sum + p.lat, 0) / latlngs.length;
                    const avgLng =
                        latlngs.reduce((sum, p) => sum + p.lng, 0) / latlngs.length;
                    coordText = `${avgLat.toFixed(4)}, ${avgLng.toFixed(4)}`;
                }
            }
        }

        // ✅ สร้าง element แสดงรายการ
        const div = document.createElement("div");
        div.className =
            "border-b border-slate-100 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2";

        div.innerHTML = `
      <div class="flex-1">
        <span>🟣 ${l.name}</span><br>
        <span class="text-xs text-slate-500">📍 ${geomType} — ${coordText}</span>
      </div>
      <div class="flex gap-2">
        <button class="focus-btn text-xs text-blue-600 hover:underline">โฟกัส</button>
        <button class="delete-btn text-xs text-red-500 hover:underline">ลบ</button>
      </div>
    `;

        // 🎯 ปุ่ม “โฟกัส” → ซูมไปที่เลเยอร์นั้น
        div.querySelector(".focus-btn").addEventListener("click", () => {
            if (!targetLayer) return;
            try {
                if (targetLayer.getBounds) {
                    map.fitBounds(targetLayer.getBounds(), { maxZoom: 16, padding: [20, 20] });
                } else if (targetLayer.getLatLng) {
                    map.setView(targetLayer.getLatLng(), 16);
                }
                targetLayer.openPopup();
            } catch (e) {
                console.warn("Cannot focus layer:", e);
            }
        });

        // 🗑️ ปุ่ม “ลบ”
        div.querySelector(".delete-btn").addEventListener("click", async () => {
            map.removeLayer(l.group);
            manualLayers.splice(i, 1);
            updateList();

            // ลบจากฐานข้อมูล
            const db = await getDB();
            db.referenceLayers = db.referenceLayers.filter(
                (r) => r.layerId !== l.id
            );
            await saveDB(db);
            console.log(`🗑️ Deleted layer ${l.name} from DB`);
        });

        refList.appendChild(div);
    });

    if (manualLayers.length === 0)
        refList.innerHTML =
            "<p class='text-slate-400 italic text-center'>ยังไม่มีเลเยอร์อ้างอิง</p>";
}

