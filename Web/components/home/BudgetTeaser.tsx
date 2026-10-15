"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useMoney } from "@/components/currency/useCurrency";
import { perPersonPerNight, tierFor } from "@/components/simulateur/budget";

const MIN = 500;
const MAX = 12000;
const TRAVELERS = [1, 2, 3, 4, 5, 6];
/** Durée de référence de la recherche ; le simulateur permet de la changer. */
const NIGHTS = 10;

export default function BudgetTeaser() {
  const [budget, setBudget] = useState(2800);
  const [travelers, setTravelers] = useState(2);
  const money = useMoney();
  const perPerson = budget / travelers;
  const tier = tierFor(perPersonPerNight(budget, travelers, 0, NIGHTS));
  const id = useId();

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 lg:p-8 shadow-lg flex flex-col gap-5">
      <div className="flex items-center gap-2 text-primary font-label-md text-label-md uppercase tracking-wider">
        <span className="material-symbols-outlined text-[18px]">savings</span> Simulateur de budget
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <label className="font-headline-sm text-headline-sm text-on-surface" htmlFor={`${id}-budget`}>
          Quel budget total pour votre voyage ?
        </label>
        <label className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant">
          Voyageurs
          <select
            className="h-10 px-3 rounded-full bg-surface-container-low text-on-surface font-label-lg text-label-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            onChange={(e) => setTravelers(Number(e.target.value))}
            value={travelers}
          >
            {TRAVELERS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <div className="font-display-lg text-display-lg text-primary font-extrabold leading-none">{money.eur(budget)}</div>
        <div className="font-body-md text-body-md text-on-surface-variant mt-1">
          pour {travelers} voyageur{travelers > 1 ? "s" : ""} et {NIGHTS} nuits, soit {money.eur(perPerson)} par personne · hors vols
          internationaux
        </div>
      </div>
      <input
        className="w-full h-2 accent-primary cursor-pointer"
        id={`${id}-budget`}
        max={MAX}
        min={MIN}
        onChange={(e) => setBudget(Number(e.target.value))}
        step={100}
        type="range"
        value={budget}
      />
      <div className="flex justify-between font-label-md text-label-md text-on-surface-variant -mt-3">
        <span>{money.eur(MIN)}</span>
        <span>{money.eur(MAX)}</span>
      </div>
      <div aria-live="polite" className="flex items-start gap-3 p-4 rounded-2xl bg-secondary/10">
        <span className="material-symbols-outlined text-secondary text-[24px]">{tier.icon}</span>
        <div>
          <div className="font-label-lg text-label-lg text-on-surface font-bold">Gamme {tier.name}</div>
          <div className="font-body-md text-body-md text-on-surface-variant">{tier.text}</div>
        </div>
      </div>
      <Link
        className="h-12 px-6 rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-primary-container transition-colors"
        href={`/simulateur?budget=${budget}&adultes=${travelers}&nuits=${NIGHTS}`}
      >
        Voir le détail de ce budget <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
      </Link>
    </div>
  );
}
