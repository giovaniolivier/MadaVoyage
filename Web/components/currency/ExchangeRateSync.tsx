"use client";

import { setExchangeRate } from "@/components/reservation/pricing";
import type { ExchangeRate } from "@/lib/exchange-rate";

/**
 * Transmet aux formateurs de prix le taux du jour lu par le serveur. Le réglage a lieu pendant le rendu, avant les pages
 * enfants, pour que le serveur et le navigateur affichent les mêmes montants en Ariary.
 */
export default function ExchangeRateSync({ rate, children }: { rate: ExchangeRate; children: React.ReactNode }) {
  setExchangeRate(rate);
  return children;
}
