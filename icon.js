(function () {
  const FALLBACK_SVG = {
    crown: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    unlock: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
    download: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
    "check-circle": '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>',
    clock: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    "external-link": '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>'
  };

  const LUCIDE_NAME_MAP = {
    crown: "crown",
    whatsapp: "message-circle",
    youtube: "youtube",
    lock: "lock",
    unlock: "unlock",
    download: "download",
    "check-circle": "circle-check",
    clock: "clock",
    "external-link": "external-link"
  };

  function setVipIcon(el, name) {
    if (!el) return;
    const key = Object.prototype.hasOwnProperty.call(FALLBACK_SVG, name) ? name : "lock";
    el.dataset.vipIcon = key;

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      const lucideName = LUCIDE_NAME_MAP[key];
      el.innerHTML = `<i data-lucide="${lucideName}"></i>`;
      window.lucide.createIcons({ root: el, attrs: { "stroke-width": 2.1 } });
      if (!el.querySelector("svg")) {
        el.innerHTML = FALLBACK_SVG[key];
      }
    } else {
      el.innerHTML = FALLBACK_SVG[key];
    }
  }

  function renderAllVipIcons(root = document) {
    const slots = root.querySelectorAll("[data-vip-icon]");
    slots.forEach((slot) => {
      const iconName = slot.getAttribute("data-vip-icon");
      setVipIcon(slot, iconName);
    });
  }

  window.VipIcons = {
    setIcon: setVipIcon,
    renderAll: renderAllVipIcons
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => renderAllVipIcons());
  } else {
    renderAllVipIcons();
  }

  window.addEventListener("load", () => renderAllVipIcons());
})();
