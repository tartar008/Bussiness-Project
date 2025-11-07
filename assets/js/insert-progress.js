// assets/js/insert-progress.js
export function renderProgressBar(currentStep = 1) {
    const steps = [
        { id: 1, label: "เกษตรกร" },
        { id: 2, label: "แปลงที่ดิน" },
        { id: 3, label: "ตรวจสอบข้อมูล" },
        { id: 3.5, label: "QGIS" },
    ];

    const container = document.getElementById("insert-progress");
    if (!container) return;
    container.innerHTML = "";

    // ✅ เส้นพื้นหลัง
    const track = document.createElement("div");
    track.className = "absolute top-5 left-0 w-full h-1 bg-slate-200 rounded-full z-0";
    container.appendChild(track);

    // ✅ เส้นเติมสี (progress)
    const progress = document.createElement("div");
    const percent = ((Math.min(currentStep, 3.5) - 1) / (steps.length - 1)) * 100;
    progress.className =
        "absolute top-5 left-0 h-1 bg-indigo-500 rounded-full z-10 transition-all duration-500 ease-out";
    progress.style.width = `${percent}%`;
    container.appendChild(progress);

    // ✅ เพิ่มแต่ละ step
    steps.forEach((s, i) => {
        const stepNum = s.id;
        const isActive = currentStep === stepNum;
        const isDone = currentStep > stepNum;

        const stepEl = document.createElement("div");
        stepEl.className =
            "relative z-20 flex flex-col items-center text-center w-1/4 select-none";

        // 🟣 วงกลม
        const circle = document.createElement("div");
        circle.className = `
      flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold mb-2
      transition-all duration-300
      ${isActive
                ? "bg-indigo-600 border-indigo-600 text-white scale-110 shadow-md"
                : isDone
                    ? "bg-indigo-100 border-indigo-400 text-indigo-700"
                    : "bg-white border-slate-300 text-slate-400"}
      cursor-pointer hover:scale-105
    `;
        circle.textContent = typeof s.id === "number" ? s.id : "3b";

        // 🧭 คลิกได้ทุก step
        circle.addEventListener("click", () => {
            const stepsMap = ["farmer", "plot", "validation", "qgis"];
            const page = stepsMap[i];
            if (window.loadStep) {
                console.log("🧭 Jump to:", page);
                window.loadStep(page, window.DB || {}, document.getElementById("insert-content"));
            }
        });

        // 🔹 Label
        const label = document.createElement("div");
        label.className = `
      text-sm mt-1
      ${isActive
                ? "text-indigo-600 font-semibold"
                : isDone
                    ? "text-slate-700"
                    : "text-slate-400"}
    `;
        label.textContent = s.label;

        stepEl.appendChild(circle);
        stepEl.appendChild(label);
        container.appendChild(stepEl);
    });
}
