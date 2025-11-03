import { getDB, saveDB } from './db.js';

export async function init() {
    console.log("📊 Plot page loaded");
    const db = await getDB();
    db.farmers ??= [];
    db.plots ??= [];

    const form = document.getElementById('form-plot');
    const sel = form.querySelector('select[name="farmerId"]');
    const coordContainer = document.getElementById('coordContainer');
    const addPointBtn = document.getElementById('addPoint');
    const pointsDiv = document.getElementById('points');

    // 🧑‍🌾 โหลดรายชื่อเกษตรกร
    sel.innerHTML = db.farmers.length
        ? db.farmers.map(f => `<option value="${f.FarmerID}">${f.FarmerID} – ${f.Name} ${f.SurName}</option>`).join('')
        : `<option disabled>❗ ไม่มีข้อมูลเกษตรกร</option>`;

    // 🔺 สลับการแสดง input พิกัด (Polygon)
    form.querySelector('[name="geometryType"]').addEventListener('change', e => {
        coordContainer.classList.toggle('hidden', e.target.value !== 'Polygon');
    });

    // ➕ เพิ่มจุดพิกัด (ใช้กับ Polygon)
    addPointBtn.addEventListener('click', () => {
        const i = pointsDiv.children.length + 1;
        const div = document.createElement("div");
        div.className = "grid grid-cols-2 gap-2 items-center";
        div.innerHTML = `
    <input name="lat_${i}" placeholder="Lat" class="border p-2 rounded-lg" />
    <input name="lng_${i}" placeholder="Lng" class="border p-2 rounded-lg" />
    <button type="button" class="text-red-500 text-sm hover:underline col-span-2 text-right">ลบจุดนี้</button>
  `;
        // ✅ เพิ่ม Event ลบจุดเมื่อคลิกปุ่ม
        div.querySelector("button").addEventListener("click", () => {
            div.remove();
        });
        pointsDiv.appendChild(div);
    });


    // 💾 เมื่อ submit
    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);

        // ✅ ตรวจ duplicate (Composite Key)
        const province = fd.get('province');
        const district = fd.get('district');
        const landCode = fd.get('landCode');
        const deed = fd.get('deed');

        const duplicate = db.plots.find(p =>
            p.Province === province &&
            p.District === district &&
            p.LandCode === landCode &&
            p.DeedType === deed
        );

        if (duplicate) {
            alert("❌ แปลงนี้มีอยู่แล้วในระบบ (จังหวัด/อำเภอ/รหัสที่ดิน/ประเภทที่ดิน ซ้ำ)");
            return;
        }

        // ✅ แปลงหน่วยไร่-งาน-วา → เอเคอร์
        const rai = Number(fd.get('rai') || 0);
        const ngan = Number(fd.get('ngan') || 0);
        const wah = Number(fd.get('wah') || 0);
        const totalWah = (rai * 400) + (ngan * 100) + wah;
        const areaAcre = (totalWah * 4) / 4046.85642; // 1 ตร.วา = 4 ตร.ม., 1 acre = 4046.85642 ตร.ม.

        // ✅ เก็บพิกัดทั้งหมด
        const coords = [];
        for (let [key, val] of fd.entries()) {
            if (key.startsWith('lat_')) {
                const index = key.split('_')[1];
                const lat = val;
                const lng = fd.get('lng_' + index);
                if (lat && lng) coords.push({ lat: Number(lat), lng: Number(lng) });
            }
        }

        // ✅ คำนวณเลขรัน PlotID (0,1,2,...)
        const nextPlotId =
            db.plots.length > 0
                ? Math.max(...db.plots.map(p => Number(p.PlotID))) + 1
                : 0;

        // ✅ สร้าง Plot ใหม่
        const plot = {
            PlotID: String(nextPlotId),
            FarmerID: fd.get('farmerId'),
            LandCode: landCode,
            Province: province,
            District: district,
            DeedType: deed,
            Area: { rai, ngan, wah },
            AreaAcre: Number(areaAcre.toFixed(4)),
            GeometryType: fd.get('geometryType'),
            Coordinates: coords,
            IsOwnedBefore2020: fd.get('ownedBefore2020') === 'on'
        };

        db.plots.push(plot);
        saveDB(db);
        alert(`✅ บันทึก Plot ${plot.PlotID} แล้ว (≈ ${plot.AreaAcre} acre)`);

        form.reset();
        pointsDiv.innerHTML = '';
    });
}

// ------------------------------------------------------------
// ⚙️ Logic สำคัญภายใน
// ------------------------------------------------------------
//
// - โหลดข้อมูลเกษตรกรทั้งหมดจากฐานข้อมูล (db.farmers)
//   • ใช้เพื่อให้เลือก FarmerID ที่จะผูกกับ Plot ได้
//
// - สลับการแสดง input พิกัดตามประเภท Geometry (Point / Polygon)
//   • หากเลือก Polygon จะสามารถกดปุ่ม “เพิ่มจุด (x,y)” เพื่อระบุพิกัดหลายจุดได้
//
// - ตรวจสอบแปลงซ้ำ (Duplicate Check)
//   • ใช้ Composite Key: จังหวัด + อำเภอ + รหัสที่ดิน + ประเภทที่ดิน
//   • ป้องกันการเพิ่มแปลงที่อยู่ในพื้นที่เดียวกันซ้ำในระบบ
//
// - แปลงหน่วยพื้นที่จาก ไร่/งาน/วา → เอเคอร์ (acre)
//   • 1 ไร่ = 0.395369 acre โดยคำนวณผ่านพื้นที่ตารางวา
//
// - สร้าง PlotID แบบเลขรันต่อเนื่อง (0,1,2,...)
//   • ใช้ Math.max(...map()) + 1 เพื่อกันเลขซ้ำหากมีการลบข้อมูลเก่าออก
//
// - เก็บพิกัดทั้งหมดที่ผู้ใช้ระบุ (lat, lng)
//   • เก็บเป็น Array ของจุดสำหรับ Polygon หรือจุดเดียวในกรณี Point
//
// - สร้างอ็อบเจ็กต์ Plot ใหม่พร้อมข้อมูลครบถ้วน
//   • เก็บข้อมูลจังหวัด, อำเภอ, พื้นที่, พิกัด และความเป็นเจ้าของก่อนปี 2020
//
// - บันทึกข้อมูล Plot ลงฐานข้อมูล (db.plots) และ saveDB()
//   • เก็บข้อมูลถาวรใน Local Storage และรีเซ็ตฟอร์มหลังบันทึกสำเร็จ
//
// ------------------------------------------------------------
