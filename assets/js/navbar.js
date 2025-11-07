// assets/js/navbar.js
import { renderProgressBar } from "./insert-progress.js";

export async function loadNavbar(targetSelector = "#navbar-placeholder") {
    console.log("⏳ เริ่มโหลด Navbar...");

    const target = document.querySelector(targetSelector);
    if (!target) return console.warn("⚠️ ไม่พบตำแหน่ง Navbar:", targetSelector);

    try {
        const res = await fetch("components/navbar.html");
        if (!res.ok) throw new Error("โหลด navbar.html ไม่สำเร็จ");
        const html = await res.text();
        target.innerHTML = html;

        // ✅ ทำให้ฟังก์ชันใช้ได้ทั่วระบบ
        window.renderProgressBar = renderProgressBar;

        // ✅ แสดง progress เริ่มต้น
        renderProgressBar(1);
    } catch (err) {
        console.error("❌ โหลด Navbar ล้มเหลว:", err);
    }
}
