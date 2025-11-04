// db-init.js
// ------------------------------------------------------------
// 🌱 ข้อมูลเริ่มต้นจำลองระบบ Plot / Farmer / Province (RDBMS-ready)
// ------------------------------------------------------------

export default {
    // ========================
    // 🗺️ จังหวัด / อำเภอ
    // ========================
    provinces: [
        { ProvinceID: 10, NameTH: "กรุงเทพมหานคร" },
        { ProvinceID: 50, NameTH: "เชียงใหม่" },
        { ProvinceID: 90, NameTH: "สงขลา" },
        { ProvinceID: 70, NameTH: "ราชบุรี" },
    ],

    districts: [
        // กรุงเทพมหานคร
        { DistrictID: 1001, ProvinceID: 10, NameTH: "บางกะปิ" },
        { DistrictID: 1002, ProvinceID: 10, NameTH: "ลาดพร้าว" },
        { DistrictID: 1003, ProvinceID: 10, NameTH: "บางนา" },

        // เชียงใหม่
        { DistrictID: 5001, ProvinceID: 50, NameTH: "เมืองเชียงใหม่" },
        { DistrictID: 5002, ProvinceID: 50, NameTH: "สันทราย" },
        { DistrictID: 5003, ProvinceID: 50, NameTH: "แม่ริม" },

        // สงขลา
        { DistrictID: 9001, ProvinceID: 90, NameTH: "เมืองสงขลา" },
        { DistrictID: 9002, ProvinceID: 90, NameTH: "หาดใหญ่" },
        { DistrictID: 9003, ProvinceID: 90, NameTH: "จะนะ" },

        // ราชบุรี
        { DistrictID: 7001, ProvinceID: 70, NameTH: "เมืองราชบุรี" },
        { DistrictID: 7002, ProvinceID: 70, NameTH: "บ้านโป่ง" },
    ],

    // ========================
    // 👨‍🌾 เกษตรกร
    // ========================
    farmers: [
        { FarmerID: "F001", Name: "สมชาย", SurName: "รุ่งเรือง", Phone: "0812345678" },
        { FarmerID: "F002", Name: "มณี", SurName: "คำสุข", Phone: "0823456789" },
        { FarmerID: "F003", Name: "วีระ", SurName: "ทองแท้", Phone: "0834567890" },
        { FarmerID: "F004", Name: "สุดา", SurName: "อินทรสมบัติ", Phone: "0841234567" },
    ],

    // ========================
    // 🌾 แปลงที่ดิน
    // ========================
    plots: [
        {
            PlotID: "P001",
            FarmerID: "F001",
            LandCode: "SK-A001",
            ProvinceID: 90,
            DistrictID: 9002,
            DeedType: "CHANOTE",
            AreaRai: 2,
            AreaNgan: 1,
            AreaWah: 50,
            AreaAcre: 2.62,
            GeometryType: "Point",
            IsOwnedBefore2020: true,
        },
        {
            PlotID: "P002",
            FarmerID: "F002",
            LandCode: "CM-B015",
            ProvinceID: 50,
            DistrictID: 5002,
            DeedType: "NS3",
            AreaRai: 1,
            AreaNgan: 3,
            AreaWah: 20,
            AreaAcre: 1.89,
            GeometryType: "Polygon",
            IsOwnedBefore2020: false,
        },
        {
            PlotID: "P003",
            FarmerID: "F003",
            LandCode: "BK-C022",
            ProvinceID: 10,
            DistrictID: 1001,
            DeedType: "NO_DOC",
            AreaRai: 3,
            AreaNgan: 0,
            AreaWah: 0,
            AreaAcre: 2.97,
            GeometryType: "Polygon",
            IsOwnedBefore2020: true,
        },
        {
            PlotID: "P004",
            FarmerID: "F004",
            LandCode: "RB-D050",
            ProvinceID: 70,
            DistrictID: 7001,
            DeedType: "CHANOTE",
            AreaRai: 5,
            AreaNgan: 2,
            AreaWah: 10,
            AreaAcre: 5.52,
            GeometryType: "Point",
            IsOwnedBefore2020: false,
        },
    ],

    // ========================
    // 📍 พิกัดแปลง
    // ========================
    plotCoordinates: [
        { PlotID: "P001", Seq: 1, Lat: 6.9931, Lng: 100.4752 },
        { PlotID: "P002", Seq: 1, Lat: 18.801, Lng: 98.98 },
        { PlotID: "P002", Seq: 2, Lat: 18.802, Lng: 98.981 },
        { PlotID: "P002", Seq: 3, Lat: 18.801, Lng: 98.982 },
        { PlotID: "P003", Seq: 1, Lat: 13.765, Lng: 100.613 },
        { PlotID: "P003", Seq: 2, Lat: 13.766, Lng: 100.615 },
        { PlotID: "P004", Seq: 1, Lat: 13.528, Lng: 99.817 },
    ],

    // ========================
    // 📘 Master สถานะ
    // ========================
    statuses: [
        { StatusID: "S001", StatusCode: "RELEGAN", NameTH: "เกี่ยวข้องกับกฎหมาย", Description: "สถานะเกี่ยวกับการปฏิบัติตามกฎหมาย" },
        { StatusID: "S002", StatusCode: "HUMAN_RIGHT", NameTH: "สิทธิมนุษยชน", Description: "สถานะการเคารพสิทธิมนุษยชน" },
        { StatusID: "S003", StatusCode: "TRANSPORT", NameTH: "การขนส่ง", Description: "เกี่ยวข้องกับการขนส่งสินค้า" },
        { StatusID: "S004", StatusCode: "ENVIRONMENT", NameTH: "สิ่งแวดล้อม", Description: "ผลกระทบต่อสิ่งแวดล้อม" },
        { StatusID: "S005", StatusCode: "TAX", NameTH: "ภาษี", Description: "สถานะด้านภาษี" },
    ],

    // ========================
    // 🔗 ความสัมพันธ์ Plot ↔ Status
    // ========================
    plotStatusLinks: [
        { PlotID: "P001", StatusID: "S002", Value: true },
        { PlotID: "P001", StatusID: "S004", Value: true },
        { PlotID: "P002", StatusID: "S001", Value: true },
        { PlotID: "P002", StatusID: "S005", Value: true },
        { PlotID: "P003", StatusID: "S003", Value: true },
        { PlotID: "P003", StatusID: "S004", Value: true },
        { PlotID: "P003", StatusID: "S005", Value: true },
    ],

    // ========================
    // 📂 เอกสารแปลง
    // ========================
    plotDocuments: [
        { DocID: 1, PlotID: "P001", FileName: "เอกสารสิทธิ์.pdf", FileType: "application/pdf", FileURL: null },
        { DocID: 2, PlotID: "P001", FileName: "ภาพโฉนด.jpg", FileType: "image/jpeg", FileURL: "data:image/jpeg;base64,..." },
        { DocID: 3, PlotID: "P002", FileName: "ใบอนุญาตครอบครอง.pdf", FileType: "application/pdf", FileURL: null },
    ],

    // ========================
    // 🌿 รูปภาพสวน
    // ========================
    plotImages: [
        { ImageID: 1, PlotID: "P001", FileName: "สวนยาง1.jpg", FileURL: "data:image/jpeg;base64,..." },
        { ImageID: 2, PlotID: "P001", FileName: "สวนยาง2.jpg", FileURL: "data:image/jpeg;base64,..." },
        { ImageID: 3, PlotID: "P002", FileName: "สวนลำไย.jpg", FileURL: "data:image/jpeg;base64,..." },
        { ImageID: 4, PlotID: "P003", FileName: "สวนผัก.jpg", FileURL: "data:image/jpeg;base64,..." },
    ],

    // ========================
    // 📘 สมุดเกษตร (Farmbook)
    // ========================
    farmbooks: [
        { FarmbookID: "FB001", FarmerID: "F001", CreatedAt: "2024-01-10" },
        { FarmbookID: "FB002", FarmerID: "F002", CreatedAt: "2024-02-05" },
        { FarmbookID: "FB003", FarmerID: "F003", CreatedAt: "2024-03-12" },
    ],

    // แปลงที่อยู่ในสมุด
    farmbookPlots: [
        { FarmbookID: "FB001", PlotID: "P001" },
        { FarmbookID: "FB002", PlotID: "P002" },
        { FarmbookID: "FB003", PlotID: "P003" },
    ],

    // ========================
    // 🔍 Validation (ตรวจสอบแปลง)
    // ========================
    validations: [
        { ValidationID: 1, PlotID: "P001", Date: "2024-07-01", Result: "ผ่าน", Officer: "อ.นฤมล" },
        { ValidationID: 2, PlotID: "P002", Date: "2024-07-03", Result: "ไม่ผ่าน", Officer: "อ.ภัทรพล" },
        { ValidationID: 3, PlotID: "P003", Date: "2024-07-10", Result: "รอแก้ไข", Officer: "อ.วิภา" },
    ],

    // ========================
    // 🚚 การขนส่ง
    // ========================
    transports: [
        { TransportID: "T001", PlotID: "P001", Date: "2024-08-10", Quantity: 1200, Unit: "กก.", Destination: "โรงงานยางพารา สงขลา" },
        { TransportID: "T002", PlotID: "P002", Date: "2024-08-15", Quantity: 500, Unit: "กก.", Destination: "ลำไยเชียงใหม่ จก." },
    ],

    // ========================
    // 📅 รายงานประจำวัน
    // ========================
    daily: [
        { DailyID: 1, PlotID: "P001", Date: "2024-09-01", Activity: "เก็บน้ำยาง", WorkerCount: 2 },
        { DailyID: 2, PlotID: "P002", Date: "2024-09-03", Activity: "ใส่ปุ๋ย", WorkerCount: 3 },
        { DailyID: 3, PlotID: "P003", Date: "2024-09-04", Activity: "ตัดหญ้า", WorkerCount: 1 },
    ],

    // ========================
    // 🧭 ชั้นข้อมูลอ้างอิง (Reference Layer)
    // ========================
    referenceLayers: [
        { LayerID: 1, Name: "พื้นที่อนุรักษ์สิ่งแวดล้อม", Type: "Polygon", Source: "กรมทรัพยากรธรรมชาติ" },
        { LayerID: 2, Name: "พื้นที่ต้นน้ำลำธาร", Type: "Polygon", Source: "กรมอุทยานฯ" },
    ],
};
