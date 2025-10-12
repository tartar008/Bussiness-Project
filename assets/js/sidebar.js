// sidebar.js
export async function loadSidebar(DB) {
    const res = await fetch("components/sidebar.html");
    const html = await res.text();
    document.body.insertAdjacentHTML("afterbegin", html);

    console.log("✅ Sidebar loaded");

    // ✅ ผูก event ให้ปุ่มเรียก loadPage จาก main.js
    document.querySelectorAll(".sidebar-link").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            console.log("📦 Sidebar clicked:", page);

            // เรียก router กลางจาก main.js
            if (window.loadPage) {
                window.loadPage(page);
            } else {
                console.warn("⚠️ window.loadPage() not found!");
            }
        });
    });
}
