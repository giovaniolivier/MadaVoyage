/**
 * Argent sur place : mêmes formulations pour le simulateur et la FAQ.
 * Ordres de grandeur à confirmer avec les grilles publiques des opérateurs Mobile Money.
 */

/** Frais de retrait Mobile Money chez un agent, en part du montant retiré. */
export const MOBILE_MONEY_FEE = { low: 0.01, high: 0.02 };

export const ON_SITE_MONEY = {
  cash: "Sur place, la plupart des dépenses se règlent en espèces, en Ariary : repas dans les petits restaurants, marchés, pourboires. Les hôtels et certains restaurants des villes acceptent la carte.",
  cardFee:
    "Frais selon votre banque : souvent un montant fixe par retrait et une commission de change. Vérifiez votre contrat avant le départ.",
  cardAccess: "Distributeurs dans les villes, rares en dehors ; le montant par retrait est limité par le distributeur.",
  mobileMoneyRequirement:
    "Il faut une carte SIM malgache et un compte ouvert en agence avec une pièce d'identité. Peu de voyageurs étrangers en disposent.",
  mobileMoneyFee: "Frais de retrait selon la grille de l'opérateur, de l'ordre de 1 à 2 % du montant.",
  mobileMoneyAccess:
    "Agents de retrait dans les villes et de nombreux bourgs. Fonctionne par menu téléphonique, sans données mobiles, mais il faut du réseau.",
};
