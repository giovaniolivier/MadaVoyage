import {
  addDays,
  nightsOf,
  type ActivityId,
  type Booking,
  type DestinationId,
  type HotelId,
  type MealId,
  type RoomId,
  type TransportId,
} from "./booking-data";
import { FALLBACK_RATE, rateDateLabel, type ExchangeRate } from "@/lib/exchange-rate";

let rate: ExchangeRate = FALLBACK_RATE;

/** Appelé par `ExchangeRateSync` avec le taux du jour lu par le serveur, avant le rendu des pages. */
export function setExchangeRate(next: ExchangeRate) {
  rate = next;
}

export const exchangeRate = () => rate;

/** « 1 € = 5 010 Ar · taux du 13 oct. 2026 ». */
export const rateLabel = () =>
  `1 € = ${whole.format(rate.mgaPerEur)} Ar · taux du ${rateDateLabel(rate)}`.replace(/[\u202f\u00a0]/g, "\u00a0");

export const DOSSIER = "MDV-2026-8902";

const whole = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nbsp = (s: string) => s.replace(/[\u202f\u00a0]/g, "\u00a0");

export function eur(amount: number, withCents = false) {
  return nbsp(`${(withCents ? cents : whole).format(amount)} €`);
}

export function mga(amount: number) {
  return nbsp(`${whole.format(Math.round(amount * rate.mgaPerEur))} Ar`);
}

export function usd(amount: number, withCents = false) {
  return nbsp(`${(withCents ? cents : whole).format(amount * rate.usdPerEur)} $`);
}

export function signedEur(amount: number) {
  if (amount === 0) return eur(0);
  return `${amount > 0 ? "+" : "−"}${eur(Math.abs(amount))}`;
}

type PerPerson = { adult: number; child: number };

/** Compagnie des vols intérieurs (ex-Tsaradia, fusionnée dans Madagascar Airlines). */
export const AIRLINE = "Madagascar Airlines";

/** Saison IATA été 2026 de Madagascar Airlines : à remplacer par le programme d'hiver dès sa publication. */
export const FLIGHT_SOURCE = {
  label: `programme de vols ${AIRLINE} du 29 mars au 24 octobre 2026`,
  href: "https://madagascarairlines.com/fileadmin/user_upload/actualites/PROGRAMME_DE_VOLS_SUMMER_2026.pdf",
};

/**
 * Données de référence des destinations réservables : l'étape 2, sa fiche détaillée, l'Explorer et les circuits liés lisent
 * tous ces valeurs.
 */
export const DESTINATIONS: Record<
  DestinationId,
  {
    name: string;
    short: string;
    airport: string;
    /** Durée du vol sans escale depuis Antananarivo, selon `FLIGHT_SOURCE`. */
    flight: string;
    /** Précision sur les escales, quand tous les vols ne sont pas sans escale. */
    flightNote?: string;
    rating: number;
    reviews: number;
    fromPrice: number;
    fromNights: number;
    detailed: boolean;
  }
> = {
  "nosy-be": {
    name: "Nosy Be et ses îles",
    short: "Nosy Be",
    airport: "Nosy Be (Fascene)",
    flight: "1\u00a0h\u00a045",
    rating: 4.8,
    reviews: 131,
    fromPrice: 450,
    fromNights: 7,
    detailed: true,
  },
  "sainte-marie": {
    name: "Sainte-Marie et l'île aux Nattes",
    short: "Sainte-Marie",
    airport: "Sainte-Marie",
    flight: "1\u00a0h\u00a005",
    flightNote: "sans escale à l'aller ; certains retours font escale à Toamasina",
    rating: 4.8,
    reviews: 129,
    fromPrice: 420,
    fromNights: 6,
    detailed: false,
  },
  "grand-nord": {
    name: "Diego Suarez et l'extrême nord",
    short: "Diego Suarez",
    airport: "Diego Suarez (Arrachart)",
    flight: "2\u00a0h",
    rating: 4.8,
    reviews: 96,
    fromPrice: 520,
    fromNights: 8,
    detailed: false,
  },
};

/** Part du prix adulte payée par un enfant : hypothèse de maquette, à aligner sur la grille tarifaire réelle. */
export const CHILD_RATE = 0.7;

const tens = (n: number) => Math.round(n / 10) * 10;

/**
 * Prix indicatif d'une zone pour le séjour réel : le prix de référence (par adulte, `fromNights` nuits) ramené à la nuit,
 * appliqué aux nuits choisies ; enfants à `CHILD_RATE`, bébés gratuits. Le prix est confirmé à l'étape 4.
 */
export function zoneEstimate(id: DestinationId, b: Booking) {
  const d = DESTINATIONS[id];
  const nights = nightsOf(b) || d.fromNights;
  const adult = tens((d.fromPrice / d.fromNights) * nights);
  const child = tens(adult * CHILD_RATE);
  return { nights, adult, child, total: adult * b.adults + child * b.children };
}

export const ROOMS: Record<RoomId, { name: string; view: string; perNight: number; capacity: number }> = {
  baobab: { name: "Suite Baobab", view: "Vue Océan", perNight: 85, capacity: 3 },
  ylang: { name: "Bungalow Ylang-Ylang", view: "Vue Jardin Fleuri", perNight: 70, capacity: 2 },
  ravinala: { name: "Villa Familiale Ravinala", view: "Piscine Privative", perNight: 130, capacity: 6 },
};

export const HOTELS: Record<HotelId, { name: string; stars: string; perNight: number; capacity: number; roomName: string }> = {
  "manga-soa": {
    name: "Manga Soa Lodge",
    stars: "4★ Écolodge",
    perNight: ROOMS.baobab.perNight,
    capacity: ROOMS.baobab.capacity,
    roomName: ROOMS.baobab.name,
  },
  vanila: { name: "Vanila Hotel & Spa", stars: "4★ Boutique", perNight: 89, capacity: 3, roomName: "Chambre Familiale Vue Océan" },
  "heure-bleue": { name: "L'Heure Bleue", stars: "3★ Charme", perNight: 76, capacity: 3, roomName: "Bungalow Famille Vue Baie" },
};

export const TRANSPORTS: Record<
  TransportId,
  { name: string; detail: string; flight: PerPerson; ground: { flat: number; perPerson: number } }
> = {
  private: {
    name: `Vols ${AIRLINE} & 4x4 privé`,
    detail: "Vols intérieurs A/R + navette 4x4 climatisée avec chauffeur-guide",
    flight: { adult: 125, child: 90 },
    ground: { flat: 80, perPerson: 0 },
  },
  shared: {
    name: "Vol matinal & navette partagée",
    detail: "Vol aller matinal promotionnel + navette éco-partagée",
    flight: { adult: 95, child: 70 },
    ground: { flat: 0, perPerson: 12 },
  },
};

export const MEALS: Record<MealId, { name: string; detail: string; perNight: PerPerson }> = {
  breakfast: {
    name: "Petit-Déjeuner Tropical",
    detail: "Petits-déjeuners de fruits du jour et mofo gasy",
    perNight: { adult: 4.5, child: 3 },
  },
  half: { name: "Demi-Pension Terroir & Océan", detail: "Petits-déjeuners + dîners 3 plats au lodge", perNight: { adult: 10, child: 8 } },
  full: { name: "Pension Complète Privilège", detail: "Tous repas inclus, pique-niques éco-conçus", perNight: { adult: 18, child: 12 } },
};

export const ACTIVITIES: Record<ActivityId, { name: string; short: string; detail: string; price: PerPerson }> = {
  lokobe: {
    name: "Réserve de Lokobe en Pirogue Traditionnelle",
    short: "Excursion Lokobe MNP en Pirogue",
    detail: "Guide naturaliste MNP + droits d'entrée",
    price: { adult: 35, child: 25 },
  },
  tanikely: {
    name: "Croisière Safari Marin Nosy Tanikely & Dauphins",
    short: "Safari marin Nosy Tanikely",
    detail: "Snorkeling, tortues marines et dauphins",
    price: { adult: 30, child: 15 },
  },
  passot: {
    name: "Randonnée Volcanique & Coucher de Soleil Mont Passot",
    short: "Randonnée Mont Passot",
    detail: "Lacs sacrés et belvédère à 329 m",
    price: { adult: 15, child: 10 },
  },
};

const perPerson = (p: PerPerson, b: Booking) => p.adult * b.adults + p.child * b.children;

export function hotelUnit(b: Booking, hotel: HotelId = b.hotel) {
  if (hotel === "manga-soa") {
    const room = ROOMS[b.room];
    return { perNight: room.perNight, capacity: room.capacity, roomName: `${room.name} ${room.view}` };
  }
  const h = HOTELS[hotel];
  return { perNight: h.perNight, capacity: h.capacity, roomName: h.roomName };
}

export function hotelCost(b: Booking, hotel: HotelId = b.hotel) {
  const unit = hotelUnit(b, hotel);
  const rooms = Math.max(1, Math.ceil((b.adults + b.children) / unit.capacity));
  return { amount: unit.perNight * nightsOf(b) * rooms, rooms, ...unit };
}

export function transportCost(b: Booking, transport: TransportId = b.transport) {
  const t = TRANSPORTS[transport];
  const flights = perPerson(t.flight, b);
  const ground = t.ground.flat + t.ground.perPerson * (b.adults + b.children);
  return { flights, ground, amount: flights + ground };
}

export function mealCost(b: Booking, meal: MealId = b.meals) {
  return Math.round(perPerson(MEALS[meal].perNight, b) * nightsOf(b) * 100) / 100;
}

export function activityCost(b: Booking, id: ActivityId) {
  return perPerson(ACTIVITIES[id].price, b);
}

export type QuoteLine = { id: string; icon: string; label: string; detail: string; amount: number };

export function quote(b: Booking) {
  const nights = nightsOf(b);
  const hotel = hotelCost(b);
  const transport = transportCost(b);
  const meals = mealCost(b);
  const destination = DESTINATIONS[b.destination];
  const roomsLabel = hotel.rooms > 1 ? `${hotel.rooms} × ` : "";

  const lines: QuoteLine[] = [
    {
      id: "hotel",
      icon: "hotel",
      label: `${HOTELS[b.hotel].name} ${HOTELS[b.hotel].stars.split(" ")[0]}`,
      detail: `${roomsLabel}${hotel.roomName} · ${nights} nuit${nights > 1 ? "s" : ""}`,
      amount: hotel.amount,
    },
    {
      id: "transport",
      icon: "flight",
      label: TRANSPORTS[b.transport].name,
      detail: `Vols Antananarivo ⇄ ${destination.airport} (${eur(transport.flights)}) + transferts (${eur(transport.ground)})`,
      amount: transport.amount,
    },
    { id: "meals", icon: "restaurant", label: MEALS[b.meals].name, detail: MEALS[b.meals].detail, amount: meals },
    ...b.activities.map((id) => ({
      id,
      icon: "kayaking",
      label: ACTIVITIES[id].short,
      detail: ACTIVITIES[id].detail,
      amount: activityCost(b, id),
    })),
  ];

  const subtotal = Math.round(lines.reduce((sum, l) => sum + l.amount, 0) * 100) / 100;
  const discount = b.promo ? Math.min(subtotal, b.promoDiscount) : 0;
  const total = subtotal - discount;
  const deposit = Math.round(total * 30) / 100;
  return {
    nights,
    lines,
    hotel,
    transport,
    meals,
    subtotal,
    discount,
    total,
    deposit,
    balance: Math.round((total - deposit) * 100) / 100,
    impact: Math.round(total) / 100,
    gap: total - b.budget,
    budgetShare: b.budget > 0 ? (total / b.budget) * 100 : 0,
  };
}

export type Quote = ReturnType<typeof quote>;

export function shorterStay(b: Booking, removeNights = 2): Partial<Booking> | null {
  const nights = nightsOf(b);
  if (nights - removeNights < 3) return null;
  if (b.travelMonth) return { monthNights: nights - removeNights };
  return b.arrival ? { departure: addDays(b.arrival, nights - removeNights) } : null;
}
