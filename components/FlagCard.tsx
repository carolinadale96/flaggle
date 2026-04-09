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
      <div className="flag-container rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
        <CountryFlag
          iso2={country.iso2}
          style={{ width: "10rem", height: "6.5rem", display: "block" }}
          aria-label={`Flag of ${country.name}`}
        />
      </div>
    </div>
  );
}
