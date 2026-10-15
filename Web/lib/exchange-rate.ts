/**
 * Taux de change unique du site : l'euro reste la devise de facturation, l'Ariary et le dollar ne sont que des équivalents
 * indicatifs. Le taux est relu chaque jour auprès de la source ; en cas d'échec, le dernier taux connu s'affiche avec sa propre date.
 */
export type ExchangeRate = {
  mgaPerEur: number;
  usdPerEur: number;
  /** Date de publication du taux par la source (ISO 8601). */
  date: string;
  source: string;
};

const SOURCE_URL = "https://open.er-api.com/v6/latest/EUR";

export const FALLBACK_RATE: ExchangeRate = {
  mgaPerEur: 5010,
  usdPerEur: 1.117,
  date: "2026-10-12T23:57:31.000Z",
  source: "ExchangeRate-API",
};

/** Dernier taux lu avec succès : un échec ponctuel de la source ne fait pas changer les montants d'une page à l'autre. */
let lastGood: ExchangeRate = FALLBACK_RATE;

export async function getDailyRate(): Promise<ExchangeRate> {
  try {
    const res = await fetch(SOURCE_URL, { next: { revalidate: 6 * 60 * 60 }, signal: AbortSignal.timeout(4000) });
    const data = (await res.json()) as { result: string; time_last_update_unix: number; rates: Record<string, number> };
    const { MGA, USD } = data.rates ?? {};
    if (data.result !== "success" || !(MGA > 0) || !(USD > 0)) return lastGood;
    lastGood = {
      mgaPerEur: Math.round(MGA),
      usdPerEur: Math.round(USD * 1000) / 1000,
      date: new Date(data.time_last_update_unix * 1000).toISOString(),
      source: FALLBACK_RATE.source,
    };
    return lastGood;
  } catch {
    return lastGood;
  }
}

/** « 13 oct. 2026 », à l'heure de Madagascar. */
export function rateDateLabel(rate: ExchangeRate) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "Indian/Antananarivo" }).format(
    new Date(rate.date),
  );
}
