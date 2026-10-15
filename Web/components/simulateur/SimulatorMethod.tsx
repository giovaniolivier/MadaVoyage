"use client";

import Link from "next/link";
import { CHILD_RATE } from "@/components/circuits/catalog-data";
import { rateLabel } from "@/components/reservation/pricing";
import { LICENSE, SOLIDARITY_TEXT } from "@/lib/site";
import { ADVISED_PER_NIGHT, TIERS } from "./budget";
import { BALANCED } from "./BudgetSplit";
import { ON_SITE_PER_DAY, PRICE_SURVEY } from "./OnSiteMoney";

const pct = (n: number) => `${Math.round(n * 100)}\u00a0%`;

/** Méthode de calcul, puis les deux engagements vérifiables, chacun relié à sa page. */
export function SimulatorMethod() {
  const [eco, comfort] = TIERS;
  const steps = [
    {
      title: "Circuits correspondants",
      text: `Prix total de chaque circuit pour votre groupe (un enfant paie ${pct(CHILD_RATE)} du tarif adulte), comparé à votre budget. Mêmes règles que le filtre « Dans mon budget » de la page Circuits.`,
    },
    {
      title: "Profils",
      text: `Budget divisé par le nombre de voyageurs et de nuits. Moins de ${eco.max} € par jour et par personne : Économique ; de ${comfort.min} à ${comfort.max} € : Confort ; au-delà : Haut de gamme.`,
    },
    {
      title: "Budget conseillé",
      text: `${ADVISED_PER_NIGHT} € par jour et par adulte, ${pct(CHILD_RATE)} pour un enfant, arrondi à la centaine.`,
    },
    {
      title: "Répartition",
      text: `Moyenne de nos voyages : hébergement ${pct(BALANCED.lodging)}, transport ${pct(BALANCED.transport)}, repas ${pct(BALANCED.food)}, parcs et guides ${pct(BALANCED.guides)}. Le curseur montre l'effet de vos priorités.`,
    },
    {
      title: "Taux de change",
      text: `Taux publié par ExchangeRate-API, actualisé chaque jour (${rateLabel()}). Le voyage est facturé en euros ; les montants en Ariary sont indicatifs.`,
    },
    {
      title: "Dépenses sur place",
      text: `Hypothèse de ${ON_SITE_PER_DAY} € par jour et par personne ; prix relevés par ${PRICE_SURVEY.source} en ${PRICE_SURVEY.date}.`,
    },
  ];

  return (
    <section aria-labelledby="methode-titre" className="flex flex-col gap-5 scroll-mt-28" id="methode">
      <div className="flex flex-col gap-1">
        <h2 className="font-headline-md text-headline-md text-on-surface" id="methode-titre">
          Comment calculons-nous ?
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Une estimation indicative : le prix définitif est confirmé dans votre devis.
        </p>
      </div>
      <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((s) => (
          <div key={s.title} className="p-5 rounded-lg bg-surface-container-lowest shadow-sm flex flex-col gap-1.5">
            <dt className="font-label-lg text-label-lg text-on-surface font-bold">{s.title}</dt>
            <dd className="font-body-sm text-body-sm text-on-surface-variant">{s.text}</dd>
          </div>
        ))}
      </dl>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-label="Nos engagements">
        <li className="flex items-start gap-3 p-5 rounded-lg bg-surface-container-low">
          <span aria-hidden="true" className="material-symbols-outlined text-[24px] text-primary shrink-0">
            verified
          </span>
          <div className="flex flex-col gap-1">
            <span className="font-label-lg text-label-lg text-on-surface font-bold">{LICENSE}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Agence réceptive agréée par le Ministère du Tourisme de Madagascar.
            </span>
            <Link className="font-label-md text-label-md text-primary font-bold underline underline-offset-4" href="/mentions-legales">
              Voir les mentions légales
            </Link>
          </div>
        </li>
        <li className="flex items-start gap-3 p-5 rounded-lg bg-surface-container-low">
          <span aria-hidden="true" className="material-symbols-outlined text-[24px] text-primary shrink-0">
            volunteer_activism
          </span>
          <div className="flex flex-col gap-1">
            <span className="font-label-lg text-label-lg text-on-surface font-bold">Fonds Fihavanana</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{SOLIDARITY_TEXT}</span>
            <Link className="font-label-md text-label-md text-primary font-bold underline underline-offset-4" href="/engagement">
              Lire le pacte Fihavanana
            </Link>
          </div>
        </li>
      </ul>
    </section>
  );
}
