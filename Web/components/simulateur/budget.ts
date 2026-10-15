import { CHILD_RATE, CIRCUITS, groupPrice, monthOf, monthsOf, type Circuit, type RegionId } from "@/components/circuits/catalog-data";

/**
 * Gammes de voyage selon le budget par personne et par jour (une nuit sur place = un jour), hors vols internationaux.
 * Seuils, prestations et montants de référence à valider par l'équipe terrain.
 */
export const TIERS = [
  {
    id: "eco",
    name: "Économique",
    min: 0,
    max: 100,
    /** Montant par jour et par personne appliqué quand on choisit ce profil. */
    preset: 75,
    icon: "hiking",
    zone: "bg-tertiary-fixed-dim",
    text: "Hôtels familiaux, taxi-brousse entre les villes et guides locaux dans les parcs.",
    includes: [
      { icon: "bed", label: "Hôtels familiaux et gîtes, chambre double avec salle d'eau" },
      { icon: "directions_bus", label: "Taxi-brousse ou minibus partagé entre les villes" },
      { icon: "hiking", label: "Guide local et entrées dans les parcs" },
      { icon: "restaurant", label: "Petit-déjeuner ; autres repas à votre charge" },
    ],
  },
  {
    id: "comfort",
    name: "Confort",
    min: 100,
    max: 185,
    preset: 140,
    icon: "forest",
    zone: "bg-secondary-fixed-dim",
    text: "Écolodges de charme, 4x4 privé avec chauffeur et guides agréés dans les parcs.",
    includes: [
      { icon: "bed", label: "Écolodges de charme" },
      { icon: "directions_car", label: "4x4 privé avec chauffeur sur tout le parcours" },
      { icon: "hiking", label: "Guides agréés et entrées dans les parcs" },
      { icon: "restaurant", label: "Petit-déjeuner et dîner" },
    ],
  },
  {
    id: "luxe",
    name: "Haut de gamme",
    min: 185,
    max: Infinity,
    preset: 240,
    icon: "hotel_class",
    zone: "bg-primary-fixed-dim",
    text: "Lodges haut de gamme, vols intérieurs pour les longues distances et guide naturaliste dédié.",
    includes: [
      { icon: "bed", label: "Lodges haut de gamme, sur la côte ou sur les îles" },
      { icon: "flight", label: "Vols intérieurs (Madagascar Airlines) pour les longues distances, 4x4 privé sur place" },
      { icon: "hiking", label: "Guide naturaliste dédié et entrées dans les parcs" },
      { icon: "restaurant", label: "Pension complète" },
    ],
  },
] as const;

/** Non inclus quel que soit le profil. */
export const NOT_INCLUDED = ["vols internationaux", "visa", "assurance voyage", "pourboires"];

export type Tier = (typeof TIERS)[number];

/** Budget conseillé par personne et par jour, au milieu de la gamme Confort. */
export const ADVISED_PER_NIGHT = 140;

/** Bornes de la piste du curseur, par personne et par jour : en dessous, le voyage n'est pas réalisable ; au-delà, il relève du sur-mesure. */
export const TRACK_FLOOR = 40;
export const TRACK_CEIL = 300;
/** Au-delà de ce montant, la saisie est refusée (faute de frappe probable). */
export const MAX_INPUT = 250_000;
/** À partir de 10 voyageurs, le départ est privatisé et chiffré sur devis. */
export const PRIVATE_GROUP = 10;

export const perPersonPerNight = (budget: number, adults: number, kids: number, nights: number) =>
  budget / Math.max(1, adults + kids) / Math.max(1, nights);

export const tierFor = (perNight: number): Tier => TIERS.find((t) => perNight < t.max) ?? TIERS[TIERS.length - 1];

const round5 = (n: number, dir: "down" | "up") => (dir === "down" ? Math.floor(n / 5) : Math.ceil(n / 5)) * 5;

/** Fourchette affichée « environ 125 à 155 € par jour et par personne » : ±10 % autour de la moyenne, arrondi à 5 €. */
export const dailyRange = (perNight: number): [number, number] => [round5(perNight * 0.9, "down"), round5(perNight * 1.1, "up")];

/** Piste du curseur en montant total pour le groupe, au pas de 50 €. */
export function trackBounds(travelers: number, nights: number) {
  const units = Math.max(1, travelers) * Math.max(1, nights);
  return { min: Math.floor((TRACK_FLOOR * units) / 50) * 50, max: Math.ceil((TRACK_CEIL * units) / 50) * 50, step: 50 };
}

/** Les enfants comptent au tarif enfant du catalogue ; arrondi à la centaine. */
export const advisedBudget = (adults: number, kids: number, nights: number) =>
  Math.round((ADVISED_PER_NIGHT * (adults + kids * CHILD_RATE) * nights) / 100) * 100;

export type TripInput = { regions: RegionId[]; departure: string; nights: number; adults: number; kids: number; budget: number | null };

/** Mêmes règles que le filtre « Dans mon budget » de la page Explorer, pour que le nombre annoncé soit celui de la liste. */
export function circuitsWithin(t: TripInput) {
  return CIRCUITS.filter(
    (c) =>
      (!t.regions.length || t.regions.includes(c.region)) &&
      c.maxGroup >= t.adults + t.kids &&
      (t.budget === null || groupPrice(c, t.adults, t.kids).total <= t.budget),
  );
}

export const inSeason = (c: Circuit, departure: string) => Boolean(departure) && monthsOf(c).includes(monthOf(departure));

/** Lien vers Explorer avec les mêmes paramètres que la recherche, filtré sur le budget. */
export function catalogHref(t: TripInput, withinBudget = true) {
  const p = new URLSearchParams();
  if (t.regions.length) p.set("region", t.regions.join(","));
  if (t.departure) p.set("depart", t.departure);
  p.set("nuits", String(t.nights));
  p.set("adultes", String(t.adults));
  if (t.kids) p.set("enfants", String(t.kids));
  if (t.budget !== null) {
    p.set("budget", String(t.budget));
    if (withinBudget) p.set("dansbudget", "1");
  }
  return `/circuits?${p}#resultats`;
}

/** Étape 3 du tunnel (Budget), préremplie par `BookingFromUrl`. */
export function tunnelHref(t: TripInput) {
  const p = new URLSearchParams({ adultes: String(t.adults), enfants: String(t.kids), nuits: String(t.nights) });
  if (t.budget !== null) p.set("budget", String(t.budget));
  if (t.departure) p.set("depart", t.departure);
  return `/reservation/budget?${p}`;
}
