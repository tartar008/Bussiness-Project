import { getDB, saveDB } from "./db.js";

let plots = []; // เก็บข้อมูลของแต่ละ plot-block

export async function init(DB, onDone) {
    console.log("🌾 Plot page loaded");

    plots = []; // reset ทุกครั้งที่เข้า page

    const wrap = document.getElementById("plots-wrap");
    const template = document.getElementById("plot-template");
    const btnAdd = document.getElementById("addPlotBlock");
    const btnNext = document.getElementById("btn-next");

    // เพิ่มบล็อกแรกอัตโนมัติ
    addPlotBlock();

    btnAdd.addEventListener("click", () => addPlotBlock());

    // =====================================================================
    // 🧱 ฟังก์ชันเพิ่ม plot-block ใหม่
    // =====================================================================
    function addPlotBlock() {
        const clone = template.content.cloneNode(true);
        const block = clone.querySelector(".plot-block");
        const index = plots.length;
        block.dataset.index = index;

        // เตรียมโครงข้อมูลใน plots[]
        plots.push({
            docs: [],
            images: [],
            coords: [],
        });

        bindBlockEvents(block, index);
        wrap.appendChild(block);
    }

    // =====================================================================
    // 🎛 Bind Event สำหรับแต่ละ Plot Block
    // =====================================================================
    function bindBlockEvents(block, index) {

        // ----------------------------
        // ✕ ลบบล็อก
        // ----------------------------
        block.querySelector(".remove-plot").addEventListener("click", () => {
            plots[index] = null;
            block.remove();
        });

        // ----------------------------
        // 📍 Geometry type (Point / Polygon)
        // ----------------------------
        const geomSelect = block.querySelector(".geometry-select");
        const pointContainer = block.querySelector(".point-container");
        const coordContainer = block.querySelector(".coord-container");
        const addPointBtn = block.querySelector(".add-point");
        const pointsDiv = block.querySelector(".points");

        geomSelect.addEventListener("change", () => {
            const type = geomSelect.value;
            pointContainer.classList.toggle("hidden", type !== "Point");
            coordContainer.classList.toggle("hidden", type !== "Polygon");
        });

        addPointBtn.addEventListener("click", () => {
            const row = document.createElement("div");
            row.className = "grid grid-cols-2 gap-2 relative";

            row.innerHTML = `
                <input placeholder="Lat" class="border p-2 rounded-lg" />
                <input placeholder="Lng" class="border p-2 rounded-lg" />
                <button type="button"
                    class="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                    ✕
                </button>
            `;

            row.querySelector("button").addEventListener("click", () => row.remove());
            pointsDiv.appendChild(row);
        });

        // ----------------------------
        // 📄 Document Upload
        // ----------------------------
        const docInput = block.querySelector(".doc-input");
        const docPreview = block.querySelector(".doc-preview");
        block.querySelector(".add-doc").addEventListener("click", () => docInput.click());

        docInput.addEventListener("change", e => {
            const files = Array.from(e.target.files);

            files.forEach(file => {
                const ext = file.name.split(".").pop().toLowerCase();
                const isImage = ["jpg", "jpeg", "png"].includes(ext);

                const docItem = {
                    name: file.name,
                    type: file.type,
                    isImage,
                    url: null,
                };

                if (isImage) {
                    const reader = new FileReader();
                    reader.onload = ev => {
                        docItem.url = ev.target.result;
                        plots[index].docs.push(docItem);
                        renderDocs();
                    };
                    reader.readAsDataURL(file);
                } else {
                    plots[index].docs.push(docItem);
                }
            });

            renderDocs();
            docInput.value = "";
        });

        function renderDocs() {
            docPreview.innerHTML = "";

            plots[index].docs.forEach((f, i) => {
                const box = document.createElement("div");
                box.className =
                    "relative flex items-center justify-center border rounded-lg w-32 h-24 bg-slate-50 overflow-hidden";

                if (f.isImage && f.url) {
                    box.innerHTML = `
                        <img src="${f.url}" class="object-cover w-full h-full" />
                        <button type="button"
                            class="absolute top-0 right-0 bg-black/50 text-white text-xs px-1 rounded-bl remove-doc"
                            data-idx="${i}">✕</button>
                    `;
                } else {
                    const icon =
                        f.type.includes("pdf") ? "📕" :
                            f.type.includes("sheet") ? "📗" :
                                f.type.includes("word") ? "📘" :
                                    "📄";

                    box.innerHTML = `
                        <div class="flex flex-col text-center p-1 text-xs text-slate-600">
                            <span class="text-2xl">${icon}</span>
                            <span class="truncate w-full">${f.name}</span>
                        </div>
                        <button type="button"
                            class="absolute top-0 right-0 bg-black/50 text-white text-xs px-1 rounded-bl remove-doc"
                            data-idx="${i}">✕</button>
                    `;
                }

                docPreview.appendChild(box);
            });

            // ปุ่ม +
            const addBtn = document.createElement("label");
            addBtn.className =
                "add-doc flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg w-32 h-24 cursor-pointer";
            addBtn.textContent = "+";
            docPreview.appendChild(addBtn);

            addBtn.addEventListener("click", () => docInput.click());

            // ปุ่มลบเอกสาร
            docPreview.querySelectorAll(".remove-doc").forEach(btn => {
                const idx = Number(btn.dataset.idx);
                btn.addEventListener("click", () => {
                    plots[index].docs.splice(idx, 1);
                    renderDocs();
                });
            });
        }

        // ----------------------------
        // 🖼 Garden Images Upload
        // ----------------------------
        const imgInput = block.querySelector(".garden-input");
        const imgPreview = block.querySelector(".garden-preview");
        block.querySelector(".add-img").addEventListener("click", () => imgInput.click());

        imgInput.addEventListener("change", e => {
            const files = Array.from(e.target.files);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = ev => {
                    plots[index].images.push(ev.target.result);
                    renderImages();
                };
                reader.readAsDataURL(file);
            });

            imgInput.value = "";
        });

        function renderImages() {
            imgPreview.innerHTML = "";

            plots[index].images.forEach((url, i) => {
                const box = document.createElement("div");
                box.className =
                    "relative w-32 h-24 rounded-lg overflow-hidden border";

                box.innerHTML = `
                    <img src="${url}" class="object-cover w-full h-full" />
                    <button type="button"
                        class="absolute top-0 right-0 bg-black/50 text-white text-xs px-1 rounded-bl remove-img"
                        data-idx="${i}">✕</button>
                `;

                imgPreview.appendChild(box);
            });

            const addBtn = document.createElement("label");
            addBtn.className =
                "add-img flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg w-32 h-24 cursor-pointer";
            addBtn.textContent = "+";
            imgPreview.appendChild(addBtn);

            addBtn.addEventListener("click", () => imgInput.click());

            imgPreview.querySelectorAll(".remove-img").forEach(btn => {
                const idx = Number(btn.dataset.idx);
                btn.addEventListener("click", () => {
                    plots[index].images.splice(idx, 1);
                    renderImages();
                });
            });
        }
    }

    // =====================================================================
    // ▶ เมื่อกดปุ่ม "ถัดไป"
    // =====================================================================
    btnNext.addEventListener("click", () => {
        const results = [];

        document.querySelectorAll(".plot-block").forEach((block, idx) => {
            const fd = {};

            fd.plotId = `P${Date.now()}_${idx}`;
            fd.landCode = block.querySelector("[name='landCode']").value;
            fd.province = block.querySelector("[name='province']").value;
            fd.district = block.querySelector("[name='district']").value;
            fd.deed = block.querySelector("[name='deed']").value;

            // พื้นที่
            fd.rai = Number(block.querySelector("[name='rai']").value || 0);
            fd.ngan = Number(block.querySelector("[name='ngan']").value || 0);
            fd.wah = Number(block.querySelector("[name='wah']").value || 0);

            const totalWah = fd.rai * 400 + fd.ngan * 100 + fd.wah;
            fd.areaAcre = Number(((totalWah * 4) / 4046.85642).toFixed(4));

            // Geometry
            fd.geometryType = block.querySelector("[name='geometryType']").value;

            if (fd.geometryType === "Point") {
                fd.coords = [{
                    lat: Number(block.querySelector("[name='pointLat']").value),
                    lng: Number(block.querySelector("[name='pointLng']").value)
                }];
            } else {
                fd.coords = Array.from(block.querySelectorAll(".points > div")).map(row => {
                    const [latInput, lngInput] = row.querySelectorAll("input");
                    return {
                        lat: Number(latInput.value),
                        lng: Number(lngInput.value)
                    };
                });
            }

            fd.docs = plots[idx]?.docs || [];
            fd.images = plots[idx]?.images || [];

            fd.status = {
                relegan: block.querySelector("[name='status_relegan']").checked,
                humanRight: block.querySelector("[name='status_human_right']").checked,
                transport: block.querySelector("[name='status_transport']").checked,
                environment: block.querySelector("[name='status_environment']").checked,
                tax: block.querySelector("[name='status_tax']").checked,
            };

            fd.ownedBefore2020 = block.querySelector("[name='ownedBefore2020']").checked;

            results.push(fd);
        });

        console.log("📦 ส่งผล plots[]:", results);

        if (onDone) onDone(results);
    });
}



// ------------------------------------------------------------
// ⚙️ Logic สำคัญภายใน (Plot.js – Multi Plot Blocks)
// ------------------------------------------------------------
//
// - ระบบรองรับการเพิ่มหลายแปลง (หลาย Plot Block) ในหน้าเดียว
//   • ใช้ <template> ในการ clone บล็อกใหม่
//   • ลบแปลงได้เป็นรายบล็อก
//
// - แต่ละบล็อกมี state แยกใน plots[index]
//   • เก็บ docs[], images[], coords[] ไม่ปะปนกัน
//
// - สลับการแสดง Point / Polygon ต่อบล็อก
//   • Point → กรอก Lat/Lng เดี่ยว
//   • Polygon → เพิ่มจุดหลายคู่ และลบได้
//
// - ระบบอัปโหลดเอกสาร (Documents)
//   • รองรับหลายชนิดไฟล์
//   • แสดง preview + ลบไฟล์ได้
//   • ผูกกับบล็อกแต่ละ plot แยกกัน
//
// - ระบบอัปโหลดรูปสวน (Images)
//   • รองรับหลายรูปพร้อมกัน
//   • แสดง thumbnail + ลบได้
//   • เก็บ base64 ใน plots[index].images
//
// - คำนวณพื้นที่ ไร่–งาน–วา → เอเคอร์ ต่อบล็อก
//
// - รวมข้อมูลทั้งหมดจากแต่ละบล็อกเมื่อกด “ถัดไป”
//   • สร้าง plotId แบบ unique (timestamp + index)
//   • รวม coords, docs, images, flags, area, geometryType
//
// - ส่งผลลัพธ์ทั้งหมดออกผ่าน onDone(results)
//   • ยังไม่บันทึกลงฐานจริงในหน้านี้
//
// ------------------------------------------------------------
