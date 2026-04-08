"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  inline?: boolean;
}

export default function CountdownTimer({ inline = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function compute() {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    }
    compute();
    const interval = setInterval(compute, 1000);
    return () => clearInterval(interval);
  }, []);

  if (inline) {
    return <span className="text-amber-500 dark:text-amber-400 font-mono font-bold text-sm tracking-wide">{timeLeft}</span>;
  }

  return (
    <div className="text-center space-y-1">
      <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Next game in</p>
      <p className="text-amber-500 dark:text-amber-400 text-2xl font-mono font-bold tracking-widest">{timeLeft}</p>
    </div>
  );
}
