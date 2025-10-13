// === 🗺️ ตั้งค่า Map ===
const map = L.map('map').setView([13.75, 100.5], 6);
const base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// === Mockup Layers ===
const farmers = [
    { id: 'F001', name: 'สมชาย', lat: 14.076, lng: 100.608 },
    { id: 'F002', name: 'สุนีย์', lat: 13.902, lng: 100.531 },
    { id: 'F003', name: 'ประยุทธ', lat: 13.543, lng: 99.945 },
];

const plots = [
    { id: 'P001', name: 'แปลง A', coords: [[14.05, 100.55], [14.07, 100.58], [14.08, 100.53]] },
    { id: 'P002', name: 'แปลง B', coords: [[13.89, 100.49], [13.90, 100.53], [13.93, 100.51]] },
];

const validated = [
    { id: 'V001', name: 'ตรวจสอบแล้ว', coords: [[13.60, 99.90], [13.63, 99.93], [13.64, 99.87]] },
];

// === สร้าง Layer ===
const farmerLayer = L.layerGroup(farmers.map(f =>
    L.marker([f.lat, f.lng]).bindPopup(`👩‍🌾 <b>${f.name}</b> (${f.id})`)
));

const plotLayer = L.layerGroup(plots.map(p =>
    L.polygon(p.coords, { color: 'orange', weight: 2, fillOpacity: 0.3 })
        .bindPopup(`🗺️ <b>${p.name}</b> (${p.id})`)
));

const validLayer = L.layerGroup(validated.map(v =>
    L.polygon(v.coords, { color: 'blue', weight: 2, fillOpacity: 0.2 })
        .bindPopup(`✅ <b>${v.name}</b> (${v.id})`)
));

// === เพิ่มเข้า Map ===
farmerLayer.addTo(map);
plotLayer.addTo(map);
validLayer.addTo(map);

// === 🧩 Layer Control ===
const overlays = {
    "🟢 Farmers": farmerLayer,
    "🟡 Plots": plotLayer,
    "🔵 Validated": validLayer
};
L.control.layers({ "🌍 Base Map": base }, overlays, { collapsed: false }).addTo(map);

// === ✏️ Leaflet Draw (สำหรับวาด Layer ใหม่) ===
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
    edit: { featureGroup: drawnItems },
    draw: {
        polygon: { allowIntersection: false, showArea: true },
        circle: false,
        marker: true,
    }
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (e) {
    const layer = e.layer;
    drawnItems.addLayer(layer);
    layer.bindPopup(`📍 Feature ใหม่<br><small>${new Date().toLocaleString('th-TH')}</small>`);
});

// === 💾 Export GeoJSON ===
document.getElementById("exportBtn").addEventListener("click", () => {
    const all = {
        farmers: farmers,
        plots: plots,
        validated: validated,
        drawn: drawnItems.toGeoJSON()
    };
    const blob = new Blob([JSON.stringify(all, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "map_data.geojson";
    a.click();
    URL.revokeObjectURL(url);
});
