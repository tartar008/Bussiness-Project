// draft.js
// --------------------------------------
// 📝 เก็บข้อมูลชั่วคราวก่อนบันทึกจริง
// --------------------------------------

const KEY = "transaction-draft";

export function saveDraft(step, data) {
    const draft = loadDraft();
    draft[step] = data;
    localStorage.setItem(KEY, JSON.stringify(draft));
    console.log(`💾 draft saved [${step}]`, data);
}
export function loadDraft() {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
}

export function clearDraft() {
    localStorage.removeItem(KEY);
    console.log("🧹 draft cleared");
}
