"use client";

import { useEffect } from "react";

/**
 * Regista o service worker da PWA (public/sw.js) assim que a app carrega
 * no browser. Falha em silêncio em ambientes sem suporte (ex: SSR).
 */
export default function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Silenciosamente ignorado — a app funciona sem SW, apenas sem offline-cache.
      });
    });
  }, []);

  return null;
}
