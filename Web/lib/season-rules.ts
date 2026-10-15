/**
 * Règles de saison telles que paramétrées dans le back-office (cahier des charges, § 2.8).
 * Seule source des conseils de saison affichés sur le site : calendrier du tunnel, choix du mois, recherche.
 */

export type SeasonTone = "recommended" | "high" | "neutral" | "warning";

export type SeasonRule = {
  /** Mois concernés, de 0 (janvier) à 11 (décembre). */
  months: number[];
  label: string;
  tone: SeasonTone;
  /** Saison sèche : pistes praticables sur l'ensemble de l'île. */
  dry: boolean;
  advice: string;
};

export const SEASON_RULES: SeasonRule[] = [
  {
    months: [0, 1],
    label: "Saison des pluies",
    tone: "warning",
    dry: false,
    advice: "Risque de cyclones sur le nord et l'est ; certaines pistes de l'ouest sont fermées.",
  },
  {
    months: [2],
    label: "Fin des pluies",
    tone: "neutral",
    dry: false,
    advice: "Averses encore fréquentes ; pistes de l'ouest encore difficiles.",
  },
  {
    months: [3, 4],
    label: "Saison sèche",
    tone: "neutral",
    dry: true,
    advice: "Début de la saison sèche : nature encore verte, peu d'affluence.",
  },
  { months: [5], label: "Saison sèche", tone: "neutral", dry: true, advice: "Temps sec ; nuits fraîches sur les Hautes Terres." },
  {
    months: [6, 7],
    label: "Haute saison",
    tone: "high",
    dry: true,
    advice: "Baleines à bosse à Sainte-Marie ; forte affluence, réservez tôt les lodges.",
  },
  {
    months: [8, 9],
    label: "Saison conseillée",
    tone: "recommended",
    dry: true,
    advice: "Temps sec et affluence moindre qu'en juillet-août.",
  },
  {
    months: [10],
    label: "Fin de saison sèche",
    tone: "neutral",
    dry: true,
    advice: "Chaleur ; premières pluies possibles en fin de mois.",
  },
  {
    months: [11],
    label: "Début des pluies",
    tone: "warning",
    dry: false,
    advice: "Averses et chaleur ; risque de cyclones à partir de la fin du mois.",
  },
];

/** Activité qui n'est possible qu'une partie de l'année, avec le message affiché hors saison. */
export type SeasonalActivity = { label: string; months: number[]; period: string };

/** Fermeture annuelle d'une zone : aucun séjour vendu si une nuit tombe dans l'un de ces mois. */
export type ZoneClosure = { months: number[]; period: string; reason: string };

/**
 * Adéquation de chaque zone de l'étape 2, paramétrée avec les règles ci-dessus : `best` liste les mois conseillés pour
 * la zone, `activities` les activités saisonnières mises en avant sur sa carte, `closed` sa fermeture annuelle.
 * Fermetures de février à faire valider par l'équipe terrain.
 */
export const ZONE_SEASONS: Record<
  "nosy-be" | "sainte-marie" | "grand-nord",
  { best: number[]; activities: SeasonalActivity[]; closed?: ZoneClosure }
> = {
  "nosy-be": { best: [3, 4, 5, 6, 7, 8, 9, 10], activities: [] },
  "sainte-marie": {
    best: [6, 7, 8, 9, 10],
    activities: [{ label: "Baleines à bosse", months: [6, 7, 8], period: "de juillet à septembre" }],
    closed: { months: [1], period: "en février", reason: "Écolodges partenaires fermés pendant la saison cyclonique." },
  },
  "grand-nord": {
    best: [3, 4, 5, 6, 7, 8, 9, 10],
    activities: [],
    closed: {
      months: [1],
      period: "en février",
      reason: "Lodges partenaires et sentiers de la Montagne d'Ambre fermés pendant la saison cyclonique.",
    },
  },
};

export type ZoneFit = {
  level: "ideal" | "possible" | "rain" | "closed";
  label: string;
  /** Activités de la zone impossibles à ces dates. */
  off: SeasonalActivity[];
  /** Fermeture qui empêche de réserver la zone à ces dates. */
  closed?: ZoneClosure;
};

/**
 * `month` de 0 à 11 : mois d'arrivée, ou mois choisi quand les dates ne sont pas encore fixées ; `stay` : tous les mois
 * couverts par le séjour, pour la fermeture.
 */
export function zoneFit(zone: keyof typeof ZONE_SEASONS, month: number, stay: number[] = [month]): ZoneFit {
  const rule = seasonOf(month);
  const { best, activities, closed } = ZONE_SEASONS[zone];
  const off = activities.filter((a) => !a.months.includes(month));
  if (closed && stay.some((m) => closed.months.includes(m))) return { level: "closed", label: "Indisponible à vos dates", off, closed };
  if (!rule.dry) return { level: "rain", label: `${rule.label} à vos dates`, off };
  if (best.includes(month) && !off.length) return { level: "ideal", label: "Idéal à vos dates", off };
  return { level: "possible", label: "Possible à vos dates", off };
}

export function seasonOf(month: number): SeasonRule {
  return SEASON_RULES.find((rule) => rule.months.includes(month)) ?? SEASON_RULES[0];
}

/** `date` au format AAAA-MM-JJ ou AAAA-MM. */
export function seasonOfDate(date: string): SeasonRule {
  return seasonOf(Number(date.slice(5, 7)) - 1);
}
