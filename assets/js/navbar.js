// assets/js/navbar.js
export async function loadNavbar(targetSelector = "#navbar-placeholder") {
    console.log("⏳ เริ่มโหลด Navbar...");

    // รอ DOM พร้อม
    await new Promise(resolve => {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", resolve);
        } else resolve();
    });

    const target = document.querySelector(targetSelector);
    if (!target) {
        console.warn("⚠️ ไม่พบตำแหน่งที่จะแทรก Navbar:", targetSelector);
        return;
    }

    try {
        // ✅ ใช้ path จาก root (ไม่มี ./)
        const res = await fetch("components/navbar.html");
        if (!res.ok) throw new Error("โหลด navbar.html ไม่สำเร็จ");
        const html = await res.text();

        target.innerHTML = html;
        console.log("✅ แทรก Navbar สำเร็จที่:", targetSelector);
    } catch (err) {
        console.error("❌ โหลด Navbar ล้มเหลว:", err);
        return;
    }

    // ✅ ผูก event ปุ่มให้เรียก router กลาง
    target.querySelectorAll("[data-page]").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            console.log("📦 Navbar clicked:", page);

            // if (window.loadPage) {
            //     window.loadPage(page);
            // } else {
            //     console.warn("⚠️ window.loadPage() not found!");
            // }
        });
    });
}
