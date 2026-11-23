(function () {
  "use strict";

  const CONFIG = {
    CHANNEL_URL: "https://whatsapp.com/channel/0029VbDNVy48qIzuoDNp9v1j",
    APK_DOWNLOAD_URL: "https://drive.usercontent.google.com/download?id=1IxPVbH2_jZrMhv8iui9Xd6kBLtP7h5S-&export=download",
    COUNTDOWN_SECONDS: 15,
    STORAGE_KEY: "rio_rise_vip_gate_v2"
  };

  const dom = {
    card: document.getElementById("vip-card"),
    statusBanner: document.getElementById("status-banner"),
    statusIcon: document.getElementById("status-icon"),
    statusText: document.getElementById("status-text"),
    channelOpenedBadge: document.getElementById("channel-opened-badge"),
    btnChannel: document.getElementById("btn-channel"),
    btnChannelLabel: document.getElementById("btn-channel-label"),
    channelNote: document.getElementById("channel-note"),
    timerPill: document.getElementById("timer-pill"),
    countdownBox: document.getElementById("countdown-box"),
    countdownClock: document.getElementById("countdown-clock"),
    progressTrack: document.getElementById("progress-track"),
    progressFill: document.getElementById("progress-fill"),
    readyBox: document.getElementById("ready-box"),
    lockedBox: document.getElementById("locked-box"),
    btnDownload: document.getElementById("btn-download"),
    btnDownloadIcon: document.getElementById("btn-download-icon"),
    btnDownloadLabel: document.getElementById("btn-download-label")
  };

  let state = {
    channelClicked: false,
    endTimestamp: null,
    unlocked: false
  };

  let tickTimerId = null;
  let isChannelClickLocked = false;

  function loadState() {
    try {
      const raw = window.sessionStorage.getItem(CONFIG.STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        state.channelClicked = Boolean(parsed.channelClicked);
        state.endTimestamp = typeof parsed.endTimestamp === "number" ? parsed.endTimestamp : null;
        state.unlocked = Boolean(parsed.unlocked);
      }
    } catch (_) {
      // Abaikan jika sessionStorage tidak tersedia
    }
  }

  function saveState() {
    try {
      window.sessionStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
      // Abaikan jika sessionStorage tidak tersedia
    }
  }

  function formatSecondsToMMSS(totalSec) {
    const clamped = Math.max(0, Math.ceil(totalSec));
    const mins = Math.floor(clamped / 60);
    const secs = clamped % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function getRemainingSeconds() {
    if (!state.endTimestamp) return CONFIG.COUNTDOWN_SECONDS;
    const diffMs = state.endTimestamp - Date.now();
    return Math.max(0, Math.ceil(diffMs / 1000));
  }

  function setBannerStatus(stepNumber, labelText, iconName) {
    if (!dom.statusBanner || !dom.statusText) return;
    dom.statusBanner.classList.remove("status-1", "status-2", "status-3", "status-4");
    dom.statusBanner.classList.add(`status-${stepNumber}`);
    dom.statusText.textContent = labelText;
    if (window.VipIcons && dom.statusIcon) {
      window.VipIcons.setIcon(dom.statusIcon, iconName);
    }
  }

  function syncProgressUI(remainingSec) {
    const total = CONFIG.COUNTDOWN_SECONDS;
    const elapsed = Math.min(total, Math.max(0, total - remainingSec));
    const percent = total > 0 ? Math.min(100, Math.round((elapsed / total) * 100)) : 100;
    const formatted = formatSecondsToMMSS(remainingSec);

    if (dom.countdownClock) dom.countdownClock.textContent = formatted;
    if (dom.timerPill) dom.timerPill.textContent = formatted;
    if (dom.progressFill) dom.progressFill.style.width = `${percent}%`;
    if (dom.progressTrack) dom.progressTrack.setAttribute("aria-valuenow", String(percent));
  }

  function applyUnlockedState() {
    state.unlocked = true;
    state.channelClicked = true;
    saveState();
    stopCountdownLoop();

    if (dom.card) dom.card.setAttribute("data-state", "unlocked");
    setBannerStatus(4, "ACCESS BERHASIL — DOWNLOAD TERBUKA", "check-circle");

    if (dom.channelOpenedBadge) dom.channelOpenedBadge.hidden = false;
    if (dom.btnChannel) {
      dom.btnChannel.classList.add("is-opened");
      dom.btnChannel.setAttribute("href", CONFIG.CHANNEL_URL);
    }
    if (dom.btnChannelLabel) dom.btnChannelLabel.textContent = "BUKA LAGI CHANNEL WHATSAPP";
    if (dom.channelNote) dom.channelNote.textContent = "CHANNEL LINK SUDAH DIBUKA";

    if (dom.lockedBox) dom.lockedBox.hidden = true;
    if (dom.countdownBox) dom.countdownBox.hidden = true;
    if (dom.readyBox) dom.readyBox.hidden = false;

    if (dom.timerPill) dom.timerPill.textContent = "00:00";

    if (dom.btnDownload) {
      dom.btnDownload.disabled = false;
      dom.btnDownload.setAttribute("aria-disabled", "false");
      dom.btnDownload.classList.remove("is-locked", "is-processing");
      dom.btnDownload.classList.add("is-unlocked");
    }
    if (dom.btnDownloadLabel) dom.btnDownloadLabel.textContent = "DOWNLOAD APK SEKARANG";
    if (window.VipIcons && dom.btnDownloadIcon) {
      window.VipIcons.setIcon(dom.btnDownloadIcon, "download");
    }
  }

  function applyProcessingState(remainingSec) {
    if (dom.card) dom.card.setAttribute("data-state", "processing");

    if (document.hidden) {
      setBannerStatus(2, "CHANNEL LINK SUDAH DIBUKA", "external-link");
    } else {
      setBannerStatus(3, "MEMPROSES ACCESS — COUNTDOWN BERJALAN", "clock");
    }

    if (dom.channelOpenedBadge) dom.channelOpenedBadge.hidden = false;
    if (dom.btnChannel) {
      dom.btnChannel.classList.add("is-opened");
      dom.btnChannel.setAttribute("href", CONFIG.CHANNEL_URL);
    }
    if (dom.btnChannelLabel) dom.btnChannelLabel.textContent = "CHANNEL LINK SUDAH DIBUKA";
    if (dom.channelNote) dom.channelNote.textContent = "CHANNEL LINK SUDAH DIBUKA — Proses akses sedang berjalan.";

    if (dom.lockedBox) dom.lockedBox.hidden = true;
    if (dom.readyBox) dom.readyBox.hidden = true;
    if (dom.countdownBox) dom.countdownBox.hidden = false;

    if (dom.btnDownload) {
      dom.btnDownload.disabled = true;
      dom.btnDownload.setAttribute("aria-disabled", "true");
      dom.btnDownload.classList.remove("is-locked", "is-unlocked");
      dom.btnDownload.classList.add("is-processing");
    }
    if (dom.btnDownloadLabel) {
      dom.btnDownloadLabel.textContent = `MEMPROSES (${formatSecondsToMMSS(remainingSec)})`;
    }
    if (window.VipIcons && dom.btnDownloadIcon) {
      window.VipIcons.setIcon(dom.btnDownloadIcon, "clock");
    }

    syncProgressUI(remainingSec);
  }

  function applyLockedState() {
    if (dom.card) dom.card.setAttribute("data-state", "locked");
    setBannerStatus(1, "MENUNGGU KLIK CHANNEL", "lock");

    if (dom.channelOpenedBadge) dom.channelOpenedBadge.hidden = true;
    if (dom.btnChannel) {
      dom.btnChannel.classList.remove("is-opened");
      dom.btnChannel.setAttribute("href", CONFIG.CHANNEL_URL);
    }
    if (dom.btnChannelLabel) dom.btnChannelLabel.textContent = "JOIN CHANNEL WHATSAPP";
    if (dom.channelNote) {
      dom.channelNote.textContent = "Membuka tautan saluran resmi di tab baru tanpa menutup halaman ini.";
    }

    if (dom.countdownBox) dom.countdownBox.hidden = true;
    if (dom.readyBox) dom.readyBox.hidden = true;
    if (dom.lockedBox) dom.lockedBox.hidden = false;

    if (dom.timerPill) dom.timerPill.textContent = formatSecondsToMMSS(CONFIG.COUNTDOWN_SECONDS);

    if (dom.btnDownload) {
      dom.btnDownload.disabled = true;
      dom.btnDownload.setAttribute("aria-disabled", "true");
      dom.btnDownload.classList.remove("is-processing", "is-unlocked");
      dom.btnDownload.classList.add("is-locked");
    }
    if (dom.btnDownloadLabel) dom.btnDownloadLabel.textContent = "LINK TERKUNCI";
    if (window.VipIcons && dom.btnDownloadIcon) {
      window.VipIcons.setIcon(dom.btnDownloadIcon, "lock");
    }
  }

  function stopCountdownLoop() {
    if (tickTimerId !== null) {
      window.clearInterval(tickTimerId);
      tickTimerId = null;
    }
  }

  function startCountdownLoop() {
    stopCountdownLoop();

    const updateStep = () => {
      if (state.unlocked) {
        applyUnlockedState();
        return;
      }

      const remaining = getRemainingSeconds();
      if (remaining <= 0) {
        syncProgressUI(0);
        applyUnlockedState();
        return;
      }

      applyProcessingState(remaining);
    };

    updateStep();
    tickTimerId = window.setInterval(updateStep, 250);
  }

  function handleChannelClick(event) {
    if (dom.btnChannel) {
      dom.btnChannel.setAttribute("href", CONFIG.CHANNEL_URL);
      dom.btnChannel.setAttribute("target", "_blank");
      dom.btnChannel.setAttribute("rel", "noopener noreferrer");
    }

    // Izinkan browser membuka tautan channel di tab baru secara langsung
    if (isChannelClickLocked) return;
    isChannelClickLocked = true;
    window.setTimeout(() => {
      isChannelClickLocked = false;
    }, 600);

    if (event && event.defaultPrevented) return;

    if (!state.unlocked) {
      state.channelClicked = true;
      if (typeof state.endTimestamp !== "number" || state.endTimestamp <= Date.now()) {
        state.endTimestamp = Date.now() + CONFIG.COUNTDOWN_SECONDS * 1000;
      }
      saveState();
      startCountdownLoop();
    } else {
      state.channelClicked = true;
      saveState();
      applyUnlockedState();
    }
  }

  function handleDownloadClick() {
    if (!state.unlocked || (dom.btnDownload && dom.btnDownload.disabled)) {
      return;
    }

    const openedWin = window.open(CONFIG.APK_DOWNLOAD_URL, "_blank", "noopener,noreferrer");
    if (!openedWin) {
      window.location.assign(CONFIG.APK_DOWNLOAD_URL);
    }
  }

  function handleVisibilityChange() {
    if (state.unlocked) {
      applyUnlockedState();
      return;
    }
    if (state.channelClicked && state.endTimestamp) {
      const remaining = getRemainingSeconds();
      if (remaining <= 0) {
        applyUnlockedState();
      } else {
        applyProcessingState(remaining);
        startCountdownLoop();
      }
    }
  }

  function init() {
    if (dom.btnChannel) {
      dom.btnChannel.setAttribute("href", CONFIG.CHANNEL_URL);
      dom.btnChannel.setAttribute("target", "_blank");
      dom.btnChannel.setAttribute("rel", "noopener noreferrer");
      dom.btnChannel.addEventListener("click", handleChannelClick);
    }

    if (dom.btnDownload) {
      dom.btnDownload.addEventListener("click", handleDownloadClick);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    loadState();

    if (state.unlocked) {
      applyUnlockedState();
    } else if (state.channelClicked && typeof state.endTimestamp === "number") {
      const remaining = getRemainingSeconds();
      if (remaining <= 0) {
        applyUnlockedState();
      } else {
        startCountdownLoop();
      }
    } else {
      applyLockedState();
    }

    if (window.VipIcons && typeof window.VipIcons.renderAll === "function") {
      window.VipIcons.renderAll();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
