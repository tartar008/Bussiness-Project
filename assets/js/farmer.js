import { getDB, saveDB } from "./db.js";

export async function init() {
  console.log("📥 Farmer page initialized");

  const db = await getDB(); // ✅ รอโหลด DB ก่อน
  const form = document.getElementById("form-farmer");
  const provinceSelect = document.getElementById("provinceSelect");
  const districtSelect = document.getElementById("districtSelect");

  // ----------------------------
  // 📍 โหลดข้อมูลจังหวัด/อำเภอ
  // ----------------------------
  try {
    const provincesData = db.provinces || [];

    provincesData.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.name_th;
      opt.textContent = p.name_th;
      provinceSelect.appendChild(opt);
    });

    provinceSelect.addEventListener("change", e => {
      const selected = provincesData.find(p => p.name_th === e.target.value);
      districtSelect.innerHTML = '<option value="">-- เลือกอำเภอ --</option>';
      selected?.districts.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        districtSelect.appendChild(opt);
      });
      districtSelect.disabled = !selected;
    });
  } catch (err) {
    console.error("❌ โหลดจังหวัดไม่สำเร็จ:", err);
  }

  // ----------------------------
  // 📘 จัดการ FarmBook
  // ----------------------------
  const farmbookList = document.getElementById("farmbook-list");
  const addFarmBookBtn = document.getElementById("addFarmBookBtn");
  const farmbookType = document.getElementById("farmbookType");
  const farmbookNumber = document.getElementById("farmbookNumber");

  let currentFarmBooks = [];

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
  const importInput = document.getElementById("importFarmer");
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
  // 💾 บันทึกเกษตรกรใหม่
  // ----------------------------
  form.addEventListener("submit", async e => {
    e.preventDefault();

    try {
      const fd = new FormData(form);
      const citizenId = fd.get("citizenId");

      if (!/^\d{13}$/.test(citizenId)) {
        alert("🚫 เลขบัตรประชาชนไม่ถูกต้อง");
        return;
      }

      // ✅ โหลดฐานข้อมูลสดใหม่ทุกครั้ง (async)
      const freshDB = await getDB();
      freshDB.farmers = freshDB.farmers || [];
      freshDB.farmbooks = freshDB.farmbooks || [];

      const farmerId = "F" + String(freshDB.farmers.length + 1).padStart(4, "0");

      const farmer = {
        FarmerID: farmerId,
        Name: fd.get("name"),
        SurName: fd.get("surname"),
        CitizenID: citizenId,
        Phone: fd.get("phone"),
        Province: fd.get("province"),
        District: fd.get("district"),
        Address: fd.get("address"),
        FarmBooks: currentFarmBooks.map(b => b.FarmBookID),
      };

      // ✅ เพิ่ม Farmer
      freshDB.farmers.push(farmer);

      // ✅ เพิ่ม FarmBooks แยกต่างหาก
      currentFarmBooks.forEach(b => {
        freshDB.farmbooks.push({
          ...b,
          FarmerID: farmerId,
        });
      });

      saveDB(freshDB);
      alert(`✅ บันทึก Farmer ${farmer.Name} ${farmer.SurName} แล้ว`);

      form.reset();
      currentFarmBooks = [];
      renderFarmBooks();
    } catch (err) {
      console.error("❌ เกิดข้อผิดพลาดตอนบันทึก:", err);
      alert("❌ เกิดข้อผิดพลาดตอนบันทึกข้อมูล");
    }
  });
}
