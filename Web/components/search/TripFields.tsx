"use client";

import Link from "next/link";
import { REGIONS, type RegionId } from "@/components/circuits/catalog-data";
import { seasonOfDate } from "@/lib/season-rules";

/** Champs de recherche communs à l'accueil, à la page Explorer et au simulateur : mêmes libellés, mêmes paramètres envoyés au tunnel. */

const DEFAULT_LEAD_DAYS = 56;
export const NIGHT_OPTIONS = [5, 7, 10, 14];
const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });

export const fieldCard = "flex flex-col p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors";
export const fieldLabel =
  "font-label-md text-label-md uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5 font-bold";

export function toInputDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Date de départ proposée par défaut et date minimale, calculées côté client pour éviter un écart d'hydratation. */
export function defaultDates() {
  const today = new Date();
  return {
    min: toInputDate(today),
    departure: toInputDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + DEFAULT_LEAD_DAYS)),
  };
}

export function isDrySeason(departure: string) {
  return departure ? seasonOfDate(departure).dry : true;
}

export function parseBudget(value: string) {
  const n = Number.parseInt(value.replace(/\D/g, ""), 10);
  return n > 0 ? n : null;
}

/** « 8 – 18 déc. 2026 », « 28 nov. – 8 déc. 2026 » ou « 28 déc. 2026 – 7 janv. 2027 » : l'année figure toujours. */
function formatRange(start: Date, end: Date) {
  const sameYear = start.getFullYear() === end.getFullYear();
  const from =
    sameYear && start.getMonth() === end.getMonth()
      ? String(start.getDate())
      : sameYear
        ? dateFormatter.format(start)
        : `${dateFormatter.format(start)} ${start.getFullYear()}`;
  return `${from} – ${dateFormatter.format(end)} ${end.getFullYear()}`;
}

type RegionChoice = (typeof REGIONS)[number]["id"];

const REGION_HINTS: Record<RegionChoice, string> = {
  all: "Les quatre grandes régions de l'île",
  "hautes-terres": "Antsirabe, Ranomafana, Isalo",
  nord: "Nosy Be, Diego Suarez, Mitsio",
  ouest: "Morondava, Tsiribihina, Bemaraha",
  est: "Andasibe, Sainte-Marie, Pangalanes",
};

export const isRegion = (id: string): id is RegionId => REGIONS.some((r) => r.id === id && r.id !== "all");

export const shortRegion = (id: RegionChoice) => REGIONS.find((r) => r.id === id)!.label.replace(/\s*\(.*\)$/, "");

/** Région du catalogue ; plusieurs régions choisies dans les filtres s'affichent comme un choix multiple. */
export function RegionField({
  id,
  className = "",
  regions,
  onChange,
}: {
  id: string;
  className?: string;
  regions: RegionId[];
  onChange: (regions: RegionId[]) => void;
}) {
  const value = regions.length === 1 ? regions[0] : regions.length ? "multi" : "all";
  return (
    <div className={`${fieldCard} ${className}`}>
      <label className={fieldLabel} htmlFor={id}>
        <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary">
          pin_drop
        </span>
        Destination
      </label>
      <select
        className="bg-transparent font-headline-sm text-headline-sm text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary rounded cursor-pointer mt-1"
        id={id}
        onChange={(e) => onChange(isRegion(e.target.value) ? [e.target.value] : [])}
        value={value}
      >
        {REGIONS.map((r) => (
          <option key={r.id} value={r.id}>
            {shortRegion(r.id)}
          </option>
        ))}
        {value === "multi" && (
          <option disabled value="multi">
            {regions.length} régions choisies
          </option>
        )}
      </select>
      <span className="font-body-md text-body-md text-on-surface-variant mt-0.5">
        {value === "multi" ? regions.map(shortRegion).join(", ") : REGION_HINTS[value]}
      </span>
    </div>
  );
}

/** Paramètres lus par `patchFromSearch` à l'étape Destination du tunnel. */
export function tunnelParams(t: { departure: string; nights: number; adults: number; kids: number; budget: string }) {
  const params = new URLSearchParams({ depart: t.departure, nuits: String(t.nights), adultes: String(t.adults), enfants: String(t.kids) });
  const budget = parseBudget(t.budget);
  if (budget) params.set("budget", String(budget));
  return params;
}

export function DatesField({
  id,
  className = "",
  departure,
  minDate,
  nights,
  onDeparture,
  onNights,
  flexible = false,
}: {
  id: string;
  className?: string;
  departure: string;
  minDate?: string;
  nights: number;
  onDeparture: (v: string) => void;
  onNights: (v: number) => void;
  /** La date reste facultative : sans date, le champ affiche « Dates flexibles » et ne juge pas la saison. */
  flexible?: boolean;
}) {
  const start = departure ? new Date(`${departure}T00:00:00`) : null;
  const end = start ? new Date(start.getTime() + nights * 86_400_000) : null;
  const dry = isDrySeason(departure);
  const season = !departure
    ? { tone: "text-on-surface-variant", icon: "event", text: "Choisissez une date pour voir les circuits de saison" }
    : dry
      ? { tone: "text-secondary", icon: "sunny", text: "Saison sèche, routes praticables" }
      : { tone: "text-amber-800", icon: "rainy", text: "Saison des pluies : certaines pistes sont difficiles" };
  return (
    <div className={`${fieldCard} ${className}`}>
      <label className={fieldLabel} htmlFor={id}>
        <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary">
          calendar_month
        </span>
        Dates du séjour
      </label>
      <div className="flex items-center justify-between gap-2 mt-1">
        <div className="relative min-w-0 flex-1 rounded focus-within:ring-2 focus-within:ring-primary">
          <span aria-hidden="true" className="block font-headline-sm text-headline-sm text-on-surface font-semibold truncate">
            {start && end ? formatRange(start, end) : flexible ? "Dates flexibles" : "Choisir une date"}
          </span>
          <input
            aria-label={flexible ? "Date de départ (facultative)" : "Date de départ"}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id={id}
            min={minDate}
            onChange={(e) => onDeparture(e.target.value)}
            onClick={(e) => e.currentTarget.showPicker?.()}
            required={!flexible}
            type="date"
            value={departure}
          />
        </div>
        <select
          aria-label="Nombre de nuits"
          className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-md text-label-md font-bold focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          onChange={(e) => onNights(Number(e.target.value))}
          value={nights}
        >
          {NIGHT_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} nuits
            </option>
          ))}
        </select>
      </div>
      <span aria-live="polite" className={`font-body-md text-body-md font-semibold flex items-start gap-1.5 mt-1 ${season.tone}`}>
        <span aria-hidden="true" className="material-symbols-outlined text-[18px] leading-[22px]">
          {season.icon}
        </span>
        {season.text}
      </span>
      {flexible && departure && (
        <button
          className="self-start font-body-sm text-body-sm text-primary font-semibold underline underline-offset-4 mt-0.5"
          onClick={() => onDeparture("")}
          type="button"
        >
          Revenir à des dates flexibles
        </button>
      )}
    </div>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const btn =
    "w-7 h-7 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm disabled:opacity-40 disabled:cursor-not-allowed";
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="font-body-md text-body-md text-on-surface">{label}</span>
      <div className="flex items-center gap-2">
        <button aria-label={`Retirer : ${label}`} className={btn} disabled={value <= min} onClick={() => onChange(value - 1)} type="button">
          <span className="material-symbols-outlined text-[16px]">remove</span>
        </button>
        <span aria-live="polite" className="w-5 text-center font-label-lg text-label-lg font-bold text-on-surface">
          {value}
        </span>
        <button aria-label={`Ajouter : ${label}`} className={btn} disabled={value >= max} onClick={() => onChange(value + 1)} type="button">
          <span className="material-symbols-outlined text-[16px]">add</span>
        </button>
      </div>
    </div>
  );
}

export function TravelersField({
  className = "",
  adults,
  kids,
  onAdults,
  onKids,
  maxAdults = 8,
  maxKids = 6,
}: {
  className?: string;
  adults: number;
  kids: number;
  onAdults: (v: number) => void;
  onKids: (v: number) => void;
  maxAdults?: number;
  maxKids?: number;
}) {
  return (
    <fieldset className={`${fieldCard} gap-1 ${className}`}>
      <legend className="sr-only">Voyageurs</legend>
      <span aria-hidden="true" className={fieldLabel}>
        <span className="material-symbols-outlined text-[18px] text-primary">group</span> Voyageurs
      </span>
      <Stepper label="Adultes" max={maxAdults} min={1} onChange={onAdults} value={adults} />
      <Stepper label="Enfants" max={maxKids} min={0} onChange={onKids} value={kids} />
    </fieldset>
  );
}

export function BudgetField({
  id,
  className = "",
  value,
  onChange,
}: {
  id: string;
  className?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={`${fieldCard} ${className}`}>
      <label className={fieldLabel} htmlFor={id}>
        <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary">
          savings
        </span>
        Budget
        <span className="normal-case tracking-normal font-normal">(facultatif)</span>
      </label>
      <div className="flex items-baseline gap-2 mt-1">
        <input
          className="w-full min-w-0 bg-transparent font-headline-sm text-headline-sm text-on-surface font-semibold placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary rounded"
          id={id}
          inputMode="numeric"
          onChange={(e) => onChange(e.target.value.replace(/[^\d\s]/g, ""))}
          placeholder="ex. 3 000"
          value={value}
        />
        <span className="font-label-lg text-label-lg text-on-surface-variant shrink-0">€ au total</span>
      </div>
      <Link
        className="font-body-md text-body-md text-primary font-semibold hover:underline mt-0.5 inline-flex items-center gap-1"
        href="/simulateur"
      >
        Pas sûr du budget ? Simuler
        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
          arrow_forward
        </span>
      </Link>
    </div>
  );
}
