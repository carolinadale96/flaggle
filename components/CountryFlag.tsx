import * as Flags from "country-flag-icons/react/3x2";

interface CountryFlagProps {
  iso2: string;           // lowercase 2-letter code
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}

export default function CountryFlag({ iso2, className, style, "aria-label": ariaLabel }: CountryFlagProps) {
  const code = iso2.toUpperCase() as keyof typeof Flags;
  const Flag = Flags[code];
  if (!Flag) return null;
  return <Flag className={className} style={style} aria-label={ariaLabel} />;
}
