import { getDB, saveDB } from './db.js';

export async function init() {
    console.log("📊 Plot page loaded");
    const db = await getDB();
    db.farmers ??= [];
    db.plots ??= [];

    const form = document.getElementById('form-plot');
    const sel = form.querySelector('select[name="farmerId"]');
    const coordContainer = document.getElementById('coordContainer');
    const pointContainer = document.getElementById('pointContainer');
    const addPointBtn = document.getElementById('addPoint');
    const pointsDiv = document.getElementById('points');

    // 🧑‍🌾 โหลดรายชื่อเกษตรกร
    sel.innerHTML = db.farmers.length
        ? db.farmers.map(f => `<option value="${f.FarmerID}">${f.FarmerID} – ${f.Name} ${f.SurName}</option>`).join('')
        : `<option disabled>❗ ไม่มีข้อมูลเกษตรกร</option>`;

    // 🔺 สลับการแสดง input พิกัด (Point / Polygon)
    form.querySelector('[name="geometryType"]').addEventListener('change', e => {
        const type = e.target.value;
        coordContainer.classList.toggle('hidden', type !== 'Polygon');
        pointContainer.classList.toggle('hidden', type !== 'Point');
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
        div.querySelector("button").addEventListener("click", () => div.remove());
        pointsDiv.appendChild(div);
    });

    // ------------------------------------------------------------
    // 📄 อัปโหลดเอกสารตรวจเช็ค
    // ------------------------------------------------------------
    const docInput = document.getElementById("docFileInput");
    const docPreview = document.getElementById("docPreview");
    let docFiles = [];

    docInput.addEventListener("change", e => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = ev => {
                // ✅ เก็บทั้งชื่อไฟล์, type และ URL (เฉพาะรูป)
                docFiles.push({
                    name: file.name,
                    type: file.type,
                    url: file.type.startsWith("image/") ? ev.target.result : null
                });
                renderDocPreview();
            };
            // อ่านเฉพาะรูปเป็น DataURL, ส่วนไฟล์อื่นไม่ต้อง
            if (file.type.startsWith("image/")) reader.readAsDataURL(file);
            else reader.onload();
        });
        e.target.value = ""; // reset เพื่อเลือกไฟล์ซ้ำได้
    });

    window.removeDocFile = i => {
        docFiles.splice(i, 1);
        renderDocPreview();
    };

    function renderDocPreview() {
        docPreview.innerHTML = "";

        docFiles.forEach((f, i) => {
            const div = document.createElement("div");
            div.className =
                "relative flex items-center justify-center border rounded-lg w-32 h-24 overflow-hidden bg-slate-50";

            // ✅ ถ้าเป็นภาพ ให้แสดง thumbnail
            if (f.url) {
                div.innerHTML = `
        <img src="${f.url}" alt="${f.name}" class="object-cover w-full h-full" />
        <button type="button"
          class="absolute top-0 right-0 bg-black/50 text-white text-xs px-1 rounded-bl"
          onclick="removeDocFile(${i})">✕</button>
      `;
            } else {
                // ✅ ถ้าไม่ใช่ภาพ เช่น PDF, Word, Excel → แสดง icon
                const ext = f.name.split('.').pop().toLowerCase();
                const icon =
                    ext === 'pdf' ? '📕' :
                        ['doc', 'docx'].includes(ext) ? '📘' :
                            ['xls', 'xlsx', 'csv'].includes(ext) ? '📗' :
                                '📄';
                div.innerHTML = `
        <div class="flex flex-col items-center justify-center text-center px-1 text-xs text-slate-600">
          <span class="text-2xl">${icon}</span>
          <span class="truncate w-full">${f.name}</span>
        </div>
        <button type="button"
          class="absolute top-0 right-0 bg-black/50 text-white text-xs px-1 rounded-bl"
          onclick="removeDocFile(${i})">✕</button>
      `;
            }

            docPreview.appendChild(div);
        });

        // ✅ กล่องเพิ่มไฟล์ใหม่
        const addBox = document.createElement("label");
        addBox.setAttribute("for", "docFileInput");
        addBox.className =
            "flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg w-32 h-24 cursor-pointer hover:bg-slate-50";
        addBox.textContent = "+";
        docPreview.appendChild(addBox);
    }


    // ------------------------------------------------------------
    // 🖼️ อัปโหลดรูปสวน
    // ------------------------------------------------------------
    const gardenInput = document.getElementById("gardenImagesInput");
    const gardenPreview = document.getElementById("gardenPreview");
    let gardenImages = [];

    gardenInput.addEventListener("change", e => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = ev => {
                gardenImages.push({ name: file.name, url: ev.target.result });
                renderGardenPreview();
            };
            reader.readAsDataURL(file);
        });
        e.target.value = "";
    });

    window.removeGardenImage = i => {
        gardenImages.splice(i, 1);
        renderGardenPreview();
    };

    function renderGardenPreview() {
        gardenPreview.innerHTML = "";
        gardenImages.forEach((img, i) => {
            const div = document.createElement("div");
            div.className = "relative w-32 h-24 rounded-lg overflow-hidden border";
            div.innerHTML = `
      <img src="${img.url}" class="object-cover w-full h-full" />
      <button type="button"
        class="absolute top-0 right-0 bg-black/50 text-white px-1 text-xs rounded-bl"
        onclick="removeGardenImage(${i})">✕</button>
    `;
            gardenPreview.appendChild(div);
        });

        // กล่อง + เพิ่มรูปใหม่
        const addBox = document.createElement("label");
        addBox.setAttribute("for", "gardenImagesInput");
        addBox.className =
            "flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg w-32 h-24 cursor-pointer hover:bg-slate-50";
        addBox.textContent = "+";
        gardenPreview.appendChild(addBox);
    }

    // ------------------------------------------------------------
    // 💾 เมื่อ submit
    // ------------------------------------------------------------
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
        const areaAcre = (totalWah * 4) / 4046.85642;

        // ✅ เก็บพิกัด (Point / Polygon)
        const geometryType = fd.get('geometryType');
        let coords = [];

        if (geometryType === 'Polygon') {
            for (let [key, val] of fd.entries()) {
                if (key.startsWith('lat_')) {
                    const index = key.split('_')[1];
                    const lat = val;
                    const lng = fd.get('lng_' + index);
                    if (lat && lng) coords.push({ lat: Number(lat), lng: Number(lng) });
                }
            }
        } else {
            const lat = fd.get('pointLat');
            const lng = fd.get('pointLng');
            if (lat && lng) coords.push({ lat: Number(lat), lng: Number(lng) });
        }

        // ✅ คำนวณเลขรัน PlotID (0,1,2,...)
        const nextPlotId =
            db.plots.length > 0
                ? Math.max(...db.plots.map(p => Number(p.PlotID))) + 1
                : 0;

        // ✅ เก็บสถานะ checkbox
        const statuses = {
            relegan: fd.get("status_relegan") === "on",
            humanRight: fd.get("status_human_right") === "on",
            transport: fd.get("status_transport") === "on",
            environment: fd.get("status_environment") === "on",
            tax: fd.get("status_tax") === "on"
        };

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
            GeometryType: geometryType,
            Coordinates: coords,
            IsOwnedBefore2020: fd.get('ownedBefore2020') === 'on',
            StatusFlags: statuses,
            DocFiles: docFiles.map(f => f.name),
            GardenImages: gardenImages.map(g => g.url)
        };

        db.plots.push(plot);
        saveDB(db);
        alert(`✅ บันทึก Plot ${plot.PlotID} แล้ว (≈ ${plot.AreaAcre} acre)`);

        form.reset();
        pointsDiv.innerHTML = '';
        gardenImages = [];
        docFiles = [];
        renderDocPreview();
        renderGardenPreview();
    });
}

// ------------------------------------------------------------
// ⚙️ Logic สำคัญภายใน
// ------------------------------------------------------------
//
// - โหลดรายชื่อเกษตรกรทั้งหมดจากฐานข้อมูล (db.farmers)
//   • ใช้เพื่อให้เลือก FarmerID ที่จะผูกกับ Plot ได้
//
// - สลับการแสดง input พิกัดตามประเภท Geometry (Point / Polygon)
//   • หากเลือก Point → ให้กรอกพิกัดเดียว (Lat/Lng)
//   • หากเลือก Polygon → สามารถกด “เพิ่มจุด (x,y)” ได้หลายจุด
//
// - ระบบอัปโหลดเอกสารตรวจเช็ค (File Upload)
//   • รองรับได้หลายชนิดไฟล์ เช่น PDF, Word, Excel, PNG, JPG
//   • หากเป็นไฟล์ภาพ → แสดง thumbnail ตัวอย่าง
//   • หากเป็นเอกสารทั่วไป → แสดงไอคอนแทน (📕, 📘, 📗, 📄)
//   • สามารถเพิ่มหลายไฟล์ได้ และลบออกได้ทีละรายการ
//
// - ระบบอัปโหลดรูปภาพสวน (Image Upload)
//   • รองรับการเลือกหลายรูปพร้อมกัน
//   • แสดง preview ของรูปทั้งหมด
//   • มีปุ่ม “✕” เพื่อลบรูปใดรูปหนึ่งออก
//   • มีช่อง “+” ให้เพิ่มรูปได้ตลอดเวลา
//
// - ตรวจสอบแปลงซ้ำ (Duplicate Check)
//   • ใช้ Composite Key: จังหวัด + อำเภอ + รหัสที่ดิน + ประเภทเอกสาร
//   • ป้องกันการเพิ่มข้อมูลซ้ำในระบบ
//
// - แปลงหน่วยพื้นที่จาก ไร่ / งาน / ตารางวา → เอเคอร์ (acre)
//   • 1 ไร่ = 400 ตารางวา
//   • 1 ตารางวา ≈ 4 ตารางเมตร
//   • 1 เอเคอร์ = 4046.85642 ตารางเมตร
//
// - เก็บพิกัดทั้งหมดที่ผู้ใช้ระบุ (lat, lng)
//   • Point → 1 จุด, Polygon → หลายจุด
//
// - จัดเก็บสถานะ checkbox (StatusFlags)
//   • เก็บเป็น Boolean 5 ค่า: relegan, humanRight, transport, environment, tax
//
// - สร้าง PlotID แบบเลขรันต่อเนื่อง (0, 1, 2, ...)
//   • ใช้ Math.max(...map()) + 1 เพื่อให้รันต่อจาก Plot ล่าสุด
//
// - สร้างอ็อบเจ็กต์ Plot ใหม่พร้อมข้อมูลครบถ้วน
//   • เก็บข้อมูลจังหวัด, อำเภอ, พื้นที่, พิกัด, สถานะ, ไฟล์เอกสาร, รูปภาพ
//
// - บันทึกข้อมูล Plot ลงฐานข้อมูล (db.plots) และ saveDB()
//   • บันทึกข้อมูลถาวรลง Local Storage
//
// - เคลียร์ฟอร์มหลังบันทึกสำเร็จ
//   • รีเซ็ตค่า input ทั้งหมด
//   • ล้าง preview ของเอกสารและรูปสวน
//
// ------------------------------------------------------------
