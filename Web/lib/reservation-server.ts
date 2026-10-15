import { parseBooking, type Booking } from "@/components/reservation/booking-data";
import { quote } from "@/components/reservation/pricing";

/** Codes promo valides : uniquement côté serveur, jamais envoyés au navigateur. */
const PROMOS: Record<string, { amount: number; until: string }> = {
  "MADA-ECO2026": { amount: 50, until: "2026-12-31" },
};

export type PromoCheck = { code: string; valid: boolean; discount: number; message: string | null };

export function checkPromo(raw: string, today = new Date()): PromoCheck {
  const code = raw.trim().toUpperCase().slice(0, 32);
  if (!code) return { code, valid: false, discount: 0, message: "Saisissez un code." };
  const promo = PROMOS[code];
  if (!promo || new Date(`${promo.until}T23:59:59`) < today) {
    return { code, valid: false, discount: 0, message: "Ce code n'est pas valide ou a expiré." };
  }
  return { code, valid: true, discount: promo.amount, message: null };
}

/**
 * Recalcule le devis à partir des seuls choix du voyageur : tarifs, remise et montant à régler
 * ne dépendent jamais de valeurs calculées par le navigateur.
 */
export function serverQuote(input: unknown, promoInput?: string | null) {
  const booking: Booking = parseBooking(JSON.stringify(input ?? null));
  const requested = promoInput !== undefined ? promoInput : booking.promo;
  const promo = requested ? checkPromo(requested) : null;
  const checked: Booking = {
    ...booking,
    promo: promo?.valid ? promo.code : null,
    promoDiscount: promo?.valid ? promo.discount : 0,
  };
  const q = quote(checked);
  return {
    booking: checked,
    promo,
    quote: {
      subtotal: q.subtotal,
      discount: q.discount,
      total: q.total,
      deposit: q.deposit,
      balance: q.balance,
    },
    amountDue: checked.payNow === "deposit" ? q.deposit : q.total,
  };
}

export type ServerQuote = ReturnType<typeof serverQuote>;
