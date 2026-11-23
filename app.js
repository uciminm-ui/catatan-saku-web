const TARGET_DOWNLOAD_URL = "https://drive.google.com/file/d/1IxPVbH2_jZrMhv8iui9Xd6kBLtP7h5S-/view?usp=drivesdk";
const WAIT_SECONDS = 8;

const btnWa = document.getElementById("btn-wa");
const btnDownload = document.getElementById("btn-download");
const btnDlText = document.getElementById("btn-dl-text");
const lockInfo = document.getElementById("lock-info");
const statusText = document.getElementById("status-text");
const progressWrap = document.getElementById("progress-wrap");
const progressBar = document.getElementById("progress-bar");
const icoLock = document.getElementById("ico-lock");

let started = false;
let unlocked = false;

btnWa.addEventListener("click", () => {
  if (started || unlocked) return;
  started = true;

  let sisa = WAIT_SECONDS;
  progressWrap.style.display = "block";
  lockInfo.textContent = "Sedang memverifikasi langganan saluran...";
  statusText.textContent = `Mohon tunggu ${sisa} detik untuk membuka link...`;
  btnDlText.textContent = `MEMBUKA DALAM ${sisa}d...`;

  const timer = setInterval(() => {
    sisa -= 1;
    const persen = Math.min(100, Math.round(((WAIT_SECONDS - sisa) / WAIT_SECONDS) * 100));
    progressBar.style.width = persen + "%";

    if (sisa > 0) {
      statusText.textContent = `Mohon tunggu ${sisa} detik untuk membuka link...`;
      btnDlText.textContent = `MEMBUKA DALAM ${sisa}d...`;
    } else {
      clearInterval(timer);
      unlocked = true;
      btnDownload.disabled = false;
      btnDownload.classList.add("unlocked");
      if (icoLock && typeof VIP_ICONS !== "undefined") {
        icoLock.innerHTML = VIP_ICONS.download;
      }
      lockInfo.textContent = "Akses VIP terbuka! Silakan download file di bawah.";
      btnDlText.textContent = "DOWNLOAD MOD MENU RIO RISE";
      statusText.textContent = "Verifikasi selesai. Link siap digunakan.";
    }
  }, 1000);
});

btnDownload.addEventListener("click", () => {
  if (!unlocked) return;
  window.open(TARGET_DOWNLOAD_URL, "_blank", "noopener,noreferrer");
});
