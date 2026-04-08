interface LogoProps {
  size?: number;
}

export default function Logo({ size = 28 }: LogoProps) {
  const fontSize = size >= 32 ? "text-2xl" : size >= 24 ? "text-xl" : "text-base";
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoFlagGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <rect x="5" y="3" width="2" height="26" rx="1" fill="#94a3b8" />
        <circle cx="6" cy="3" r="2.5" fill="#f59e0b" />
        <path d="M7 6 L26 6 L26 18 Q20 21 14 18 Q10 16 7 18 Z" fill="url(#logoFlagGrad)" />
      </svg>
      <span className={`${fontSize} font-extrabold tracking-tight text-slate-900 dark:text-white`}>
        Flaggle
      </span>
    </div>
  );
}
