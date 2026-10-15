export type TripTypeId = "detente" | "aventure" | "culture" | "lune-de-miel";
export type DestinationId = "nosy-be" | "sainte-marie" | "grand-nord";
export type HotelId = "manga-soa" | "vanila" | "heure-bleue";
export type RoomId = "baobab" | "ylang" | "ravinala";
export type TransportId = "private" | "shared";
export type MealId = "breakfast" | "half" | "full";
export type ActivityId = "lokobe" | "tanikely" | "passot";
export type DietId = "child" | "veggie" | "gluten";
export type Slot = "morning" | "afternoon";

export type Booking = {
  /** Arrivée à Madagascar ; null tant que les dates ne sont pas choisies ou quand seul le mois est connu. */
  arrival: string | null;
  /** Départ de Madagascar. */
  departure: string | null;
  /** Mois du voyage (AAAA-MM) quand le voyageur n'a pas encore de dates précises. */
  travelMonth: string | null;
  /** Nombre de nuits prévu quand seul le mois est connu. */
  monthNights: number;
  flexible: boolean;
  adults: number;
  children: number;
  /** Âge de chaque enfant (2 à 11 ans), dans l'ordre ; null tant qu'il n'est pas indiqué. */
  childAges: (number | null)[];
  infants: number;
  tripType: TripTypeId | null;
  /** Circuit du catalogue d'où vient le voyageur (identifiant de `CIRCUITS`), ou null pour un voyage composé librement. */
  circuit: string | null;
  destination: DestinationId;
  /** Vrai quand la destination vient d'une fiche circuit ou de l'étape 2, et non de la valeur par défaut. */
  destinationChosen: boolean;
  nationality: string;
  arrivalFrom: string;
  arrivalFlight: string;
  budget: number;
  hotel: HotelId;
  room: RoomId;
  transport: TransportId;
  meals: MealId;
  activities: ActivityId[];
  lokobeSlot: Slot;
  diets: DietId[];
  childSeat: boolean;
  promo: string | null;
  /** Remise accordée par le serveur pour `promo` ; recalculée côté serveur à chaque devis. */
  promoDiscount: number;
  payNow: "total" | "deposit";
};

export const DEFAULT_BOOKING: Booking = {
  arrival: "2026-11-05",
  departure: "2026-11-15",
  travelMonth: null,
  monthNights: 10,
  flexible: true,
  adults: 2,
  children: 1,
  childAges: [8],
  infants: 0,
  tripType: null,
  circuit: null,
  destination: "nosy-be",
  destinationChosen: false,
  nationality: "",
  arrivalFrom: "",
  arrivalFlight: "",
  budget: 1400,
  hotel: "manga-soa",
  room: "baobab",
  transport: "private",
  meals: "half",
  activities: ["lokobe"],
  lokobeSlot: "morning",
  diets: ["child"],
  childSeat: true,
  promo: null,
  promoDiscount: 0,
  payNow: "deposit",
};

export const LIMITS = {
  adults: { min: 1, max: 8 },
  children: { min: 0, max: 6 },
  infants: { min: 0, max: 3 },
  childAge: { min: 2, max: 11 },
  /** Au-delà, le voyage est organisé comme un voyage de groupe, sur devis. */
  maxTravelers: 9,
  minNights: 3,
  maxNights: 21,
  /** Délai minimal entre la réservation et l'arrivée, pour organiser l'accueil et les transferts. */
  minLeadDays: 3,
  /** Dernière date réservable (réservations ouvertes jusqu'à fin 2027). */
  lastDate: "2027-12-31",
  maxBudget: 100_000,
};

export function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toIso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function addDays(iso: string, days: number) {
  const d = parseDate(iso);
  d.setDate(d.getDate() + days);
  return toIso(d);
}

export function daysBetween(from: string, to: string) {
  return Math.round((parseDate(to).getTime() - parseDate(from).getTime()) / 86_400_000);
}

export function nightsOf(b: Booking) {
  if (b.travelMonth) return b.monthNights;
  if (!b.arrival || !b.departure) return 0;
  return daysBetween(b.arrival, b.departure);
}

/** Début du séjour, ou premier jour du mois choisi quand les dates ne sont pas encore fixées. */
export function stayStart(b: Booking) {
  return b.travelMonth ? `${b.travelMonth}-01` : b.arrival;
}

/** Fin du séjour ; au plus tôt quand seul le mois est connu. */
export function stayEnd(b: Booking) {
  const start = stayStart(b);
  const nights = nightsOf(b);
  return start && nights ? addDays(start, nights) : null;
}

/** Mois (0 à 11) couverts par les nuits du séjour, du mois d'arrivée à celui de la dernière nuit. */
export function stayMonths(b: Booking) {
  const start = stayStart(b);
  if (!start) return [];
  const end = stayEnd(b);
  const last = end ? addDays(end, -1) : start;
  const months: number[] = [];
  let y = Number(start.slice(0, 4));
  let m = Number(start.slice(5, 7)) - 1;
  const lastIndex = Number(last.slice(0, 4)) * 12 + Number(last.slice(5, 7)) - 1;
  while (y * 12 + m <= lastIndex && months.length < 12) {
    months.push(m);
    m = (m + 1) % 12;
    if (m === 0) y++;
  }
  return months;
}

/** Ajuste la liste des âges au nombre d'enfants ; un âge hors de la tranche enfant est à redemander. */
export function childAgesFor(children: number, ages: (number | null)[]) {
  return Array.from({ length: children }, (_, i) => {
    const age = ages[i];
    return typeof age === "number" && age >= LIMITS.childAge.min && age <= LIMITS.childAge.max ? age : null;
  });
}

/** Nom de la clé localStorage et du cookie qui la recopie pour le rendu serveur. */
export const BOOKING_KEY = "mv_booking";

const CHOICES: Partial<Record<keyof Booking, readonly string[]>> = {
  tripType: ["detente", "aventure", "culture", "lune-de-miel"],
  destination: ["nosy-be", "sainte-marie", "grand-nord"],
  hotel: ["manga-soa", "vanila", "heure-bleue"],
  room: ["baobab", "ylang", "ravinala"],
  transport: ["private", "shared"],
  meals: ["breakfast", "half", "full"],
  activities: ["lokobe", "tanikely", "passot"],
  lokobeSlot: ["morning", "afternoon"],
  diets: ["child", "veggie", "gluten"],
  payNow: ["total", "deposit"],
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function valid(key: keyof Booking, value: unknown) {
  const fallback = DEFAULT_BOOKING[key];
  const choices = CHOICES[key];
  if (key === "childAges") return Array.isArray(value) && value.length <= 12 && value.every((v) => v === null || Number.isInteger(v));
  if (Array.isArray(fallback)) return Array.isArray(value) && value.every((v) => choices?.includes(v));
  if (choices) return choices.includes(value as string);
  if (key === "arrival" || key === "departure") return value === null || (typeof value === "string" && ISO_DATE.test(value));
  if (key === "travelMonth") return value === null || (typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value));
  if (key === "promo") return value === null || (typeof value === "string" && value.length <= 32);
  if (key === "circuit") return value === null || (typeof value === "string" && /^[a-z0-9-]{1,40}$/.test(value));
  if (typeof fallback === "string") return typeof value === "string" && value.length <= 60;
  if (typeof fallback === "number") return Number.isFinite(value) && (value as number) >= 0;
  return typeof value === typeof fallback;
}

/** Relit une réservation enregistrée en écartant toute valeur inattendue. */
export function parseBooking(raw: string | null | undefined): Booking {
  if (!raw) return DEFAULT_BOOKING;
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return DEFAULT_BOOKING;
    const booking = { ...DEFAULT_BOOKING };
    for (const key of Object.keys(DEFAULT_BOOKING) as (keyof Booking)[]) {
      if (key in data && valid(key, data[key])) (booking as Record<string, unknown>)[key] = data[key];
    }
    const clamp = (n: number, { min, max }: { min: number; max: number }) => Math.min(max, Math.max(min, Math.round(n)));
    booking.adults = clamp(booking.adults, LIMITS.adults);
    booking.children = clamp(booking.children, LIMITS.children);
    booking.children = Math.min(booking.children, LIMITS.maxTravelers - booking.adults);
    booking.infants = clamp(booking.infants, { min: 0, max: Math.min(LIMITS.infants.max, booking.adults) });
    booking.infants = Math.min(booking.infants, LIMITS.maxTravelers - booking.adults - booking.children);
    booking.childAges = childAgesFor(booking.children, booking.childAges);
    booking.budget = clamp(booking.budget, { min: 0, max: LIMITS.maxBudget });
    booking.activities = [...new Set(booking.activities)];
    booking.diets = [...new Set(booking.diets)];
    booking.monthNights = clamp(booking.monthNights, { min: LIMITS.minNights, max: LIMITS.maxNights });
    if (booking.travelMonth) {
      booking.arrival = null;
      booking.departure = null;
    }
    if (!booking.arrival) booking.departure = null;
    const nights = nightsOf(booking);
    if (booking.departure && (nights < LIMITS.minNights || nights > LIMITS.maxNights)) booking.departure = null;
    if (!booking.promo) booking.promoDiscount = 0;
    return booking;
  } catch {
    return DEFAULT_BOOKING;
  }
}
