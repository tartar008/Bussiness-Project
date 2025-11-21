import { getDB, saveDB } from './db.js';

export async function init(plotId) {
    console.log("🚛 Truck Registration Loaded");

    const db = await getDB();
    db.trucks ??= [];

    const form = document.getElementById('form-truck');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);

        const truck = {
            TransportRowID: "TRK-" + Date.now(),
            PlotID: plotId,
            Truck_Code: fd.get('truck_code'),
            DealerID: fd.get('dealer') || "",
            OwnerName: fd.get('owner') || "",
            CarType: fd.get('cartype') || "",
            EngineType: fd.get('enginetype') || "",
            FuelType: fd.get('fueltype') || "",
            LicensePlateNo: fd.get('license'),
            Capacity: parseFloat(fd.get('capacity') || 0),
            DistanceFromDealer: parseFloat(fd.get('distance') || 0),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        db.trucks.push(truck);
        saveDB(db);

        alert("✅ บันทึกข้อมูลรถเรียบร้อย!");

        if (window.loadStep) {
            window.loadStep("summary", db, document.getElementById("insert-content"));
        }
    });
}
