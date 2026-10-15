"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import type { Currency } from "@/components/currency/currency";
import { useCurrency } from "@/components/currency/useCurrency";
import { usd } from "@/components/reservation/pricing";
import { BudgetField, DatesField, defaultDates, fieldCard, fieldLabel, TravelersField, tunnelParams } from "@/components/search/TripFields";

const DESTINATIONS = [
  { value: "nosy-be", label: "Nosy Be & Archipels", hint: "Nord, îles & canal du Mozambique" },
  { value: "menabe", label: "Menabe & Baobabs", hint: "Ouest, Morondava & Tsingy" },
  { value: "isalo", label: "Massif de l'Isalo & RN7", hint: "Hautes Terres & grand Sud" },
  { value: "sainte-marie", label: "Île Sainte-Marie & Baleines", hint: "Côte Est & lagons" },
  { value: "diego-suarez", label: "Diego Suarez & Mer d'Émeraude", hint: "Extrême Nord & Tsingy Rouges" },
] as const;

type Destination = (typeof DESTINATIONS)[number]["value"];
type ExploreState = {
  destination: Destination;
  chooseDestination: (d: Destination) => void;
  searchRef: React.RefObject<HTMLFormElement | null>;
};

const ExploreContext = createContext<ExploreState | null>(null);

function useExplore() {
  const ctx = useContext(ExploreContext);
  if (!ctx) throw new Error("useExplore doit être utilisé dans <ExploreProvider>");
  return ctx;
}

export function ExploreProvider({ children }: { children: React.ReactNode }) {
  const [destination, setDestination] = useState<Destination>("nosy-be");
  const searchRef = useRef<HTMLFormElement>(null);

  const chooseDestination = (d: Destination) => {
    setDestination(d);
    const form = searchRef.current;
    if (!form) return;
    form.scrollIntoView({ behavior: "smooth", block: "center" });
    form.querySelector<HTMLSelectElement>("select[name=destination]")?.focus({ preventScroll: true });
  };

  return <ExploreContext.Provider value={{ destination, chooseDestination, searchRef }}>{children}</ExploreContext.Provider>;
}

export function TrendButton({ destination, icon, children }: { destination: Destination; icon: string; children: React.ReactNode }) {
  const { chooseDestination } = useExplore();
  return (
    <button
      className="h-11 px-4 rounded-full border border-surface/50 bg-on-surface/45 backdrop-blur-md hover:bg-surface-container-lowest hover:text-on-surface text-surface font-label-lg text-label-lg font-semibold flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface"
      onClick={() => chooseDestination(destination)}
      type="button"
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span> {children}
    </button>
  );
}

export function ExpeditionSearch() {
  const { destination, chooseDestination, searchRef } = useExplore();
  const router = useRouter();
  const ids = useId();
  const [departure, setDeparture] = useState("");
  const [minDate, setMinDate] = useState<string>();
  const [nights, setNights] = useState(10);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(1);
  const [theme, setTheme] = useState("faune");
  const [budget, setBudget] = useState("");
  const [pending, setPending] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const d = defaultDates();
    setMinDate(d.min);
    setDeparture(d.departure);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const hint = DESTINATIONS.find((d) => d.value === destination)?.hint;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pending || !departure) return;
    setPending(true);
    const params = tunnelParams({ departure, nights, adults, kids, budget });
    params.set("destination", destination);
    params.set("theme", theme);
    timerRef.current = window.setTimeout(() => router.push(`/reservation/destination?${params}`), 700);
  };

  return (
    <form
      ref={searchRef}
      aria-label="Rechercher un circuit"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch"
      onSubmit={submit}
    >
      <div className={`lg:col-span-3 ${fieldCard}`}>
        <label className={fieldLabel} htmlFor={`${ids}-dest`}>
          <span className="material-symbols-outlined text-[18px] text-primary">pin_drop</span> Destination
        </label>
        <select
          className="bg-transparent font-headline-sm text-headline-sm text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary rounded cursor-pointer mt-1"
          id={`${ids}-dest`}
          name="destination"
          onChange={(e) => chooseDestination(e.target.value as Destination)}
          value={destination}
        >
          {DESTINATIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
        <span className="font-body-md text-body-md text-on-surface-variant mt-0.5">{hint}</span>
      </div>

      <DatesField
        className="lg:col-span-3"
        departure={departure}
        id={`${ids}-date`}
        minDate={minDate}
        nights={nights}
        onDeparture={setDeparture}
        onNights={setNights}
      />
      <TravelersField adults={adults} className="lg:col-span-3" kids={kids} onAdults={setAdults} onKids={setKids} />
      <BudgetField className="lg:col-span-3" id={`${ids}-budget`} onChange={setBudget} value={budget} />

      <div className="md:col-span-2 lg:col-span-12 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 px-4 py-2.5 rounded-xl bg-surface-container-low">
          <label className={`${fieldLabel} shrink-0`} htmlFor={`${ids}-theme`}>
            <span className="material-symbols-outlined text-[18px] text-primary">nature_people</span> Thématique
          </label>
          <select
            className="flex-1 min-w-[12rem] bg-transparent font-label-lg text-label-lg text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary rounded cursor-pointer"
            id={`${ids}-theme`}
            onChange={(e) => setTheme(e.target.value)}
            value={theme}
          >
            <option value="faune">Faune &amp; lémuriens</option>
            <option value="lagon">Lagon &amp; plages</option>
            <option value="aventure">Aventure &amp; pistes</option>
            <option value="immersion">Culture &amp; villages</option>
          </select>
        </div>
        <button
          aria-busy={pending}
          className="sm:w-auto w-full h-[52px] px-8 rounded-full bg-tertiary hover:bg-on-tertiary-fixed-variant text-on-tertiary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-80"
          disabled={pending}
          type="submit"
        >
          <span className={`material-symbols-outlined text-[20px] ${pending ? "animate-spin" : ""}`}>
            {pending ? "progress_activity" : "explore"}
          </span>
          <span>{pending ? "Préparation de votre séjour…" : "Planifier mon voyage"}</span>
        </button>
      </div>
    </form>
  );
}

const usdFrom = (eurLabel: string) => usd(Number(eurLabel.replace(/\D/g, "")));

export function CurrencyToggle({ compact = false }: { compact?: boolean }) {
  const [currency, setCurrency] = useCurrency();
  const option = (value: Currency, label: string) => (
    <button
      aria-pressed={currency === value}
      className={`rounded-full whitespace-nowrap ${compact ? "px-3 py-1.5 font-label-md text-label-md" : "px-4 py-2 font-label-md text-label-md"} ${
        currency === value
          ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
          : "text-on-surface-variant hover:text-on-surface font-semibold"
      }`}
      onClick={() => setCurrency(value)}
      type="button"
    >
      {label}
    </button>
  );
  return (
    <div
      aria-label="Devise d'affichage des prix"
      className={`flex items-center bg-surface-container-high rounded-full ${compact ? "p-1" : "p-1.5"}`}
      role="group"
    >
      {option("EUR", "EUR (€)")}
      {option("MGA", "Ariary (MGA)")}
      {option("USD", "USD ($)")}
    </div>
  );
}

export function Price({ eur, mga, secondaryClassName }: { eur: string; mga: string; secondaryClassName: string }) {
  const [currency] = useCurrency();
  const [primary, secondary] = currency === "EUR" ? [eur, mga] : currency === "MGA" ? [mga, eur] : [usdFrom(eur), eur];
  return (
    <>
      {primary} <span className={secondaryClassName}>· {secondary}</span>
    </>
  );
}

/** Montant dans la devise choisie, ou dans l'autre devise (préfixé de « ~ ») avec `alternate`. */
export function Amount({ eur, mga, alternate = false }: { eur: string; mga: string; alternate?: boolean }) {
  const [currency] = useCurrency();
  if (alternate) return <>~{currency === "EUR" ? mga : eur}</>;
  return <>{currency === "EUR" ? eur : currency === "MGA" ? mga : usdFrom(eur)}</>;
}

const FAVORITES_KEY = "mv_favorite_destinations";

function readFavorites(): string[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function FavoriteButton({ id, name, compact = false }: { id: string; name: string; compact?: boolean }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(readFavorites().includes(id));
  }, [id]);

  const toggle = () => {
    const current = readFavorites();
    const next = active ? current.filter((x) => x !== id) : [...new Set([...current, id])];
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {
      // Stockage indisponible : le favori vaut pour cette visite.
    }
    setActive(!active);
  };

  return (
    <button
      aria-label={active ? `Retirer ${name} des favoris` : `Ajouter ${name} aux favoris`}
      aria-pressed={active}
      className={`absolute top-3 right-3 z-20 rounded-full backdrop-blur-md flex items-center justify-center hover:text-tertiary transition-colors ${
        compact ? "w-9 h-9 bg-surface-container-lowest/80" : "w-10 h-10 bg-surface-container-lowest/90 shadow-sm"
      } ${active ? "text-tertiary" : "text-on-surface"}`}
      onClick={toggle}
      type="button"
    >
      <span
        className={`material-symbols-outlined ${compact ? "text-[18px]" : "text-[20px]"}`}
        style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        favorite
      </span>
    </button>
  );
}
