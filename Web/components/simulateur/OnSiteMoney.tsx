"use client";

import { useMoney } from "@/components/currency/useCurrency";
import type { RegionId } from "@/components/circuits/catalog-data";
import { exchangeRate } from "@/components/reservation/pricing";
import { shortRegion } from "@/components/search/TripFields";
import { MOBILE_MONEY_FEE, ON_SITE_MONEY } from "@/lib/on-site-money";

/** Relevé de prix : source et date affichées avec les chiffres. À remplacer par le relevé réel de l'équipe terrain. */
export const PRICE_SURVEY = { source: "nos guides et chauffeurs", date: "septembre 2026" };

type LocalPrice = { icon: string; label: string; place: string; ariary: number | [number, number]; region: RegionId | "all" };

/** Dépenses que le voyageur règle lui-même : rien de ce qui est déjà inclus dans les circuits (transport, entrées des parcs). */
const LOCAL_PRICES: LocalPrice[] = [
  {
    icon: "restaurant",
    label: "Repas complet dans un hotely (petit restaurant local)",
    place: "Antsirabe, Fianarantsoa",
    ariary: 15_000,
    region: "hautes-terres",
  },
  {
    icon: "sailing",
    label: "Journée en pirogue avec un pêcheur",
    place: "Anakao, Ifaty (fin de la RN7)",
    ariary: 120_000,
    region: "hautes-terres",
  },
  { icon: "shopping_bag", label: "Écharpe en soie sauvage", place: "Ambalavao", ariary: 45_000, region: "hautes-terres" },
  { icon: "restaurant", label: "Repas de langoustes", place: "Nosy Be", ariary: 60_000, region: "nord" },
  { icon: "sailing", label: "Sortie en boutre vers Nosy Komba", place: "Nosy Be", ariary: 80_000, region: "nord" },
  { icon: "shopping_bag", label: "Gousses de vanille, 100 g", place: "Marchés de Nosy Be et Diego", ariary: 50_000, region: "nord" },
  { icon: "restaurant", label: "Assiette de crabe", place: "Morondava", ariary: 30_000, region: "ouest" },
  { icon: "agriculture", label: "Charrette à zébus, allée des Baobabs", place: "Morondava", ariary: 30_000, region: "ouest" },
  { icon: "sailing", label: "Sortie baleines (juillet à septembre)", place: "Sainte-Marie", ariary: 150_000, region: "est" },
  { icon: "restaurant", label: "Poisson au coco", place: "Sainte-Marie, Foulpointe", ariary: 25_000, region: "est" },
  { icon: "water_full", label: "Bouteille d'eau, 1,5 L", place: "Partout", ariary: 3_000, region: "all" },
  {
    icon: "volunteer_activism",
    label: "Pourboire du chauffeur-guide, par jour et par groupe",
    place: "Repère de notre charte",
    ariary: [25_000, 40_000],
    region: "all",
  },
];

/** Hypothèse de dépenses non incluses (repas libres, boissons, pourboires, artisanat), par jour et par personne. */
export const ON_SITE_PER_DAY = 15;

const ar = new Intl.NumberFormat("fr-FR");
const eurOf = (ariary: number) => {
  const eur = ariary / exchangeRate().mgaPerEur;
  return eur < 10 ? eur.toLocaleString("fr-FR", { maximumFractionDigits: 1 }) : String(Math.round(eur));
};

function pricesFor(regions: RegionId[]) {
  const common = LOCAL_PRICES.filter((p) => p.region === "all");
  if (regions.length) return [...LOCAL_PRICES.filter((p) => p.region !== "all" && regions.includes(p.region)), ...common];
  const onePerRegion = LOCAL_PRICES.filter((p, i, all) => p.region !== "all" && all.findIndex((q) => q.region === p.region) === i);
  return [...onePerRegion, ...common];
}

export function OnSiteMoney({ regions, travelers, nights, ids }: { regions: RegionId[]; travelers: number; nights: number; ids: string }) {
  const money = useMoney();
  const prices = pricesFor(regions);
  const regionText = regions.length ? `Région : ${regions.map(shortRegion).join(", ")}.` : "Toutes les régions, un exemple par région.";
  const spending = ON_SITE_PER_DAY * travelers * nights;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
      <section aria-labelledby={`${ids}-local`} className="bg-surface-container-lowest rounded-lg p-6 lg:p-7 shadow-md flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-headline-sm text-headline-sm text-on-surface" id={`${ids}-local`}>
            Quelques prix sur place
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Prix moyens relevés par {PRICE_SURVEY.source} en {PRICE_SURVEY.date}, payés en Ariary. {regionText}
          </p>
        </div>
        <ul className="flex flex-col gap-2">
          {prices.map((item) => {
            const [low, high] = Array.isArray(item.ariary) ? item.ariary : [item.ariary, item.ariary];
            return (
              <li key={item.label} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    aria-hidden="true"
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 material-symbols-outlined text-[16px] bg-primary/10 text-primary"
                  >
                    {item.icon}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">{item.label}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {item.place}
                      {!regions.length && item.region !== "all" && ` · ${shortRegion(item.region)}`}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-label-md text-label-md text-on-surface font-bold whitespace-nowrap">
                    {low === high ? ar.format(low) : `${ar.format(low)} à ${ar.format(high)}`}&nbsp;Ar
                  </span>
                  <span className="block font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">
                    ≈ {low === high ? eurOf(low) : `${eurOf(low)} à ${eurOf(high)}`}&nbsp;€
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby={`${ids}-cash`} className="bg-surface-container-lowest rounded-lg p-6 lg:p-7 shadow-md flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-headline-sm text-headline-sm text-on-surface" id={`${ids}-cash`}>
            Avoir des Ariary sur place
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {ON_SITE_MONEY.cash} Votre voyage, lui, se règle à la réservation, sans frais.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-lg bg-surface-container-low flex flex-col gap-2">
            <h3 className="flex items-center gap-1.5 text-on-surface font-bold font-label-md text-label-md">
              <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary">
                credit_card
              </span>
              Retrait par carte bancaire
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface">{ON_SITE_MONEY.cardFee}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{ON_SITE_MONEY.cardAccess}</p>
          </div>
          <div className="p-4 rounded-lg bg-surface-container-low flex flex-col gap-2">
            <h3 className="flex items-center gap-1.5 text-on-surface font-bold font-label-md text-label-md">
              <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary">
                smartphone
              </span>
              Retrait par Mobile Money
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface">{ON_SITE_MONEY.mobileMoneyRequirement}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {ON_SITE_MONEY.mobileMoneyFee} {ON_SITE_MONEY.mobileMoneyAccess}
            </p>
          </div>
        </div>

        <div className="mt-auto p-4 rounded-lg bg-secondary/10 flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface">
          <p className="font-label-md text-label-md font-bold">Dépenses sur place estimées : {money.eur(spending)} pour votre groupe</p>
          <p className="text-on-surface-variant">
            Hypothèse : {money.eur(ON_SITE_PER_DAY)} par jour et par personne (repas libres, boissons, pourboires, artisanat), sur {nights}{" "}
            nuits.
          </p>
          <p>
            Chaque point de frais coûte environ <strong>{money.eur(spending / 100)}</strong> sur ce montant. Avec Mobile Money, comptez{" "}
            {money.eur(spending * MOBILE_MONEY_FEE.low)} à {money.eur(spending * MOBILE_MONEY_FEE.high)} ; par carte, appliquez le taux de
            votre banque.
          </p>
        </div>
      </section>
    </div>
  );
}
