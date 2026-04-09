"use client";

import { useState } from "react";

interface ShareButtonProps {
  text: string;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
}

export default function ShareButton({ text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  async function handleNativeShare() {
    try {
      await navigator.share({ text });
    } catch {
      // user cancelled or not supported — fall back to copy
      await copyText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleCopy() {
    await copyText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleWhatsApp() {
    // Use native share sheet if available — passes text without URL encoding (no emoji mangling)
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // user cancelled — do nothing
        return;
      }
    }
    // Desktop fallback: whatsapp:// deep link goes directly to the app, skipping wa.me redirect
    window.open(`whatsapp://send?text=${encodeURIComponent(text)}`, "_blank");
  }

  function handleSMS() {
    // &body= works on iOS; ?body= works on Android — try both via &
    window.location.href = `sms:&body=${encodeURIComponent(text)}`;
  }

  return (
    <div className="space-y-2">
      {/* Primary share button */}
      {canNativeShare ? (
        <button
          onClick={handleNativeShare}
          className="w-full py-3 rounded-xl font-bold text-base transition-all duration-200 border active:scale-95 bg-amber-400 hover:bg-amber-300 border-amber-300 text-slate-900"
        >
          📤 Share result
        </button>
      ) : (
        <button
          onClick={handleCopy}
          className={`w-full py-3 rounded-xl font-bold text-base transition-all duration-200 border active:scale-95 ${
            copied
              ? "bg-green-500 border-green-400 text-white"
              : "bg-amber-400 hover:bg-amber-300 border-amber-300 text-slate-900"
          }`}
        >
          {copied ? "✓ Copied!" : "📋 Copy result"}
        </button>
      )}

      {/* Quick share row */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-green-400 hover:text-green-600 dark:hover:text-green-400 transition-all active:scale-95"
        >
          💬 WhatsApp
        </button>
        <button
          onClick={handleSMS}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95"
        >
          ✉️ Messages
        </button>
      </div>
    </div>
  );
}
