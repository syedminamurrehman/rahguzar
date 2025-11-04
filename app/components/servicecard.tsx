"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then(() => console.log("✅ Service Worker registered successfully."))
          .catch((err) =>
            console.log("❌ Service Worker registration failed:", err)
          );
      });
    }
  }, []);

  return null;
}
