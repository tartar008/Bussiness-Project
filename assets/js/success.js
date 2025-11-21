export function init(DB, onDone) {
    console.log("🎉 Success page loaded");

    const txBox = document.getElementById("success-tx");

    // ถ้า finalizeTransaction ส่งค่า Transaction ID มา
    const tx = window.currentSession?.finalTx;

    if (tx && txBox) {
        txBox.innerHTML = `
            <div><b>รหัสธุรกรรม:</b> ${tx.TransactionID}</div>
            <div><b>วันที่:</b> ${new Date(tx.CompletedAt).toLocaleString("th-TH")}</div>
        `;
        txBox.classList.remove("hidden");
    }

    document.getElementById("btn-new-insert").addEventListener("click", () => {
        console.log("🔄 เริ่มการลงทะเบียนใหม่");
        if (onDone) onDone();
    });
}
