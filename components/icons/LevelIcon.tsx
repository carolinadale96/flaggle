import Suitcase from "./levels/Suitcase";
import Airplane from "./levels/Airplane";
import Compass from "./levels/Compass";
import GlobeLevel from "./levels/GlobeLevel";
import Columns from "./levels/Columns";
import Medal from "./levels/Medal";
import Crown from "./levels/Crown";

const ICONS = [Suitcase, Airplane, Compass, GlobeLevel, Columns, Medal, Crown];

interface LevelIconProps {
  rank: number; // 1–7
  size?: number;
}

export default function LevelIcon({ rank, size = 32 }: LevelIconProps) {
  const Icon = ICONS[Math.min(rank - 1, 6)];
  return <Icon size={size} />;
}
