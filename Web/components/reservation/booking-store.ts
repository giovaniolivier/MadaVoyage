"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import {
  BOOKING_KEY,
  DEFAULT_BOOKING,
  LIMITS,
  addDays,
  childAgesFor,
  nightsOf,
  parseBooking,
  parseDate,
  type Booking,
  type DestinationId,
} from "./booking-data";

export * from "./booking-data";

const KEY = BOOKING_KEY;
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedBooking: Booking = DEFAULT_BOOKING;

/** Réservation lue par le serveur dans le cookie, utilisée pendant l'hydratation. */
export const BookingSeedContext = createContext<Booking>(DEFAULT_BOOKING);

export function readBooking(): Booking {
  return read();
}

function read(): Booking {
  const raw = localStorage.getItem(KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedBooking = parseBooking(raw);
  }
  return cachedBooking;
}

/** Recopie la réservation dans un cookie pour que le serveur rende directement les bons montants. */
export function syncBookingCookie() {
  const raw = localStorage.getItem(KEY);
  document.cookie = raw
    ? `${KEY}=${encodeURIComponent(raw)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
    : `${KEY}=; path=/; max-age=0; SameSite=Lax`;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function updateBooking(patch: Partial<Booking> | ((b: Booking) => Partial<Booking>)) {
  const current = read();
  const next = { ...current, ...(typeof patch === "function" ? patch(current) : patch) };
  localStorage.setItem(KEY, JSON.stringify(next));
  syncBookingCookie();
  listeners.forEach((l) => l());
}

export function useBooking() {
  const seed = useContext(BookingSeedContext);
  const booking = useSyncExternalStore(subscribe, read, () => seed);
  return [booking, updateBooking] as const;
}

export function durationLabel(b: Booking) {
  const n = nightsOf(b);
  if (n === 0) return b.arrival ? "Date de départ à choisir" : "Dates à choisir";
  return `${n} nuit${n > 1 ? "s" : ""} / ${n + 1} jours`;
}

const dayMonth = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });
const dayMonthYear = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const monthYear = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });

/** « novembre 2026 » pour un mois AAAA-MM. */
export function monthLabel(month: string) {
  return monthYear.format(parseDate(`${month}-01`));
}

export function rangeLabel(b: Booking) {
  if (b.travelMonth) return `${monthLabel(b.travelMonth)}, dates à fixer`;
  if (!b.arrival) return "Dates à choisir";
  const start = parseDate(b.arrival);
  if (!b.departure) return `Dès le ${dayMonthYear.format(start)}`;
  const end = parseDate(b.departure);
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} — ${dayMonthYear.format(end)}`;
  }
  return `${dayMonth.format(start)} — ${dayMonthYear.format(end)}`;
}

export function travelersCount(b: Booking) {
  return b.adults + b.children + b.infants;
}

export function travelersLabel(b: Booking) {
  const parts = [`${b.adults} adulte${b.adults > 1 ? "s" : ""}`];
  if (b.children) parts.push(`${b.children} enfant${b.children > 1 ? "s" : ""}`);
  if (b.infants) parts.push(`${b.infants} bébé${b.infants > 1 ? "s" : ""}`);
  const total = travelersCount(b);
  return `${total} voyageur${total > 1 ? "s" : ""} (${parts.join(", ")})`;
}

export function travelersLongLabel(b: Booking) {
  const parts = [`${b.adults} Adulte${b.adults > 1 ? "s" : ""}`];
  if (b.children) parts.push(`${b.children} Enfant${b.children > 1 ? "s" : ""}`);
  if (b.infants) parts.push(`${b.infants} Bébé${b.infants > 1 ? "s" : ""}`);
  return parts.join(", ");
}

const longDay = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export function longRangeLabel(b: Booking) {
  if (b.travelMonth) return `${monthLabel(b.travelMonth)} (dates à fixer)`;
  if (!b.arrival) return "dates à choisir";
  const start = parseDate(b.arrival);
  if (!b.departure) return `À partir du ${longDay.format(start)}`;
  const end = parseDate(b.departure);
  const sameYear = start.getFullYear() === end.getFullYear();
  const from =
    sameYear && start.getMonth() === end.getMonth()
      ? String(start.getDate())
      : longDay.format(start).replace(sameYear ? ` ${start.getFullYear()}` : "", "");
  return `${from} au ${longDay.format(end)}`;
}

const DESTINATION_PARAMS: Record<string, DestinationId> = {
  "nosy-be": "nosy-be",
  "nosy-be-express": "nosy-be",
  mitsio: "nosy-be",
  "sainte-marie": "sainte-marie",
  diego: "grand-nord",
  "diego-suarez": "grand-nord",
  "grand-nord": "grand-nord",
};

export function destinationFromParam(value: string | null): DestinationId | null {
  return value ? (DESTINATION_PARAMS[value] ?? null) : null;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Traduit les paramètres envoyés par le simulateur, l'explorateur, les circuits ou le lodge. */
export function patchFromSearch(search: string): Partial<Booking> {
  const p = new URLSearchParams(search);
  const patch: Partial<Booking> = {};
  const int = (key: string) => {
    const v = Number.parseInt(p.get(key) ?? "", 10);
    return Number.isFinite(v) ? v : null;
  };
  const arrival = p.get("arrivee") ?? p.get("depart");
  if (arrival && /^\d{4}-\d{2}-\d{2}$/.test(arrival)) {
    patch.arrival = arrival;
    patch.travelMonth = null;
  }
  const nights = int("nuits");
  if (nights !== null && nights > 0) {
    const n = clamp(nights, LIMITS.minNights, LIMITS.maxNights);
    const current = readBooking();
    const start = patch.arrival ?? (current.travelMonth ? null : current.arrival);
    if (start) patch.departure = addDays(start, n);
    else patch.monthNights = n;
  }
  const adults = int("adultes");
  if (adults !== null) patch.adults = clamp(adults, LIMITS.adults.min, LIMITS.adults.max);
  const children = int("enfants");
  if (children !== null) {
    patch.children = clamp(children, LIMITS.children.min, LIMITS.children.max);
    patch.childAges = childAgesFor(patch.children, readBooking().childAges);
  }
  const budget = int("budget");
  if (budget !== null && budget > 0) patch.budget = budget;
  const circuit = p.get("circuit");
  if (circuit && /^[a-z0-9-]{1,40}$/.test(circuit)) patch.circuit = circuit;
  const destination = destinationFromParam(p.get("destination")) ?? destinationFromParam(circuit);
  if (destination) {
    patch.destination = destination;
    patch.destinationChosen = true;
  } else if (patch.circuit) {
    patch.destinationChosen = false;
  }
  if (p.get("hebergement") === "manga-soa-lodge") {
    patch.hotel = "manga-soa";
    patch.destination = "nosy-be";
    patch.destinationChosen = true;
    const room = p.get("chambre");
    if (room === "baobab" || room === "ylang" || room === "ravinala") patch.room = room;
  }
  return patch;
}
