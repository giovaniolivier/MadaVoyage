"use client";

import { useLang, type Lang } from "@/components/i18n/lang";
import type { RegionId } from "@/components/circuits/catalog-data";
import type { DestinationId } from "./booking-data";
import type { Theme } from "./destination-cards";

export type Sort = "recommended" | "price-asc" | "price-desc" | "rating" | "carbon";

type ZoneText = {
  name: string;
  short: string;
  badge: string;
  places: string;
  text: string;
  alt: string;
  /** Même ordre que `gallery` dans `ZONE_CARDS`. */
  galleryAlts: string[];
  /** Même ordre que `highlights` dans `ZONE_CARDS`. */
  highlights: string[];
  climate: string;
  lodge: string;
  flight: string;
  flightNote?: string;
};

const plural = (n: number, one: string, many: string) => (n > 1 ? many : one);

/** Le malgache s'écrit avec la virgule décimale, comme le français. */
export const numberLocale = (html: string) => (html === "en" ? "en-GB" : "fr-FR");

export const ratingText = (rating: number, html: string) =>
  rating.toLocaleString(numberLocale(html), { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const FR = {
  pageTitle: "Réservation, étape 2 : choix de la destination",
  colon: " :" as string,
  stepDone: "(terminée)",
  stepEdit: "Modifier",
  stepCurrent: "Étape en cours",
  stepUpcoming: "(à venir)",
  /** Sous-titres des étapes 3, 4 et 5. */
  stepSubs: ["Estimation", "Itinéraire", "Paiement sécurisé"],
  backToDates: "Retour aux dates",

  filtersLabel: "Filtres et tri",
  regionGroup: "Filtrer par région",
  regionPrefix: "Région :",
  themeGroup: "Filtrer par thématique",
  themePrefix: "Thématique :",
  sortLabel: "Trier par :",
  zonesLabel: (n: number) => (n ? `${n} ${plural(n, "destination", "destinations")}` : "aucune destination, option indisponible"),
  emptyCircuitRegion: "Aucun séjour sur mesure dans cette région : elle se découvre en circuit guidé.",
  emptyRegionTheme: "Aucune destination de cette région pour la thématique choisie.",
  emptyTheme: "Aucune destination pour cette thématique dans la région choisie.",
  regions: {
    all: "Toutes les régions",
    "hautes-terres": "Hautes Terres & RN7 (Isalo)",
    nord: "Nord & Archipels (Nosy Be, Diego)",
    ouest: "Ouest Sauvage & Tsingy",
    est: "Côte Est & Sainte-Marie",
  } as Record<"all" | RegionId, string>,
  themes: {
    lagon: "Lagon & Plongée",
    trek: "Éco-trek & Lémuriens",
    culture: "Culture locale",
    pirogue: "Voile et pirogue",
  } as Record<Theme, string>,
  sorts: {
    recommended: {
      label: "Recommandé pour vos dates",
      hint: "D'abord les destinations idéales à vos dates, puis les mieux notées, puis les moins chères.",
    },
    "price-asc": { label: "Prix croissant", hint: "Prix indicatif pour votre groupe et vos nuits, du moins cher au plus cher." },
    "price-desc": { label: "Prix décroissant", hint: "Prix indicatif pour votre groupe et vos nuits, du plus cher au moins cher." },
    rating: { label: "Mieux notés", hint: "Note moyenne des voyageurs, puis nombre d'avis." },
    carbon: { label: "Empreinte carbone minimale", hint: "Destinations les moins émettrices d'abord, vols intérieurs compris." },
  } as Record<Sort, { label: string; hint: string }>,
  fallback: {
    "hautes-terres": {
      text: "Les Hautes Terres et l'Isalo se réservent en circuit guidé plutôt qu'en séjour balnéaire.",
      cta: "Voir la Traversée RN7 & Isalo",
    },
    ouest: {
      text: "L'Allée des Baobabs et les Tsingy de Bemaraha se réservent en circuit guidé, en 4x4.",
      cta: "Voir les circuits de l'Ouest",
    },
  } as Partial<Record<RegionId, { text: string; cta: string }>>,

  viewsLabel: "Affichage des destinations",
  viewList: "Liste",
  viewMap: "Carte",

  circuitTitle: "Votre circuit guidé",
  circuitIntro:
    "Vous avez choisi ce circuit dans l'Explorer : il se réserve dans ce même parcours, sans passer par le choix d'une destination. Prix indicatif ici, confirmé à l'étape 4.",
  circuitLength: (days: number, nights: number) => `${days} jours / ${nights} nuits`,
  circuitIncludes: "Compris :",
  circuitPrice: (travelers: string) => `pour ${travelers}`,
  circuitContinue: "Continuer avec ce circuit",
  circuitSwitch: "Choisir plutôt une destination en séjour sur mesure",
  circuitOther: "Voir les autres circuits",
  circuitPerPerson: (adult: string, child: string | null) => `Soit ${adult} par adulte${child ? `, ${child} par enfant` : ""}.`,
  circuitMinAge: (min: number, youngest: number) =>
    `Âge minimum conseillé : ${min} ans ; votre plus jeune enfant a ${youngest} ans. Nous vous proposerons une variante adaptée ou un autre circuit.`,

  recommendedTitle: "Destinations recommandées",
  aboutResults: "À propos de ces résultats",
  noDates: "Choisissez vos dates à l'étape 1 pour voir la saison de chaque destination.",
  intro:
    "Choisissez une destination : nous composons votre séjour sur mesure pour vos dates et votre groupe (lodge, vols intérieurs, transferts). Prix indicatif ici, confirmé à l'étape 4.",
  rateNote: (rate: string, date: string) => `Prix en euros ; équivalents en Ariary au taux du ${date} : 1 € = ${rate} Ar.`,
  filteredCount: (n: number, total: number) => `${n} ${plural(n, "destination", "destinations")} sur ${total}`,
  filteredMatch: (n: number) => `${plural(n, "correspond", "correspondent")} à vos filtres.`,
  showAll: "Afficher toutes",
  allZones: (n: number) => `Les ${n} destinations en séjour sur mesure`,
  byDates: ", classées selon vos dates",
  circuitOnly: (n: number) => `${plural(n, "se réserve", "se réservent")} en circuit guidé, dans ce même parcours :`,
  explorerLink: "choisir un circuit dans l'Explorer",
  noResultsTitle: "Aucun séjour en ligne ne correspond à ces filtres.",
  noResultsText: "Essayez une autre thématique ou réinitialisez les filtres pour revoir toutes nos destinations.",
  resetFilters: "Réinitialiser les filtres",

  reviews: (n: number) => `(${n} avis)`,
  chosen: "Votre choix actuel",
  fitIdeal: "Idéal à vos dates",
  fitPossible: "Possible à vos dates",
  fitRain: (season: string) => `${season} à vos dates`,
  fitClosed: "Indisponible à vos dates",
  fitOff: (activity: string) => `Hors saison pour les ${activity.toLowerCase()}`,
  rainNote: (advice: string) => `${advice} Nous vous confirmerons les excursions possibles dans votre offre.`,
  offTag: "(hors saison)",
  advisedLength: "Durée conseillée :",
  yourStay: (n: number) => ` (votre séjour : ${n} nuits)`,
  nightsRange: ([min, max]: [number, number]) => `${min} à ${max} nuits`,
  flightFrom: "Vol depuis Antananarivo :",
  priceFrom: "À partir de",
  forNights: (n: number, travelers: string) => `pour ${n} nuits, ${travelers}`,
  perPerson: (adult: string, child: string | null) =>
    `Soit ${adult} par adulte${child ? `, ${child} par enfant de 2 à 11 ans` : ""} · lodge, vols intérieurs et transferts compris.`,
  baseNights: (diff: number, base: number) =>
    diff > 0
      ? `Prix indicatif · ${diff} ${plural(diff, "nuit supplémentaire", "nuits supplémentaires")} par rapport au circuit de base (${base} nuits).`
      : diff < 0
        ? `Prix indicatif · ${-diff} ${plural(-diff, "nuit", "nuits")} de moins que le circuit de base (${base} nuits).`
        : `Prix indicatif · même durée que le circuit de base (${base} nuits).`,
  seeDetail: "Voir le détail",
  seeDetailSr: (name: string) => ` de ${name} (météo, avis, photos)`,
  continueZone: "Continuer avec cette destination",
  choose: "Choisir et continuer",

  includedTitle: "Compris dans le prix indicatif :",
  includedText: "lodge, vols intérieurs et transferts ; excursions guidées en option à l'étape 4. Durées de vol selon le",
  flightSource: "programme de vols Madagascar Airlines du 29 mars au 24 octobre 2026",
  flightSourceAfter: ", à reconfirmer pour vos dates",
  insuranceTitle: "Assurance assistance-rapatriement : vivement conseillée, non comprise.",
  insuranceText:
    "Vous la souscrivez auprès de l'assureur de votre choix, ou vérifiez celle de votre carte bancaire : c'est elle qui paie les frais médicaux, l'évacuation et le rapatriement. Sur place, notre ligne d'urgence 24 h/24 organise l'aide et fait le lien avec votre assisteur.",
  insuranceLink: "Ce qu'il faut vérifier",
  fundLink: "Comment le fonds est utilisé",

  mapTitle: "Carte des destinations",
  legend: "Légende",
  legendZone: "Destination en séjour sur mesure",
  legendCircuit: "Circuit guidé",
  legendAirport: "Antananarivo (Ivato)",
  legendFlight: "Vol intérieur sans escale",
  flightLine: (flight: string, note?: string) => (note ? `${flight} (${note})` : `${flight} sans escale`),
  choiceDetail: (flightLine: string, lodge: string) => `Vol depuis Antananarivo : ${flightLine}. Hébergement : ${lodge}.`,
  continueWith: (short: string) => `Continuer avec ${short}`,
  noChoice:
    "Aucune destination choisie pour l'instant. Cliquez sur un point pour la retrouver dans la liste, puis sur « Choisir et continuer ».",

  barChoice: "Votre choix",
  barFrom: (price: string) => `à partir de ${price}`,
  barContinue: "Continuer",
  barWith: (short: string) => ` avec ${short}`,
  barClosed: (period: string) => `Fermé ${period}`,
  barNone: "Aucune destination choisie",
  seeMap: "Voir la carte",
  seeList: "Voir la liste",

  mapAlt:
    "Carte de Madagascar. Au nord, Diego Suarez et Nosy Be ; sur la côte est, Sainte-Marie ; toutes trois reliées par vol à Antananarivo, au centre. Circuits guidés : Andasibe à l'est, Allée des Baobabs à l'ouest, Isalo au sud.",
  mapRegions: ["NORD", "HAUTES TERRES", "OUEST", "CÔTE EST"],
  circuitSpots: ["Allée des Baobabs", "Andasibe", "Isalo"],
  circuitAria: (name: string) => `${name} : voir les circuits`,
  pinsGroup: "Destinations, du nord au sud",
  pinAria: (name: string, detail: string, chosen: boolean) =>
    `${name}, ${detail}${chosen ? ", votre choix actuel" : ""} : voir la destination dans la liste`,
  pinClosed: "indisponible à vos dates",
  pinFrom: (price: string) => `à partir de ${price}`,
  pinClosedTag: "fermé",
  pinKeys: "Flèches pour passer d'une destination à l'autre, Entrée pour l'afficher dans la liste.",

  closedTitle: (period: string) => `Fermé ${period}.`,
  closedHint: "Décalez vos dates ou choisissez une autre destination.",
  editDates: "Modifier les dates",
  offlineSuffix: "(disponible au retour du réseau)",
  offlineTitle: "Connexion perdue.",
  offlineText:
    "Les destinations, les prix indicatifs et la carte restent consultables, et votre choix est enregistré sur cet appareil ; l'étape suivante attend le retour du réseau.",
  retry: "Réessayer",
  photoUnavailable: "Photo indisponible",
  photoOffline: "Photo disponible au retour du réseau",

  backToChoice: "Retour au choix de la destination",
  inBrief: "En bref",
  detailLength: "Durée conseillée",
  detailFlight: "Vol depuis Antananarivo",
  detailLodge: "Hébergement",
  flightSourcePrefix: "Durées de vol selon le",
  weatherTitle: "Météo et meilleure période",
  months: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
  levels: { ideal: "Idéal", possible: "Possible", rain: "Pluies", closed: "Fermé" },
  stayMonthSr: " (mois de votre séjour)",
  weatherLegend:
    "« Idéal » : saison sèche et période conseillée pour la destination ; « Pluies » : saison des pluies, risque de cyclones de décembre à mars.",
  closedLegend: " « Fermé » : pas de séjour possible ce mois-là.",
  stayCircled: (many: boolean): string => (many ? " Les mois de votre séjour sont entourés." : " Le mois de votre séjour est entouré."),
  annualClosure: "Fermeture annuelle :",
  activitySeen: (period: string) => ` visibles ${period}.`,
  reviewsTitle: "Avis des voyageurs",
  ratingOf: (rating: string) => `${rating} sur 5`,
  reviewsCount: (n: number) => `${n} avis`,
  ratingLine: (rating: string, n: number) => `Note de la destination : ${rating}/5 sur ${n} avis`,
  reviewsSource: "avis vérifiés de voyageurs MadaVoyage, déposés après le séjour",
  readReviews: "Lire les avis des voyageurs",
  photosTitle: "Photos",
  detailPriceNote: (n: number, travelers: string) =>
    `Pour ${n} nuits, ${travelers} : lodge, vols intérieurs et transferts compris. Prix indicatif, confirmé à l'étape 4.`,
  nightsWarning: (n: number, range: string) => `Votre séjour compte ${n} nuits ; nous conseillons ${range} pour cette destination.`,
  compare: "Comparer avec les autres destinations",

  errorTitle: "Les destinations n'ont pas pu être chargées",
  errorOfflineTitle: "Vous êtes hors ligne",
  errorText:
    "Un incident réseau a interrompu le chargement. Réessayez dans un instant : vos dates et vos voyageurs sont conservés sur cet appareil.",
  errorOfflineText: "Vérifiez votre connexion Wi-Fi ou mobile, puis réessayez. Vos dates et vos voyageurs sont conservés sur cet appareil.",
  helpNow: "Besoin d'aide tout de suite ?",
  or: "ou",
  loading: "Chargement des destinations…",

  zones: {
    "nosy-be": {
      name: "Nosy Be et ses îles",
      short: "Nosy Be",
      badge: "Refuge marin & Corail",
      places: "Nosy Komba · Tanikely · Archipel des Mitsio",
      text: "Lagons turquoise, forêt primaire de Lokobe et plantations de vanille : l'archipel idéal pour une première immersion en famille.",
      alt: "Vue aérienne de l'archipel de Nosy Be : lagon turquoise, plage de sable blanc et pirogue à balancier",
      galleryAlts: ["Eaux turquoise et banc de sable de l'archipel de Nosy Be"],
      highlights: [
        "Sanctuaire Lokobe (Lémur Macaco)",
        "Tortues marines de Tanikely",
        "Plantations de Vanille & Ylang",
        "Pirogues traditionnelles Sakalava",
      ],
      climate: "Eau 27°C / Air 28°C",
      lodge: "Manga Soa Lodge",
      flight: "1\u00a0h\u00a045",
    },
    "sainte-marie": {
      name: "Sainte-Marie et l'île aux Nattes",
      short: "Sainte-Marie",
      badge: "Lagon & Île aux Nattes",
      places: "Île aux Nattes · Ambodifotatra · Baie d'Ampanihy",
      text: "Piscines naturelles rocheuses, criques secrètes et cimetière des forbans pirates.",
      alt: "Lagon de Sainte-Marie et de l'île aux Nattes avec banc de sable blanc et pirogue locale",
      galleryAlts: ["Lagon bordé de cocotiers à l'île Sainte-Marie"],
      highlights: ["Baleines à bosse", "Traversée en pirogue", "Histoire des pirates"],
      climate: "Eau 26°C / Air 27°C",
      lodge: "Écolodges partenaires",
      flight: "1\u00a0h\u00a005",
      flightNote: "sans escale à l'aller ; certains retours font escale à Toamasina",
    },
    "grand-nord": {
      name: "Diego Suarez et l'extrême nord",
      short: "Diego Suarez",
      badge: "Canyon & Lagons Sauvages",
      places: "Diego Suarez · Mer d'Émeraude · Montagne d'Ambre",
      text: "Aux confins de la baie des Courriers : cascades et lémuriens couronnés de la Montagne d'Ambre, lagon de la mer d'Émeraude.",
      alt: "Tsingy Rouges du nord de Madagascar face à la mer d'Émeraude",
      galleryAlts: ["Mer d'Émeraude près de Diego Suarez", "Cascade dans la forêt de la Montagne d'Ambre"],
      highlights: ["Tsingy d'Irodo", "Parc Montagne d'Ambre", "Mer d'Émeraude"],
      climate: "Eau 26°C / Air 30°C",
      lodge: "Écolodges partenaires",
      flight: "2\u00a0h",
    },
  } as Record<DestinationId, ZoneText>,
  /** Clé : libellé français de l'activité dans `ZONE_SEASONS`. */
  activities: { "Baleines à bosse": { label: "Baleines à bosse", period: "de juillet à septembre" } } as Record<
    string,
    { label: string; period: string }
  >,
  closures: {
    "sainte-marie": { period: "en février", reason: "Écolodges partenaires fermés pendant la saison cyclonique." },
    "grand-nord": {
      period: "en février",
      reason: "Lodges partenaires et sentiers de la Montagne d'Ambre fermés pendant la saison cyclonique.",
    },
  } as Partial<Record<DestinationId, { period: string; reason: string }>>,
};

export type DestinationText = typeof FR;

const EN: DestinationText = {
  pageTitle: "Booking, step 2: choose your destination",
  colon: ":",
  stepDone: "(completed)",
  stepEdit: "Edit",
  stepCurrent: "Current step",
  stepUpcoming: "(upcoming)",
  stepSubs: ["Estimate", "Itinerary", "Secure payment"],
  backToDates: "Back to dates",

  filtersLabel: "Filters and sorting",
  regionGroup: "Filter by region",
  regionPrefix: "Region:",
  themeGroup: "Filter by theme",
  themePrefix: "Theme:",
  sortLabel: "Sort by:",
  zonesLabel: (n) => (n ? `${n} ${plural(n, "destination", "destinations")}` : "no destinations, option unavailable"),
  emptyCircuitRegion: "No tailor-made stay in this region: it is explored on a guided circuit.",
  emptyRegionTheme: "No destination in this region for the selected theme.",
  emptyTheme: "No destination for this theme in the selected region.",
  regions: {
    all: "All regions",
    "hautes-terres": "Highlands & RN7 (Isalo)",
    nord: "North & Islands (Nosy Be, Diego)",
    ouest: "Wild West & Tsingy",
    est: "East Coast & Sainte-Marie",
  },
  themes: {
    lagon: "Lagoon & Diving",
    trek: "Eco-trek & Lemurs",
    culture: "Local culture",
    pirogue: "Sailing and dugout canoes",
  },
  sorts: {
    recommended: {
      label: "Recommended for your dates",
      hint: "Destinations that are ideal for your dates first, then the best rated, then the least expensive.",
    },
    "price-asc": { label: "Price: low to high", hint: "Indicative price for your group and nights, from lowest to highest." },
    "price-desc": { label: "Price: high to low", hint: "Indicative price for your group and nights, from highest to lowest." },
    rating: { label: "Best rated", hint: "Average traveller rating, then number of reviews." },
    carbon: { label: "Lowest carbon footprint", hint: "Lowest-emission destinations first, domestic flights included." },
  },
  fallback: {
    "hautes-terres": {
      text: "The Highlands and Isalo are booked as a guided circuit rather than a beach stay.",
      cta: "See the RN7 & Isalo journey",
    },
    ouest: {
      text: "The Avenue of the Baobabs and the Tsingy de Bemaraha are booked as a guided 4x4 circuit.",
      cta: "See circuits in the West",
    },
  },

  viewsLabel: "Display destinations as",
  viewList: "List",
  viewMap: "Map",

  circuitTitle: "Your guided circuit",
  circuitIntro:
    "You chose this circuit in the Explorer: it is booked through this same process, without choosing a destination. Indicative price here, confirmed in step 4.",
  circuitLength: (days, nights) => `${days} days / ${nights} nights`,
  circuitIncludes: "Included:",
  circuitPrice: (travelers) => `for ${travelers}`,
  circuitContinue: "Continue with this circuit",
  circuitSwitch: "Choose a tailor-made destination stay instead",
  circuitOther: "See the other circuits",
  circuitPerPerson: (adult, child) => `That is ${adult} per adult${child ? `, ${child} per child` : ""}.`,
  circuitMinAge: (min, youngest) =>
    `Recommended minimum age: ${min}; your youngest child is ${youngest}. We will suggest a suitable variant or another circuit.`,

  recommendedTitle: "Recommended destinations",
  aboutResults: "About these results",
  noDates: "Choose your dates in step 1 to see the season for each destination.",
  intro:
    "Choose a destination: we put together a tailor-made stay for your dates and your group (lodge, domestic flights, transfers). Indicative price here, confirmed in step 4.",
  rateNote: (rate, date) => `Prices in euros; ariary equivalents at the rate of ${date}: €1 = ${rate} Ar.`,
  filteredCount: (n, total) => `${n} of ${total} ${plural(total, "destination", "destinations")}`,
  filteredMatch: (n) => `${plural(n, "matches", "match")} your filters.`,
  showAll: "Show all",
  allZones: (n) => `The ${n} destinations for a tailor-made stay`,
  byDates: ", ranked for your dates",
  circuitOnly: (n) => `${plural(n, "is", "are")} booked as a guided circuit, through this same process:`,
  explorerLink: "choose a circuit in the Explorer",
  noResultsTitle: "No online stay matches these filters.",
  noResultsText: "Try another theme or reset the filters to see all our destinations again.",
  resetFilters: "Reset filters",

  reviews: (n) => `(${n} ${plural(n, "review", "reviews")})`,
  chosen: "Your current choice",
  fitIdeal: "Ideal for your dates",
  fitPossible: "Possible for your dates",
  fitRain: (season) => `${season} at your dates`,
  fitClosed: "Unavailable for your dates",
  fitOff: (activity) => `Out of season for ${activity.toLowerCase()}`,
  rainNote: (advice) => `${advice} We will confirm which excursions are possible in your offer.`,
  offTag: "(out of season)",
  advisedLength: "Recommended length:",
  yourStay: (n) => ` (your stay: ${n} nights)`,
  nightsRange: ([min, max]) => `${min} to ${max} nights`,
  flightFrom: "Flight from Antananarivo:",
  priceFrom: "From",
  forNights: (n, travelers) => `for ${n} nights, ${travelers}`,
  perPerson: (adult, child) =>
    `That is ${adult} per adult${child ? `, ${child} per child aged 2 to 11` : ""} · lodge, domestic flights and transfers included.`,
  baseNights: (diff, base) =>
    diff > 0
      ? `Indicative price · ${diff} ${plural(diff, "night", "nights")} more than the base circuit (${base} nights).`
      : diff < 0
        ? `Indicative price · ${-diff} ${plural(-diff, "night", "nights")} fewer than the base circuit (${base} nights).`
        : `Indicative price · same length as the base circuit (${base} nights).`,
  seeDetail: "See details",
  seeDetailSr: (name) => ` of ${name} (weather, reviews, photos)`,
  continueZone: "Continue with this destination",
  choose: "Choose and continue",

  includedTitle: "Included in the indicative price:",
  includedText: "lodge, domestic flights and transfers; guided excursions optional in step 4. Flight times according to the",
  flightSource: "Madagascar Airlines flight schedule from 29 March to 24 October 2026",
  flightSourceAfter: ", to be reconfirmed for your dates",
  insuranceTitle: "Assistance and repatriation insurance: strongly recommended, not included.",
  insuranceText:
    "Take it out with the insurer of your choice, or check the cover provided by your bank card: it pays for medical costs, evacuation and repatriation. On site, our 24/7 emergency line organises help and liaises with your assistance provider.",
  insuranceLink: "What to check",
  fundLink: "How the fund is used",

  mapTitle: "Destination map",
  legend: "Legend",
  legendZone: "Destination for a tailor-made stay",
  legendCircuit: "Guided circuit",
  legendAirport: "Antananarivo (Ivato)",
  legendFlight: "Non-stop domestic flight",
  flightLine: (flight, note) => (note ? `${flight} (${note})` : `${flight} non-stop`),
  choiceDetail: (flightLine, lodge) => `Flight from Antananarivo: ${flightLine}. Accommodation: ${lodge}.`,
  continueWith: (short) => `Continue with ${short}`,
  noChoice: "No destination chosen yet. Click a point to find it in the list, then “Choose and continue”.",

  barChoice: "Your choice",
  barFrom: (price) => `from ${price}`,
  barContinue: "Continue",
  barWith: (short) => ` with ${short}`,
  barClosed: (period) => `Closed ${period}`,
  barNone: "No destination chosen",
  seeMap: "See the map",
  seeList: "See the list",

  mapAlt:
    "Map of Madagascar. In the north, Diego Suarez and Nosy Be; on the east coast, Sainte-Marie; all three linked by flights to Antananarivo, in the centre. Guided circuits: Andasibe in the east, the Avenue of the Baobabs in the west, Isalo in the south.",
  mapRegions: ["NORTH", "HIGHLANDS", "WEST", "EAST COAST"],
  circuitSpots: ["Avenue of the Baobabs", "Andasibe", "Isalo"],
  circuitAria: (name) => `${name}: see the circuits`,
  pinsGroup: "Destinations, from north to south",
  pinAria: (name, detail, chosen) => `${name}, ${detail}${chosen ? ", your current choice" : ""}: show the destination in the list`,
  pinClosed: "unavailable for your dates",
  pinFrom: (price) => `from ${price}`,
  pinClosedTag: "closed",
  pinKeys: "Use the arrow keys to move between destinations and Enter to show one in the list.",

  closedTitle: (period) => `Closed ${period}.`,
  closedHint: "Change your dates or choose another destination.",
  editDates: "Change dates",
  offlineSuffix: "(available when you are back online)",
  offlineTitle: "Connection lost.",
  offlineText:
    "Destinations, indicative prices and the map remain available, and your choice is saved on this device; the next step will wait until you are back online.",
  retry: "Try again",
  photoUnavailable: "Photo unavailable",
  photoOffline: "Photo available when you are back online",

  backToChoice: "Back to choosing a destination",
  inBrief: "At a glance",
  detailLength: "Recommended length",
  detailFlight: "Flight from Antananarivo",
  detailLodge: "Accommodation",
  flightSourcePrefix: "Flight times according to the",
  weatherTitle: "Weather and best time to go",
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  levels: { ideal: "Ideal", possible: "Possible", rain: "Rains", closed: "Closed" },
  stayMonthSr: " (month of your stay)",
  weatherLegend:
    "“Ideal”: dry season and recommended period for the destination; “Rains”: rainy season, risk of cyclones from December to March.",
  closedLegend: " “Closed”: no stays possible that month.",
  stayCircled: (many) => (many ? " The months of your stay are circled." : " The month of your stay is circled."),
  annualClosure: "Annual closure:",
  activitySeen: (period) => ` visible ${period}.`,
  reviewsTitle: "Traveller reviews",
  ratingOf: (rating) => `${rating} out of 5`,
  reviewsCount: (n) => `${n} ${plural(n, "review", "reviews")}`,
  ratingLine: (rating, n) => `Destination rating: ${rating}/5 from ${n} ${plural(n, "review", "reviews")}`,
  reviewsSource: "verified reviews from MadaVoyage travellers, posted after their stay",
  readReviews: "Read traveller reviews",
  photosTitle: "Photos",
  detailPriceNote: (n, travelers) =>
    `For ${n} nights, ${travelers}: lodge, domestic flights and transfers included. Indicative price, confirmed in step 4.`,
  nightsWarning: (n, range) => `Your stay is ${n} nights; we recommend ${range} for this destination.`,
  compare: "Compare with the other destinations",

  errorTitle: "The destinations could not be loaded",
  errorOfflineTitle: "You are offline",
  errorText: "A network problem interrupted loading. Try again in a moment: your dates and travellers are saved on this device.",
  errorOfflineText: "Check your Wi-Fi or mobile connection, then try again. Your dates and travellers are saved on this device.",
  helpNow: "Need help right away?",
  or: "or",
  loading: "Loading destinations…",

  zones: {
    "nosy-be": {
      name: "Nosy Be and its islands",
      short: "Nosy Be",
      badge: "Marine refuge & Coral",
      places: "Nosy Komba · Tanikely · Mitsio Archipelago",
      text: "Turquoise lagoons, the primary forest of Lokobe and vanilla plantations: the ideal archipelago for a first family immersion.",
      alt: "Aerial view of the Nosy Be archipelago: turquoise lagoon, white sand beach and outrigger canoe",
      galleryAlts: ["Turquoise water and sandbank in the Nosy Be archipelago"],
      highlights: [
        "Lokobe sanctuary (black lemur)",
        "Sea turtles of Tanikely",
        "Vanilla & ylang-ylang plantations",
        "Traditional Sakalava dugouts",
      ],
      climate: "Water 27°C / Air 28°C",
      lodge: "Manga Soa Lodge",
      flight: "1\u00a0hr\u00a045\u00a0min",
    },
    "sainte-marie": {
      name: "Sainte-Marie and Île aux Nattes",
      short: "Sainte-Marie",
      badge: "Lagoon & Île aux Nattes",
      places: "Île aux Nattes · Ambodifotatra · Ampanihy Bay",
      text: "Natural rock pools, hidden coves and the pirates' cemetery.",
      alt: "Lagoon of Sainte-Marie and Île aux Nattes with a white sandbank and a local dugout",
      galleryAlts: ["Palm-fringed lagoon on Sainte-Marie Island"],
      highlights: ["Humpback whales", "Dugout crossing", "Pirate history"],
      climate: "Water 26°C / Air 27°C",
      lodge: "Partner eco-lodges",
      flight: "1\u00a0hr\u00a05\u00a0min",
      flightNote: "non-stop outbound; some return flights stop in Toamasina",
    },
    "grand-nord": {
      name: "Diego Suarez and the far north",
      short: "Diego Suarez",
      badge: "Canyons & Wild Lagoons",
      places: "Diego Suarez · Emerald Sea · Amber Mountain",
      text: "At the far end of Courrier Bay: waterfalls and crowned lemurs in Amber Mountain, the lagoon of the Emerald Sea.",
      alt: "Red Tsingy of northern Madagascar facing the Emerald Sea",
      galleryAlts: ["Emerald Sea near Diego Suarez", "Waterfall in the Amber Mountain forest"],
      highlights: ["Irodo Tsingy", "Amber Mountain National Park", "Emerald Sea"],
      climate: "Water 26°C / Air 30°C",
      lodge: "Partner eco-lodges",
      flight: "2\u00a0hr",
    },
  },
  activities: { "Baleines à bosse": { label: "Humpback whales", period: "from July to September" } },
  closures: {
    "sainte-marie": { period: "in February", reason: "Partner eco-lodges close during the cyclone season." },
    "grand-nord": {
      period: "in February",
      reason: "Partner lodges and the Amber Mountain trails close during the cyclone season.",
    },
  },
};

/** Version malgache : à faire relire par un locuteur natif avant mise en ligne. */
const MG: DestinationText = {
  pageTitle: "Famandrihana, dingana 2 : fisafidianana ny toerana",
  colon: " :",
  stepDone: "(vita)",
  stepEdit: "Ovaina",
  stepCurrent: "Dingana ankehitriny",
  stepUpcoming: "(ho avy)",
  stepSubs: ["Tombana", "Lalana harahina", "Fandoavana azo antoka"],
  backToDates: "Hiverina amin'ny daty",

  filtersLabel: "Sivana sy filaharana",
  regionGroup: "Sivanina araka ny faritra",
  regionPrefix: "Faritra :",
  themeGroup: "Sivanina araka ny lohahevitra",
  themePrefix: "Lohahevitra :",
  sortLabel: "Alaharo araka ny :",
  zonesLabel: (n) => (n ? `toerana ${n}` : "tsy misy toerana, tsy azo safidiana"),
  emptyCircuitRegion: "Tsy misy fivahiniana namboarina manokana amin'ity faritra ity : amin'ny dia voatarika no itsidihana azy.",
  emptyRegionTheme: "Tsy misy toerana amin'ity faritra ity ho an'ny lohahevitra voafidy.",
  emptyTheme: "Tsy misy toerana ho an'ity lohahevitra ity amin'ny faritra voafidy.",
  regions: {
    all: "Faritra rehetra",
    "hautes-terres": "Afovoan-tany & RN7 (Isalo)",
    nord: "Avaratra & Nosy (Nosy Be, Diego)",
    ouest: "Andrefana & Tsingy",
    est: "Morontsiraka Atsinanana & Sainte-Marie",
  },
  themes: {
    lagon: "Lagon & Fitsirihana anaty rano",
    trek: "Dia an-tongotra & Varika",
    culture: "Kolontsaina eo an-toerana",
    pirogue: "Sambo lay sy lakana",
  },
  sorts: {
    recommended: {
      label: "Soso-kevitra ho an'ny datinao",
      hint: "Voalohany ireo toerana tena mety amin'ny datinao, avy eo ireo tsara naoty indrindra, avy eo ireo mora indrindra.",
    },
    "price-asc": { label: "Vidiny miakatra", hint: "Vidiny tombana ho an'ny vondrona sy ny alinareo, manomboka amin'ny mora indrindra." },
    "price-desc": { label: "Vidiny midina", hint: "Vidiny tombana ho an'ny vondrona sy ny alinareo, manomboka amin'ny lafo indrindra." },
    rating: { label: "Tsara naoty indrindra", hint: "Naoty salanisan'ny mpandeha, avy eo ny isan'ny hevitra." },
    carbon: {
      label: "Dian-karbôna kely indrindra",
      hint: "Voalohany ireo toerana mamoaka entona kely indrindra, tafiditra ny sidina anatiny.",
    },
  },
  fallback: {
    "hautes-terres": {
      text: "Amin'ny dia voatarika no famandrihana ny Afovoan-tany sy Isalo fa tsy fijanonana amoron-dranomasina.",
      cta: "Jereo ny dia RN7 & Isalo",
    },
    ouest: {
      text: "Amin'ny dia voatarika amin'ny 4x4 no famandrihana ny Lalan'ny Baobab sy ny Tsingy any Bemaraha.",
      cta: "Jereo ireo dia any Andrefana",
    },
  },

  viewsLabel: "Fomba fanehoana ny toerana",
  viewList: "Lisitra",
  viewMap: "Sarintany",

  circuitTitle: "Ny dia voatarika nofidinao",
  circuitIntro:
    "Nofidinao tao amin'ny Explorer ity dia ity : amin'ity dingana ity ihany no famandrihana azy, tsy mila misafidy toerana. Vidiny tombana eto, hamafisina amin'ny dingana 4.",
  circuitLength: (days, nights) => `andro ${days} / alina ${nights}`,
  circuitIncludes: "Tafiditra :",
  circuitPrice: (travelers) => `ho an'ny ${travelers}`,
  circuitContinue: "Tohizo amin'ity dia ity",
  circuitSwitch: "Misafidiana toerana ho an'ny fivahiniana natao manokana",
  circuitOther: "Jereo ireo dia hafa",
  circuitPerPerson: (adult, child) => `Izany hoe ${adult} isaky ny olon-dehibe${child ? `, ${child} isaky ny ankizy` : ""}.`,
  circuitMinAge: (min, youngest) =>
    `Taona kely indrindra atoro : ${min} taona ; ${youngest} taona ny zanakao faralahy. Hanolotra dia mifanaraka na dia hafa izahay.`,

  recommendedTitle: "Toerana atolotra",
  aboutResults: "Momba ireo valiny ireo",
  noDates: "Safidio ny datinao amin'ny dingana 1 mba hahitana ny vanim-potoana amin'ny toerana tsirairay.",
  intro:
    "Misafidiana toerana iray : manomana fivahiniana mifanaraka amin'ny datinao sy ny vondronao izahay (lodge, sidina anatiny, fitaterana). Vidiny tombana eto, hamafisina amin'ny dingana 4.",
  rateNote: (rate, date) => `Vidiny amin'ny euro ; ny sandany amin'ny Ariary dia araka ny sandam-bola tamin'ny ${date} : 1 € = ${rate} Ar.`,
  filteredCount: (n, total) => `toerana ${n} amin'ny ${total}`,
  filteredMatch: () => "no mifanaraka amin'ny sivanao.",
  showAll: "Asehoy daholo",
  allZones: (n) => `Ireo toerana ${n} ho an'ny fivahiniana natao manokana`,
  byDates: ", nalahatra araka ny datinao",
  circuitOnly: () => "dia amin'ny dia voatarika no famandrihana azy, amin'ity dingana ity ihany :",
  explorerLink: "misafidiana dia ao amin'ny Explorer",
  noResultsTitle: "Tsy misy fivahiniana an-tserasera mifanaraka amin'ireo sivana ireo.",
  noResultsText: "Andramo lohahevitra hafa na avereno ny sivana mba hahitana indray ny toerana rehetra.",
  resetFilters: "Avereno ny sivana",

  reviews: (n) => `(hevitra ${n})`,
  chosen: "Ny safidinao ankehitriny",
  fitIdeal: "Tena mety amin'ny datinao",
  fitPossible: "Azo atao amin'ny datinao",
  fitRain: (season) => `${season} amin'ny datinao`,
  fitClosed: "Tsy azo atao amin'ny datinao",
  fitOff: (activity) => `Tsy fotoan'ny ${activity.toLowerCase()}`,
  rainNote: (advice) => `${advice} Hohamafisinay ao amin'ny tolotra ireo fitsangatsanganana azo atao.`,
  offTag: "(tsy fotoanany)",
  advisedLength: "Faharetana soso-kevitra :",
  yourStay: (n) => ` (ny fivahinianao : alina ${n})`,
  nightsRange: ([min, max]) => `alina ${min} ka hatramin'ny ${max}`,
  flightFrom: "Sidina avy any Antananarivo :",
  priceFrom: "Manomboka amin'ny",
  forNights: (n, travelers) => `ho an'ny alina ${n}, ${travelers}`,
  perPerson: (adult, child) =>
    `Izany hoe ${adult} isaky ny olon-dehibe${child ? `, ${child} isaky ny ankizy 2 ka hatramin'ny 11 taona` : ""} · tafiditra ny lodge, ny sidina anatiny ary ny fitaterana.`,
  baseNights: (diff, base) =>
    diff > 0
      ? `Vidiny tombana · alina ${diff} fanampiny raha oharina amin'ny dia fototra (alina ${base}).`
      : diff < 0
        ? `Vidiny tombana · alina ${-diff} latsaka noho ny dia fototra (alina ${base}).`
        : `Vidiny tombana · mitovy faharetana amin'ny dia fototra (alina ${base}).`,
  seeDetail: "Jereo ny antsipiriany",
  seeDetailSr: (name) => ` momba ny ${name} (toetr'andro, hevitra, sary)`,
  continueZone: "Tohizo amin'ity toerana ity",
  choose: "Safidio ary tohizo",

  includedTitle: "Tafiditra ao amin'ny vidiny tombana :",
  includedText:
    "lodge, sidina anatiny ary fitaterana ; azo ampiana amin'ny dingana 4 ny fitsangatsanganana misy mpitarika. Faharetan'ny sidina araka ny",
  flightSource: "fandaharam-pisidinan'ny Madagascar Airlines manomboka ny 29 Martsa ka hatramin'ny 24 Oktobra 2026",
  flightSourceAfter: ", mbola hohamafisina ho an'ny datinao",
  insuranceTitle: "Fiantohana fanampiana sy famerenana an-tanindrazana : tena atoro, tsy tafiditra.",
  insuranceText:
    "Atao amin'ny mpiantoka tianao, na hamarino ny fiantohana omen'ny karatra bankinao : izy no mandoa ny fitsaboana, ny famindrana marary ary ny famerenana an-tanindrazana. Eto an-toerana, ny laharana vonjy maika 24 ora/24 no mandamina ny fanampiana ary mifandray amin'ny mpanampy anao.",
  insuranceLink: "Izay tokony hamarinina",
  fundLink: "Ny fampiasana ny tahirim-bola",

  mapTitle: "Sarintanin'ny toerana",
  legend: "Fanazavana",
  legendZone: "Toerana ho an'ny fivahiniana natao manokana",
  legendCircuit: "Dia voatarika",
  legendAirport: "Antananarivo (Ivato)",
  legendFlight: "Sidina anatiny tsy mijanona",
  flightLine: (flight, note) => (note ? `${flight} (${note})` : `${flight} tsy mijanona`),
  choiceDetail: (flightLine, lodge) => `Sidina avy any Antananarivo : ${flightLine}. Toeram-ponenana : ${lodge}.`,
  continueWith: (short) => `Tohizo amin'i ${short}`,
  noChoice:
    "Mbola tsy misy toerana voafidy. Tsindrio ny teboka iray hahitana ilay toerana ao amin'ny lisitra, avy eo « Safidio ary tohizo ».",

  barChoice: "Ny safidinao",
  barFrom: (price) => `manomboka amin'ny ${price}`,
  barContinue: "Tohizo",
  barWith: (short) => ` amin'i ${short}`,
  barClosed: (period) => `Mihidy ${period}`,
  barNone: "Tsy misy toerana voafidy",
  seeMap: "Jereo ny sarintany",
  seeList: "Jereo ny lisitra",

  mapAlt:
    "Sarintanin'i Madagasikara. Any avaratra, Antsiranana sy Nosy Be ; any amin'ny morontsiraka atsinanana, Sainte-Marie ; samy mifandray amin'ny sidina amin'i Antananarivo, eo afovoany. Dia voatarika : Andasibe any atsinanana, Lalan'ny Baobab any andrefana, Isalo any atsimo.",
  mapRegions: ["AVARATRA", "AFOVOAN-TANY", "ANDREFANA", "ATSINANANA"],
  circuitSpots: ["Lalan'ny Baobab", "Andasibe", "Isalo"],
  circuitAria: (name) => `${name} : jereo ireo dia`,
  pinsGroup: "Toerana, avy any avaratra mankany atsimo",
  pinAria: (name, detail, chosen) => `${name}, ${detail}${chosen ? ", ny safidinao ankehitriny" : ""} : asehoy ao amin'ny lisitra`,
  pinClosed: "tsy azo atao amin'ny datinao",
  pinFrom: (price) => `manomboka amin'ny ${price}`,
  pinClosedTag: "mihidy",
  pinKeys: "Zana-tsipìka hifindrana amin'ny toerana iray mankany amin'ny iray hafa, Entrée hanehoana azy ao amin'ny lisitra.",

  closedTitle: (period) => `Mihidy ${period}.`,
  closedHint: "Ovay ny datinao na misafidiana toerana hafa.",
  editDates: "Ovay ny daty",
  offlineSuffix: "(azo atao rehefa miverina ny tambajotra)",
  offlineTitle: "Tapaka ny fifandraisana.",
  offlineText:
    "Mbola azo jerena ireo toerana, ny vidiny tombana ary ny sarintany, ary voatahiry amin'ity fitaovana ity ny safidinao ; miandry ny fiverenan'ny tambajotra ny dingana manaraka.",
  retry: "Andramo indray",
  photoUnavailable: "Tsy misy sary",
  photoOffline: "Hiseho ny sary rehefa miverina ny tambajotra",

  backToChoice: "Hiverina amin'ny fisafidianana toerana",
  inBrief: "Fohy hoe",
  detailLength: "Faharetana soso-kevitra",
  detailFlight: "Sidina avy any Antananarivo",
  detailLodge: "Toeram-ponenana",
  flightSourcePrefix: "Faharetan'ny sidina araka ny",
  weatherTitle: "Toetr'andro sy fotoana tsara indrindra",
  months: ["Jan", "Feb", "Mar", "Apr", "Mey", "Jon", "Jol", "Aog", "Sep", "Okt", "Nov", "Des"],
  levels: { ideal: "Tena mety", possible: "Azo atao", rain: "Orana", closed: "Mihidy" },
  stayMonthSr: " (volana hivahinianao)",
  weatherLegend:
    "« Tena mety » : main-tany sy fotoana atolotra ho an'ilay toerana ; « Orana » : fotoanan'ny orana, mety hisy rivodoza manomboka Desambra ka hatramin'ny Martsa.",
  closedLegend: " « Mihidy » : tsy misy fivahiniana azo atao amin'io volana io.",
  stayCircled: (many) => (many ? " Voahodidina ireo volana hivahinianao." : " Voahodidina ny volana hivahinianao."),
  annualClosure: "Fanakatonana isan-taona :",
  activitySeen: (period) => ` hita ${period}.`,
  reviewsTitle: "Hevitry ny mpandeha",
  ratingOf: (rating) => `${rating} amin'ny 5`,
  reviewsCount: (n) => `hevitra ${n}`,
  ratingLine: (rating, n) => `Naotin'ny toerana : ${rating}/5 amin'ny hevitra ${n}`,
  reviewsSource: "hevitra voamarina avy amin'ny mpandeha MadaVoyage, nalefa taorian'ny fivahiniana",
  readReviews: "Vakio ny hevitry ny mpandeha",
  photosTitle: "Sary",
  detailPriceNote: (n, travelers) =>
    `Ho an'ny alina ${n}, ${travelers} : tafiditra ny lodge, ny sidina anatiny ary ny fitaterana. Vidiny tombana, hohamafisina amin'ny dingana 4.`,
  nightsWarning: (n, range) => `Alina ${n} ny fivahinianao ; ${range} no soso-kevitray ho an'ity toerana ity.`,
  compare: "Ampitahao amin'ireo toerana hafa",

  errorTitle: "Tsy voaentana ireo toerana",
  errorOfflineTitle: "Tsy mifandray amin'ny tambajotra ianao",
  errorText:
    "Nisy olana tamin'ny tambajotra nanapaka ny fampidirana. Andramo indray afaka kelikely : voatahiry amin'ity fitaovana ity ny daty sy ny mpandeha.",
  errorOfflineText:
    "Hamarino ny Wi-Fi na ny fifandraisana finday, avy eo andramo indray. Voatahiry amin'ity fitaovana ity ny daty sy ny mpandeha.",
  helpNow: "Mila fanampiana avy hatrany ?",
  or: "na",
  loading: "Mampiditra ireo toerana…",

  zones: {
    "nosy-be": {
      name: "Nosy Be sy ireo nosy manodidina",
      short: "Nosy Be",
      badge: "Fialofana an-dranomasina & Haran-dranomasina",
      places: "Nosy Komba · Tanikely · Nosy Mitsio",
      text: "Lagon manga, alan'i Lokobe tsy mbola voakitika ary tanim-banila : ireo nosy tsara indrindra hanombohana fitsidihana miaraka amin'ny fianakaviana.",
      alt: "Nosy Be jerena avy eny ambony : lagon manga, tora-pasika fotsy ary lakana misy fanarina",
      galleryAlts: ["Rano manga sy fasika ao amin'ireo nosy manodidina an'i Nosy Be"],
      highlights: [
        "Tahirin'i Lokobe (Varika Macaco)",
        "Fano an-dranomasin'i Tanikely",
        "Tanim-banila sy ilang-ilang",
        "Lakana Sakalava nentim-paharazana",
      ],
      climate: "Rano 27°C / Rivotra 28°C",
      lodge: "Manga Soa Lodge",
      flight: "1\u00a0ora\u00a045\u00a0min",
    },
    "sainte-marie": {
      name: "Sainte-Marie (Nosy Boraha) sy Nosy Nato",
      short: "Sainte-Marie",
      badge: "Lagon & Nosy Nato",
      places: "Nosy Nato · Ambodifotatra · Helodranon'Ampanihy",
      text: "Dobo voajanahary eny amin'ny vatolampy, helodrano miafina ary fasan'ireo jiolahy an-dranomasina.",
      alt: "Lagon'i Sainte-Marie sy Nosy Nato miaraka amin'ny fasika fotsy sy lakana eo an-toerana",
      galleryAlts: ["Lagon voahodidin'ny voanio ao Sainte-Marie"],
      highlights: ["Trozona", "Fiampitana an-dakana", "Tantaran'ny jiolahy an-dranomasina"],
      climate: "Rano 26°C / Rivotra 27°C",
      lodge: "Écolodges mpiara-miasa",
      flight: "1\u00a0ora\u00a05\u00a0min",
      flightNote: "tsy mijanona rehefa mandeha ; mijanona any Toamasina ny sidina miverina sasany",
    },
    "grand-nord": {
      name: "Antsiranana sy ny faritra avaratra lavitra",
      short: "Antsiranana",
      badge: "Hantsana & Lagon Voajanahary",
      places: "Antsiranana · Ranomasina Emeraoda · Tendrombohitr'Ambre",
      text: "Any amin'ny faran'ny helodranon'i Courrier : riandrano sy varika misy satroboninahitra ao Tendrombohitr'Ambre, lagon'ny Ranomasina Emeraoda.",
      alt: "Tsingy Mena any avaratr'i Madagasikara manatrika ny Ranomasina Emeraoda",
      galleryAlts: ["Ranomasina Emeraoda akaikin'i Antsiranana", "Riandrano ao anatin'ny alan'ny Tendrombohitr'Ambre"],
      highlights: ["Tsingy any Irodo", "Valan-javaboarin'ny Tendrombohitr'Ambre", "Ranomasina Emeraoda"],
      climate: "Rano 26°C / Rivotra 30°C",
      lodge: "Écolodges mpiara-miasa",
      flight: "2\u00a0ora",
    },
  },
  activities: { "Baleines à bosse": { label: "Trozona", period: "manomboka Jolay ka hatramin'ny Septambra" } },
  closures: {
    "sainte-marie": { period: "amin'ny Febroary", reason: "Mihidy ireo écolodges mpiara-miasa mandritra ny fotoanan'ny rivodoza." },
    "grand-nord": {
      period: "amin'ny Febroary",
      reason: "Mihidy ireo lodge mpiara-miasa sy ny lalan'ny Tendrombohitr'Ambre mandritra ny fotoanan'ny rivodoza.",
    },
  },
};

const TEXT: Record<Lang, DestinationText> = { FR, EN, MG };

export function useDestinationText() {
  return TEXT[useLang()];
}
