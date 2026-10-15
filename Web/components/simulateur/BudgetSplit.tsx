"use client";

import { useState } from "react";
import { useMoney } from "@/components/currency/useCurrency";

type CategoryKey = "lodging" | "transport" | "food" | "guides";
type Split = Record<CategoryKey, number>;

/** Teintes distinctes pour les principales formes de daltonisme (palette Okabe-Ito) ; les pourcentages sont aussi écrits sur l'anneau. */
const CATEGORIES: { key: CategoryKey; label: string; color: string }[] = [
  { key: "lodging", label: "Hébergement", color: "#0072B2" },
  { key: "transport", label: "Transport (4x4, vols intérieurs)", color: "#E69F00" },
  { key: "food", label: "Repas", color: "#CC79A7" },
  { key: "guides", label: "Parcs et guides", color: "#009E73" },
];

/** Répartitions de référence ; les positions intermédiaires sont interpolées. */
export const BALANCED: Split = { lodging: 0.4, transport: 0.25, food: 0.2, guides: 0.15 };
const COMFORT: Split = { lodging: 0.52, transport: 0.22, food: 0.16, guides: 0.1 };
const ADVENTURE: Split = { lodging: 0.24, transport: 0.3, food: 0.16, guides: 0.3 };

const STOPS = ["Tout confort", "Plutôt confort", "Équilibré", "Plutôt aventure", "Tout aventure"];
const BALANCED_STOP = 2;

function splitFor(stop: number): Split {
  const t = (stop - BALANCED_STOP) / BALANCED_STOP;
  const target = t < 0 ? COMFORT : ADVENTURE;
  const k = Math.abs(t);
  return {
    lodging: BALANCED.lodging + (target.lodging - BALANCED.lodging) * k,
    transport: BALANCED.transport + (target.transport - BALANCED.transport) * k,
    food: BALANCED.food + (target.food - BALANCED.food) * k,
    guides: BALANCED.guides + (target.guides - BALANCED.guides) * k,
  };
}

const C = 70;
const OUTER_R = 44;
const INNER_R = 30;
const LABEL_R = 61;
const GAP = 1.2;

function arcs(split: Split, r: number) {
  const circumference = 2 * Math.PI * r;
  let start = 0;
  return CATEGORIES.map((cat) => {
    const share = split[cat.key];
    const arc = { key: cat.key, color: cat.color, share, start, length: share * circumference, circumference, mid: start + share / 2 };
    start += share;
    return arc;
  });
}

const pct = (n: number) => `${Math.round(n * 100)} %`;

export function BudgetSplit({ total, intro, id }: { total: number; intro: string; id: string }) {
  const money = useMoney();
  const [stop, setStop] = useState(BALANCED_STOP);
  const split = splitFor(stop);
  const changed = stop !== BALANCED_STOP;
  const outer = arcs(split, OUTER_R);
  const inner = arcs(BALANCED, INNER_R);

  return (
    <section aria-labelledby={id} className="bg-surface-container-lowest rounded-lg p-6 lg:p-8 shadow-md flex flex-col gap-6">
      <div>
        <h2 className="font-headline-md text-headline-md text-on-surface" id={id}>
          Répartition estimée du budget
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">{intro}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <figure className="md:col-span-5 flex flex-col items-center gap-2">
          <svg aria-hidden="true" className="w-72 h-72 max-w-full" viewBox="0 0 140 140">
            <g transform={`rotate(-90 ${C} ${C})`}>
              {outer.map((a) => (
                <circle
                  key={a.key}
                  className="transition-[stroke-dasharray,stroke-dashoffset] duration-500"
                  cx={C}
                  cy={C}
                  fill="none"
                  r={OUTER_R}
                  stroke={a.color}
                  strokeDasharray={`${Math.max(0, a.length - GAP)} ${a.circumference}`}
                  strokeDashoffset={-a.start * a.circumference}
                  strokeWidth="14"
                />
              ))}
              {changed &&
                inner.map((a) => (
                  <circle
                    key={a.key}
                    cx={C}
                    cy={C}
                    fill="none"
                    opacity={0.85}
                    r={INNER_R}
                    stroke={a.color}
                    strokeDasharray={`${Math.max(0, a.length - GAP)} ${a.circumference}`}
                    strokeDashoffset={-a.start * a.circumference}
                    strokeWidth="5"
                  />
                ))}
            </g>
            {outer.map((a) => {
              const angle = a.mid * 2 * Math.PI - Math.PI / 2;
              return (
                <text
                  key={a.key}
                  className="fill-on-surface transition-all duration-500"
                  dominantBaseline="central"
                  fontSize="7.5"
                  fontWeight="700"
                  textAnchor="middle"
                  x={C + LABEL_R * Math.cos(angle)}
                  y={C + LABEL_R * Math.sin(angle)}
                >
                  {pct(a.share)}
                </text>
              );
            })}
            <text className="fill-on-surface-variant" fontSize="5.5" textAnchor="middle" x={C} y={C - 5}>
              Total
            </text>
            <text
              className="fill-on-surface"
              fontSize={money.eur(total).length > 9 ? 6.5 : 9}
              fontWeight="700"
              textAnchor="middle"
              x={C}
              y={C + 6}
            >
              {money.eur(total)}
            </text>
          </svg>
          <figcaption className="font-body-sm text-body-sm text-on-surface-variant text-center">
            {changed
              ? `Après : ${STOPS[stop].toLowerCase()} (anneau extérieur). Avant : équilibré (anneau intérieur).`
              : "Déplacez le curseur pour comparer avec cette répartition équilibrée."}
          </figcaption>
        </figure>

        <div className="md:col-span-7 flex flex-col gap-5">
          <ul className="flex flex-col gap-2">
            {CATEGORIES.map((cat) => {
              const amount = total * split[cat.key];
              const before = total * BALANCED[cat.key];
              const delta = amount - before;
              const showDelta = changed && Math.abs(delta) >= 1;
              return (
                <li key={cat.key} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-surface-container-low">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span aria-hidden="true" className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">{cat.label}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {pct(split[cat.key])} du budget
                        {changed && ` (équilibré : ${pct(BALANCED[cat.key])})`}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-headline-sm text-headline-sm font-bold text-on-surface">{money.eur(amount)}</div>
                    {showDelta ? (
                      <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center justify-end gap-0.5">
                        <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                          {delta > 0 ? "arrow_upward" : "arrow_downward"}
                        </span>
                        <span>
                          <span className="sr-only">{delta > 0 ? "hausse de " : "baisse de "}</span>
                          {delta > 0 ? "+" : "−"}
                          {money.eur(Math.abs(delta))}
                          <span className="sr-only"> par rapport à la répartition équilibrée</span>
                        </span>
                      </div>
                    ) : (
                      <div className="font-body-sm text-body-sm text-on-surface-variant">{money.mga(amount)}</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <label className="font-headline-sm text-headline-sm text-on-surface" htmlFor={`${id}-orientation`}>
                Plutôt confort ou plutôt aventure ?
              </label>
              {changed && (
                <button
                  className="font-label-md text-label-md text-primary font-bold underline underline-offset-4"
                  onClick={() => setStop(BALANCED_STOP)}
                  type="button"
                >
                  Revenir à l&apos;équilibre
                </button>
              )}
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Côté confort, plus de budget va aux lodges ; côté aventure, aux pistes, aux bivouacs et aux guides. Le total ne change pas.
            </p>
            <input
              aria-valuetext={STOPS[stop]}
              className="w-full h-2.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
              id={`${id}-orientation`}
              max={STOPS.length - 1}
              min={0}
              onChange={(e) => setStop(Number(e.target.value))}
              step={1}
              type="range"
              value={stop}
            />
            <div aria-hidden="true" className="grid grid-cols-5 font-label-sm text-label-sm text-on-surface-variant">
              {STOPS.map((label, i) => (
                <span
                  key={label}
                  className={`${i === 0 ? "text-left" : i === STOPS.length - 1 ? "text-right" : "text-center"} ${
                    i === stop ? "text-on-surface font-bold" : ""
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
