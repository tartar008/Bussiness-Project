// main.js — SPA router
import { getDB } from './db.js';

const app = document.getElementById('app');
const navBtns = document.querySelectorAll('.nav-btn');

// ฟังก์ชันโหลดหน้า HTML + script
async function loadPage(name) {
    app.innerHTML = `<div class="text-center text-slate-400 py-10">กำลังโหลด ${name}...</div>`;
    const res = await fetch(`pages/${name}.html`);
    const html = await res.text();
    app.innerHTML = html;

    try {
        const module = await import(`./${name}.js`);
        if (module.init) module.init();
    } catch (err) {
        console.warn(`⚠️ No JS for ${name}`, err);
    }

    highlightActive(name);
}

function highlightActive(name) {
    navBtns.forEach(btn => {
        const active = btn.dataset.page === name;
        btn.classList.toggle('text-indigo-600', active);
        btn.classList.toggle('font-semibold', active);
    });
}

// ตั้ง event
navBtns.forEach(btn => btn.addEventListener('click', () => loadPage(btn.dataset.page)));

// โหลดหน้าแรก
loadPage('farmer');
