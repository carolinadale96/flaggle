const CONFIG: Record<string, { abbr: string; bg: string; text: string }> = {
  "Africa":        { abbr: "AF", bg: "#fef3c7", text: "#92400e" },
  "Asia":          { abbr: "AS", bg: "#fce7f3", text: "#9d174d" },
  "Europe":        { abbr: "EU", bg: "#ede9fe", text: "#4c1d95" },
  "North America": { abbr: "NA", bg: "#dcfce7", text: "#14532d" },
  "South America": { abbr: "SA", bg: "#d1fae5", text: "#065f46" },
  "Oceania":       { abbr: "OC", bg: "#e0f2fe", text: "#0c4a6e" },
};

export default function ContinentIcon({ continent, size = 24 }: { continent: string; size?: number }) {
  const cfg = CONFIG[continent];
  if (!cfg) return null;
  const fontSize = size * 0.38;
  const r = size * 0.28;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <rect x="0" y="0" width={size} height={size} rx={r} fill={cfg.bg} />
      <text
        x={size / 2}
        y={size / 2 + fontSize * 0.35}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        fill={cfg.text}
        letterSpacing="0.5"
      >
        {cfg.abbr}
      </text>
    </svg>
  );
}
