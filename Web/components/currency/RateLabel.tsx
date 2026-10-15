"use client";

import { mga, rateLabel } from "@/components/reservation/pricing";

/** « 1 € = 5 010 Ar · taux du 13 oct. 2026 », utilisable dans une page serveur. */
export default function RateLabel() {
  return <>{rateLabel()}</>;
}

/** Contre-valeur en Ariary d'un montant en euros, au taux du jour. */
export function Ariary({ eur }: { eur: number }) {
  return <>{mga(eur)}</>;
}
