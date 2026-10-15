import type { ServerQuote } from "@/lib/reservation-server";
import { updateBooking, type Booking } from "./booking-store";
import { eur } from "./pricing";

export async function fetchServerQuote(booking: Booking, promo?: string | null): Promise<ServerQuote> {
  const response = await fetch("/api/reservation/devis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(promo === undefined ? { booking } : { booking, promo }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) throw new Error(data?.error ?? "Le service de réservation est momentanément indisponible.");
  return data as ServerQuote;
}

/**
 * Fait valider le devis par le serveur avant le paiement et aligne la réservation locale sur sa réponse.
 * Renvoie un message à afficher si le voyageur doit revoir le montant, sinon `null`.
 */
export async function confirmWithServer(booking: Booking, payNow: Booking["payNow"], expected: number): Promise<string | null> {
  try {
    const server = await fetchServerQuote({ ...booking, payNow });
    updateBooking({ payNow, promo: server.booking.promo, promoDiscount: server.booking.promoDiscount });
    if (booking.promo && !server.booking.promo)
      return "Le code promo n'est plus valide : il a été retiré du devis. Vérifiez le nouveau montant.";
    if (Math.abs(server.amountDue - expected) > 0.005)
      return `Le montant a été mis à jour (${eur(server.amountDue, true)}). Vérifiez-le puis confirmez.`;
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Le service de réservation est momentanément indisponible.";
  }
}
