// Common alternate names accepted in hard mode
const ALTERNATES: Record<string, string[]> = {
  "United States": ["usa", "us", "united states of america", "america"],
  "United Kingdom": ["uk", "great britain", "britain", "england", "u.k."],
  "Russia": ["russian federation"],
  "South Korea": ["korea", "republic of korea"],
  "North Korea": ["democratic peoples republic of korea"],
  "Czech Republic": ["czechia"],
  "Czechia": ["czech republic"],
  "DR Congo": ["congo", "drc", "democratic republic of congo", "democratic republic of the congo", "zaire"],
  "Republic of the Congo": ["congo brazzaville"],
  "Ivory Coast": ["cote divoire", "cote d ivoire"],
  "Myanmar": ["burma"],
  "Eswatini": ["swaziland"],
  "North Macedonia": ["macedonia"],
  "Timor-Leste": ["east timor"],
  "São Tomé and Príncipe": ["sao tome and principe", "sao tome"],
  "Bosnia and Herzegovina": ["bosnia", "herzegovina"],
  "Trinidad and Tobago": ["trinidad"],
  "Antigua and Barbuda": ["antigua"],
  "Saint Kitts and Nevis": ["st kitts", "st kitts and nevis", "saint kitts"],
  "Saint Vincent and the Grenadines": ["st vincent", "saint vincent"],
  "Papua New Guinea": ["png"],
  "New Zealand": ["nz"],
  "South Africa": ["rsa"],
  "United Arab Emirates": ["uae", "u.a.e."],
  "UAE": ["united arab emirates"],
  "Central African Republic": ["car"],
  "Saint Lucia": ["st lucia"],
  "Saint Barthélemy": ["st barthelemy"],
};

function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9\s]/g, "")     // strip punctuation
    .replace(/\s+/g, " ");
}

export function matchesCountryName(guess: string, official: string): boolean {
  if (!guess.trim()) return false;
  const g = normalize(guess);
  if (g === normalize(official)) return true;
  const alts = ALTERNATES[official] ?? [];
  return alts.includes(g);
}
