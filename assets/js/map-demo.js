import { getDB, saveDB } from "./db.js";

// ==============================
// 🗺️ 1) ตั้งค่า Base Maps แบบ QGIS
// ==============================

// OSM Standard (เดิม)
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
});

// ESRI World Imagery (Satellite)
const esri = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}",
    {
        attribution: "Tiles © Esri",
        maxZoom: 19,
    }
);

// ESRI Terrain (แผนที่ภูมิประเทศ)
const terrain = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{x}/{y}",
    { attribution: "© Esri Topo" }
);

// ==============================
// 🗺️ 2) สร้างแผนที่ + Base Map เริ่มต้น
// ==============================
const map = L.map("map", {
    center: [13.75, 100.5],
    zoom: 6,
    layers: [esri], // ⭐ เริ่มต้นเป็นภาพดาวเทียม เพื่อให้รายละเอียดสูง
});

// ==============================
// 🌳 3) Forest Reserve Layer (WMS จากกรมป่าไม้)
// ==============================
const forestWMS = L.tileLayer.wms("https://rfdgis.forest.go.th/geoserver/wms?", {
    layers: "rfd:ReservedForest",
    format: "image/png",
    transparent: true,
    opacity: 0.45,
    zIndex: 5000,
});

// ==============================
// 📦 4) Layer Control (เลือกชั้นเหมือน QGIS)
// ==============================
const baseLayers = {
    "🟦 OSM Standard": osm,
    "🛰️ ESRI Satellite (แนะนำ)": esri,
    "⛰️ ESRI Terrain": terrain,
};

const overlayLayers = {
    "🌳 Forest Reserve (กรมป่าไม้)": forestWMS,
};

L.control.layers(baseLayers, overlayLayers, { collapsed: false }).addTo(map);

// ==============================
// 👩‍🌾 5) Mock ข้อมูลเกษตรกร
// ==============================
const farmers = [
    { id: "F001", name: "สมชาย", lat: 14.076, lng: 100.608 },
    { id: "F002", name: "สุนีย์", lat: 13.902, lng: 100.531 },
];

const farmerLayer = L.layerGroup(
    farmers.map((f) =>
        L.marker([f.lat, f.lng])
            .bindPopup(`👩‍🌾 <b>${f.name}</b><br>ID: ${f.id}`)
    )
).addTo(map);
farmerLayer.setZIndex(10000); // ⭐ marker อยู่เหนือ polygon ทั้งหมด

// ==============================
// 📦 6) กลุ่มฟีเจอร์ที่ผู้ใช้วาด
// ==============================
const drawnItems = new L.FeatureGroup();
drawnItems.setZIndex(6000); // ⭐ อยู่เหนือ WMS
map.addLayer(drawnItems);

// ==============================
// 💾 7) Export GeoJSON
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
// ✏️ 8) Manual Reference Layers (แก้ให้รองรับ QGIS Stack)
// ==============================
const manualLayers = [];
const refList = document.getElementById("ref-list");
let activeDrawCtrl = null;
let activeHint = null;

// โหลดจาก DB
async function loadReferenceLayers() {
    try {
        const db = await getDB();
        if (!db.referenceLayers) return;

        db.referenceLayers.forEach((ref) => {
            const { layerId, layerName, geometry, color = "#8b5cf6" } = ref;
            let layer = null;

            if (geometry.type === "Point") {
                const [lng, lat] = geometry.coordinates;
                layer = L.marker([lat, lng]);
            } else if (geometry.type === "Polygon") {
                const coords = geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
                layer = L.polygon(coords, { color, weight: 2, fillOpacity: 0.25 });
            } else if (geometry.type === "LineString") {
                const coords = geometry.coordinates.map(([lng, lat]) => [lat, lng]);
                layer = L.polyline(coords, { color, weight: 3 });
            }

            if (layer) {
                const group = new L.FeatureGroup([layer]);
                group.setZIndex(8000); // ⭐ อยู่เหนือ WMS + drawnItems
                map.addLayer(group);
                drawnItems.addLayer(layer);

                layer.bindPopup(
                    `🟣 <b>${layerName}</b><br><small>📁 Loaded from DB</small>`
                );

                manualLayers.push({ id: layerId, name: layerName, color, group });
            }
        });

        updateList();
        console.log("Reference layers loaded.");
    } catch (err) {
        console.error("Load error:", err);
    }
}

loadReferenceLayers();

// ==============================
// ➕ เพิ่มเลเยอร์ใหม่ (ปรับระบบให้เป็น QGIS-style)
// ==============================
document.getElementById("addRefBtn").addEventListener("click", () => {
    const name = document.getElementById("refName").value.trim();
    const color = document.getElementById("refColor").value;

    if (!name) return alert("⚠️ กรุณากรอกชื่อพื้นที่ก่อนวาด");

    if (activeDrawCtrl) map.removeControl(activeDrawCtrl);
    if (activeHint) map.removeControl(activeHint);

    const newGroup = new L.FeatureGroup();
    newGroup.setZIndex(8000);
    map.addLayer(newGroup);

    // Hint box
    activeHint = L.control({ position: "topright" });
    activeHint.onAdd = () => {
        const div = L.DomUtil.create("div", "bg-indigo-600 text-white px-3 py-1 rounded shadow-md");
        div.innerHTML = `✏️ <b>โหมดวาด:</b> ${name} <span style="color:${color}">●</span>`;
        return div;
    };
    activeHint.addTo(map);

    // DrawControl
    const drawCtrl = new L.Control.Draw({
        edit: { featureGroup: newGroup },
        draw: {
            polygon: { shapeOptions: { color, fillOpacity: 0.25 } },
            polyline: { shapeOptions: { color, weight: 3 } },
            rectangle: { shapeOptions: { color, fillOpacity: 0.25 } },
            circle: false,
            marker: { icon: new L.Icon.Default() },
        },
    });
    map.addControl(drawCtrl);
    activeDrawCtrl = drawCtrl;

    map.once(L.Draw.Event.CREATED, async (ev) => {
        const layer = ev.layer;
        newGroup.addLayer(layer);
        drawnItems.addLayer(layer);

        layer.bindPopup(`🟣 <b>${name}</b>`);
        const geojson = layer.toGeoJSON().geometry;

        // save
        const db = await getDB();
        if (!db.referenceLayers) db.referenceLayers = [];
        const newRef = { layerId: "layer_" + Date.now(), layerName: name, geometry: geojson, color };
        db.referenceLayers.push(newRef);
        await saveDB(db);

        manualLayers.push({ id: newRef.layerId, name, color, group: newGroup });
        updateList();

        map.removeControl(activeDrawCtrl);
        map.removeControl(activeHint);
        activeDrawCtrl = null;
        activeHint = null;

        alert(`✅ เพิ่มเลเยอร์ "${name}" สำเร็จ!`);
    });
});

// ==============================
// 📝 9) รายการเลเยอร์
// ==============================
function updateList() {
    refList.innerHTML = "";
    if (manualLayers.length === 0) {
        refList.innerHTML = "<p class='text-slate-400 italic text-center'>ยังไม่มีเลเยอร์อ้างอิง</p>";
        return;
    }

    manualLayers.forEach((l, i) => {
        const layers = Object.values(l.group._layers);
        const layer = layers[0];

        let geomType = layer instanceof L.Marker ? "Point" :
            layer instanceof L.Polygon ? "Polygon" :
                "Polyline";

        // center
        let coordText = "–";
        if (layer.getBounds) {
            const c = layer.getBounds().getCenter();
            coordText = `${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}`;
        }

        const div = document.createElement("div");
        div.className = "border-b py-2 flex justify-between items-center";

        div.innerHTML = `
            <div><b>${l.name}</b><br>
            <small>${geomType} @ ${coordText}</small></div>

            <div class="flex gap-2">
                <button class="focus-btn text-blue-600 text-xs">โฟกัส</button>
                <button class="delete-btn text-red-500 text-xs">ลบ</button>
            </div>
        `;

        // Focus
        div.querySelector(".focus-btn").addEventListener("click", () => {
            if (layer.getBounds) map.fitBounds(layer.getBounds(), { maxZoom: 16 });
            else if (layer.getLatLng) map.setView(layer.getLatLng(), 16);
            layer.openPopup();
        });

        // Delete
        div.querySelector(".delete-btn").addEventListener("click", async () => {
            map.removeLayer(l.group);
            manualLayers.splice(i, 1);

            const db = await getDB();
            db.referenceLayers = db.referenceLayers.filter(r => r.layerId !== l.id);
            await saveDB(db);

            updateList();
        });

        refList.appendChild(div);
    });
}
