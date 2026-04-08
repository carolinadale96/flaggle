"use client";

import {
  CheckCircle, Star, Flame, Calendar, CalendarDays, Trophy,
  Compass, Landmark, Crown, Map, Globe, Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface IconConfig {
  Icon: LucideIcon;
  lightBg: string;
  darkBg: string;
  lightColor: string;
  darkColor: string;
}

export const ACHIEVEMENT_ICON_CONFIG: Record<string, IconConfig> = {
  first_correct:   { Icon: CheckCircle,  lightBg: "#dcfce7", darkBg: "#14532d55", lightColor: "#16a34a", darkColor: "#4ade80" },
  flawless:        { Icon: Star,         lightBg: "#fef9c3", darkBg: "#71390f55", lightColor: "#ca8a04", darkColor: "#fbbf24" },
  on_fire:         { Icon: Flame,        lightBg: "#fee2e2", darkBg: "#7f1d1d55", lightColor: "#dc2626", darkColor: "#f87171" },
  streak_3:        { Icon: Calendar,     lightBg: "#dbeafe", darkBg: "#1e3a5f55", lightColor: "#1d4ed8", darkColor: "#60a5fa" },
  streak_7:        { Icon: CalendarDays, lightBg: "#ede9fe", darkBg: "#3b076455", lightColor: "#7c3aed", darkColor: "#a78bfa" },
  streak_30:       { Icon: Trophy,       lightBg: "#fef3c7", darkBg: "#78350f55", lightColor: "#d97706", darkColor: "#fcd34d" },
  level_explorer:  { Icon: Compass,      lightBg: "#ccfbf1", darkBg: "#134e4a55", lightColor: "#0f766e", darkColor: "#2dd4bf" },
  level_diplomat:  { Icon: Landmark,     lightBg: "#fef3c7", darkBg: "#78350f55", lightColor: "#b45309", darkColor: "#fbbf24" },
  level_master:    { Icon: Crown,        lightBg: "#fae8ff", darkBg: "#58187255", lightColor: "#a21caf", darkColor: "#e879f9" },
  africa_expert:   { Icon: Map,          lightBg: "#fef3c7", darkBg: "#78350f55", lightColor: "#92400e", darkColor: "#fcd34d" },
  asia_expert:     { Icon: Map,          lightBg: "#fce7f3", darkBg: "#83184355", lightColor: "#9d174d", darkColor: "#f9a8d4" },
  europe_expert:   { Icon: Map,          lightBg: "#ede9fe", darkBg: "#3b076455", lightColor: "#4c1d95", darkColor: "#c4b5fd" },
  americas_expert: { Icon: Map,          lightBg: "#dcfce7", darkBg: "#14532d55", lightColor: "#14532d", darkColor: "#86efac" },
  globetrotter:    { Icon: Globe,        lightBg: "#e0f2fe", darkBg: "#0c4a6e55", lightColor: "#0369a1", darkColor: "#38bdf8" },
  comeback:        { Icon: Zap,          lightBg: "#fefce8", darkBg: "#71390f55", lightColor: "#ca8a04", darkColor: "#fde047" },
};

function useDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const update = () => setDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

interface AchievementIconProps {
  id: string;
  size?: number;
  locked?: boolean;
}

export default function AchievementIcon({ id, size = 36, locked = false }: AchievementIconProps) {
  const dark = useDark();
  const cfg = ACHIEVEMENT_ICON_CONFIG[id];
  if (!cfg) return null;

  const { Icon, lightBg, darkBg, lightColor, darkColor } = cfg;
  const iconSize = Math.round(size * 0.52);
  const radius = Math.round(size * 0.3);

  const bg = locked
    ? (dark ? "#1e293b" : "#f1f5f9")
    : (dark ? darkBg : lightBg);
  const color = locked
    ? (dark ? "#475569" : "#94a3b8")
    : (dark ? darkColor : lightColor);

  return (
    <span
      className="inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size, borderRadius: radius, backgroundColor: bg }}
    >
      <Icon size={iconSize} color={color} strokeWidth={2} />
    </span>
  );
}
