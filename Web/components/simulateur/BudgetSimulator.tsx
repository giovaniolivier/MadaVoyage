"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { useCurrency, useMoney } from "@/components/currency/useCurrency";
import { CURRENCIES } from "@/components/currency/currency";
import { groupPrice, type RegionId } from "@/components/circuits/catalog-data";
import { nightsOf, readBooking } from "@/components/reservation/booking-store";
import {
  DatesField,
  defaultDates,
  isRegion,
  NIGHT_OPTIONS,
  parseBudget,
  RegionField,
  TravelersField,
} from "@/components/search/TripFields";
import {
  advisedBudget,
  catalogHref,
  circuitsWithin,
  inSeason,
  MAX_INPUT,
  NOT_INCLUDED,
  perPersonPerNight,
  PRIVATE_GROUP,
  tierFor,
  TIERS,
  TRACK_CEIL,
  TRACK_FLOOR,
  tunnelHref,
  type TripInput,
} from "./budget";
import { BudgetEntry, BudgetSummary, formatBudget, type BudgetIssue } from "./BudgetEntry";
import { BudgetSplit } from "./BudgetSplit";
import { OnSiteMoney } from "./OnSiteMoney";
import { SimulationActions } from "./SimulationActions";
import { SimulatorMethod } from "./SimulatorMethod";

const DEFAULT_BUDGET = 2800;
const MAX_ADULTS = 15;
const MAX_KIDS = 8;
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const closestNights = (n: number) => NIGHT_OPTIONS.reduce((best, o) => (Math.abs(o - n) < Math.abs(best - n) ? o : best));
const plural = (n: number, word: string) => `${n} ${word}${n > 1 ? "s" : ""}`;

export default function BudgetSimulator() {
  const ids = useId();
  const money = useMoney();
  const [currency, setCurrency] = useCurrency();
  const [ready, setReady] = useState(false);
  const [minDate, setMinDate] = useState<string>();
  const [regions, setRegions] = useState<RegionId[]>([]);
  const [departure, setDeparture] = useState("");
  const [nights, setNights] = useState(10);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [budgetText, setBudgetText] = useState(formatBudget(DEFAULT_BUDGET));

  useEffect(() => {
    const today = defaultDates().min;
    setMinDate(today);
    const p = new URLSearchParams(window.location.search);
    const int = (key: string) => Number.parseInt(p.get(key) ?? "", 10);
    if (p.has("budget")) {
      const fromBudget = parseBudget(p.get("budget") ?? "");
      setBudgetText(fromBudget ? formatBudget(fromBudget) : "");
    }
    const booking = readBooking();
    const fromAdults = int("adultes") || int("voyageurs") || booking.adults;
    if (fromAdults > 0) setAdults(clamp(fromAdults, 1, MAX_ADULTS));
    const fromKids = p.has("enfants") ? int("enfants") : booking.children;
    if (fromKids >= 0) setKids(clamp(fromKids, 0, MAX_KIDS));
    const fromNights = int("nuits") || nightsOf(booking);
    if (fromNights > 0) setNights(closestNights(fromNights));
    setRegions((p.get("region") ?? "").split(",").filter(isRegion));
    const date = p.get("depart") ?? (booking.travelMonth ? "" : (booking.arrival ?? ""));
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && date >= today) setDeparture(date);
    setReady(true);
  }, []);

  const typed = parseBudget(budgetText);
  const budget = typed !== null && typed <= MAX_INPUT ? typed : null;
  const trip: TripInput = { regions, departure, nights, adults, kids, budget };

  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams({ budget: budget === null ? "" : String(budget), adultes: String(adults), nuits: String(nights) });
    if (kids) p.set("enfants", String(kids));
    if (regions.length) p.set("region", regions.join(","));
    if (departure) p.set("depart", departure);
    window.history.replaceState(window.history.state, "", `${window.location.pathname}?${p}`);
  }, [ready, budget, adults, kids, nights, regions, departure]);

  const travelers = adults + kids;
  const advised = advisedBudget(adults, kids, nights);
  const shown = budget ?? advised;
  const perNight = budget === null ? 0 : perPersonPerNight(budget, adults, kids, nights);
  const tier = budget === null ? null : tierFor(perNight);
  const groupFits = circuitsWithin({ ...trip, budget: null }).sort(
    (a, b) => groupPrice(a, adults, kids).total - groupPrice(b, adults, kids).total,
  );
  const cheapest = groupFits[0];
  const cheapestTotal = cheapest ? groupPrice(cheapest, adults, kids).total : null;
  const matches = budget === null ? [] : circuitsWithin(trip);
  const tooLow = budget !== null && !matches.length && cheapestTotal !== null && budget < cheapestTotal;
  const examples = tooLow
    ? groupFits.slice(0, 2)
    : [...matches].sort((a, b) => Math.abs(a.nights - nights) - Math.abs(b.nights - nights) || a.priceEur - b.priceEur).slice(0, 3);
  const month = departure ? new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(new Date(`${departure}T00:00:00`)) : "";
  const seasonal = departure ? matches.filter((c) => inSeason(c, departure)).length : 0;
  const travelersText = [plural(adults, "adulte"), kids ? plural(kids, "enfant") : ""].filter(Boolean).join(" et ");
  const elsewhere = regions.length > 0 && budget !== null && circuitsWithin({ ...trip, regions: [] }).length > 0;

  const issue: BudgetIssue =
    typed === null
      ? { kind: "empty" }
      : budget === null
        ? { kind: "invalid" }
        : tooLow && cheapestTotal !== null
          ? { kind: "low", minimum: cheapestTotal, fromCircuit: true, onBroaden: elsewhere ? () => setRegions([]) : undefined }
          : perNight < TRACK_FLOOR
            ? { kind: "low", minimum: TRACK_FLOOR * travelers * nights, fromCircuit: false }
            : perNight > TRACK_CEIL
              ? { kind: "extreme", customHref: tunnelHref(trip) }
              : null;
  const bigGroup = travelers >= PRIVATE_GROUP;

  return (
    <>
      <section aria-labelledby={`${ids}-trip`} className="bg-surface-container-lowest rounded-lg p-6 lg:p-10 shadow-md flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-headline-md text-headline-md text-on-surface" id={`${ids}-trip`}>
              Votre voyage
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Les mêmes critères que la recherche de circuits.</p>
          </div>
          <div
            aria-label="Devise d'affichage"
            className="flex items-center gap-1 bg-surface-container-low p-1 rounded-full self-start md:self-auto"
            role="group"
          >
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                aria-pressed={c.code === currency}
                className={`h-9 px-4 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${
                  c.code === currency
                    ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                onClick={() => setCurrency(c.code)}
                title={c.label}
                type="button"
              >
                {c.code}
                <span className="sr-only"> ({c.label})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          <RegionField id={`${ids}-region`} onChange={setRegions} regions={regions} />
          <DatesField
            departure={departure}
            flexible
            id={`${ids}-date`}
            minDate={minDate}
            nights={nights}
            onDeparture={setDeparture}
            onNights={setNights}
          />
          <TravelersField adults={adults} kids={kids} maxAdults={MAX_ADULTS} maxKids={MAX_KIDS} onAdults={setAdults} onKids={setKids} />
        </div>

        {bigGroup && (
          <div
            aria-live="polite"
            className="flex items-start gap-3 p-4 rounded-lg bg-secondary/10 text-on-surface font-body-md text-body-md"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[22px] shrink-0">
              groups
            </span>
            <div className="flex flex-col gap-1">
              <p className="font-label-lg text-label-lg font-bold">Groupe de {travelers} voyageurs : départ privatisé</p>
              <p className="text-on-surface-variant">
                À partir de {PRIVATE_GROUP} personnes, nous ajoutons un véhicule et un guide, et le tarif de groupe est établi sur devis.{" "}
                {groupFits.length
                  ? `${plural(groupFits.length, "circuit")} du catalogue ${groupFits.length > 1 ? "accueillent" : "accueille"} ${travelers} voyageurs ; les montants ci-dessous restent indicatifs.`
                  : `Aucun circuit du catalogue n'accueille ${travelers} voyageurs d'un seul tenant : nous pouvons organiser deux départs coordonnés.`}
              </p>
              <Link
                className="self-start font-label-md text-label-md text-primary font-bold underline underline-offset-4"
                href={tunnelHref(trip)}
              >
                Demander un devis de groupe
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 bg-surface-container-low rounded-lg p-6">
            <BudgetEntry
              adults={adults}
              advised={advised}
              id={`${ids}-budget`}
              issue={issue}
              kids={kids}
              nights={nights}
              onValue={setBudgetText}
              travelersText={travelersText}
              value={budgetText}
            />
          </div>

          <div
            aria-live="polite"
            className="lg:col-span-5 bg-surface-container-lowest ring-1 ring-surface-container-high rounded-lg p-6 flex flex-col items-center justify-center"
          >
            <BudgetSummary adults={adults} budget={budget} kids={kids} nights={nights} travelersText={travelersText} />
          </div>
        </div>
      </section>

      <section
        aria-labelledby={`${ids}-result`}
        className="bg-primary text-on-primary rounded-lg p-6 lg:p-10 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        <div aria-live="polite" className="lg:col-span-7 flex flex-col gap-4">
          <span className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-on-primary/15 font-label-sm text-label-sm font-bold">
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
              info
            </span>
            Estimation indicative
          </span>
          <h2 className="font-headline-lg text-headline-lg font-bold" id={`${ids}-result`}>
            {!cheapest
              ? `Aucun circuit du catalogue pour ${plural(travelers, "voyageur")}`
              : budget === null
                ? "Indiquez un budget pour voir les circuits correspondants"
                : matches.length
                  ? `${plural(matches.length, "circuit")} ${matches.length > 1 ? "correspondent" : "correspond"} à ce budget`
                  : tooLow
                    ? "Budget insuffisant pour ce voyage"
                    : "Aucun circuit à ce budget pour l'instant"}
          </h2>
          <p className="font-body-lg text-body-lg text-on-primary/90">
            {!cheapest || cheapestTotal === null
              ? `Aucun circuit n'accueille ${plural(travelers, "voyageur")}${regions.length ? " dans cette région" : ""} : un voyage sur-mesure reste possible.`
              : budget === null
                ? `${plural(groupFits.length, "circuit")} ${groupFits.length > 1 ? "accueillent" : "accueille"} ${travelersText}, à partir de ${money.eur(cheapestTotal)} au total.`
                : matches.length
                  ? `Prix total pour ${travelersText}${regions.length ? "" : ", toutes régions confondues"}.${
                      departure
                        ? ` ${seasonal ? plural(seasonal, "circuit") : "Aucun"} conseillé${seasonal > 1 ? "s" : ""} en ${month}.`
                        : ""
                    }`
                  : `Il manque ${money.eur(cheapestTotal - budget)} : les circuits les plus accessibles pour ${travelersText} sont ci-dessous.`}
          </p>
          {examples.length > 0 && (
            <ul className="flex flex-col gap-2">
              {examples.map((c) => (
                <li key={c.id}>
                  <Link
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-on-primary/10 hover:bg-on-primary/20 transition-colors"
                    href={c.href}
                  >
                    <span className="min-w-0">
                      <span className="block font-label-lg text-label-lg font-bold truncate">{c.title}</span>
                      <span className="block font-body-sm text-body-sm text-on-primary/80">
                        {c.days} jours / {c.nights} nuits
                      </span>
                    </span>
                    <span className="shrink-0 font-label-lg text-label-lg font-bold">{money.eur(groupPrice(c, adults, kids).total)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-5 flex flex-col gap-3">
          <Link
            className="h-14 px-6 rounded-full bg-surface-container-lowest text-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors"
            href={catalogHref(trip, matches.length > 0)}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
              travel_explore
            </span>
            {matches.length ? "Voir les circuits à ce budget" : "Voir tous les circuits"}
          </Link>
          <Link
            className="h-12 px-6 rounded-full border-2 border-on-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:bg-on-primary hover:text-primary transition-colors"
            href={tunnelHref(trip)}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              edit_calendar
            </span>
            {budget === null ? "Composer mon voyage" : "Composer mon voyage avec ce budget"}
          </Link>
          <SimulationActions methodHref="#methode" />
          <div className="mt-2 p-4 rounded-lg bg-on-primary/10 font-body-sm text-body-sm text-on-primary">
            <p className="font-bold text-on-primary">Non inclus dans cette estimation :</p>
            <p>{NOT_INCLUDED.join(", ")}.</p>
            <p className="mt-1">Le prix définitif est confirmé dans votre devis.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby={`${ids}-tiers`} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-headline-md text-headline-md text-on-surface" id={`${ids}-tiers`}>
            Quel voyage pour ce budget ?
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Ce que comprend chaque profil. Choisissez-en un pour régler le budget, ou ajustez le montant plus haut.
          </p>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIERS.map((t) => {
            const current = t.id === tier?.id;
            const units = travelers * nights;
            const low = Math.round((t.min * units) / 50) * 50;
            const high = Math.round((t.max * units) / 50) * 50;
            const preset = t.id === "comfort" ? advised : Math.round((t.preset * units) / 100) * 100;
            return (
              <li
                key={t.id}
                className={`relative p-5 rounded-lg flex flex-col gap-3 transition-all has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-primary ${
                  current
                    ? "ring-2 ring-secondary bg-secondary/10"
                    : "bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:ring-2 hover:ring-primary/30"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    aria-hidden="true"
                    className={`w-9 h-9 rounded-full flex items-center justify-center material-symbols-outlined text-[20px] ${
                      current ? "bg-secondary text-on-secondary" : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {t.icon}
                  </span>
                  {current && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold">
                      <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                        check
                      </span>
                      Votre budget
                    </span>
                  )}
                </div>
                <h3
                  className={`flex items-center gap-2 font-headline-sm text-headline-sm ${current ? "text-secondary" : "text-on-surface"}`}
                >
                  <span aria-hidden="true" className={`w-3 h-3 rounded-full ${t.zone}`}></span>
                  {t.name}
                </h3>
                <dl className="flex flex-col gap-2 font-body-sm text-body-sm">
                  <div>
                    <dt className="text-on-surface-variant">Par jour et par personne</dt>
                    <dd className="font-label-lg text-label-lg text-on-surface font-bold">
                      {t.min === 0
                        ? `moins de ${money.eur(t.max)}`
                        : t.max === Infinity
                          ? `plus de ${money.eur(t.min)}`
                          : `de ${money.eur(t.min)} à ${money.eur(t.max)}`}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-on-surface-variant">Pour votre groupe, au total</dt>
                    <dd className="font-label-lg text-label-lg text-on-surface font-bold">
                      {t.min === 0
                        ? `moins de ${money.eur(high)}`
                        : t.max === Infinity
                          ? `plus de ${money.eur(low)}`
                          : `de ${money.eur(low)} à ${money.eur(high)}`}
                    </dd>
                  </div>
                </dl>
                <div className="flex flex-col gap-1.5">
                  <p className="font-label-md text-label-md text-on-surface font-bold">Inclus</p>
                  <ul className="flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                    {t.includes.map((item) => (
                      <li key={item.label} className="flex items-start gap-2">
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary shrink-0">
                          {item.icon}
                        </span>
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  aria-pressed={current}
                  className={`mt-auto pt-3 border-t border-surface-container-high flex items-center justify-between gap-2 font-label-md text-label-md font-bold text-left focus-visible:outline-none after:absolute after:inset-0 after:content-[''] after:rounded-lg ${
                    current ? "text-secondary" : "text-primary"
                  }`}
                  onClick={() => setBudgetText(formatBudget(preset))}
                  type="button"
                >
                  <span>
                    {current ? "Profil de votre budget" : "Régler le budget sur ce profil"}
                    <span className="block font-body-sm text-body-sm font-normal text-on-surface-variant">
                      Montant type : {money.eur(preset)} au total
                    </span>
                  </span>
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                    {current ? "check_circle" : "arrow_forward"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Dans les trois profils, non inclus : {NOT_INCLUDED.join(", ")}. Les vols intérieurs du profil Haut de gamme font partie du budget
          ; les vols internationaux restent à votre charge.
        </p>
      </section>

      <BudgetSplit
        id={`${ids}-split`}
        intro={
          budget === null
            ? `Exemple calculé sur le budget conseillé (${money.eur(advised)}).`
            : "Une moyenne de nos voyages. Le curseur montre comment elle évolue selon vos priorités."
        }
        total={shown}
      />

      <OnSiteMoney ids={ids} nights={nights} regions={regions} travelers={travelers} />

      <SimulatorMethod />
    </>
  );
}
