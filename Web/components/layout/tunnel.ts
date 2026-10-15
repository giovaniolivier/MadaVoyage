/** Étapes du tunnel de réservation : en-tête réduit, ni navigation ni grand pied de page. La confirmation garde l'habillage du site. */
export function isTunnel(pathname: string) {
  return pathname.startsWith("/reservation/") && !pathname.startsWith("/reservation/confirmation");
}
