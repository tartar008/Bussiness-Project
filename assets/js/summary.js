import { saveDB } from "./db.js";

export function init(DB, onDone) {
    console.log("📄 Summary page loaded");

    const farmer = window.currentSession?.farmer;
    const plot = window.currentSession?.plot;
    const truck = window.currentSession?.truck;

    // --- Render Farmer ---
    const farmerBox = document.getElementById("summary-farmer");
    farmerBox.innerHTML = `
        <div><b>ชื่อ:</b> ${farmer?.FarmerName || "-"}</div>
        <div><b>รหัสเกษตรกร:</b> ${farmer?.FarmerID || "-"}</div>
        <div><b>โทร:</b> ${farmer?.Phone || "-"}</div>
        <div><b>ที่อยู่:</b> ${farmer?.Address || "-"}</div>
    `;

    // --- Render Plot ---
    const plotBox = document.getElementById("summary-plot");
    plotBox.innerHTML = `
        <div><b>PlotID:</b> ${plot?.PlotID || "-"}</div>
        <div><b>ชื่อแปลง:</b> ${plot?.PlotName || "-"}</div>
        <div><b>พื้นที่ (ไร่):</b> ${plot?.Area || "-"}</div>
        <div><b>ตำบล/อำเภอ/จังหวัด:</b> ${plot?.Tambon || "-"} / ${plot?.Amphur || "-"} / ${plot?.Province || "-"}</div>
    `;

    // --- Render Truck ---
    const truckBox = document.getElementById("summary-truck");
    truckBox.innerHTML = `
        <div><b>Truck Code:</b> ${truck?.Truck_Code || "-"}</div>
        <div><b>Owner:</b> ${truck?.OwnerName || "-"}</div>
        <div><b>ทะเบียน:</b> ${truck?.LicensePlateNo || "-"}</div>
        <div><b>ความจุ:</b> ${truck?.Capacity || "0"} kg</div>
        <div><b>ประเภท:</b> ${truck?.CarType || "-"}</div>
        <div><b>Dealer ID:</b> ${truck?.DealerID || "-"}</div>
    `;

    // --- Confirm Button ---
    document.getElementById("btn-confirm").addEventListener("click", () => {
        if (!onDone) return;
        console.log("✔️ Summary confirmed");
        onDone({
            ConfirmedAt: new Date().toISOString()
        });
    });
}
