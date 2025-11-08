import { getDB, saveDB } from "./db.js";
import { saveDraft, loadDraft } from "./draft.js";

export async function init() {
  console.log("📥 Farmer page initialized");

  const db = await getDB();
  const form = document.getElementById("form-farmer");
  const provinceSelect = document.getElementById("provinceSelect");
  const districtSelect = document.getElementById("districtSelect");
  const importInput = document.getElementById("importFarmer");

  let currentFarmBooks = [];
  const draft = loadDraft();

  // ----------------------------
  // 📘 โหลดจังหวัด/อำเภอจาก DB
  // ----------------------------
  const provinces = db.provinces || [];
  const districts = db.districts || [];

  // เติมจังหวัดทั้งหมด
  provinceSelect.innerHTML = '<option value="">-- เลือกจังหวัด --</option>';
  provinces.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.ProvinceID;
    opt.textContent = p.NameTH;
    provinceSelect.appendChild(opt);
  });

  // เมื่อเลือกจังหวัด → โหลดอำเภอที่ตรงกับ ProvinceID
  provinceSelect.addEventListener("change", e => {
    const selectedProvinceId = Number(e.target.value);
    const filteredDistricts = districts.filter(d => d.ProvinceID === selectedProvinceId);

    districtSelect.innerHTML = '<option value="">-- เลือกอำเภอ --</option>';
    filteredDistricts.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.DistrictID;
      opt.textContent = d.NameTH;
      districtSelect.appendChild(opt);
    });

    districtSelect.disabled = filteredDistricts.length === 0;
  });

  // ----------------------------
  // ♻️ โหลด Draft ถ้ามี
  // ----------------------------
  if (draft.farmer) {
    console.log("🧩 โหลด draft เกษตรกร:", draft.farmer);

    // เติมค่าพื้นฐาน
    form.querySelector('[name="name"]').value = draft.farmer.Name || "";
    form.querySelector('[name="surname"]').value = draft.farmer.SurName || "";
    form.querySelector('[name="citizenId"]').value = draft.farmer.CitizenID || "";
    form.querySelector('[name="phone"]').value = draft.farmer.Phone || "";
    form.querySelector('[name="address"]').value = draft.farmer.Address || "";

    // โหลดจังหวัด + อำเภอจาก draft
    provinceSelect.value = draft.farmer.ProvinceID || "";
    const filteredDistricts = districts.filter(
      d => String(d.ProvinceID) === String(draft.farmer.ProvinceID)
    );
    districtSelect.innerHTML = '<option value="">-- เลือกอำเภอ --</option>';
    filteredDistricts.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.DistrictID;
      opt.textContent = d.NameTH;
      districtSelect.appendChild(opt);
    });
    districtSelect.value = draft.farmer.DistrictID || "";

    // โหลด FarmBooks
    currentFarmBooks = draft.farmer.FarmBooks || [];

    // แสดง Notice ด้านบน
    const notice = document.createElement("div");
    notice.className =
      "bg-yellow-50 border border-yellow-300 text-yellow-700 rounded-md p-2 mb-3 text-sm";
    notice.innerHTML = `
      ⚠️ โหลดข้อมูลเกษตรกรที่ยังไม่ได้บันทึกไว้แล้ว<br/>
      จังหวัด: <b>${draft.farmer.ProvinceName || "-"}</b> |
      อำเภอ: <b>${draft.farmer.DistrictName || "-"}</b>
    `;
    form.prepend(notice);
  }

  // ----------------------------
  // 📘 จัดการ FarmBook
  // ----------------------------
  const farmbookList = document.getElementById("farmbook-list");
  const addFarmBookBtn = document.getElementById("addFarmBookBtn");
  const farmbookType = document.getElementById("farmbookType");
  const farmbookNumber = document.getElementById("farmbookNumber");

  const renderFarmBooks = () => {
    farmbookList.innerHTML = "";
    if (currentFarmBooks.length === 0) {
      farmbookList.innerHTML =
        '<li class="text-slate-400 italic">ยังไม่มีรายการ Farm Book</li>';
      return;
    }
    currentFarmBooks.forEach(b => {
      const li = document.createElement("li");
      li.className = "flex justify-between items-center border-b py-1";
      li.innerHTML = `
        <span>📗 ${b.Type} — <b>${b.Number}</b></span>
        <button class="text-xs text-red-500 hover:underline" data-id="${b.FarmBookID}">ลบ</button>
      `;
      farmbookList.appendChild(li);
    });
  };
  renderFarmBooks();

  addFarmBookBtn?.addEventListener("click", e => {
    e.preventDefault();
    const type = farmbookType.value;
    const number = farmbookNumber.value.trim() || "ไม่มี";

    if (!type) {
      alert("⚠️ กรุณาเลือกประเภท Farm Book");
      return;
    }

    const newBook = {
      FarmBookID: "FB" + String(currentFarmBooks.length + 1).padStart(4, "0"),
      Type: type,
      Number: number,
    };
    currentFarmBooks.push(newBook);
    renderFarmBooks();
    farmbookType.value = "";
    farmbookNumber.value = "";
  });

  farmbookList?.addEventListener("click", e => {
    if (e.target.matches("button[data-id]")) {
      const id = e.target.dataset.id;
      currentFarmBooks = currentFarmBooks.filter(b => b.FarmBookID !== id);
      renderFarmBooks();
    }
  });

  // ----------------------------
  // 📂 Import ข้อมูลเกษตรกร
  // ----------------------------
  importInput?.addEventListener("change", async e => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const imported = JSON.parse(text);
      db.farmers.push(...imported);
      saveDB(db);
      alert(`✅ นำเข้าเกษตรกรจำนวน ${imported.length} ราย`);
    } catch (err) {
      alert("🚫 ไฟล์ไม่ถูกต้อง");
    }
  });

  // ----------------------------
  // 💾 บันทึก Draft แล้วไปหน้า Plot
  // ----------------------------
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const fd = new FormData(form);

    const provinceId = fd.get("province");
    const districtId = fd.get("district");
    const provinceObj = db.provinces.find(p => String(p.ProvinceID) === String(provinceId));
    const districtObj = db.districts.find(d => String(d.DistrictID) === String(districtId));

    const farmer = {
      Name: fd.get("name"),
      SurName: fd.get("surname"),
      CitizenID: fd.get("citizenId"),
      Phone: fd.get("phone"),
      ProvinceID: provinceId,
      ProvinceName: provinceObj ? provinceObj.NameTH : "",
      DistrictID: districtId,
      DistrictName: districtObj ? districtObj.NameTH : "",
      Address: fd.get("address"),
      FarmBooks: currentFarmBooks
    };

    saveDraft("farmer", farmer);
    alert("✅ เก็บข้อมูลเกษตรกรไว้ชั่วคราวแล้ว (ยังไม่บันทึกจริง)");

    // 🔄 ไปหน้า plot ต่อ (ใช้ระบบ multi-step)
    if (window.loadStep && window.DB) {
      await window.loadStep("plot", window.DB, document.getElementById("insert-content"));
    }
  });
}


// ------------------------------------------------------------
// ⚙️ Logic สำคัญภายใน
// ------------------------------------------------------------
//
// - โหลดฐานข้อมูล (getDB) เพื่อเตรียมใช้งานข้อมูลเกษตรกร, สมุดเกษตร (FarmBook) และจังหวัด/อำเภอ
//
// - แสดงรายชื่อจังหวัดและอำเภอแบบ Dynamic:
//   เมื่อผู้ใช้เลือกจังหวัด จะกรองและแสดงเฉพาะอำเภอที่อยู่ในจังหวัดนั้น
//
// - จัดการ FarmBook ภายในเกษตรกร:
//   • สามารถเพิ่ม FarmBook ชั่วคราวได้หลายเล่มก่อนบันทึกจริง
//   • สามารถลบ FarmBook ทีละเล่มได้จากรายการ
//   • FarmBook แต่ละเล่มจะเก็บ Type และ Number (ประเภท/หมายเลข)
//
// - ตรวจสอบเลขบัตรประชาชน:
//   • ตรวจสอบว่ากรอกครบ 13 หลักด้วย regex (`/^\d{13}$/`)
//   • (สามารถเพิ่มการเช็คซ้ำ CitizenID ก่อนบันทึกได้ในอนาคต เพื่อกันข้อมูลซ้ำ)
//
// - สร้าง FarmerID แบบเลขรันต่อเนื่อง (0, 1, 2, ...):
//   • ใช้ Math.max(...map()) + 1 เพื่อหาค่า ID ล่าสุดในฐานข้อมูล
//   • ป้องกันเลขซ้ำแม้มีการลบเกษตรกรบางรายออก
//
// - สร้างอ็อบเจ็กต์ Farmer ใหม่:
//   • รวมข้อมูลจากฟอร์ม เช่น ชื่อ, นามสกุล, เบอร์โทร, จังหวัด, อำเภอ
//   • แนบรายการ FarmBook ที่เพิ่งเพิ่มเข้าไป
//
// - บันทึกความสัมพันธ์ Farmer ↔ FarmBook:
//   • แต่ละ FarmBook จะผูกกับ FarmerID ของเจ้าของโดยตรง
//   • ใช้เพื่อให้แสดงข้อมูลย้อนกลับได้ว่า FarmBook นี้เป็นของเกษตรกรคนไหน
//
// - บันทึกข้อมูลลงฐานข้อมูล (saveDB):
//   • เก็บข้อมูลทั้งหมดไว้ใน Local Storage ผ่าน saveDB()
//   • หลังบันทึกเสร็จจะแสดง alert แจ้งผลสำเร็จ และรีเซ็ตฟอร์ม/ลิสต์ FarmBook
//
// ------------------------------------------------------------
