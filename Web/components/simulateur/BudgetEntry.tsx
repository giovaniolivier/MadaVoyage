"use client";

import Link from "next/link";
import { useMoney } from "@/components/currency/useCurrency";
import { parseBudget } from "@/components/search/TripFields";
import {
  ADVISED_PER_NIGHT,
  dailyRange,
  MAX_INPUT,
  perPersonPerNight,
  TIERS,
  TRACK_CEIL,
  TRACK_FLOOR,
  tierFor,
  trackBounds,
} from "./budget";

export type BudgetIssue =
  | { kind: "empty" }
  | { kind: "invalid" }
  | { kind: "low"; minimum: number; fromCircuit: boolean; onBroaden?: () => void }
  | { kind: "extreme"; customHref: string }
  | null;

const THUMB =
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-surface-container-lowest [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab " +
  "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-surface-container-lowest [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-grab [&::-moz-range-track]:bg-transparent " +
  "focus-visible:outline-none [&:focus-visible::-webkit-slider-thumb]:ring-4 [&:focus-visible::-webkit-slider-thumb]:ring-primary/40 [&:focus-visible::-moz-range-thumb]:ring-4 [&:focus-visible::-moz-range-thumb]:ring-primary/40";

const numberFormat = new Intl.NumberFormat("fr-FR");
export const formatBudget = (n: number) => numberFormat.format(n).replace(/\u202f/g, "\u00a0");

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** « 125 à 155 € » : l'unité n'est écrite qu'une fois. */
export const rangeText = (money: ReturnType<typeof useMoney>, low: number, high: number) =>
  `${money.eur(low).replace(/[\s\u00a0\u202f]*[^\d\s\u00a0\u202f,.]+$/u, "")} à ${money.eur(high)}`;
const round50 = (n: number) => Math.round(n / 50) * 50;

type Props = {
  id: string;
  value: string;
  onValue: (v: string) => void;
  adults: number;
  kids: number;
  nights: number;
  advised: number;
  travelersText: string;
  issue: BudgetIssue;
};

/** Saisie du budget total : champ au clavier et curseur sur une piste colorée par gamme (seuils par jour et par personne). */
export function BudgetEntry({ id, value, onValue, adults, kids, nights, advised, travelersText, issue }: Props) {
  const money = useMoney();
  const budget = parseBudget(value);
  const travelers = adults + kids;
  const units = Math.max(1, travelers) * Math.max(1, nights);
  const { min, max, step } = trackBounds(travelers, nights);
  const pos = (v: number) => clamp((v - min) / (max - min), 0, 1);
  const at = (v: number) => `calc(12px + (100% - 24px) * ${pos(v)})`;
  const current = budget !== null && issue?.kind !== "invalid" ? tierFor(perPersonPerNight(budget, adults, kids, nights)) : null;
  const hintId = `${id}-hint`;
  const issueId = `${id}-issue`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="font-headline-sm text-headline-sm text-on-surface" htmlFor={id}>
          Budget total du groupe
        </label>
        <p className="font-body-sm text-body-sm text-on-surface-variant" id={hintId}>
          En euros, pour {travelersText} et {nights} nuits, hors vols internationaux.
        </p>
      </div>

      <div
        className={`flex items-center gap-2 px-4 h-16 rounded-xl bg-surface-container-lowest ring-2 focus-within:ring-primary ${
          issue?.kind === "invalid" ? "ring-error" : issue?.kind === "empty" ? "ring-outline-variant" : "ring-surface-container-high"
        }`}
      >
        <input
          aria-describedby={issue ? `${hintId} ${issueId}` : hintId}
          aria-invalid={issue?.kind === "invalid" || undefined}
          autoComplete="off"
          className="w-full min-w-0 self-stretch bg-transparent font-headline-lg text-headline-lg font-bold text-on-surface placeholder:text-on-surface-variant/60 placeholder:font-normal focus:outline-none"
          id={id}
          inputMode="numeric"
          maxLength={9}
          onBlur={() => budget !== null && onValue(formatBudget(budget))}
          onChange={(e) => onValue(e.target.value.replace(/[^\d\s\u202f]/g, ""))}
          placeholder={`ex. ${formatBudget(advised)}`}
          value={value}
        />
        <span className="shrink-0 font-headline-sm text-headline-sm text-on-surface-variant">€</span>
      </div>

      <div className="relative h-10">
        <div
          aria-hidden="true"
          className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-3 rounded-full overflow-hidden bg-surface-container-high"
        >
          {TIERS.map((t) => {
            const from = pos(Math.max(t.min, TRACK_FLOOR) * units);
            const to = pos(Math.min(t.max, TRACK_CEIL) * units);
            return (
              <span
                key={t.id}
                className={`absolute inset-y-0 ${t.zone} ${current && current.id !== t.id ? "opacity-45" : ""}`}
                style={{ left: `${from * 100}%`, width: `${(to - from) * 100}%` }}
              ></span>
            );
          })}
        </div>
        <span
          aria-hidden="true"
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-10 rounded-full bg-on-surface"
          style={{ left: at(advised) }}
        ></span>
        <input
          aria-label="Budget total du groupe, curseur"
          aria-valuetext={budget !== null && current ? `${money.eur(budget)} au total, gamme ${current.name}` : "Aucun montant saisi"}
          className={`absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer ${THUMB} ${
            budget === null ? "[&::-webkit-slider-thumb]:opacity-50 [&::-moz-range-thumb]:opacity-50" : ""
          }`}
          max={max}
          min={min}
          onChange={(e) => onValue(formatBudget(Number(e.target.value)))}
          step={step}
          type="range"
          value={clamp(budget ?? advised, min, max)}
        />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 -mt-1">
        {TIERS.map((t) => {
          const low = round50(t.min * units);
          const high = round50(t.max * units);
          const active = current?.id === t.id;
          return (
            <li
              key={t.id}
              className={`flex items-start gap-2 p-2.5 rounded-lg ${active ? "bg-surface-container-lowest ring-1 ring-secondary" : ""}`}
            >
              <span aria-hidden="true" className={`mt-1 w-3 h-3 rounded-full shrink-0 ${t.zone}`}></span>
              <span className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-bold">
                  {t.name}
                  {active && <span className="sr-only"> (votre budget)</span>}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {t.min === 0
                    ? `moins de ${money.eur(high)} au total`
                    : t.max === Infinity
                      ? `plus de ${money.eur(low)} au total`
                      : `de ${money.eur(low)} à ${money.eur(high)} au total`}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body-md text-body-md text-on-surface-variant">
        <span aria-hidden="true" className="w-1 h-5 rounded-full bg-on-surface shrink-0"></span>
        <span>
          Budget conseillé : <strong className="text-on-surface">{money.eur(advised)} au total</strong> (environ{" "}
          {money.eur(ADVISED_PER_NIGHT)} par jour et par adulte)
        </span>
        {budget !== advised && (
          <button
            className="font-label-md text-label-md text-primary font-bold underline underline-offset-4"
            onClick={() => onValue(formatBudget(advised))}
            type="button"
          >
            Utiliser ce montant
          </button>
        )}
      </div>

      <div aria-live="polite" id={issueId}>
        {issue && (
          <IssueNotice
            advised={advised}
            budget={budget}
            issue={issue}
            perDay={budget ? budget / units : 0}
            travelersText={travelersText}
            onValue={onValue}
          />
        )}
      </div>
    </div>
  );
}

function IssueNotice({
  issue,
  budget,
  advised,
  perDay,
  travelersText,
  onValue,
}: {
  issue: NonNullable<BudgetIssue>;
  budget: number | null;
  advised: number;
  perDay: number;
  travelersText: string;
  onValue: (v: string) => void;
}) {
  const money = useMoney();
  const action = "font-label-md text-label-md font-bold underline underline-offset-4";

  if (issue.kind === "empty") {
    return (
      <Notice icon="edit" tone="bg-surface-container-lowest text-on-surface" title="Aucun montant saisi">
        <p>Indiquez le budget total du groupe, ou partez du budget conseillé pour ce voyage.</p>
        <button className={`${action} text-primary`} onClick={() => onValue(formatBudget(advised))} type="button">
          Partir de {money.eur(advised)}
        </button>
      </Notice>
    );
  }

  if (issue.kind === "invalid") {
    return (
      <Notice icon="error" tone="bg-error-container text-on-error-container" title="Montant trop élevé">
        <p>Saisissez un budget inférieur à {money.eur(MAX_INPUT)}. Pour un projet de cette ampleur, un conseiller vous rappelle.</p>
      </Notice>
    );
  }

  if (issue.kind === "low") {
    const missing = budget === null ? 0 : issue.minimum - budget;
    const target = Math.ceil(issue.minimum / 50) * 50;
    return (
      <Notice icon="trending_up" tone="bg-tertiary-fixed/50 text-on-tertiary-fixed" title="Budget insuffisant pour ce voyage">
        <p>
          Il manque <strong>{money.eur(missing)}</strong>
          {issue.fromCircuit && ` : le circuit le moins cher pour ${travelersText} revient à ${money.eur(issue.minimum)} au total.`}
          {perDay < TRACK_FLOOR &&
            `${issue.fromCircuit ? " Sous" : " : sous"} ${money.eur(TRACK_FLOOR)} par jour et par personne, le transport et l'entrée des parcs ne sont pas couverts.`}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <button className={`${action} text-tertiary`} onClick={() => onValue(formatBudget(target))} type="button">
            Passer à {money.eur(target)}
          </button>
          {issue.onBroaden && (
            <button className={`${action} text-tertiary`} onClick={issue.onBroaden} type="button">
              Chercher dans toutes les régions
            </button>
          )}
        </div>
      </Notice>
    );
  }

  const [low, high] = dailyRange(perDay);
  return (
    <Notice icon="diamond" tone="bg-primary-fixed/40 text-on-primary-fixed" title="Budget au-delà de nos circuits">
      <p>
        Environ {rangeText(money, low, high)} par jour et par personne, alors que nos circuits les plus haut de gamme restent sous{" "}
        {money.eur(TRACK_CEIL)}. Un conseiller peut composer un voyage sur-mesure : lodges privatisés, vols privés, guide dédié.
      </p>
      <Link className={`${action} text-primary`} href={issue.customHref}>
        Composer un voyage sur-mesure
      </Link>
    </Notice>
  );
}

function Notice({ icon, tone, title, children }: { icon: string; tone: string; title: string; children: React.ReactNode }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg font-body-sm text-body-sm ${tone}`}>
      <span aria-hidden="true" className="material-symbols-outlined text-[20px] shrink-0">
        {icon}
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="font-label-lg text-label-lg font-bold">{title}</p>
        {children}
      </div>
    </div>
  );
}

/** Le chiffre clé, étiqueté : total du groupe, puis la valeur parlante par jour et par personne. */
export function BudgetSummary({
  budget,
  adults,
  kids,
  nights,
  travelersText,
}: {
  budget: number | null;
  adults: number;
  kids: number;
  nights: number;
  travelersText: string;
}) {
  const money = useMoney();
  const travelers = adults + kids;

  if (budget === null) {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-label-md text-label-md text-on-surface-variant">Total du groupe</span>
        <span aria-hidden="true" className="font-display-lg text-display-lg font-bold text-outline">
          —
        </span>
        <span className="font-body-md text-body-md text-on-surface-variant">
          Saisissez un montant pour voir ce qu&apos;il représente par jour.
        </span>
      </div>
    );
  }

  const perDay = perPersonPerNight(budget, adults, kids, nights);
  const [low, high] = dailyRange(perDay);
  const tier = tierFor(perDay);

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="font-label-md text-label-md text-on-surface-variant">
        Total du groupe · {travelersText}, {nights} nuits
      </span>
      <span className="font-display-lg text-display-lg font-bold text-primary tracking-tight">{money.eur(budget)}</span>
      <span className="font-body-md text-body-md text-on-surface-variant">≈ {money.mga(budget)}</span>
      <span className="w-12 h-px bg-surface-container-high my-2" aria-hidden="true"></span>
      <span className="font-headline-sm text-headline-sm font-bold text-secondary">environ {rangeText(money, low, high)}</span>
      <span className="font-label-md text-label-md text-on-surface">par jour et par personne</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
        soit {money.eur(budget / Math.max(1, travelers))} par personne pour tout le séjour
      </span>
      <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-label-md text-label-md font-bold">
        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
          {tier.icon}
        </span>
        Gamme {tier.name}
      </span>
    </div>
  );
}
