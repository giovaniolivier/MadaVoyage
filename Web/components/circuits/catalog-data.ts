import { CHILD_RATE, DESTINATIONS as BOOKABLE } from "@/components/reservation/pricing";

export const REGIONS = [
  { id: "all", label: "Toutes les régions" },
  { id: "hautes-terres", label: "Hautes Terres & RN7 (Isalo)" },
  { id: "nord", label: "Nord & Archipels (Nosy Be, Diego)" },
  { id: "ouest", label: "Ouest Sauvage & Tsingy" },
  { id: "est", label: "Côte Est & Sainte-Marie" },
] as const;

export type RegionId = Exclude<(typeof REGIONS)[number]["id"], "all">;

export const DURATIONS = [
  { id: "court", label: "Court séjour (≤ 5 jours)", test: (d: number) => d <= 5 },
  { id: "moyen", label: "Immersion moyenne (6 - 10j)", test: (d: number) => d >= 6 && d <= 10 },
  { id: "long", label: "Grande traversée (> 10 jours)", test: (d: number) => d > 10 },
] as const;

export type DurationId = (typeof DURATIONS)[number]["id"];

export const THEMES = [
  { id: "marin", icon: "scuba_diving", iconClass: "text-primary", label: "Sanctuaires Marins & Corail" },
  { id: "foret", icon: "forest", iconClass: "text-secondary", label: "Forêts primaires & Lémuriens" },
  { id: "trek", icon: "hiking", iconClass: "text-tertiary", label: "Trek, Canyons & Aventure" },
  { id: "immersion", icon: "handshake", iconClass: "text-on-surface-variant", label: "Immersion villageoise & Fihavanana" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const LODGINGS = [
  { id: "lodge", label: "Éco-Lodge 4★ de charme" },
  { id: "bivouac", label: "Bivouac sous les étoiles" },
  { id: "hote", label: "Maisons d'hôtes villageoises" },
] as const;

export type LodgingId = (typeof LODGINGS)[number]["id"];

export type Level = "Facile" | "Modéré" | "Sportif";

export type Circuit = {
  id: string;
  title: string;
  region: RegionId;
  regionLabel: string;
  days: number;
  nights: number;
  rating: number;
  reviews: number;
  /** Prix par adulte, base 2 adultes ; un enfant paie `CHILD_RATE` de ce prix. */
  priceEur: number;
  maxGroup: number;
  themes: ThemeId[];
  lodgings: LodgingId[];
  /** Une seule pastille de thème sur la photo, à côté du niveau. */
  theme: { label: string; icon: string };
  level: Level;
  /** Âge minimum conseillé pour les enfants. */
  minAge: number;
  /** Période conseillée : affichée sur la carte et comparée au mois de départ choisi. */
  months: string;
  /** Ce que comprend le prix, en plus des nuits. */
  includes: string;
  places: string[];
  image: { src: string; alt: string };
  href: string;
};

const IMG = "https://lh3.googleusercontent.com/aida-public/";

export const CIRCUITS: Circuit[] = [
  {
    id: "rn7",
    title: "La Mythique Route Nationale 7 & Massif de l'Isalo",
    region: "hautes-terres",
    regionLabel: "Hautes Terres & RN7",
    days: 10,
    nights: 9,
    rating: 4.9,
    reviews: 214,
    priceEur: 1290,
    maxGroup: 8,
    themes: ["foret", "trek", "immersion"],
    lodgings: ["lodge"],
    theme: { label: "Grand classique", icon: "route" },
    level: "Modéré",
    minAge: 6,
    months: "Toute l'année",
    includes: "4x4 avec chauffeur, vol retour inclus",
    places: ["Antsirabe", "Ranomafana", "Isalo", "Ifaty"],
    image: {
      src: `${IMG}AB6AXuA0AMde6BBid8kfvFuwMk11GQ9yNU28yf2zuY9yVQHbzPhMH53L90Jr3ojeZXcFsbgIDlQYp35k0enoZJhwQsjuuL7nQDejR_cpO2YkVqiTj8BgTA0YnGj-8igNQ6fArdfc-nKqCEIzBHXHEUcgn14NSH2_ollE71UxRZJ2c1mK0y367mVHm_GlXtGe-Zw-bGkM0N0-5XJ1F9-gqORwY9zdglzurVOZr_50iWeuY_iyDGmVjkcLAds`,
      alt: "Canyons de grès du parc national de l’Isalo à l’heure dorée",
    },
    href: "/circuits/rn7",
  },
  {
    id: "nosy-be",
    title: "Nosy Be, Archipels Secrets & Baie des Russes",
    region: "nord",
    regionLabel: "Nord-Ouest · Canal du Mozambique",
    days: 8,
    nights: 7,
    rating: BOOKABLE["nosy-be"].rating,
    reviews: BOOKABLE["nosy-be"].reviews,
    priceEur: BOOKABLE["nosy-be"].fromPrice,
    maxGroup: 6,
    themes: ["marin"],
    lodgings: ["lodge", "bivouac"],
    theme: { label: "Lagon & corail", icon: "scuba_diving" },
    level: "Facile",
    minAge: 4,
    months: "Toute l'année",
    includes: "transferts et sorties en boutre",
    places: ["Nosy Tanikely", "Nosy Iranja", "Baie des Russes"],
    image: {
      src: `${IMG}AB6AXuA366ERebDHMCw7Ml6qEuCRg-H-0ngb8weStl6kypc32Qy8sxbV3prampbgVlha8ZbalfSJQRlMIvqJePsKlrSzFpGvy4FhaPHHHzYTKBh3AcSom4Tm8XSBnHs2XpZ4l_8ABVPs2U5IPWssV3J_WFSEUClznEJgejSsVUbnW1CBfRAS788RKquaizOh9rzqPI5jLDR6nLj_tvR7-HELz7XAnk9T29jh8ivnXI3QiFVGaMi-2GmzSy4`,
      alt: "Boutre traditionnel sur les eaux turquoise de l’archipel de Nosy Be",
    },
    href: "/reservation/dates?circuit=nosy-be&nuits=7",
  },
  {
    id: "diego",
    title: "Le Grand Nord Sauvage : Diego & Tsingy Rouges",
    region: "nord",
    regionLabel: "Extrême Nord · Diego Suarez",
    days: 9,
    nights: 8,
    rating: BOOKABLE["grand-nord"].rating,
    reviews: BOOKABLE["grand-nord"].reviews,
    priceEur: BOOKABLE["grand-nord"].fromPrice,
    maxGroup: 8,
    themes: ["trek", "marin", "foret"],
    lodgings: ["lodge"],
    theme: { label: "Tsingy & lagon", icon: "landscape" },
    level: "Modéré",
    minAge: 8,
    months: "Avril à novembre",
    includes: "4x4 privatif et transferts",
    places: ["Mer d'Émeraude", "Montagne d'Ambre", "Ankarana"],
    image: {
      src: `${IMG}AB6AXuAe_5UZqDN0nKgRn0NRbXuBxD_SknMEKJZ8B7_1EAGBFF_3R_n6fm0v1DCPKmfDX1DPqdIxmB22GkloT8PdtAB0BKaLtZLdMC0HATla8UQ2XUMQ6uzYBrejdfsRKCeUXkgQI5Tk5nZUJK3qqxKY-WGZfGOhPQOUMUoQDgsAxXPktBRjCW3gbF4QN21alMnaESwJqCMCrY6eBjxNwJUV3ArRp1pbN4YOeAz9Q39dS8DLAEaDtVNPB6o`,
      alt: "Tsingy Rouges dominant la mer d'Émeraude et ses boutres, près de Diego Suarez",
    },
    href: "/reservation/dates?circuit=diego&nuits=8",
  },
  {
    id: "sainte-marie",
    title: "Sanctuaire des Baleines : Sainte-Marie & Île aux Nattes",
    region: "est",
    regionLabel: "Côte Est · Sainte-Marie",
    days: 7,
    nights: 6,
    rating: BOOKABLE["sainte-marie"].rating,
    reviews: BOOKABLE["sainte-marie"].reviews,
    priceEur: BOOKABLE["sainte-marie"].fromPrice,
    maxGroup: 10,
    themes: ["marin", "immersion"],
    lodgings: ["lodge", "hote"],
    theme: { label: "Baleines", icon: "waves" },
    level: "Facile",
    minAge: 4,
    months: "Juillet à septembre",
    includes: "vol aller-retour et transferts",
    places: ["Île aux Nattes", "Ambodifotatra", "Baie d'Ampanihy"],
    image: {
      src: `${IMG}AB6AXuAUqbRUQF-sRwyk6tcnpG60I8tW5wnjZcf2mWLD4_D28sr6uiNatYFT1kaFrIf5TKx92KXDGqHUEztiUF_gmx0dmDMpXWqKWZK1hoPMdbZDECD45_jo_8PEUtgisFyHPgP4mmtiHXiMzshNvET-Qe-X-WVzIoVB08_NTEimULm-z7JKTr2qcj9wi2SFXHZVX2ACEePhaUt6B3SxgiErpXu5Sr2US0B6d5eYDvXbn1gzO_cpQozYb7I`,
      alt: "Baleine à bosse sautant au large de l’île Sainte-Marie",
    },
    href: "/reservation/dates?circuit=sainte-marie&nuits=6",
  },
  {
    id: "tsiribihina",
    title: "Descente Tsiribihina & Tsingy de Bemaraha",
    region: "ouest",
    regionLabel: "Ouest Sauvage · Menabe",
    days: 11,
    nights: 10,
    rating: 4.7,
    reviews: 88,
    priceEur: 1450,
    maxGroup: 6,
    themes: ["trek", "immersion"],
    lodgings: ["bivouac", "lodge"],
    theme: { label: "Fleuve & Tsingy", icon: "kayaking" },
    level: "Sportif",
    minAge: 12,
    months: "Mai à octobre",
    includes: "4x4, chaland et bivouacs",
    places: ["Gorges de Manambolo", "Grands Tsingy", "Allée des Baobabs"],
    image: {
      src: `${IMG}AB6AXuCGLP5R8McmoOAwx-enz4eeJ9YsHePXH6gzJbGLQ8EO4ZXDFOjgmARzxzwJ42UaAMbyfqIcM_PbO-wnARovfRSjdXwY6qAg34BRQhdZ0L7en0XU8ELqbL6X11fFpLgnH1bE6awzQAUt_s60y2Q6NDMW9uR5b0DDbzA-fEala4kXyVfX7GRbtD__ehrOcXn3w7DlHhYCZ-r5gIRvgf5uNyqqb8xdXYuRn27l2kh3SDBKWcozMzIjKM0`,
      alt: "Labyrinthe calcaire des Tsingy de Bemaraha traversé par un pont suspendu",
    },
    href: "/reservation/dates?circuit=tsiribihina&nuits=10",
  },
  {
    id: "andasibe",
    title: "Les Brumes d'Andasibe & Forêt d'Émeraude",
    region: "est",
    regionLabel: "Forêt de l'Est · Alaotra-Mangoro",
    days: 5,
    nights: 4,
    rating: 4.9,
    reviews: 150,
    priceEur: 650,
    maxGroup: 10,
    themes: ["foret"],
    lodgings: ["lodge"],
    theme: { label: "Lémuriens", icon: "forest" },
    level: "Facile",
    minAge: 4,
    months: "Toute l'année",
    includes: "transferts depuis Antananarivo",
    places: ["Analamazaotra", "Mitsinjo", "Vakôna"],
    image: {
      src: `${IMG}AB6AXuBPC47C_jjBR12_RLS_JYyxFYRhJkZWWflGyYDVPJqhtGc0pR1fGjuF_BarmIzkUs5g3QVOx02nluJ3oXz_H5Hgd2lCP_xJT-7aD_M9N7lui5XQIEf8ZEd_PaCZLBm00jew5D8fj9aJEbo2HsBfREMfRXoTm_bAPqyZCnCrFq3S-trwYcKCmO-DmNR5LTTQMTqskFdl-NIZ9UN29TYGT1ZlqHo1Ok2OxyRvXwCsmk4W6hVrH9t9XMM`,
      alt: "Indri perché dans la canopée brumeuse d’Andasibe",
    },
    href: "/reservation/dates?circuit=andasibe&nuits=4",
  },
  {
    id: "andringitra",
    title: "Andringitra, Pic Boby & Vallée du Tsaranoro",
    region: "hautes-terres",
    regionLabel: "Hautes Terres · Ambalavao",
    days: 8,
    nights: 7,
    rating: 4.8,
    reviews: 73,
    priceEur: 990,
    maxGroup: 8,
    themes: ["trek", "immersion"],
    lodgings: ["bivouac", "hote"],
    theme: { label: "Trek & sommets", icon: "hiking" },
    level: "Sportif",
    minAge: 12,
    months: "Avril à octobre",
    includes: "guide, porteurs et bivouacs",
    places: ["Pic Boby", "Tsaranoro", "Ambalavao"],
    image: {
      src: `${IMG}AB6AXuANzmWHaUb9VtlgvUg29raTuNu1ex10gd1daErkQkVxu0yrw8p7GB4ekSkfuqYQlHBoXKPF7fUJXl9-uEUBxqJiP5XjnP1HTQLYdrZX64nnMXT7-VztaWKQsO7dcOGaAvcpe0wg8OPjBWDrotB2BB2yQJxrSDyeZQV69Lyh_OEnw79UwSLl7yDbpH76fi-kHg31FBI6FzeSIA9Cx0FbE4yERRSsnq70ihlyI55AcPCtzDx8v9GfWeM`,
      alt: "Rizières en terrasses du pays Betsileo sur la route d’Ambalavao",
    },
    href: "/reservation/dates?circuit=andringitra&nuits=7",
  },
  {
    id: "nosy-be-express",
    title: "Escapade Nosy Be : Lokobe & Nosy Komba",
    region: "nord",
    regionLabel: "Nord · Nosy Be",
    days: 4,
    nights: 3,
    rating: 4.7,
    reviews: 112,
    priceEur: 290,
    maxGroup: 10,
    themes: ["marin", "foret"],
    lodgings: ["lodge"],
    theme: { label: "Lagon & lémuriens", icon: "beach_access" },
    level: "Facile",
    minAge: 4,
    months: "Toute l'année",
    includes: "transferts et sorties en mer",
    places: ["Lokobe", "Nosy Komba", "Ambatoloaka"],
    image: {
      src: `${IMG}AB6AXuBMBI4fC-1m6CDy1XRA0Za4X5khehryYVku88Grson1o_4dwVQQimNFmdVojDNdbbcUVL2XZ-TSgnsftczLI159q8KhCyldGtqahJZHD9NmnCfGd9txdnZRca7Xu5Gez_q6ObFZvAhaqfFiROFwdPzO0krY-jNh5WBQHNwC_k9B-ev3f0r473Igd55rUZ3ZQpLJZY6UvGDy76Z9jOTptpx-hZJ1E4nhXo_AqPtXMFpXKVd4aC503M8`,
      alt: "Banc de sable et eaux turquoise au large de Nosy Be",
    },
    href: "/reservation/dates?circuit=nosy-be-express&nuits=3",
  },
  {
    id: "baobabs",
    title: "Allée des Baobabs & Forêt de Kirindy",
    region: "ouest",
    regionLabel: "Ouest · Morondava",
    days: 4,
    nights: 3,
    rating: 4.8,
    reviews: 141,
    priceEur: 590,
    maxGroup: 10,
    themes: ["foret", "immersion"],
    lodgings: ["lodge", "hote"],
    theme: { label: "Baobabs & fossa", icon: "park" },
    level: "Facile",
    minAge: 4,
    /** Piste Morondava–Kirindy coupée par les pluies de décembre à mars : période à valider par l'équipe terrain. */
    months: "Avril à novembre",
    includes: "vol aller-retour et 4x4",
    places: ["Allée des Baobabs", "Kirindy", "Morondava"],
    image: {
      src: `${IMG}AB6AXuAvGIKjRcgmLwYvqiv4oKncg5q6lpLOjuprKW0XoN0_fgcltE-cDG5-YkSlS1ycPVIQzWsf4raaqpxtfQKSS9KGpnCJHSsXztptX9HX4_JukqGXKwCITt3lenzos4PoC8zpmD8yTuQ9P_Wlkh1t5O_fDREH61ns16d9IR_g2bboEjAoQ02MFoudFUP0oZkJ9j2p5LoKW5513Ut9kKqegq6X-9eSvmI4IWSO7grBBiJUf1t9M1z8f00`,
      alt: "Allée des Baobabs de Morondava au coucher du soleil",
    },
    href: "/reservation/dates?circuit=baobabs&nuits=3",
  },
  {
    id: "pangalanes",
    title: "Canal des Pangalanes & Villages de Pêcheurs",
    region: "est",
    regionLabel: "Côte Est · Tamatave",
    days: 6,
    nights: 5,
    rating: 4.6,
    reviews: 64,
    priceEur: 780,
    maxGroup: 8,
    themes: ["immersion", "marin"],
    lodgings: ["hote", "lodge"],
    theme: { label: "Immersion", icon: "handshake" },
    level: "Facile",
    minAge: 6,
    months: "Avril à novembre",
    includes: "transferts et pirogue",
    places: ["Tamatave", "Akanin'ny Nofy", "Ampitabe"],
    image: {
      src: `${IMG}AB6AXuDMZ3UqfLWcPcFXNPjYJKOKEimkvdcD_Op8qGZPD_1V9-w7H6iKhRpnRee2YQJlxEx64uGSqScGy_k7r_WEeFX_EYHxTM3Tc_BJKm-7DYCBbVyEApiVKPfOaYZaVdgGXYutlBrAsyJ7jD9GyakJr_PZ3cLwj3cDHuPbkSqVjl0hYYzU7XFdqG1U0-60f7PTUIvFFGO5MvGn2YwbwhGj4Z5251hy7SCYXXufdfWeBTXEeiCn_gTLECQ`,
      alt: "Lagon bordé de cocotiers sur la côte Est",
    },
    href: "/reservation/dates?circuit=pangalanes&nuits=5",
  },
  {
    id: "grande-traversee",
    title: "La Grande Traversée : d'Antananarivo à Tuléar",
    region: "hautes-terres",
    regionLabel: "Hautes Terres & Grand Sud",
    days: 15,
    nights: 14,
    rating: 4.9,
    reviews: 58,
    priceEur: 1990,
    maxGroup: 6,
    themes: ["trek", "foret", "immersion"],
    lodgings: ["lodge", "bivouac", "hote"],
    theme: { label: "Grande traversée", icon: "route" },
    level: "Sportif",
    minAge: 12,
    months: "Avril à novembre",
    includes: "4x4, guides et vol retour",
    places: ["Ranomafana", "Andringitra", "Isalo", "Anakao"],
    image: {
      src: `${IMG}AB6AXuBsG13al8pzFgEuWspDJ8Krv5QWpALg72EdQ6OGDtdBvSZQiYvNjqCwOdDjzN1ianNORsetMl6EJuLPFI7AfLu1iBI5bA2vSX2NBdIladTwmxnIBobLG-DnRIYBBjnRArsV2E2R9UeBxmxkkjD4DDRDAQMr0XyLOsp3EX56j2fBs-kNHRzLXHiKAp3PCntnH15-jL1RzCLEZOWXNE5lQ4_eguCvJj0YQtALeDkS42d4kjdDl7ULlzI`,
      alt: "Makis catta sur les blocs de granit de la réserve d'Anja, entre Ambalavao et l'Andringitra",
    },
    href: "/reservation/dates?circuit=grande-traversee&nuits=14",
  },
  {
    id: "mitsio",
    title: "Croisière en Boutre : Archipel des Mitsio & Radama",
    region: "nord",
    regionLabel: "Nord-Ouest · Archipels",
    days: 12,
    nights: 11,
    rating: 4.9,
    reviews: 47,
    priceEur: 2350,
    maxGroup: 8,
    themes: ["marin"],
    lodgings: ["bivouac"],
    theme: { label: "Croisière en boutre", icon: "sailing" },
    level: "Modéré",
    minAge: 8,
    months: "Avril à novembre",
    includes: "boutre, équipage et repas à bord",
    places: ["Nosy Mitsio", "Îles Radama", "Nosy Be"],
    image: {
      src: `${IMG}AB6AXuBcpEix6A9DBSbjhJlIMRFk4Sx9K0yBiih6blbHStFyBlzuuV9yZJU13bwd5olptdY4g05--4ytfCXgHeQCk-BTyN2kQS9yZx2_ZFt1KEgsnEdsAGbZy5BcMSFuw8O9JcrUNjQqeweUx6WpPYQwHnrGua_uASZAOHCVajHKXVjkD_FD8gyPMyoyJK2NHi9tuWQbqIH66r4-izVMGkYskDkfGY84B8CXRMGmMYG8IffMPn0EW-zjOLY`,
      alt: "Eaux émeraude et plages de corail du nord de Madagascar",
    },
    href: "/reservation/dates?circuit=mitsio&nuits=11",
  },
];

export { CHILD_RATE };

/** Total du groupe, comparé au budget saisi (lui aussi « au total »). */
export function groupPrice(c: Circuit, adults: number, kids: number) {
  const child = Math.round(c.priceEur * CHILD_RATE);
  return { total: c.priceEur * adults + child * kids, adult: c.priceEur, child };
}

export const PRICE_MIN = 250;
export const PRICE_MAX = 2500;

export const LEVEL_OPTIONS: Level[] = ["Facile", "Modéré", "Sportif"];

export const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
] as const;

/** Mois conseillés (1 à 12), lus dans `months` : « Toute l'année » ou « Avril à novembre ». */
export function monthsOf(c: Circuit): number[] {
  const all = Array.from({ length: 12 }, (_, i) => i + 1);
  const range = c.months.match(/^(\S+) à (\S+)$/);
  if (!range) return all;
  const index = (name: string) => MONTHS.findIndex((m) => m.toLowerCase() === name.toLowerCase()) + 1;
  const from = index(range[1]);
  const to = index(range[2]);
  if (!from || !to) return all;
  return all.filter((m) => (from <= to ? m >= from && m <= to : m >= from || m <= to));
}

/** Mois (1 à 12) d'une date `AAAA-MM-JJ`, 0 sans date. */
export const monthOf = (date: string) => (date ? Number(date.slice(5, 7)) : 0);

/** Âge du plus jeune enfant : un circuit convient si son `minAge` ne le dépasse pas. */
export const CHILD_AGES = [
  { age: 4, label: "4 à 7 ans" },
  { age: 8, label: "8 à 11 ans" },
  { age: 12, label: "12 ans et plus" },
] as const;

export const RATING_STEPS = [4.6, 4.7, 4.8, 4.9] as const;

/**
 * Point d'ancrage de chaque circuit sur la carte (repère du `viewBox` de `MadagascarMap`), décalé si besoin pour que les
 * étiquettes de prix voisines ne se chevauchent pas.
 */
export const MAP_POSITIONS: Record<string, { x: number; y: number }> = {
  mitsio: { x: 330, y: 50 },
  diego: { x: 485, y: 24 },
  "nosy-be": { x: 420, y: 76 },
  "nosy-be-express": { x: 392, y: 124 },
  "sainte-marie": { x: 508, y: 232 },
  pangalanes: { x: 476, y: 298 },
  andasibe: { x: 418, y: 345 },
  tsiribihina: { x: 236, y: 317 },
  baobabs: { x: 224, y: 392 },
  rn7: { x: 362, y: 408 },
  andringitra: { x: 336, y: 474 },
  "grande-traversee": { x: 240, y: 545 },
};
