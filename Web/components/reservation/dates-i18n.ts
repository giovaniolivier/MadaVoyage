"use client";

import { useLang, type Lang } from "@/components/i18n/lang";
import { type Booking, type TripTypeId, nightsOf, parseDate, travelersCount } from "./booking-store";

type DateFormats = {
  monthYear: (d: Date) => string;
  full: (d: Date) => string;
  dayMonth: (d: Date) => string;
  dayMonthShort: (d: Date) => string;
  dayMonthYear: (d: Date) => string;
  dayMonthYearShort: (d: Date) => string;
};

function intlFormats(locale: string): DateFormats {
  const f = (options: Intl.DateTimeFormatOptions) => {
    const format = new Intl.DateTimeFormat(locale, options);
    return (d: Date) => format.format(d);
  };
  return {
    monthYear: f({ month: "long", year: "numeric" }),
    full: f({ weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    dayMonth: f({ day: "numeric", month: "long" }),
    dayMonthShort: f({ day: "numeric", month: "short" }),
    dayMonthYear: f({ day: "numeric", month: "long", year: "numeric" }),
    dayMonthYearShort: f({ day: "numeric", month: "short", year: "numeric" }),
  };
}

/** Les navigateurs ne connaissent pas tous le malgache : noms des mois et des jours écrits ici. */
const MG_MONTHS = [
  "Janoary",
  "Febroary",
  "Martsa",
  "Aprily",
  "Mey",
  "Jona",
  "Jolay",
  "Aogositra",
  "Septambra",
  "Oktobra",
  "Novambra",
  "Desambra",
];
const MG_DAYS = ["Alahady", "Alatsinainy", "Talata", "Alarobia", "Alakamisy", "Zoma", "Sabotsy"];

const mgFormats: DateFormats = {
  monthYear: (d) => `${MG_MONTHS[d.getMonth()]} ${d.getFullYear()}`,
  full: (d) => `${MG_DAYS[d.getDay()]} ${d.getDate()} ${MG_MONTHS[d.getMonth()]} ${d.getFullYear()}`,
  dayMonth: (d) => `${d.getDate()} ${MG_MONTHS[d.getMonth()]}`,
  dayMonthShort: (d) => `${d.getDate()} ${MG_MONTHS[d.getMonth()]}`,
  dayMonthYear: (d) => `${d.getDate()} ${MG_MONTHS[d.getMonth()]} ${d.getFullYear()}`,
  dayMonthYearShort: (d) => `${d.getDate()} ${MG_MONTHS[d.getMonth()]} ${d.getFullYear()}`,
};

const plural = (n: number, one: string, many: string) => (n > 1 ? many : one);

type Words = {
  datesToChoose: string;
  from: (d: string) => string;
  monthPending: (m: string) => string;
  departureToChoose: string;
  nightsDays: (n: number) => string;
  travelers: (total: number, parts: string[]) => string;
  adults: (n: number) => string;
  children: (n: number) => string;
  infants: (n: number) => string;
};

/** Libellés de dates et de voyageurs, avec la même logique que ceux du tunnel en français. */
function labels(fmt: DateFormats, w: Words) {
  const range = (b: Booking) => {
    if (b.travelMonth) return w.monthPending(fmt.monthYear(parseDate(`${b.travelMonth}-01`)));
    if (!b.arrival) return w.datesToChoose;
    const start = parseDate(b.arrival);
    if (!b.departure) return w.from(fmt.dayMonthYearShort(start));
    const end = parseDate(b.departure);
    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    return `${sameMonth ? start.getDate() : fmt.dayMonthShort(start)} — ${fmt.dayMonthYearShort(end)}`;
  };
  return {
    monthTitle: (d: Date) => fmt.monthYear(d),
    fullDay: (iso: string) => fmt.full(parseDate(iso)),
    shortDate: (iso: string) => fmt.dayMonth(parseDate(iso)),
    monthLabel: (month: string) => fmt.monthYear(parseDate(`${month}-01`)),
    longDate: (iso: string) => fmt.dayMonthYear(parseDate(iso)),
    range,
    /** Version courte, sans année, pour le fil des étapes : « 11–19 nov. ». */
    compactRange(b: Booking) {
      if (b.travelMonth || !b.arrival || !b.departure) return range(b);
      const start = parseDate(b.arrival);
      const end = parseDate(b.departure);
      const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
      return sameMonth ? `${start.getDate()}–${fmt.dayMonthShort(end)}` : `${fmt.dayMonthShort(start)} – ${fmt.dayMonthShort(end)}`;
    },
    duration(b: Booking) {
      const n = nightsOf(b);
      if (n === 0) return b.arrival ? w.departureToChoose : w.datesToChoose;
      return w.nightsDays(n);
    },
    travelers(b: Booking) {
      const parts = [w.adults(b.adults)];
      if (b.children) parts.push(w.children(b.children));
      if (b.infants) parts.push(w.infants(b.infants));
      return w.travelers(travelersCount(b), parts);
    },
  };
}

const FR = {
  html: "fr",
  ...labels(intlFormats("fr-FR"), {
    datesToChoose: "Dates à choisir",
    from: (d) => `Dès le ${d}`,
    monthPending: (m) => `${m}, dates à fixer`,
    departureToChoose: "Date de départ à choisir",
    nightsDays: (n) => `${n} ${plural(n, "nuit", "nuits")} / ${n + 1} jours`,
    travelers: (total, parts) => `${total} ${plural(total, "voyageur", "voyageurs")} (${parts.join(", ")})`,
    adults: (n) => `${n} ${plural(n, "adulte", "adultes")}`,
    children: (n) => `${n} ${plural(n, "enfant", "enfants")}`,
    infants: (n) => `${n} ${plural(n, "bébé", "bébés")}`,
  }),
  reviewedDate: (iso: string) =>
    new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
      .format(new Date(`${iso}T12:00:00Z`))
      .replace(/^1 /, "1er "),
  time: (d: Date) => `${d.getHours()} h ${String(d.getMinutes()).padStart(2, "0")}`,
  joinList: (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}` : items[0]),
  newTab: "(nouvel onglet)",

  weekdays: [
    ["Lu", "lundi"],
    ["Ma", "mardi"],
    ["Me", "mercredi"],
    ["Je", "jeudi"],
    ["Ve", "vendredi"],
    ["Sa", "samedi"],
    ["Di", "dimanche"],
  ] as [string, string][],
  /** Même ordre que SEASON_RULES. */
  seasons: [
    { label: "Saison des pluies", advice: "Risque de cyclones sur le nord et l'est ; certaines pistes de l'ouest sont fermées." },
    { label: "Fin des pluies", advice: "Averses encore fréquentes ; pistes de l'ouest encore difficiles." },
    { label: "Saison sèche", advice: "Début de la saison sèche : nature encore verte, peu d'affluence." },
    { label: "Saison sèche", advice: "Temps sec ; nuits fraîches sur les Hautes Terres." },
    { label: "Haute saison", advice: "Baleines à bosse à Sainte-Marie ; forte affluence, réservez tôt les lodges." },
    { label: "Saison conseillée", advice: "Temps sec et affluence moindre qu'en juillet-août." },
    { label: "Fin de saison sèche", advice: "Chaleur ; premières pluies possibles en fin de mois." },
    { label: "Début des pluies", advice: "Averses et chaleur ; risque de cyclones à partir de la fin du mois." },
  ],

  dayToday: "aujourd'hui",
  dayArrival: "arrivée à Madagascar",
  dayDeparture: "départ de Madagascar",
  dayInStay: "pendant votre séjour",
  dayUnavailable: "indisponible",
  legendLabel: "Légende du calendrier",
  legendAvailable: "Disponible",
  legendEndpoint: "Arrivée ou départ",
  legendStay: "Pendant le séjour",
  legendUnavailable: "Indisponible",
  leadKnown: (days: number, last: string): [string, string] => [
    "Arrivée possible à partir du ",
    ` (${days} jours pour organiser votre accueil) et jusqu'au ${last}.`,
  ],
  leadUnknown: (days: number, last: string) => `Arrivée possible ${days} jours après la réservation au plus tôt, et jusqu'au ${last}.`,
  keyboardHelp: "Au clavier : flèches pour changer de jour, touches Page précédente et Page suivante pour changer de mois.",
  prevMonth: "Mois précédent",
  nextMonth: "Mois suivant",

  staleDates: "Les dates enregistrées sont passées ou trop proches : choisissez de nouvelles dates.",
  tooEarly: (first: string, days: number) =>
    `Arrivée possible à partir du ${first} : il nous faut ${days} jours pour organiser votre accueil.`,
  tooLate: (last: string) => `Les réservations sont ouvertes jusqu'au ${last}.`,
  tooShort: (min: number, date: string) => `Séjour trop court : ${min} nuits minimum, départ de Madagascar à partir du ${date}.`,
  tooLong: (n: number, max: number, date: string) =>
    `Trop de nuits (${n}) : séjour limité à ${max} nuits, départ de Madagascar au plus tard le ${date}.`,
  stayAnnounce: (from: string, to: string, n: number) => `Séjour du ${from} au ${to} : ${n} nuits.`,
  arrivalAnnounce: (from: string) => `Arrivée à Madagascar le ${from}. Choisissez maintenant la date de départ de Madagascar.`,
  newArrival: (max: number) => `Séjour limité à ${max} nuits : cette date devient votre nouvelle date d'arrivée à Madagascar.`,
  cleared: "Dates effacées. Choisissez votre date d'arrivée à Madagascar.",
  datesTitle: "Vos dates",
  introMonth: "Indiquez le mois et la durée : vous fixerez les dates précises avec notre équipe avant le paiement.",
  introDates: "Choisissez votre date d'arrivée à Madagascar, puis votre date de départ de Madagascar.",
  modeLegend: "Vos dates sont-elles fixées ?",
  modeExact: "J'ai mes dates",
  modeMonth: "Je n'ai pas encore de dates",
  travelMonth: "Mois du voyage",
  stayLength: "Durée du séjour",
  nightsN: (n: number) => `${n} nuits`,
  arrivalField: "Arrivée à Madagascar",
  departureField: "Départ de Madagascar",
  clearDates: "Effacer les dates",
  pickArrival: "Choisissez votre date d'arrivée à Madagascar.",
  pickDeparture: "Choisissez maintenant votre date de départ de Madagascar.",
  circuitDeparture: (date: string, n: number) => `Départ le ${date} (${n} nuits, durée du circuit)`,
  circuitNote: (title: string, circuitNights: number, n: number) =>
    `Le circuit « ${title} » dure ${circuitNights} nuits ; vous en avez choisi ${n}. Nous adapterons l'itinéraire et vous le confirmerons dans votre offre.`,
  backToNights: (n: number) => `Revenir à ${n} nuits`,
  yourChoice: "Votre choix :",
  stayRange: (min: number, max: number) => `Séjour de ${min} à ${max} nuits`,
  catalogRange: (min: number, max: number) => ` ; nos circuits durent de ${min} à ${max} nuits.`,
  flexible: "Dates flexibles (± 3 jours, pour trouver plus de disponibilités en lodge)",

  issueDatesShort: "vos dates",
  issueDates: "Choisissez votre date d'arrivée à Madagascar.",
  issueDepartureShort: "votre date de départ",
  issueDeparture: "Dates incomplètes : choisissez votre date de départ de Madagascar.",
  issueAgesShort: "l'âge de chaque enfant",
  issueAges: "Indiquez l'âge de chaque enfant.",
  issueTripShort: "un type de séjour",
  issueTrip: "Choisissez un type de séjour.",
  missing: "Il manque",
  complete: "Pour continuer, complétez",
  continueTo: (step: string) => `Continuer vers ${step}`,
  continue: "Continuer",
  stepDestination: "l'étape 2 · Destination",
  stepBudget: "l'étape 3 · Budget",

  tripTitle: "Type de séjour",
  tripIntro: "Il oriente les hébergements et les activités que nous vous proposerons.",
  tripTypes: {
    detente: { label: "Détente", text: "Plages, lodges au calme, rythme doux" },
    aventure: { label: "Aventure", text: "Randonnées, pistes en 4x4, bivouacs" },
    culture: { label: "Culture", text: "Villages, artisanat, histoire des Hautes Terres" },
    "lune-de-miel": { label: "Lune de miel", text: "Lodges romantiques, moments à deux" },
  } as Record<TripTypeId, { label: string; text: string }>,

  travelersTitle: "Les voyageurs",
  travelersIntro: "Le nombre et l'âge des voyageurs déterminent les chambres et les places dans les parcs nationaux.",
  counters: {
    adults: { label: "Adultes", age: "12 ans et plus" },
    children: { label: "Enfants", age: "2 à 11 ans" },
    infants: { label: "Bébés", age: "Moins de 2 ans" },
  },
  holder: (name: string) => `Dont vous, titulaire du dossier (${name})`,
  oneAdult: "Au moins un adulte par réservation",
  childHint: "Tarif enfant ; l'âge exact sert à préparer les chambres et les activités",
  infantShort: "Gratuit, un bébé par adulte",
  infantText:
    "Les bébés de moins de 2 ans voyagent gratuitement : aucun supplément pour l'hébergement, les vols intérieurs, les transferts et les excursions. En vol, chaque bébé voyage sur les genoux d'un adulte, d'où la limite d'un bébé par adulte. Un lit parapluie est fourni gratuitement sur demande, selon le lodge ; les petits pots et le lait ne sont pas compris.",
  remove: (label: string) => `Retirer : ${label}`,
  add: (label: string) => `Ajouter : ${label}`,
  agesLegend: "Âge de chaque enfant pendant le séjour",
  childN: (i: number) => `Enfant ${i}`,
  agePick: "Âge à choisir",
  years: (n: number) => `${n} ans`,
  ageRule: "À 12 ans ou plus, comptez-le parmi les adultes ; avant 2 ans, parmi les bébés.",
  adultError: "Au moins un adulte doit voyager : un enfant ou un bébé ne peut pas partir sans adulte.",
  infantLimit: "Un bébé maximum par adulte : en vol, chaque bébé voyage sur les genoux d'un adulte.",
  limitReached: "Limite atteinte.",
  groupText: (max: number, adults: number, children: number) =>
    `La réservation en ligne est limitée à ${max} voyageurs, dont ${adults} adultes et ${children} enfants au plus. Pour un groupe plus grand, nous préparons un devis sur mesure : `,
  groupWhatsapp: "écrivez-nous sur WhatsApp",
  groupOr: " ou à ",
  formalities: "Formalités d'entrée",
  nationality: "Nationalité",
  toSpecify: "À préciser",
  nationalities: { Française: "Française", Belge: "Belge", Suisse: "Suisse", Canadienne: "Canadienne", Autre: "Autre" } as Record<
    string,
    string
  >,
  passport:
    "Chaque voyageur, enfants compris, a besoin d'un passeport valable au moins 6 mois après la date de départ de Madagascar. Le visa n'est pas compris dans nos prix et ses conditions dépendent de la nationalité : vérifiez-les sur le ",
  visaSite: "site officiel du visa malgache",
  andOn: " et sur ",
  otherMinistry: " et auprès du ministère des Affaires étrangères de votre pays",
  reviewed: (date: string) => ` Informations vérifiées le ${date}.`,

  arrivalTitle: "Votre arrivée à Madagascar",
  optional: "facultatif",
  arrivalIntro:
    "Les vols internationaux ne sont pas inclus : vous les réservez de votre côté. Ces informations nous servent à organiser votre accueil à l'aéroport ; vous pourrez les compléter plus tard.",
  fromCity: "Ville de départ",
  fromCityPlaceholder: "ex. Paris, Bruxelles, Montréal",
  flightNumber: "Numéro du vol d'arrivée",
  flightPlaceholder: "ex. AF 934",

  steps: ["Séjour", "Destination", "Budget", "Offre", "Paiement"],
  stepsLabel: "Étapes de la réservation",
  validated: " (validée)",

  heroStay: "Votre séjour",
  heroCircuit: "Votre séjour · circuit",
  heroCustom: "Séjour sur mesure",
  heroAlt: "Vue aérienne d'un récif corallien turquoise bordant une côte de Madagascar",
  rowDates: "Dates",
  rowDuration: "Durée",
  rowFlexibility: "Flexibilité",
  flexValue: "± 3 jours",
  circuitNights: (n: number) => `circuit : ${n} nuits`,
  rowTravelers: "Voyageurs",
  agesToGive: "Âge des enfants à indiquer",
  childrenAges: (count: number, list: string) => `${plural(count, "Enfant", "Enfants")} : ${list}`,
  rowTripType: "Type de séjour",
  toChoose: "À choisir",
  rowDestination: "Destination",
  rowArrival: "Arrivée",
  fund: "Fonds Fihavanana",
  solidarity: "1 % de chaque réservation finance le fonds Fihavanana : reboisement, écoles et dispensaires des villages hôtes.",
  cancellation: "Annulation gratuite jusqu'à J-7 avant le départ, remboursement intégral.",
  emergency: "Sur place, ligne d'urgence 24 h/24 ; bureau d'Antananarivo de 8 h à 20 h.",

  draftAuto: "Brouillon enregistré automatiquement",
  draftAt: (time: string) => `Brouillon enregistré à ${time}`,
  backCircuit: "Retour au circuit",
  backCircuits: "Retour aux circuits",
  backHome: "Retour à l'accueil",
  travelersShort: (n: number) => `${n} ${plural(n, "voyageur", "voyageurs")}`,
  summary: "Résumé",

  pageTitle: "Réservation, étape 1 : dates, voyageurs et type de séjour",
  asideLabel: "Résumé du séjour",
  adviceTitle: "Besoin d'un conseil ?",
  adviceText: "Nos conseillers voyage à Antananarivo, 7 j/7, 8 h – 20 h",
  adviceWhatsapp: "Écrire sur WhatsApp",
};

export type DatesText = typeof FR;

const EN: DatesText = {
  html: "en",
  ...labels(intlFormats("en-GB"), {
    datesToChoose: "Dates to choose",
    from: (d) => `From ${d}`,
    monthPending: (m) => `${m}, dates to be set`,
    departureToChoose: "Departure date to choose",
    nightsDays: (n) => `${n} ${plural(n, "night", "nights")} / ${n + 1} days`,
    travelers: (total, parts) => `${total} ${plural(total, "traveller", "travellers")} (${parts.join(", ")})`,
    adults: (n) => `${n} ${plural(n, "adult", "adults")}`,
    children: (n) => `${n} ${plural(n, "child", "children")}`,
    infants: (n) => `${n} ${plural(n, "baby", "babies")}`,
  }),
  reviewedDate: (iso) =>
    new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
      new Date(`${iso}T12:00:00Z`),
    ),
  time: (d) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
  joinList: (items) => (items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}` : items[0]),
  newTab: "(new tab)",

  weekdays: [
    ["Mo", "Monday"],
    ["Tu", "Tuesday"],
    ["We", "Wednesday"],
    ["Th", "Thursday"],
    ["Fr", "Friday"],
    ["Sa", "Saturday"],
    ["Su", "Sunday"],
  ],
  seasons: [
    { label: "Rainy season", advice: "Risk of cyclones in the north and east; some tracks in the west are closed." },
    { label: "End of the rains", advice: "Showers still frequent; tracks in the west still difficult." },
    { label: "Dry season", advice: "Start of the dry season: landscapes still green, few visitors." },
    { label: "Dry season", advice: "Dry weather; cool nights in the Highlands." },
    { label: "High season", advice: "Humpback whales off Sainte-Marie; very busy, book lodges early." },
    { label: "Recommended season", advice: "Dry weather and fewer visitors than in July and August." },
    { label: "End of the dry season", advice: "Hot; first rains possible at the end of the month." },
    { label: "Start of the rains", advice: "Showers and heat; risk of cyclones from the end of the month." },
  ],

  dayToday: "today",
  dayArrival: "arrival in Madagascar",
  dayDeparture: "departure from Madagascar",
  dayInStay: "during your stay",
  dayUnavailable: "unavailable",
  legendLabel: "Calendar key",
  legendAvailable: "Available",
  legendEndpoint: "Arrival or departure",
  legendStay: "During the stay",
  legendUnavailable: "Unavailable",
  leadKnown: (days, last) => ["Arrival possible from ", ` (${days} days to organise your welcome) until ${last}.`],
  leadUnknown: (days, last) => `Arrival possible ${days} days after booking at the earliest, and until ${last}.`,
  keyboardHelp: "With the keyboard: arrow keys to change day, Page Up and Page Down to change month.",
  prevMonth: "Previous month",
  nextMonth: "Next month",

  staleDates: "The saved dates have passed or are too close: please choose new dates.",
  tooEarly: (first, days) => `Arrival possible from ${first}: we need ${days} days to organise your welcome.`,
  tooLate: (last) => `Bookings are open until ${last}.`,
  tooShort: (min, date) => `Stay too short: ${min} nights minimum, departure from Madagascar from ${date}.`,
  tooLong: (n, max, date) =>
    `Too many nights (${n}): stays are limited to ${max} nights, departure from Madagascar by ${date} at the latest.`,
  stayAnnounce: (from, to, n) => `Stay from ${from} to ${to}: ${n} nights.`,
  arrivalAnnounce: (from) => `Arrival in Madagascar on ${from}. Now choose your departure date from Madagascar.`,
  newArrival: (max) => `Stays are limited to ${max} nights: this date becomes your new arrival date in Madagascar.`,
  cleared: "Dates cleared. Choose your arrival date in Madagascar.",
  datesTitle: "Your dates",
  introMonth: "Tell us the month and length of stay: you will set the exact dates with our team before payment.",
  introDates: "Choose your arrival date in Madagascar, then your departure date from Madagascar.",
  modeLegend: "Are your dates fixed?",
  modeExact: "I have my dates",
  modeMonth: "I don't have dates yet",
  travelMonth: "Month of travel",
  stayLength: "Length of stay",
  nightsN: (n) => `${n} nights`,
  arrivalField: "Arrival in Madagascar",
  departureField: "Departure from Madagascar",
  clearDates: "Clear dates",
  pickArrival: "Choose your arrival date in Madagascar.",
  pickDeparture: "Now choose your departure date from Madagascar.",
  circuitDeparture: (date, n) => `Leave on ${date} (${n} nights, length of the tour)`,
  circuitNote: (title, circuitNights, n) =>
    `The “${title}” tour lasts ${circuitNights} nights; you have chosen ${n}. We will adapt the itinerary and confirm it in your offer.`,
  backToNights: (n) => `Back to ${n} nights`,
  yourChoice: "Your choice:",
  stayRange: (min, max) => `Stays of ${min} to ${max} nights`,
  catalogRange: (min, max) => `; our tours last ${min} to ${max} nights.`,
  flexible: "Flexible dates (± 3 days, to find more lodge availability)",

  issueDatesShort: "your dates",
  issueDates: "Choose your arrival date in Madagascar.",
  issueDepartureShort: "your departure date",
  issueDeparture: "Incomplete dates: choose your departure date from Madagascar.",
  issueAgesShort: "each child's age",
  issueAges: "Give the age of each child.",
  issueTripShort: "a type of stay",
  issueTrip: "Choose a type of stay.",
  missing: "Still needed",
  complete: "To continue, please add",
  continueTo: (step) => `Continue to ${step}`,
  continue: "Continue",
  stepDestination: "step 2 · Destination",
  stepBudget: "step 3 · Budget",

  tripTitle: "Type of stay",
  tripIntro: "It guides the accommodation and activities we will suggest.",
  tripTypes: {
    detente: { label: "Relaxation", text: "Beaches, quiet lodges, gentle pace" },
    aventure: { label: "Adventure", text: "Hikes, 4x4 tracks, bivouacs" },
    culture: { label: "Culture", text: "Villages, crafts, history of the Highlands" },
    "lune-de-miel": { label: "Honeymoon", text: "Romantic lodges, time for two" },
  },

  travelersTitle: "Travellers",
  travelersIntro: "The number and age of travellers determine the rooms and the places in the national parks.",
  counters: {
    adults: { label: "Adults", age: "12 and over" },
    children: { label: "Children", age: "2 to 11" },
    infants: { label: "Babies", age: "Under 2" },
  },
  holder: (name) => `Including you, the booking holder (${name})`,
  oneAdult: "At least one adult per booking",
  childHint: "Child rate; the exact age helps us prepare rooms and activities",
  infantShort: "Free, one baby per adult",
  infantText:
    "Babies under 2 travel free: no extra charge for accommodation, domestic flights, transfers or excursions. On flights, each baby sits on an adult's lap, hence the limit of one baby per adult. A travel cot is provided free on request, depending on the lodge; baby food and milk are not included.",
  remove: (label) => `Remove: ${label}`,
  add: (label) => `Add: ${label}`,
  agesLegend: "Age of each child during the stay",
  childN: (i) => `Child ${i}`,
  agePick: "Choose age",
  years: (n) => `${n} years`,
  ageRule: "Aged 12 or over, count them as an adult; under 2, as a baby.",
  adultError: "At least one adult must travel: a child or baby cannot travel without an adult.",
  infantLimit: "One baby per adult at most: on flights, each baby sits on an adult's lap.",
  limitReached: "Limit reached.",
  groupText: (max, adults, children) =>
    `Online booking is limited to ${max} travellers, with at most ${adults} adults and ${children} children. For a larger group, we prepare a tailor-made quote: `,
  groupWhatsapp: "message us on WhatsApp",
  groupOr: " or email ",
  formalities: "Entry requirements",
  nationality: "Nationality",
  toSpecify: "To be specified",
  nationalities: { Française: "French", Belge: "Belgian", Suisse: "Swiss", Canadienne: "Canadian", Autre: "Other" },
  passport:
    "Every traveller, including children, needs a passport valid for at least 6 months after the departure date from Madagascar. The visa is not included in our prices and its conditions depend on nationality: check them on the ",
  visaSite: "official Madagascar visa website",
  andOn: " and on ",
  otherMinistry: " and with your country's foreign ministry",
  reviewed: (date) => ` Information checked on ${date}.`,

  arrivalTitle: "Your arrival in Madagascar",
  optional: "optional",
  arrivalIntro:
    "International flights are not included: you book them yourself. This information helps us organise your welcome at the airport; you can complete it later.",
  fromCity: "Departure city",
  fromCityPlaceholder: "e.g. Paris, Brussels, Montreal",
  flightNumber: "Arrival flight number",
  flightPlaceholder: "e.g. AF 934",

  steps: ["Stay", "Destination", "Budget", "Offer", "Payment"],
  stepsLabel: "Booking steps",
  validated: " (done)",

  heroStay: "Your stay",
  heroCircuit: "Your stay · tour",
  heroCustom: "Tailor-made stay",
  heroAlt: "Aerial view of a turquoise coral reef along a coast of Madagascar",
  rowDates: "Dates",
  rowDuration: "Length",
  rowFlexibility: "Flexibility",
  flexValue: "± 3 days",
  circuitNights: (n) => `tour: ${n} nights`,
  rowTravelers: "Travellers",
  agesToGive: "Children's ages to be given",
  childrenAges: (count, list) => `${plural(count, "Child", "Children")}: ${list}`,
  rowTripType: "Type of stay",
  toChoose: "To choose",
  rowDestination: "Destination",
  rowArrival: "Arrival",
  fund: "Fihavanana fund",
  solidarity: "1% of every booking funds the Fihavanana fund: reforestation, schools and clinics in the host villages.",
  cancellation: "Free cancellation up to 7 days before departure, full refund.",
  emergency: "On site, 24/7 emergency line; Antananarivo office open 8 am to 8 pm.",

  draftAuto: "Draft saved automatically",
  draftAt: (time) => `Draft saved at ${time}`,
  backCircuit: "Back to the tour",
  backCircuits: "Back to tours",
  backHome: "Back to home page",
  travelersShort: (n) => `${n} ${plural(n, "traveller", "travellers")}`,
  summary: "Summary",

  pageTitle: "Booking, step 1: dates, travellers and type of stay",
  asideLabel: "Stay summary",
  adviceTitle: "Need advice?",
  adviceText: "Our travel advisers in Antananarivo, 7 days a week, 8 am – 8 pm",
  adviceWhatsapp: "Message us on WhatsApp",
};

/** Version malgache : à faire relire par un locuteur natif avant mise en ligne. */
const MG: DatesText = {
  html: "mg",
  ...labels(mgFormats, {
    datesToChoose: "Daty mbola hosafidiana",
    from: (d) => `Manomboka ny ${d}`,
    monthPending: (m) => `${m}, daty mbola hofaritana`,
    departureToChoose: "Daty hialana mbola hosafidiana",
    nightsDays: (n) => `${n} alina / ${n + 1} andro`,
    travelers: (total, parts) => `${total} mpandeha (${parts.join(", ")})`,
    adults: (n) => `${n} olon-dehibe`,
    children: (n) => `${n} ankizy`,
    infants: (n) => `${n} zazakely`,
  }),
  reviewedDate: (iso) => mgFormats.dayMonthYear(new Date(`${iso}T12:00:00`)),
  time: (d) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
  joinList: (items) => (items.length > 1 ? `${items.slice(0, -1).join(", ")} sy ${items[items.length - 1]}` : items[0]),
  newTab: "(tabilao vaovao)",

  weekdays: [
    ["Alt", "Alatsinainy"],
    ["Tal", "Talata"],
    ["Alr", "Alarobia"],
    ["Alk", "Alakamisy"],
    ["Zom", "Zoma"],
    ["Sab", "Sabotsy"],
    ["Alh", "Alahady"],
  ],
  seasons: [
    { label: "Fotoanan'ny orana", advice: "Mety hisy rivodoza any avaratra sy atsinanana ; mihidy ny lalana sasany any andrefana." },
    { label: "Fiafaran'ny orana", advice: "Mbola matetika ny oram-baratra ; mbola sarotra ny lalana any andrefana." },
    { label: "Main-tany", advice: "Fiandohan'ny main-tany : mbola maitso ny natiora, vitsy ny mpitsidika." },
    { label: "Main-tany", advice: "Maina ny andro ; mangatsiaka ny alina any amin'ny Afovoan-tany." },
    { label: "Fotoana be mpitsidika", advice: "Trozona any Sainte-Marie ; be ny mpitsidika, mamandriha lodge aloha." },
    { label: "Fotoana tsara indrindra", advice: "Maina ny andro ary vitsy kokoa ny mpitsidika noho ny Jolay sy Aogositra." },
    { label: "Fiafaran'ny main-tany", advice: "Mafana ; mety hilatsaka ny orana voalohany amin'ny faran'ny volana." },
    { label: "Fiandohan'ny orana", advice: "Oram-baratra sy hafanana ; mety hisy rivodoza manomboka amin'ny faran'ny volana." },
  ],

  dayToday: "androany",
  dayArrival: "fahatongavana eto Madagasikara",
  dayDeparture: "fiaingana avy eto Madagasikara",
  dayInStay: "mandritra ny fivahinianao",
  dayUnavailable: "tsy azo safidiana",
  legendLabel: "Fanazavana ny tetiandro",
  legendAvailable: "Malalaka",
  legendEndpoint: "Fahatongavana na fiaingana",
  legendStay: "Mandritra ny fivahiniana",
  legendUnavailable: "Tsy azo safidiana",
  leadKnown: (days, last) => [
    "Azo atao ny tonga manomboka ny ",
    ` (andro ${days} hikarakarana ny fandraisana anao) ka hatramin'ny ${last}.`,
  ],
  leadUnknown: (days, last) => `Azo atao ny tonga ${days} andro farafahakeliny aorian'ny famandrihana, ka hatramin'ny ${last}.`,
  keyboardHelp: "Amin'ny fitendry : zana-tsipìka hanovana andro, Page Up sy Page Down hanovana volana.",
  prevMonth: "Volana teo aloha",
  nextMonth: "Volana manaraka",

  staleDates: "Efa lasa na akaiky loatra ireo daty voatahiry : misafidiana daty vaovao.",
  tooEarly: (first, days) => `Azo atao ny tonga manomboka ny ${first} : mila andro ${days} izahay hikarakarana ny fandraisana anao.`,
  tooLate: (last) => `Misokatra hatramin'ny ${last} ny famandrihana.`,
  tooShort: (min, date) => `Fohy loatra ny fivahiniana : ${min} alina farafahakeliny, fiaingana manomboka ny ${date}.`,
  tooLong: (n, max, date) => `Be loatra ny alina (${n}) : ${max} alina farafahabetsany, fiaingana hatramin'ny ${date} farafahaterintany.`,
  stayAnnounce: (from, to, n) => `Fivahiniana manomboka ny ${from} ka hatramin'ny ${to} : ${n} alina.`,
  arrivalAnnounce: (from) => `Fahatongavana eto Madagasikara ny ${from}. Misafidiana izao ny daty hialanao avy eto Madagasikara.`,
  newArrival: (max) => `${max} alina farafahabetsany : io daty io no lasa daty fahatongavanao vaovao.`,
  cleared: "Voafafa ny daty. Misafidiana ny daty hahatongavanao eto Madagasikara.",
  datesTitle: "Ny datinao",
  introMonth: "Asehoy ny volana sy ny faharetany : hofaritanareo miaraka amin'ny ekipanay ny daty marina alohan'ny fandoavam-bola.",
  introDates: "Misafidiana ny daty hahatongavanao eto Madagasikara, avy eo ny daty hialanao.",
  modeLegend: "Efa voafaritra ve ny datinao ?",
  modeExact: "Efa manana daty aho",
  modeMonth: "Mbola tsy manana daty aho",
  travelMonth: "Volana hivahiniana",
  stayLength: "Faharetan'ny fivahiniana",
  nightsN: (n) => `${n} alina`,
  arrivalField: "Fahatongavana eto Madagasikara",
  departureField: "Fiaingana avy eto Madagasikara",
  clearDates: "Fafao ny daty",
  pickArrival: "Misafidiana ny daty hahatongavanao eto Madagasikara.",
  pickDeparture: "Misafidiana izao ny daty hialanao avy eto Madagasikara.",
  circuitDeparture: (date, n) => `Miainga ny ${date} (${n} alina, faharetan'ny fitsangatsanganana)`,
  circuitNote: (title, circuitNights, n) =>
    `Maharitra ${circuitNights} alina ny fitsangatsanganana « ${title} » ; ${n} alina no nofidinao. Hamboarinay ny lalana ary hamafisinay ao amin'ny tolotra.`,
  backToNights: (n) => `Hiverina amin'ny ${n} alina`,
  yourChoice: "Ny safidinao :",
  stayRange: (min, max) => `Fivahiniana ${min} ka hatramin'ny ${max} alina`,
  catalogRange: (min, max) => ` ; maharitra ${min} ka hatramin'ny ${max} alina ny fitsangatsanganana atolotray.`,
  flexible: "Daty azo ovaina (± 3 andro, mba hahitana toerana malalaka kokoa amin'ny lodge)",

  issueDatesShort: "ny datinao",
  issueDates: "Misafidiana ny daty hahatongavanao eto Madagasikara.",
  issueDepartureShort: "ny daty hialanao",
  issueDeparture: "Tsy feno ny daty : misafidiana ny daty hialanao avy eto Madagasikara.",
  issueAgesShort: "ny taonan'ny ankizy tsirairay",
  issueAges: "Asehoy ny taonan'ny ankizy tsirairay.",
  issueTripShort: "karazana fivahiniana",
  issueTrip: "Misafidiana karazana fivahiniana.",
  missing: "Mbola tsy ampy",
  complete: "Mba hanohizana, fenoy",
  continueTo: (step) => `Tohizo mankany amin'ny ${step}`,
  continue: "Tohizo",
  stepDestination: "dingana 2 · Toerana",
  stepBudget: "dingana 3 · Tetibola",

  tripTitle: "Karazana fivahiniana",
  tripIntro: "Izy no hitarihana ny trano fandraisam-bahiny sy ny hetsika hatolotray anao.",
  tripTypes: {
    detente: { label: "Fialan-tsasatra", text: "Morontsiraka, lodge mangina, gadona malefaka" },
    aventure: { label: "Fitsangatsanganana mavitrika", text: "Dia an-tongotra, lalana 4x4, fitobiana" },
    culture: { label: "Kolontsaina", text: "Tanàna, asa-tanana, tantaran'ny Afovoan-tany" },
    "lune-de-miel": { label: "Volan-tantely", text: "Lodge romantika, fotoana ho anareo roa" },
  },

  travelersTitle: "Ireo mpandeha",
  travelersIntro: "Ny isa sy ny taonan'ny mpandeha no mamaritra ny efitrano sy ny toerana any amin'ireo valan-javaboahary.",
  counters: {
    adults: { label: "Olon-dehibe", age: "12 taona no ho miakatra" },
    children: { label: "Ankizy", age: "2 ka hatramin'ny 11 taona" },
    infants: { label: "Zazakely", age: "Latsaky ny 2 taona" },
  },
  holder: (name) => `Anisan'izany ianao, tompon'ny famandrihana (${name})`,
  oneAdult: "Olon-dehibe iray farafahakeliny isaky ny famandrihana",
  childHint: "Saran'ankizy ; ny taona marina dia ilaina hikarakarana ny efitrano sy ny hetsika",
  infantShort: "Maimaimpoana, zazakely iray isaky ny olon-dehibe",
  infantText:
    "Mandeha maimaimpoana ny zazakely latsaky ny 2 taona : tsy misy sarany fanampiny amin'ny trano fandraisam-bahiny, ny sidina anatiny, ny fitaterana ary ny fitsangatsanganana. Ao anaty fiaramanidina, eo am-pofoan'olon-dehibe ny zazakely tsirairay, ka zazakely iray ihany isaky ny olon-dehibe. Misy fandriana kely omena maimaimpoana raha angatahina, arakaraka ny lodge ; tsy tafiditra ny sakafon-jaza sy ny ronono.",
  remove: (label) => `Esory : ${label}`,
  add: (label) => `Ampio : ${label}`,
  agesLegend: "Taonan'ny ankizy tsirairay mandritra ny fivahiniana",
  childN: (i) => `Zaza ${i}`,
  agePick: "Safidio ny taona",
  years: (n) => `${n} taona`,
  ageRule: "Raha 12 taona no ho miakatra, isao ho olon-dehibe ; raha latsaky ny 2 taona, isao ho zazakely.",
  adultError: "Tsy maintsy misy olon-dehibe iray farafahakeliny : tsy afaka mandeha tsy misy olon-dehibe ny ankizy na zazakely.",
  infantLimit:
    "Zazakely iray farafahabetsany isaky ny olon-dehibe : ao anaty fiaramanidina, eo am-pofoan'olon-dehibe ny zazakely tsirairay.",
  limitReached: "Tratra ny fetra.",
  groupText: (max, adults, children) =>
    `Voafetra ho ${max} mpandeha ny famandrihana an-tserasera, ka ${adults} olon-dehibe sy ${children} ankizy farafahabetsany. Ho an'ny vondrona lehibe kokoa, manomana tolotra manokana izahay : `,
  groupWhatsapp: "manorata aminay amin'ny WhatsApp",
  groupOr: " na amin'ny ",
  formalities: "Taratasy ilaina hidirana",
  nationality: "Zom-pirenena",
  toSpecify: "Hofaritana",
  nationalities: { Française: "Frantsay", Belge: "Belza", Suisse: "Soisa", Canadienne: "Kanadiana", Autre: "Hafa" },
  passport:
    "Mila pasipaoro manan-kery 6 volana farafahakeliny aorian'ny daty hialana avy eto Madagasikara ny mpandeha tsirairay, ankizy koa. Tsy tafiditra ao amin'ny vidinay ny visa ary miankina amin'ny zom-pirenena ny fepetra : jereo ao amin'ny ",
  visaSite: "tranonkala ofisialin'ny visa malagasy",
  andOn: " sy ao amin'ny ",
  otherMinistry: " sy any amin'ny ministeran'ny Raharaham-bahiny ao amin'ny firenenao",
  reviewed: (date) => ` Fampahalalana nohamarinina ny ${date}.`,

  arrivalTitle: "Ny fahatongavanao eto Madagasikara",
  optional: "tsy voatery",
  arrivalIntro:
    "Tsy tafiditra ny sidina iraisam-pirenena : ianao no mamandrika azy. Ireo fampahalalana ireo dia ilainay hikarakarana ny fandraisana anao eny amin'ny seranam-piaramanidina ; azonao fenoina any aoriana.",
  fromCity: "Tanàna iaingana",
  fromCityPlaceholder: "ohatra : Paris, Bruxelles, Montréal",
  flightNumber: "Laharan'ny sidina hahatongavana",
  flightPlaceholder: "ohatra : AF 934",

  steps: ["Fivahiniana", "Toerana", "Tetibola", "Tolotra", "Fandoavana"],
  stepsLabel: "Dingana amin'ny famandrihana",
  validated: " (vita)",

  heroStay: "Ny fivahinianao",
  heroCircuit: "Ny fivahinianao · fitsangatsanganana",
  heroCustom: "Fivahiniana namboarina manokana",
  heroAlt: "Haran-dranomasina manga hita avy eny ambony, manamorona ny morontsirak'i Madagasikara",
  rowDates: "Daty",
  rowDuration: "Faharetany",
  rowFlexibility: "Fahafahana manova",
  flexValue: "± 3 andro",
  circuitNights: (n) => `fitsangatsanganana : ${n} alina`,
  rowTravelers: "Mpandeha",
  agesToGive: "Mbola tsy voalaza ny taonan'ny ankizy",
  childrenAges: (_count, list) => `Ankizy : ${list}`,
  rowTripType: "Karazana fivahiniana",
  toChoose: "Hosafidiana",
  rowDestination: "Toerana",
  rowArrival: "Fahatongavana",
  fund: "Tahirim-bola Fihavanana",
  solidarity:
    "1 % amin'ny famandrihana tsirairay no mamatsy ny tahirim-bola Fihavanana : fambolen-kazo, sekoly ary toeram-pitsaboana ao amin'ireo tanàna mandray.",
  cancellation: "Fanafoanana maimaimpoana hatramin'ny 7 andro alohan'ny fiaingana, averina manontolo ny vola.",
  emergency: "Eny an-toerana, laharana vonjy maika 24 ora/24 ; birao any Antananarivo misokatra amin'ny 8 ora ka hatramin'ny 20 ora.",

  draftAuto: "Voatahiry ho azy ny drafitra",
  draftAt: (time) => `Voatahiry ny drafitra tamin'ny ${time}`,
  backCircuit: "Hiverina amin'ny fitsangatsanganana",
  backCircuits: "Hiverina amin'ireo fitsangatsanganana",
  backHome: "Hiverina amin'ny pejy fandraisana",
  travelersShort: (n) => `${n} mpandeha`,
  summary: "Famintinana",

  pageTitle: "Famandrihana, dingana 1 : daty, mpandeha ary karazana fivahiniana",
  asideLabel: "Famintinana ny fivahiniana",
  adviceTitle: "Mila torohevitra ?",
  adviceText: "Ireo mpanolotsaina momba ny dia ao Antananarivo, isan'andro, 8 ora – 20 ora",
  adviceWhatsapp: "Manorata amin'ny WhatsApp",
};

const TEXT: Record<Lang, DatesText> = { FR, EN, MG };

export function useDatesText() {
  return TEXT[useLang()];
}
