"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  addDays,
  durationLabel,
  parseDate,
  longRangeLabel,
  nightsOf,
  patchFromSearch,
  rangeLabel,
  stayStart,
  travelersCount,
  travelersLabel,
  travelersLongLabel,
  updateBooking,
  useBooking,
  type Booking,
} from "./booking-store";
import { useMoney, type Money } from "@/components/currency/useCurrency";
import { DESTINATIONS, HOTELS, MEALS, hotelUnit, quote, type Quote } from "./pricing";
import { BALANCE_DUE_DAYS } from "@/lib/site";

/** Reporte dans la réservation les paramètres d'URL transmis par une autre page. */
export function BookingFromUrl() {
  useEffect(() => {
    const patch = patchFromSearch(window.location.search);
    if (Object.keys(patch).length) updateBooking(patch);
  }, []);
  return null;
}

const FIELDS = {
  range: (b) => rangeLabel(b),
  longRange: (b) => longRangeLabel(b),
  duration: (b) => durationLabel(b),
  nights: (b) => `${nightsOf(b)} nuit${nightsOf(b) > 1 ? "s" : ""}`,
  travelers: (b) => travelersLabel(b),
  travelersLong: (b) => travelersLongLabel(b),
  people: (b) => `${travelersCount(b)} pers.`,
  stepDates: (b) => `${rangeLabel(b)} · ${travelersLabel(b)}`,
  destination: (b) => DESTINATIONS[b.destination].name,
  destinationShort: (b) => DESTINATIONS[b.destination].short,
  hotel: (b) => `${HOTELS[b.hotel].name} ${HOTELS[b.hotel].stars.split(" ")[0]}`,
  budget: (b, q, m) => m.eur(b.budget),
  total: (b, q, m) => m.eur(q.total),
  totalCents: (b, q, m) => m.eur(q.total, true),
  totalMga: (b, q, m) => m.mga(q.total),
  deposit: (b, q, m) => m.eur(q.deposit, true),
  depositMga: (b, q, m) => m.mga(q.deposit),
  balance: (b, q, m) => m.eur(q.balance, true),
  balanceMga: (b, q, m) => m.mga(q.balance),
  impact: (b, q, m) => m.eur(q.impact, true),
  payNow: (b, q, m) => m.eur(b.payNow === "deposit" ? q.deposit : q.total, true),
  payNowMga: (b, q, m) => m.mga(b.payNow === "deposit" ? q.deposit : q.total),
  payNowLabel: (b) => (b.payNow === "deposit" ? "Acompte de confirmation (30%)" : "Règlement intégral du séjour"),
  balanceDate: (b) => balanceDateLabel(b),
  remaining: (b, q, m) =>
    b.payNow === "deposit" ? `${m.eur(q.balance, true)} (~ ${m.mga(q.balance)})` : `${m.eur(0, true)} (séjour soldé)`,
  count: (b) => String(travelersCount(b)),
  hotelDetail: (b) => `${hotelUnit(b).roomName} · ${MEALS[b.meals].name}`,
  monthly3x: (b, q, m) => m.eur(Math.round((q.total / 3) * 100) / 100, true),
} satisfies Record<string, (b: Booking, q: Quote, m: Money) => string>;

export type BookingField = keyof typeof FIELDS;

const longDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/** Le solde est prélevé automatiquement 15 jours avant l'arrivée. */
export function balanceDateLabel(b: Booking) {
  const start = stayStart(b);
  if (!start) return `${BALANCE_DUE_DAYS} jours avant l'arrivée`;
  const date = longDate.format(parseDate(addDays(start, -BALANCE_DUE_DAYS)));
  return b.travelMonth ? `${BALANCE_DUE_DAYS} jours avant l'arrivée (au plus tôt le ${date})` : date;
}

export function useQuote() {
  const [booking, update] = useBooking();
  return { booking, update, q: quote(booking) };
}

/** Affiche une donnée de la réservation en cours (dates, voyageurs, montants…). */
export function BookingText({ field }: { field: BookingField }) {
  const { booking, q } = useQuote();
  const money = useMoney();
  return <>{FIELDS[field](booking, q, money)}</>;
}

/** Les prestations détaillées en ligne sont celles de Nosy Be : on le signale pour les autres destinations. */
export function DestinationNotice() {
  const [booking, update] = useBooking();
  const destination = DESTINATIONS[booking.destination];
  if (destination.detailed) return null;
  return (
    <div
      className="mb-space-lg p-space-md rounded-lg bg-tertiary-fixed/40 text-on-surface flex flex-col md:flex-row md:items-center gap-space-sm justify-between"
      role="note"
    >
      <div className="flex items-start gap-space-sm">
        <span className="material-symbols-outlined text-tertiary text-[22px] shrink-0">info</span>
        <p className="font-body-md text-body-md">
          Destination choisie : <strong>{destination.short}</strong>. Les hébergements et excursions détaillés ci-dessous sont ceux de notre
          séjour Nosy Be, qui sert de base au prix : vos billets et vouchers indiqueront les prestations équivalentes à {destination.short},
          au même niveau de prix.
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          className="px-space-md py-2 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md shadow-sm"
          onClick={() => update({ destination: "nosy-be" })}
          type="button"
        >
          Revenir à Nosy Be
        </button>
        <Link
          className="px-space-md py-2 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md"
          href="/reservation/destination"
        >
          Changer
        </Link>
      </div>
    </div>
  );
}
