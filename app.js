const TARGET_DOWNLOAD_URL = "https://drive.google.com/file/d/1IxPVbH2_jZrMhv8iui9Xd6kBLtP7h5S-/view?usp=drivesdk";
const CHANNEL_URL = "https://whatsapp.com/channel/0029VbDNVy48qIzuoDNp9v1j";
const WAIT_SECONDS = 5;
const STORAGE_KEY = "vip_gate_unlock_end_v1";

const btnWa = document.getElementById("btn-wa");
const btnDownload = document.getElementById("btn-download");
const btnDlText = document.getElementById("btn-dl-text");
const lockInfo = document.getElementById("lock-info");
const statusText = document.getElementById("status-text");
const progressWrap = document.getElementById("progress-wrap");
const progressBar = document.getElementById("progress-bar");
const icoLock = document.getElementById("ico-lock");

let timerId = null;
let unlocked = false;

function bukaAksesDownload() {
  if (unlocked) return;
  unlocked = true;
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  progressWrap.style.display = "block";
  progressBar.style.width = "100%";
  btnDownload.disabled = false;
  btnDownload.classList.add("unlocked");

  if (icoLock && typeof VIP_ICONS !== "undefined") {
    icoLock.innerHTML = VIP_ICONS.download;
  }

  lockInfo.textContent = "Akses VIP terbuka! Silakan download file di bawah.";
  btnDlText.textContent = "DOWNLOAD MOD MENU RIO RISE";
  statusText.textContent = "Verifikasi selesai. Link siap digunakan.";
  statusText.style.color = "#4ade80";
}

function jalankanCountdown(endTimeMs) {
  if (unlocked) return;
  if (timerId) clearInterval(timerId);

  progressWrap.style.display = "block";
  lockInfo.textContent = "Channel link sudah dibuka! Menunggu countdown selesai...";
  statusText.style.color = "#38bdf8";

  const update = () => {
    const sisaMs = endTimeMs - Date.now();
    const sisaDetik = Math.max(0, Math.ceil(sisaMs / 1000));
    const persen = Math.min(100, Math.max(0, Math.round(((WAIT_SECONDS * 1000 - sisaMs) / (WAIT_SECONDS * 1000)) * 100)));

    progressBar.style.width = persen + "%";

    if (sisaDetik > 0) {
      statusText.textContent = `Mohon tunggu ${sisaDetik} detik untuk membuka link...`;
      btnDlText.textContent = `MEMBUKA DALAM ${sisaDetik}d...`;
    } else {
      bukaAksesDownload();
    }
  };

  update();
  timerId = setInterval(update, 250);
}

function mulaiProsesChannel() {
  if (unlocked) return;
  let savedEnd = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
  if (!savedEnd) {
    savedEnd = Date.now() + WAIT_SECONDS * 1000;
    sessionStorage.setItem(STORAGE_KEY, String(savedEnd));
  }
  jalankanCountdown(savedEnd);
}

btnWa.addEventListener("pointerdown", mulaiProsesChannel);
btnWa.addEventListener("click", (e) => {
  mulaiProsesChannel();
  e.preventDefault();
  window.open(CHANNEL_URL, "_blank", "noopener,noreferrer");
});

document.addEventListener("visibilitychange", () => {
  const savedEnd = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
  if (savedEnd && !unlocked) {
    jalankanCountdown(savedEnd);
  }
});

window.addEventListener("focus", () => {
  const savedEnd = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
  if (savedEnd && !unlocked) {
    jalankanCountdown(savedEnd);
  }
});

btnDownload.addEventListener("click", () => {
  if (!unlocked) return;
  window.open(TARGET_DOWNLOAD_URL, "_blank", "noopener,noreferrer");
});

(function cekStateAwal() {
  const savedEnd = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
  if (savedEnd) {
    jalankanCountdown(savedEnd);
  }
})();
