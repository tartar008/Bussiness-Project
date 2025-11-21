export function renderProgressBar(currentStep = 1) {
    const steps = [
        { id: 1, label: "เกษตรกร" },
        { id: 2, label: "แปลงที่ดิน" },
        { id: 3, label: "รถ" },
        { id: 4, label: "ตรวจสอบข้อมูล" },
        { id: 5, label: "เสร็จสิ้น" },
    ];

    const stepsMap = ["farmer", "plot", "truck", "summary", "success"];

    const container = document.getElementById("insert-progress");
    if (!container) return;
    container.innerHTML = "";

    // เส้นด้านหลัง
    const track = document.createElement("div");
    track.className = "absolute top-5 left-0 w-full h-1 bg-slate-200 rounded-full z-0";
    container.appendChild(track);

    // Progress bar
    const progress = document.createElement("div");
    const percent = ((currentStep - 1) / (steps.length - 1)) * 100;
    progress.className =
        "absolute top-5 left-0 h-1 bg-indigo-500 rounded-full z-10 transition-all duration-500 ease-out";
    progress.style.width = `${percent}%`;
    container.appendChild(progress);

    // Step items
    steps.forEach((s, i) => {
        const isActive = currentStep === s.id;
        const isDone = currentStep > s.id;

        const stepEl = document.createElement("div");
        stepEl.className =
            "relative z-20 flex flex-col items-center text-center w-1/5 select-none";

        const circle = document.createElement("div");
        circle.className = `
            flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold mb-2
            transition-all duration-300
            ${isActive
                ? "bg-indigo-600 border-indigo-600 text-white scale-110 shadow-md"
                : isDone
                    ? "bg-indigo-100 border-indigo-400 text-indigo-700"
                    : "bg-white border-slate-300 text-slate-400"}
        `;
        circle.textContent = s.id;

        // คลิกเพื่อกระโดดไป step นั้น
        circle.addEventListener("click", () => {
            const page = stepsMap[i];
            if (window.loadStep) {
                console.log("🧭 Jump to:", page);
                window.loadStep(page, window.DB || {}, document.getElementById("insert-content"));
            }
        });

        const label = document.createElement("div");
        label.className =
            `text-sm mt-1 ${isActive ? "text-indigo-600 font-semibold" : isDone ? "text-slate-700" : "text-slate-400"}`;
        label.textContent = s.label;

        stepEl.appendChild(circle);
        stepEl.appendChild(label);
        container.appendChild(stepEl);
    });
}
