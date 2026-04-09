"use client";

import type { Country } from "@/types";
import CountryFlag from "@/components/CountryFlag";

interface FlagCardProps {
  country: Country;
  animationKey: number;
}

export default function FlagCard({ country, animationKey }: FlagCardProps) {
  return (
    <div key={animationKey} className="flag-card-enter flex justify-center py-3">
      <div className="flag-container" style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.18))" }}>
        <CountryFlag
          iso2={country.iso2}
          style={{ width: "10rem", height: "auto", display: "block" }}
          aria-label={`Flag of ${country.name}`}
        />
      </div>
    </div>
  );
}
