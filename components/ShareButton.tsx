"use client";

import { useState } from "react";
import { FLAGGLE_URL } from "@/lib/share";

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
      await navigator.share({ text, url: FLAGGLE_URL });
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

  return (
    <button
      onClick={canNativeShare ? handleNativeShare : handleCopy}
      className={`w-full py-3 rounded-xl font-bold text-base transition-all duration-200 border active:scale-95 ${
        copied
          ? "bg-green-500 border-green-400 text-white"
          : "bg-amber-400 hover:bg-amber-300 border-amber-300 text-slate-900"
      }`}
    >
      {copied ? "✓ Copied!" : "📤 Share your score"}
    </button>
  );
}
