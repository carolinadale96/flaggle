// Explorer — compass
export default function Compass({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Outer ring */}
      <circle cx="16" cy="16" r="13" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="13" fill="none" stroke="#cbd5e1" strokeWidth="3" />
      {/* Bezel marks */}
      {[0, 90, 180, 270].map((deg) => (
        <line
          key={deg}
          x1={16 + 10 * Math.sin((deg * Math.PI) / 180)}
          y1={16 - 10 * Math.cos((deg * Math.PI) / 180)}
          x2={16 + 12.5 * Math.sin((deg * Math.PI) / 180)}
          y2={16 - 12.5 * Math.cos((deg * Math.PI) / 180)}
          stroke="#64748b"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
      {/* N/S/E/W labels */}
      <text x="16" y="7.5" textAnchor="middle" fontSize="3.5" fill="#ef4444" fontWeight="bold">N</text>
      <text x="16" y="26.5" textAnchor="middle" fontSize="3.5" fill="#64748b" fontWeight="bold">S</text>
      <text x="26" y="17" textAnchor="middle" fontSize="3.5" fill="#64748b" fontWeight="bold">E</text>
      <text x="6" y="17" textAnchor="middle" fontSize="3.5" fill="#64748b" fontWeight="bold">W</text>
      {/* Needle — north red */}
      <path d="M16 16 L14.5 22 L16 21 L17.5 22 Z" fill="#94a3b8" />
      <path d="M16 16 L14.5 10 L16 11 L17.5 10 Z" fill="#ef4444" />
      {/* Center */}
      <circle cx="16" cy="16" r="2" fill="#1e293b" />
      <circle cx="16" cy="16" r="1" fill="#f8fafc" />
    </svg>
  );
}
