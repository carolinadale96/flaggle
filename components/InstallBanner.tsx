"use client";

import { useEffect, useState } from "react";
import { X, Share, Download } from "lucide-react";

const DISMISSED_KEY = "flaggle_install_dismissed";

type Platform = "ios" | "android" | null;

function detectPlatform(): Platform {
  if (typeof window === "undefined") return null;
  // Already installed as standalone — don't show
  if (window.matchMedia("(display-mode: standalone)").matches) return null;
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua) && /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua)) return "ios";
  return null; // android is handled via beforeinstallprompt event
}

export default function InstallBanner() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // Android: capture the native install prompt
    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> });
      setPlatform("android");
      setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // iOS: show manual instructions
    const p = detectPlatform();
    if (p === "ios") {
      setPlatform("ios");
      setVisible(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setDeferredPrompt(null);
  }

  if (!visible || !platform) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center">
          <Download size={18} className="text-slate-900" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Add Flaggle to your home screen</p>
          {platform === "ios" ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tap <Share size={11} className="inline mb-0.5" /> then <span className="font-medium">"Add to Home Screen"</span> for the full app experience.
            </p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Install for offline play and a cleaner experience.
            </p>
          )}
          {platform === "android" && (
            <button
              onClick={handleInstall}
              className="mt-2 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold rounded-lg transition-colors active:scale-95"
            >
              Install
            </button>
          )}
        </div>
        <button onClick={dismiss} className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
