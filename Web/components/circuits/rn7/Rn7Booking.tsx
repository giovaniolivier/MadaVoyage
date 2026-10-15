"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { CANCELLATION } from "@/lib/site";
import { mga } from "@/components/reservation/pricing";

const ADULT_PRICE = 1290;
const KID_PRICE = 900;
const DEPOSIT_RATE = 0.3;
const MAX_ADULTS = 8;
const MAX_KIDS = 6;

const DEPARTURES = [
  { value: "2026-10-14", label: "14 Octobre 2026 (Climat idéal • 4 places)", seats: 4 },
  { value: "2026-10-28", label: "28 Octobre 2026 (Complet lémuriens • 2 places)", seats: 2 },
  { value: "2026-11-12", label: "12 Novembre 2026 (Baleines & Floraison)", seats: 12 },
];

const fr = (n: number) => n.toLocaleString("fr-FR");

function Counter({
  label,
  value,
  onDecrement,
  onIncrement,
  canDecrement,
  canIncrement,
}: {
  label: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  canDecrement: boolean;
  canIncrement: boolean;
}) {
  const button =
    "w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center font-bold shadow-sm hover:bg-surface-container-high transition-colors disabled:opacity-40 disabled:pointer-events-none";
  return (
    <div className="bg-surface-container-low p-3 rounded-xl" role="group" aria-label={label}>
      <span className="block font-label-sm text-label-sm text-on-surface-variant font-medium mb-1">{label}</span>
      <div className="flex items-center justify-between">
        <button aria-label={`Retirer : ${label}`} className={button} disabled={!canDecrement} onClick={onDecrement} type="button">
          -
        </button>
        <span className="font-headline-sm text-headline-sm font-bold text-on-surface" aria-live="polite">
          {value}
        </span>
        <button aria-label={`Ajouter : ${label}`} className={button} disabled={!canIncrement} onClick={onIncrement} type="button">
          +
        </button>
      </div>
    </div>
  );
}

export default function Rn7Booking() {
  const [departure, setDeparture] = useState(DEPARTURES[0].value);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(1);
  const ids = useId();

  const seats = DEPARTURES.find((d) => d.value === departure)?.seats ?? MAX_ADULTS;
  const travellers = adults + kids;
  const overbooked = travellers > seats;
  const total = adults * ADULT_PRICE + kids * KID_PRICE;
  const deposit = Math.round(total * DEPOSIT_RATE);
  const href = `/reservation/composition?circuit=rn7&depart=${departure}&adultes=${adults}&enfants=${kids}`;

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1.5" htmlFor={`${ids}-departure`}>
          Prochain départ garanti (Saison Sèche)
        </label>
        <div className="relative">
          <select
            className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            id={`${ids}-departure`}
            onChange={(e) => setDeparture(e.target.value)}
            value={departure}
          >
            {DEPARTURES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-on-surface-variant text-[20px]">
            calendar_month
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Counter
          canDecrement={adults > 1}
          canIncrement={adults < MAX_ADULTS && travellers < seats}
          label="Adultes"
          onDecrement={() => setAdults((n) => n - 1)}
          onIncrement={() => setAdults((n) => n + 1)}
          value={adults}
        />
        <Counter
          canDecrement={kids > 0}
          canIncrement={kids < MAX_KIDS && travellers < seats}
          label="Enfants (< 12 ans)"
          onDecrement={() => setKids((n) => n - 1)}
          onIncrement={() => setKids((n) => n + 1)}
          value={kids}
        />
      </div>

      {overbooked && (
        <p className="font-body-sm text-body-sm text-error flex items-start gap-1.5" role="alert">
          <span className="material-symbols-outlined text-[16px] mt-0.5">error</span>
          Ce départ ne compte plus que {seats} place{seats > 1 ? "s" : ""} : réduisez le nombre de voyageurs ou choisissez une autre date.
        </p>
      )}

      <div className="bg-surface-container/60 p-4 rounded-xl space-y-2 mt-4" aria-live="polite">
        <div className="flex items-center justify-between font-body-md text-body-md text-on-surface">
          <span>
            Estimation Totale ({travellers} voyageur{travellers > 1 ? "s" : ""})
          </span>
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{fr(total)} €</span>
        </div>
        <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
          <span>Contre-valeur Ariary</span>
          <span className="font-semibold text-primary">~ {mga(total)}</span>
        </div>
        <div className="pt-2 border-t border-surface-container flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
          <span>Acompte de 30% requis :</span>
          <span className="font-bold text-secondary">
            {fr(deposit)} € (~ {mga(deposit)})
          </span>
        </div>
      </div>

      {overbooked ? (
        <span
          aria-disabled="true"
          className="w-full h-14 bg-surface-container-high text-on-surface-variant font-label-lg text-label-lg rounded-full flex items-center justify-center gap-2 mt-2 cursor-not-allowed"
        >
          <span>Personnaliser &amp; Réserver ce circuit</span>
          <span className="material-symbols-outlined text-[20px]">block</span>
        </span>
      ) : (
        <Link
          className="w-full h-14 bg-tertiary text-on-tertiary font-label-lg text-label-lg rounded-full shadow-[0_4px_16px_rgba(167,57,30,0.35)] hover:bg-tertiary-container hover:text-on-tertiary-container transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
          href={href}
        >
          <span>Personnaliser &amp; Réserver ce circuit</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </Link>
      )}

      <p className="text-center font-body-sm text-body-sm text-on-surface-variant flex items-center justify-center gap-1.5 pt-1">
        <span className="material-symbols-outlined text-[16px] text-secondary">security</span>
        <span>{CANCELLATION.short} (7 jours avant le départ)</span>
      </p>
    </div>
  );
}
