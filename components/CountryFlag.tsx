interface CountryFlagProps {
  iso2: string;           // lowercase 2-letter code
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}

export default function CountryFlag({ iso2, className, style, "aria-label": ariaLabel }: CountryFlagProps) {
  return (
    <img
      src={`https://flagcdn.com/${iso2.toLowerCase()}.svg`}
      alt={ariaLabel ?? iso2.toUpperCase()}
      className={className}
      style={style}
      loading="lazy"
    />
  );
}
