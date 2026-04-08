"use client";

import type { Country } from "@/types";

interface FlagCardProps {
  country: Country;
  animationKey: number;
}

export default function FlagCard({ country, animationKey }: FlagCardProps) {
  return (
    <div key={animationKey} className="flag-card-enter flex justify-center py-3">
      <div className="flag-container rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
        <span
          className={`fi fi-${country.iso2}`}
          style={{ display: "block" }}
          aria-label={`Flag of ${country.name}`}
        />
      </div>
    </div>
  );
}
