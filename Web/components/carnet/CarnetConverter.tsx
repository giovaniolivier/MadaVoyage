"use client";

import { useState } from "react";
import { exchangeRate } from "@/components/reservation/pricing";

const formatter = new Intl.NumberFormat("fr-FR");

export default function CarnetConverter() {
  const [eur, setEur] = useState("50");
  const value = parseFloat(eur);
  const ariary = Number.isNaN(value) || value < 0 ? 0 : Math.round(value * exchangeRate().mgaPerEur);

  return (
    <div className="flex flex-col gap-space-sm mb-space-md">
      <div>
        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1" htmlFor="carnet-eur-input">
          Montant en Euros (€)
        </label>
        <div className="relative">
          <input
            className="w-full h-12 px-space-md rounded bg-surface-container-low text-on-surface font-headline-sm text-headline-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            id="carnet-eur-input"
            inputMode="decimal"
            min="0"
            onChange={(e) => setEur(e.target.value)}
            type="number"
            value={eur}
          />
          <span className="absolute right-4 top-3 font-label-md text-label-md text-on-surface-variant font-bold">EUR</span>
        </div>
      </div>
      <div className="flex justify-center -my-1">
        <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[16px]">sync_alt</span>
        </div>
      </div>
      <div>
        <span className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Équivalent en Ariary Malgache</span>
        <div className="w-full h-12 px-space-md rounded bg-surface-container flex items-center justify-between">
          <output aria-live="polite" className="font-headline-sm text-headline-sm font-bold text-secondary" htmlFor="carnet-eur-input">
            {formatter.format(ariary)} Ar
          </output>
          <span className="font-label-md text-label-md text-on-surface-variant font-bold">MGA</span>
        </div>
      </div>
    </div>
  );
}
