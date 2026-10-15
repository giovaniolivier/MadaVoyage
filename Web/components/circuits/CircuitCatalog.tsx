"use client";

import Link from "next/link";
import { createContext, Fragment, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { useMoney } from "@/components/currency/useCurrency";
import { FavoriteButton } from "@/components/explore/Explore";
import { rateLabel } from "@/components/reservation/pricing";
import { ISLAND, MAP_VIEWBOX } from "@/components/explore/MadagascarMap";
import {
  BudgetField,
  DatesField,
  defaultDates,
  isRegion,
  parseBudget,
  RegionField,
  shortRegion,
  TravelersField,
} from "@/components/search/TripFields";
import { GUIDES, REVIEWS_VERIFIED, SOLIDARITY_TEXT } from "@/lib/site";
import Pending from "@/components/ui/Pending";
import {
  CHILD_AGES,
  CIRCUITS,
  DURATIONS,
  LEVEL_OPTIONS,
  LODGINGS,
  MAP_POSITIONS,
  groupPrice,
  monthOf,
  monthsOf,
  PRICE_MAX,
  PRICE_MIN,
  RATING_STEPS,
  REGIONS,
  THEMES,
  type Circuit,
  type Level,
  type DurationId,
  type LodgingId,
  type RegionId,
  type ThemeId,
} from "./catalog-data";

const PAGE_SIZE = 12;
const PRICE_STEP = 50;
const SORTS = [
  { id: "recommandes", label: "Recommandés" },
  { id: "prix-asc", label: "Prix croissant" },
  { id: "prix-desc", label: "Prix décroissant" },
  { id: "note", label: "Mieux notés" },
  { id: "duree", label: "Durée, du plus court au plus long" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

type Filters = {
  query: string;
  /** Vide : toutes les régions. */
  regions: RegionId[];
  /** Vide : dates flexibles. */
  departure: string;
  nights: number;
  adults: number;
  kids: number;
  /** Budget total du groupe : il signale les circuits trop chers, et ne les masque qu'avec `withinBudget`. */
  budget: string;
  withinBudget: boolean;
  duration: DurationId | "all";
  /** Ne garder que les circuits conseillés au mois de départ choisi. */
  inSeason: boolean;
  /** Âge du plus jeune enfant, 0 : indifférent. */
  childAge: number;
  levels: Level[];
  /** 0 : toutes les notes. */
  minRating: number;
  priceMin: number;
  priceMax: number;
  themes: ThemeId[];
  lodgings: LodgingId[];
};

const DEFAULT_FILTERS: Filters = {
  query: "",
  regions: [],
  departure: "",
  nights: 10,
  adults: 2,
  kids: 0,
  budget: "",
  withinBudget: false,
  duration: "all",
  inSeason: false,
  childAge: 0,
  levels: [],
  minRating: 0,
  priceMin: PRICE_MIN,
  priceMax: PRICE_MAX,
  themes: [],
  lodgings: [],
};

/** Filtres dont chaque option affiche son nombre de circuits, calculé sans tenir compte du filtre lui-même. */
type Facet = "region" | "duration" | "season" | "budget" | "childAge" | "level" | "rating";

/** Le circuit est-il conseillé au mois de départ ? `null` sans date choisie. */
const seasonFit = (c: Circuit, departure: string) => (departure ? monthsOf(c).includes(monthOf(departure)) : null);

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

/** Sans budget saisi, tous les circuits conviennent. */
function fitsBudget(c: Circuit, f: Filters) {
  const budget = parseBudget(f.budget);
  return budget === null || groupPrice(c, f.adults, f.kids).total <= budget;
}

function matches(c: Circuit, f: Filters, ignore?: Facet) {
  const q = normalize(f.query.trim());
  if (q && !normalize([c.title, c.regionLabel, ...c.places, c.theme.label].join(" ")).includes(q)) return false;
  const size = f.adults + f.kids;
  if (c.maxGroup < size) return false;
  if (ignore !== "region" && f.regions.length && !f.regions.includes(c.region)) return false;
  if (ignore !== "duration" && f.duration !== "all" && !DURATIONS.find((d) => d.id === f.duration)!.test(c.days)) return false;
  if (ignore !== "season" && f.inSeason && seasonFit(c, f.departure) === false) return false;
  if (ignore !== "budget" && f.withinBudget && !fitsBudget(c, f)) return false;
  if (ignore !== "childAge" && f.childAge && c.minAge > f.childAge) return false;
  if (ignore !== "level" && f.levels.length && !f.levels.includes(c.level)) return false;
  if (ignore !== "rating" && f.minRating && c.rating < f.minRating) return false;
  if (c.priceEur < f.priceMin || c.priceEur > f.priceMax) return false;
  if (f.themes.length && !f.themes.some((t) => c.themes.includes(t))) return false;
  if (f.lodgings.length && !f.lodgings.some((l) => c.lodgings.includes(l))) return false;
  return true;
}

const decimal = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 1 });

type Chip = { id: string; label: string; clear: Partial<Filters> };

/** Filtres qui réduisent la liste, affichés en puces au-dessus des résultats. Les dates n'en font pas partie : elles ne masquent aucun circuit. */
function activeChips(f: Filters, eur: (n: number) => string): Chip[] {
  const chips: Chip[] = [];
  if (f.query.trim()) chips.push({ id: "query", label: `« ${f.query.trim()} »`, clear: { query: "" } });
  for (const r of f.regions) chips.push({ id: `region-${r}`, label: shortRegion(r), clear: { regions: f.regions.filter((x) => x !== r) } });
  if (f.adults !== DEFAULT_FILTERS.adults || f.kids !== DEFAULT_FILTERS.kids) {
    const size = f.adults + f.kids;
    chips.push({
      id: "travelers",
      label: `${size} voyageur${size > 1 ? "s" : ""}`,
      clear: { adults: DEFAULT_FILTERS.adults, kids: DEFAULT_FILTERS.kids },
    });
  }
  if (f.duration !== "all")
    chips.push({ id: "duration", label: DURATIONS.find((d) => d.id === f.duration)!.label, clear: { duration: "all" } });
  if (f.inSeason && f.departure) chips.push({ id: "season", label: "Compatibles avec mes dates", clear: { inSeason: false } });
  const budget = parseBudget(f.budget);
  if (f.withinBudget && budget) chips.push({ id: "budget", label: `Dans mon budget de ${eur(budget)}`, clear: { withinBudget: false } });
  if (f.childAge) {
    const age = CHILD_AGES.find((a) => a.age === f.childAge)!;
    chips.push({ id: "child-age", label: `Enfant de ${age.label}`, clear: { childAge: 0 } });
  }
  for (const l of f.levels)
    chips.push({ id: `level-${l}`, label: `Niveau ${l.toLowerCase()}`, clear: { levels: f.levels.filter((x) => x !== l) } });
  if (f.minRating) chips.push({ id: "rating", label: `Note ${decimal(f.minRating)} et plus`, clear: { minRating: 0 } });
  if (f.priceMin !== PRICE_MIN || f.priceMax !== PRICE_MAX)
    chips.push({
      id: "price",
      label: `${eur(f.priceMin)} – ${eur(f.priceMax)} / adulte`,
      clear: { priceMin: PRICE_MIN, priceMax: PRICE_MAX },
    });
  for (const t of f.themes)
    chips.push({ id: `theme-${t}`, label: THEMES.find((x) => x.id === t)!.label, clear: { themes: f.themes.filter((x) => x !== t) } });
  for (const l of f.lodgings)
    chips.push({
      id: `lodging-${l}`,
      label: LODGINGS.find((x) => x.id === l)!.label,
      clear: { lodgings: f.lodgings.filter((x) => x !== l) },
    });
  return chips;
}

type View = "grid" | "list" | "map";

const VIEW_SLUGS: Record<View, string> = { grid: "grille", list: "liste", map: "carte" };
const LEVEL_SLUGS: Record<Level, string> = { Facile: "facile", Modéré: "modere", Sportif: "sportif" };

const listParam = <T extends string>(value: string | null, allowed: readonly T[]) =>
  (value ?? "").split(",").filter((v): v is T => (allowed as readonly string[]).includes(v));
const numberParam = (value: string | null, ok: (n: number) => boolean, fallback: number) => {
  const n = Number(value);
  return value !== null && Number.isFinite(n) && ok(n) ? n : fallback;
};

/**
 * Adresse partageable : seuls les choix qui diffèrent du réglage par défaut y figurent, avec des clés lisibles
 * (`?region=nord,est&depart=2027-08-02&saison=1&niveau=facile&tri=prix-asc&vue=liste`).
 */
function toParams(f: Filters, sort: SortId, view: View, base: URLSearchParams) {
  const p = new URLSearchParams(base);
  const set = (key: string, value: string | number | false | null | undefined) => {
    if (value === false || value === null || value === undefined || value === "") p.delete(key);
    else p.set(key, String(value));
  };
  set("q", f.query.trim());
  set("region", f.regions.join(","));
  set("depart", f.departure);
  set("nuits", f.nights !== DEFAULT_FILTERS.nights && f.nights);
  set("adultes", f.adults !== DEFAULT_FILTERS.adults && f.adults);
  set("enfants", f.kids !== DEFAULT_FILTERS.kids && f.kids);
  set("budget", parseBudget(f.budget) ?? "");
  set("dansbudget", f.withinBudget && parseBudget(f.budget) !== null && 1);
  set("duree", f.duration !== "all" && f.duration);
  set("saison", f.inSeason && f.departure && 1);
  p.delete("mois");
  set("age", f.childAge || "");
  set("niveau", f.levels.map((l) => LEVEL_SLUGS[l]).join(","));
  set("note", f.minRating || "");
  set("prixmin", f.priceMin !== PRICE_MIN && f.priceMin);
  set("prixmax", f.priceMax !== PRICE_MAX && f.priceMax);
  set("theme", f.themes.join(","));
  set("hebergement", f.lodgings.join(","));
  set("tri", sort !== "recommandes" && sort);
  set("vue", view !== "grid" && VIEW_SLUGS[view]);
  return p;
}

function fromParams(p: URLSearchParams, today: string) {
  const levelBySlug = Object.fromEntries(Object.entries(LEVEL_SLUGS).map(([l, s]) => [s, l as Level]));
  const priceMin = numberParam(p.get("prixmin"), (n) => n >= PRICE_MIN && n < PRICE_MAX, PRICE_MIN);
  const date = p.get("depart") ?? "";
  // Une date passée (lien ancien) redevient « dates flexibles ».
  const departure = /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= today ? date : "";
  const filters: Filters = {
    ...DEFAULT_FILTERS,
    query: p.get("q") ?? "",
    regions: (p.get("region") ?? "").split(",").filter(isRegion),
    departure,
    nights: numberParam(p.get("nuits"), (n) => n >= 1 && n <= 30, DEFAULT_FILTERS.nights),
    adults: numberParam(p.get("adultes"), (n) => n >= 1 && n <= 12, DEFAULT_FILTERS.adults),
    kids: numberParam(p.get("enfants"), (n) => n >= 0 && n <= 10, DEFAULT_FILTERS.kids),
    budget: parseBudget(p.get("budget") ?? "") ? p.get("budget")! : "",
    withinBudget: parseBudget(p.get("budget") ?? "") !== null && p.get("dansbudget") === "1",
    duration: DURATIONS.find((d) => d.id === p.get("duree"))?.id ?? "all",
    inSeason: Boolean(departure) && p.get("saison") === "1",
    childAge: CHILD_AGES.find((a) => String(a.age) === p.get("age"))?.age ?? 0,
    levels: (p.get("niveau") ?? "")
      .split(",")
      .map((s) => levelBySlug[s])
      .filter(Boolean),
    minRating: REVIEWS_VERIFIED ? (RATING_STEPS.find((r) => String(r) === p.get("note")) ?? 0) : 0,
    priceMin,
    priceMax: numberParam(p.get("prixmax"), (n) => n > priceMin && n <= PRICE_MAX, PRICE_MAX),
    themes: listParam(
      p.get("theme"),
      THEMES.map((t) => t.id),
    ),
    lodgings: listParam(
      p.get("hebergement"),
      LODGINGS.map((l) => l.id),
    ),
  };
  const sort = SORTS.find((s) => s.id === p.get("tri") && (s.id !== "note" || REVIEWS_VERIFIED))?.id ?? "recommandes";
  const view = (Object.entries(VIEW_SLUGS).find(([, slug]) => slug === p.get("vue"))?.[0] as View | undefined) ?? "grid";
  return { filters, sort, view };
}

type CatalogState = {
  filters: Filters;
  update: (patch: Partial<Filters>) => void;
  /** Efface les filtres mais garde les dates du séjour. */
  clearFilters: () => void;
  results: Circuit[];
  /** Nombre de circuits pour une option, avec les autres filtres en place. */
  countFor: (facet: Facet, test: (c: Circuit) => boolean) => number;
  /** Nombre de résultats si l'on appliquait ce changement de filtres. */
  countWith: (patch: Partial<Filters>) => number;
  sort: SortId;
  setSort: (s: SortId) => void;
  view: View;
  setView: (v: View) => void;
  /** Résultats affichés : « Voir plus » en ajoute `PAGE_SIZE` à chaque clic. */
  shown: number;
  showMore: () => void;
  /** Faux tant que les filtres de l'adresse ne sont pas lus : la liste affiche des squelettes plutôt qu'un catalogue non filtré. */
  ready: boolean;
  online: boolean;
  /** Connexion lente ou mode économie de données : une seule petite taille de photo est demandée. */
  liteData: boolean;
  resultsRef: React.RefObject<HTMLDivElement | null>;
  scrollToResults: () => void;
};

/** API Network Information : absente de Safari et Firefox, la page se comporte alors comme sur une bonne connexion. */
type NetworkConnection = EventTarget & { saveData?: boolean; effectiveType?: string };
const isSlow = (c?: NetworkConnection) => !!c && (c.saveData === true || ["slow-2g", "2g", "3g"].includes(c.effectiveType ?? ""));

const CatalogContext = createContext<CatalogState | null>(null);

function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog doit être utilisé dans <CatalogProvider>");
  return ctx;
}

const SORTERS: Record<SortId, (a: Circuit, b: Circuit) => number> = {
  recommandes: (a, b) => b.rating * Math.log(b.reviews + 1) - a.rating * Math.log(a.reviews + 1),
  "prix-asc": (a, b) => a.priceEur - b.priceEur,
  "prix-desc": (a, b) => b.priceEur - a.priceEur,
  note: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  duree: (a, b) => a.days - b.days,
};

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortId>("recommandes");
  const [view, setView] = useState<View>("grid");
  const [shown, setShown] = useState(PAGE_SIZE);
  const [ready, setReady] = useState(false);
  const [online, setOnline] = useState(true);
  const [liteData, setLiteData] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    url.search = toParams(filters, sort, view, url.searchParams).toString();
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
  }, [ready, filters, sort, view]);

  useEffect(() => {
    const initial = fromParams(new URLSearchParams(window.location.search), defaultDates().min);
    setFilters(initial.filters);
    setSort(initial.sort);
    setView(initial.view);
    setReady(true);

    const onRegion = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id === "all" || isRegion(id)) {
        setFilters((f) => ({ ...f, regions: id === "all" ? [] : [id] }));
        setShown(PAGE_SIZE);
      }
    };
    const connection = (navigator as Navigator & { connection?: NetworkConnection }).connection;
    const onNetwork = () => {
      setOnline(navigator.onLine);
      setLiteData(isSlow(connection));
    };
    onNetwork();
    window.addEventListener("mv:catalog-region", onRegion);
    window.addEventListener("online", onNetwork);
    window.addEventListener("offline", onNetwork);
    connection?.addEventListener("change", onNetwork);
    return () => {
      window.removeEventListener("mv:catalog-region", onRegion);
      window.removeEventListener("online", onNetwork);
      window.removeEventListener("offline", onNetwork);
      connection?.removeEventListener("change", onNetwork);
    };
  }, []);

  const results = useMemo(() => CIRCUITS.filter((c) => matches(c, filters)).sort(SORTERS[sort]), [filters, sort]);

  const scrollToResults = () => {
    const top = resultsRef.current?.getBoundingClientRect().top;
    if (top !== undefined) window.scrollTo({ top: window.scrollY + top - 100, behavior: "smooth" });
    resultsRef.current?.querySelector("h3")?.focus({ preventScroll: true });
  };

  const value: CatalogState = {
    filters,
    update: (patch) => {
      setFilters((f) => {
        const next = { ...f, ...patch };
        if (!next.departure) next.inSeason = false;
        if (parseBudget(next.budget) === null) next.withinBudget = false;
        return next;
      });
      setShown(PAGE_SIZE);
    },
    clearFilters: () => {
      setFilters((f) => ({ ...DEFAULT_FILTERS, departure: f.departure, nights: f.nights }));
      setShown(PAGE_SIZE);
    },
    results,
    countFor: (facet, test) => CIRCUITS.filter((c) => matches(c, filters, facet) && test(c)).length,
    countWith: (patch) => CIRCUITS.filter((c) => matches(c, { ...filters, ...patch })).length,
    sort,
    setSort: (s) => {
      setSort(s);
      setShown(PAGE_SIZE);
    },
    view,
    setView,
    shown,
    showMore: () => setShown((n) => n + PAGE_SIZE),
    ready,
    online,
    liteData,
    resultsRef,
    scrollToResults,
  };

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

/**
 * Mêmes champs que la recherche de l'accueil. La liste se filtre à chaque choix ; « Rechercher » mène aux résultats
 * (utile sur mobile, où ils sont sous le formulaire). La réservation passe par la fiche circuit ou l'en-tête.
 */
export function CatalogSearch() {
  const { filters, update, scrollToResults } = useCatalog();
  const ids = useId();
  const [minDate, setMinDate] = useState<string>();

  useEffect(() => setMinDate(defaultDates().min), []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    scrollToResults();
  };

  return (
    <form
      aria-label="Rechercher un circuit"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch"
      onSubmit={submit}
    >
      <RegionField className="lg:col-span-3" id={`${ids}-dest`} onChange={(regions) => update({ regions })} regions={filters.regions} />

      <DatesField
        className="lg:col-span-3"
        departure={filters.departure}
        flexible
        id={`${ids}-date`}
        minDate={minDate}
        nights={filters.nights}
        onDeparture={(departure) => update({ departure })}
        onNights={(nights) => update({ nights })}
      />
      <TravelersField
        adults={filters.adults}
        className="lg:col-span-3"
        kids={filters.kids}
        onAdults={(adults) => update({ adults })}
        onKids={(kids) => update({ kids })}
      />
      <BudgetField className="lg:col-span-3" id={`${ids}-budget`} onChange={(budget) => update({ budget })} value={filters.budget} />

      <div className="md:col-span-2 lg:col-span-12 flex justify-end">
        <button
          className="w-full sm:w-auto h-[52px] px-8 rounded-full bg-primary hover:bg-on-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
          type="submit"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
            search
          </span>
          Rechercher
        </button>
      </div>
    </form>
  );
}

const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
const LEGEND = "font-label-md text-label-md text-on-surface font-bold uppercase tracking-wide mb-1";
const DIVIDER = <div className="h-[1px] bg-surface-container-high shrink-0"></div>;

function FilterOption({
  type,
  name,
  checked,
  onChange,
  label,
  hint,
  count,
  icon,
  disabled = false,
}: {
  type: "checkbox" | "radio";
  name?: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  hint?: string;
  count?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-center justify-between gap-2 p-2.5 rounded transition-colors ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      } ${checked ? "bg-primary-container/15" : "bg-surface-container-low hover:bg-surface-container"}`}
    >
      <span className="flex items-center gap-2 min-w-0">
        <input
          checked={checked}
          className="w-4 h-4 shrink-0 accent-primary cursor-pointer disabled:cursor-not-allowed"
          disabled={disabled}
          name={name}
          onChange={onChange}
          type={type}
        />
        {icon}
        <span className="flex flex-col min-w-0">
          <span className={`font-body-md text-body-md ${checked ? "font-semibold text-primary" : "text-on-surface"}`}>{label}</span>
          {hint && <span className="font-body-sm text-body-sm text-on-surface-variant leading-tight">{hint}</span>}
        </span>
      </span>
      {count !== undefined && (
        <span className={`font-label-sm text-label-sm shrink-0 ${checked ? "font-bold text-primary" : "text-on-surface-variant"}`}>
          {count}
          <span className="sr-only">{` circuit${count > 1 ? "s" : ""}`}</span>
        </span>
      )}
    </label>
  );
}

const THUMB =
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-surface-container-lowest [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-surface-container-lowest [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-grab [&::-moz-range-track]:bg-transparent " +
  "focus-visible:outline-none [&:focus-visible::-webkit-slider-thumb]:ring-4 [&:focus-visible::-webkit-slider-thumb]:ring-primary/30 [&:focus-visible::-moz-range-thumb]:ring-4 [&:focus-visible::-moz-range-thumb]:ring-primary/30";

/** Une seule piste à deux poignées : deux curseurs superposés dont seules les poignées captent le pointeur. */
function PriceRange() {
  const { filters, update } = useCatalog();
  const money = useMoney();
  const { priceMin, priceMax } = filters;
  const pct = (v: number) => (v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN);
  const at = (v: number) => `calc(10px + (100% - 20px) * ${pct(v)})`;
  const input = `absolute inset-0 w-full h-full appearance-none bg-transparent pointer-events-none ${THUMB}`;

  return (
    <fieldset className="flex flex-col gap-space-sm">
      <legend className="w-full flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mb-1">
        <span className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wide">Prix par adulte</span>
        <span className="font-label-sm text-label-sm text-secondary font-semibold bg-secondary-container px-2 py-0.5 rounded-full whitespace-nowrap">
          {rateLabel()}
        </span>
      </legend>
      <div className="p-3 bg-surface-container-low rounded flex items-center justify-between gap-2">
        <div>
          <span className="font-body-sm text-body-sm text-on-surface-variant block">Min.</span>
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{money.eur(priceMin)}</span>
          <span className="font-body-sm text-body-sm text-outline block leading-none">{money.mga(priceMin)}</span>
        </div>
        <span aria-hidden="true" className="material-symbols-outlined text-outline">
          trending_flat
        </span>
        <div className="text-right">
          <span className="font-body-sm text-body-sm text-on-surface-variant block">Max.</span>
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{money.eur(priceMax)}</span>
          <span className="font-body-sm text-body-sm text-outline block leading-none">{money.mga(priceMax)}</span>
        </div>
      </div>
      <div className="relative h-8">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-surface-container-high"></div>
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-primary"
          style={{ left: at(priceMin), right: `calc(100% - ${at(priceMax)})` }}
        ></div>
        <input
          aria-label="Prix minimum par adulte"
          aria-valuetext={money.eur(priceMin)}
          className={`${input} ${pct(priceMin) > 0.5 ? "z-20" : "z-10"}`}
          max={PRICE_MAX}
          min={PRICE_MIN}
          onChange={(e) => update({ priceMin: Math.min(Number(e.target.value), priceMax - PRICE_STEP) })}
          step={PRICE_STEP}
          type="range"
          value={priceMin}
        />
        <input
          aria-label="Prix maximum par adulte"
          aria-valuetext={money.eur(priceMax)}
          className={`${input} z-10`}
          max={PRICE_MAX}
          min={PRICE_MIN}
          onChange={(e) => update({ priceMax: Math.max(Number(e.target.value), priceMin + PRICE_STEP) })}
          step={PRICE_STEP}
          type="range"
          value={priceMax}
        />
      </div>
    </fieldset>
  );
}

function FilterFields() {
  const { filters, update, countFor } = useCatalog();
  const ids = useId();
  const regionOptions = REGIONS.filter((r) => r.id !== "all") as { id: RegionId; label: string }[];

  return (
    <>
      <label className="flex flex-col gap-1.5">
        <span className={LEGEND}>Lieu ou parc</span>
        <span className="flex items-center gap-2 px-3 h-11 rounded-full bg-surface-container-low focus-within:ring-2 focus-within:ring-primary">
          <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-on-surface-variant">
            search
          </span>
          <input
            className="flex-1 min-w-0 bg-transparent border-0 outline-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/70"
            onChange={(e) => update({ query: e.target.value })}
            placeholder="Isalo, Andasibe, Tsingy…"
            type="search"
            value={filters.query}
          />
        </span>
      </label>
      {DIVIDER}

      <fieldset className="flex flex-col gap-2">
        <legend className={LEGEND}>Régions de la Grande Île</legend>
        <p className="font-body-sm text-body-sm text-on-surface-variant -mt-1 mb-1">Plusieurs choix possibles.</p>
        {regionOptions.map((r) => (
          <FilterOption
            key={r.id}
            checked={filters.regions.includes(r.id)}
            count={countFor("region", (c) => c.region === r.id)}
            label={r.label}
            onChange={() => update({ regions: toggle(filters.regions, r.id) })}
            type="checkbox"
          />
        ))}
      </fieldset>
      {DIVIDER}

      <fieldset className="flex flex-col gap-2">
        <legend className={LEGEND}>Durée du circuit</legend>
        {[{ id: "all" as const, label: "Toutes les durées" }, ...DURATIONS].map((d) => (
          <FilterOption
            key={d.id}
            checked={filters.duration === d.id}
            count={d.id === "all" ? undefined : countFor("duration", (c) => d.test(c.days))}
            label={d.label}
            name={`${ids}-duration`}
            onChange={() => update({ duration: d.id })}
            type="radio"
          />
        ))}
      </fieldset>
      {DIVIDER}

      <PriceRange />
      {DIVIDER}

      <fieldset className="flex flex-col gap-2">
        <legend className={LEGEND}>Thématiques</legend>
        {THEMES.map((t) => (
          <FilterOption
            key={t.id}
            checked={filters.themes.includes(t.id)}
            icon={
              <span aria-hidden="true" className={`material-symbols-outlined text-[18px] ${t.iconClass}`}>
                {t.icon}
              </span>
            }
            label={t.label}
            onChange={() => update({ themes: toggle(filters.themes, t.id) })}
            type="checkbox"
          />
        ))}
      </fieldset>
      {DIVIDER}

      <fieldset className="flex flex-col gap-2">
        <legend className={LEGEND}>Voyage en famille</legend>
        <p className="font-body-sm text-body-sm text-on-surface-variant -mt-1 mb-1">Âge du plus jeune enfant.</p>
        {[{ age: 0, label: "Sans enfant ou indifférent" }, ...CHILD_AGES].map((a) => (
          <FilterOption
            key={a.age}
            checked={filters.childAge === a.age}
            count={a.age ? countFor("childAge", (c) => c.minAge <= a.age) : undefined}
            label={a.label}
            name={`${ids}-child`}
            onChange={() => update({ childAge: a.age })}
            type="radio"
          />
        ))}
        {filters.kids > 0 && !filters.childAge && (
          <p className="font-body-sm text-body-sm text-tertiary font-semibold">
            Vous voyagez avec {filters.kids} enfant{filters.kids > 1 ? "s" : ""} : indiquez l&apos;âge du plus jeune.
          </p>
        )}
      </fieldset>
      {DIVIDER}

      <fieldset className="flex flex-col gap-2">
        <legend className={LEGEND}>Niveau physique</legend>
        {LEVEL_OPTIONS.map((l) => (
          <FilterOption
            key={l}
            checked={filters.levels.includes(l)}
            count={countFor("level", (c) => c.level === l)}
            icon={
              <span className="text-on-surface-variant flex">
                <LevelBars level={l} />
              </span>
            }
            hint={LEVELS[l].hint}
            label={l}
            onChange={() => update({ levels: toggle(filters.levels, l) })}
            type="checkbox"
          />
        ))}
      </fieldset>
      {DIVIDER}

      <fieldset className="flex flex-col gap-2">
        <legend className={LEGEND}>Note minimale</legend>
        {!REVIEWS_VERIFIED && <Pending>En attente des premiers avis publiés</Pending>}
        {[0, ...RATING_STEPS].map((r) => (
          <FilterOption
            key={r}
            checked={filters.minRating === r}
            count={r && REVIEWS_VERIFIED ? countFor("rating", (c) => c.rating >= r) : undefined}
            disabled={!REVIEWS_VERIFIED}
            icon={
              r ? (
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-[18px] text-tertiary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ) : undefined
            }
            label={r ? `${decimal(r)} et plus` : "Toutes les notes"}
            name={`${ids}-rating`}
            onChange={() => update({ minRating: r })}
            type="radio"
          />
        ))}
      </fieldset>
      {DIVIDER}

      <fieldset className="flex flex-col gap-2.5">
        <legend className={LEGEND}>Style d&apos;hébergement</legend>
        {LODGINGS.map((l) => {
          const checked = filters.lodgings.includes(l.id);
          return (
            <label key={l.id} className="flex items-center gap-3 cursor-pointer">
              <input
                checked={checked}
                className="w-4 h-4 text-primary rounded accent-primary cursor-pointer"
                onChange={() => update({ lodgings: toggle(filters.lodgings, l.id) })}
                type="checkbox"
              />
              <span className={`font-body-md text-body-md ${checked ? "font-semibold text-primary" : "text-on-surface-variant"}`}>
                {l.label}
              </span>
            </label>
          );
        })}
      </fieldset>
      {DIVIDER}

      <div className="p-3 bg-secondary-container/30 rounded flex flex-col gap-2">
        <p className="flex items-center gap-2 text-on-secondary-container font-label-md text-label-md font-bold">
          <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
            eco
          </span>
          Inclus dans tous nos circuits
        </p>
        <p className="flex items-start gap-2 font-body-sm text-body-sm text-on-secondary-fixed-variant font-medium">
          <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-secondary mt-0.5">
            verified
          </span>
          {`${GUIDES.claim}, ${GUIDES.detail}.`}
        </p>
        <p className="flex items-start gap-2 font-body-sm text-body-sm text-on-secondary-fixed-variant font-medium">
          <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-secondary mt-0.5">
            park
          </span>
          {SOLIDARITY_TEXT}
        </p>
      </div>
    </>
  );
}

/**
 * Desktop : colonne collante qui défile seule, filtrage instantané.
 * Mobile : bouton « Filtres » qui ouvre une feuille plein écran, refermée par « Voir les N circuits ».
 */
export function CatalogFilters() {
  const { filters, clearFilters, results, scrollToResults } = useCatalog();
  const money = useMoney();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const jumpToResults = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);
  const measureMore = () => {
    const el = scrollRef.current;
    setMore(Boolean(el && el.clientHeight > 0 && el.scrollHeight - el.scrollTop - el.clientHeight > 24));
  };

  useEffect(() => {
    measureMore();
    const observer = new ResizeObserver(measureMore);
    if (scrollRef.current) observer.observe(scrollRef.current);
    return () => observer.disconnect();
  }, [open]);
  const activeCount = activeChips(filters, money.eur).length;

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      if (!jumpToResults.current) triggerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = () => desktop.matches && setOpen(false);
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  // Le défilement vers les résultats attend la fermeture : tant que la feuille est ouverte, la page est bloquée.
  useEffect(() => {
    if (open || !jumpToResults.current) return;
    jumpToResults.current = false;
    scrollToResults();
  }, [open, scrollToResults]);

  const showResults = () => {
    jumpToResults.current = true;
    setOpen(false);
  };

  return (
    <>
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className="lg:hidden w-full h-12 rounded-full bg-surface-container-lowest shadow-sm text-on-surface font-label-lg text-label-lg font-bold flex items-center justify-center gap-2"
        onClick={() => setOpen(true)}
        ref={triggerRef}
        type="button"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary">
          tune
        </span>
        Filtres
        {activeCount > 0 && (
          <span className="min-w-6 h-6 px-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center">
            {activeCount}
            <span className="sr-only"> actifs</span>
          </span>
        )}
      </button>

      {open && (
        <div
          aria-hidden="true"
          className="lg:hidden fixed inset-0 z-[60] bg-on-surface/50 motion-safe:animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}
      <div
        aria-labelledby={titleId}
        aria-modal={open || undefined}
        className={`${
          open
            ? "fixed inset-x-0 bottom-0 z-[61] flex max-h-[88dvh] rounded-t-2xl shadow-[0_-12px_40px_rgba(31,41,51,0.3)] motion-safe:animate-sheet-up"
            : "hidden"
        } lg:static lg:z-auto lg:flex lg:max-h-[calc(100vh-8rem)] lg:rounded-lg lg:shadow-sm lg:animate-none flex-col bg-surface-container-lowest overflow-hidden`}
        id={panelId}
        role={open ? "dialog" : "region"}
      >
        <div aria-hidden="true" className="lg:hidden shrink-0 flex justify-center pt-2">
          <span className="w-10 h-1.5 rounded-full bg-outline-variant"></span>
        </div>
        <div className="shrink-0 flex items-center justify-between gap-3 px-space-lg py-space-md border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px]">
              tune
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold" id={titleId}>
              Filtres
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="font-label-sm text-label-sm text-primary hover:text-on-primary-container underline font-semibold transition-colors"
              onClick={clearFilters}
              type="button"
            >
              Tout effacer
            </button>
            <button
              ref={closeRef}
              aria-label="Fermer les filtres"
              className="lg:hidden w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center"
              onClick={() => setOpen(false)}
              type="button"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
                close
              </span>
            </button>
          </div>
        </div>

        <div className="relative flex-1 min-h-0 flex flex-col">
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-space-lg flex flex-col gap-space-lg"
            onScroll={measureMore}
          >
            <FilterFields />
          </div>
          {more && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/90 to-transparent flex items-end justify-center pb-2">
              <button
                className="pointer-events-auto h-9 px-4 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold shadow-sm flex items-center gap-1 hover:bg-surface-container-highest"
                onClick={() => scrollRef.current?.scrollBy({ top: scrollRef.current.clientHeight * 0.7, behavior: "smooth" })}
                type="button"
              >
                Plus de filtres
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                  expand_more
                </span>
              </button>
            </div>
          )}
        </div>

        <div className="lg:hidden shrink-0 p-space-md border-t border-surface-container-high">
          <button
            className="w-full h-[48px] bg-primary hover:bg-on-primary-container text-on-primary font-label-lg text-label-lg rounded-full shadow-md flex items-center justify-center gap-2 transition-all"
            onClick={showResults}
            type="button"
          >
            {results.length === 0 ? "Aucun circuit" : `Voir les ${results.length} circuit${results.length > 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * Position du bandeau sur-mesure : en grille, il occupe toute une ligne, donc il se place après une ligne complète
 * (la première carte, mise en avant quand le nombre de résultats est impair, compte pour deux cases), vers la 3e ou 4e carte.
 */
function customTripIndex(count: number, view: View) {
  if (view === "list") return Math.min(3, count) - 1;
  let cells = 0;
  for (let i = 0; i < count; i++) {
    cells += i === 0 && count % 2 === 1 ? 2 : 1;
    if (cells >= 4 && cells % 2 === 0) return i;
  }
  return count - 1;
}

/** Bandeau d'appel au sur-mesure, glissé dans le flux des résultats sur toute la largeur. */
function CustomTripCard() {
  return (
    <aside
      aria-label="Itinéraire sur-mesure"
      className="col-span-full bg-gradient-to-br from-primary-container/25 via-surface-container-high to-secondary-container/40 rounded-lg shadow-sm p-space-lg flex flex-col md:flex-row md:items-center md:justify-between gap-space-md"
    >
      <div className="flex items-start gap-space-md">
        <span className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
          <span aria-hidden="true" className="material-symbols-outlined text-[24px]">
            support_agent
          </span>
        </span>
        <div className="flex flex-col gap-1">
          <h4 className="font-headline-sm text-headline-sm text-on-surface font-extrabold leading-tight">
            Besoin d&apos;un itinéraire sur-mesure ?
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Composez-le en ligne : prix indicatif, confirmé à l&apos;étape 4, billets et carnet envoyés dès la confirmation.
          </p>
        </div>
      </div>
      <Link
        className="self-start md:self-center shrink-0 h-11 px-6 rounded-full bg-primary hover:bg-on-primary-container text-on-primary font-label-md text-label-md font-bold flex items-center gap-2 shadow-sm transition-all"
        href="/reservation/dates"
      >
        Composer mon voyage
        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
          arrow_forward
        </span>
      </Link>
    </aside>
  );
}

const LEVELS: Record<Level, { bars: number; className: string; hint: string }> = {
  Facile: { bars: 1, className: "bg-secondary-container text-on-secondary-container", hint: "balades courtes" },
  Modéré: { bars: 2, className: "bg-primary-fixed text-on-primary-fixed-variant", hint: "marches de 3 à 5 h" },
  Sportif: { bars: 3, className: "bg-tertiary-fixed text-on-tertiary-fixed-variant", hint: "trek sur plusieurs jours" },
};

/** Trois barres dont 1, 2 ou 3 pleines : dessinées en SVG pour rester alignées sur le texte (les icônes sont forcées à 24 px). */
function LevelBars({ level }: { level: Level }) {
  return (
    <svg aria-hidden="true" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 14">
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          fill="currentColor"
          height={4 + i * 4}
          opacity={i < LEVELS[level].bars ? 1 : 0.3}
          rx="1"
          width="3"
          x={1 + i * 4.5}
          y={10 - i * 4}
        />
      ))}
    </svg>
  );
}

const travelersLabel = (adults: number, kids: number) =>
  [`${adults} adulte${adults > 1 ? "s" : ""}`, kids ? `${kids} enfant${kids > 1 ? "s" : ""}` : ""].filter(Boolean).join(" et ");

/** Un seul message de saison par carte : neutre sans date, sinon idéal ou déconseillé pour le mois de départ. */
function seasonNote(c: Circuit, departure: string) {
  const period = c.months.toLowerCase();
  const fit = seasonFit(c, departure);
  if (fit === null) return { tone: "text-on-surface-variant", icon: "event", text: `Conseillé : ${period}` };
  return fit
    ? { tone: "text-secondary", icon: "event_available", text: "Idéal à vos dates" }
    : { tone: "text-amber-800", icon: "event_busy", text: `Déconseillé à vos dates · conseillé : ${period}` };
}

const PHOTO_WIDTHS = [480, 800, 1200];
/** Les photos hébergées chez Google acceptent un suffixe de largeur ; les autres sont servies telles quelles. */
const resizable = (src: string) => src.includes("googleusercontent.com");
const photoAt = (src: string, width: number) => (resizable(src) ? `${src}=w${width}` : src);

/**
 * Photo de carte : fond neutre jusqu'au chargement puis fondu, taille choisie selon l'écran, une seule petite taille sur
 * connexion lente, et un repli lisible si l'image échoue (nouvel essai au retour du réseau).
 */
function CardPhoto({ image, wide, priority }: { image: Circuit["image"]; wide: boolean; priority: boolean }) {
  const { liteData, online } = useCatalog();
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth) setStatus("loaded");
  }, [status, liteData]);

  useEffect(() => {
    if (online) setStatus((s) => (s === "error" ? "loading" : s));
  }, [online]);

  if (status === "error") {
    return (
      <div
        aria-label={image.alt}
        className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-on-surface-variant"
        role="img"
      >
        <span aria-hidden="true" className="material-symbols-outlined">
          image_not_supported
        </span>
        <span className="font-body-sm text-body-sm">{online ? "Photo indisponible" : "Photo disponible au retour du réseau"}</span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      alt={image.alt}
      className={`absolute inset-0 w-full h-full object-cover transition-[opacity,transform] duration-500 group-hover:scale-105 ${
        status === "loaded" ? "opacity-100" : "opacity-0"
      }`}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      loading={priority ? "eager" : "lazy"}
      onError={() => setStatus("error")}
      onLoad={() => setStatus("loaded")}
      sizes={
        wide ? "(min-width: 1440px) 520px, (min-width: 768px) 40vw, 100vw" : "(min-width: 1440px) 560px, (min-width: 768px) 45vw, 100vw"
      }
      src={liteData ? photoAt(image.src, PHOTO_WIDTHS[0]) : image.src}
      srcSet={!liteData && resizable(image.src) ? PHOTO_WIDTHS.map((w) => `${photoAt(image.src, w)} ${w}w`).join(", ") : undefined}
    />
  );
}

function CircuitCard({
  circuit: c,
  wide,
  priority = false,
  className = "",
}: {
  circuit: Circuit;
  wide: boolean;
  priority?: boolean;
  className?: string;
}) {
  const money = useMoney();
  const { filters } = useCatalog();
  const season = seasonNote(c, filters.departure);
  const price = groupPrice(c, filters.adults, filters.kids);
  const budget = parseBudget(filters.budget);
  const overBudget = budget ? price.total - budget : 0;
  return (
    <article
      className={`bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary has-[a:focus-visible]:ring-offset-2 transition-all duration-300 flex group relative ${
        wide ? "flex-col md:flex-row" : "flex-col"
      } ${className}`}
    >
      <div
        className={`relative overflow-hidden bg-surface-container-high ${wide ? "h-56 md:h-auto md:w-2/5 md:min-h-[15rem] shrink-0" : "h-56"}`}
      >
        <CardPhoto image={c.image} priority={priority} wide={wide} />
        <div className="absolute top-3 left-3 right-16 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/95 text-on-surface font-label-md text-label-md font-semibold shadow-sm flex items-center gap-1">
            <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">
              {c.theme.icon}
            </span>
            {c.theme.label}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full font-label-md text-label-md font-bold shadow-sm flex items-center gap-1.5 ${LEVELS[c.level].className}`}
          >
            <LevelBars level={c.level} />
            <span>
              <span className="sr-only">Niveau : </span>
              {c.level}
            </span>
          </span>
        </div>
        <FavoriteButton id={c.id} name={c.title} />
        <div className="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-full text-on-surface font-label-md text-label-md font-semibold flex items-center gap-1 shadow-sm pointer-events-none">
          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
            schedule
          </span>
          {c.days} jours / {c.nights} nuits
        </div>
      </div>
      <div className={`p-space-lg flex flex-col flex-1 gap-space-md min-w-0 ${wide ? "" : "justify-between"}`}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-body-sm text-body-sm text-primary font-bold flex items-center gap-1 min-w-0" title={c.regionLabel}>
              <span aria-hidden="true" className="material-symbols-outlined text-[16px] shrink-0">
                pin_drop
              </span>
              <span className="truncate">{c.regionLabel}</span>
            </span>
            {REVIEWS_VERIFIED ? (
              <span className="flex items-center gap-1 shrink-0">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-[16px] text-tertiary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="font-label-md text-label-md font-bold text-on-surface">{c.rating.toLocaleString("fr-FR")}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">({c.reviews} avis)</span>
              </span>
            ) : (
              <span
                className="shrink-0 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-bold"
                title="Pas encore d'avis publiés pour ce circuit"
              >
                Nouveau
              </span>
            )}
          </div>
          <h4 className="font-headline-sm text-headline-sm text-on-surface font-extrabold leading-tight decoration-2 underline-offset-4 group-hover:underline">
            {c.title}
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant">
            <span className="sr-only">Étapes : </span>
            {c.places.join(" · ")}
          </p>
          <p className={`flex items-start gap-1.5 font-body-sm text-body-sm font-semibold ${season.tone}`}>
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              {season.icon}
            </span>
            {season.text}
          </p>
        </div>
        <div className="pt-space-sm border-t border-surface-container-high flex flex-col gap-2">
          {budget !== null && (
            <p
              className={`self-start px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold flex items-center gap-1 ${
                overBudget > 0 ? "bg-amber-100 text-amber-900" : "bg-secondary-container text-on-secondary-container"
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                {overBudget > 0 ? "savings" : "check_circle"}
              </span>
              {overBudget > 0 ? `Dépasse votre budget de ${money.eur(overBudget)}` : "Dans votre budget"}
            </p>
          )}
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-[13rem] flex-1">
              <p className="whitespace-nowrap">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Dès </span>
                <span className="font-headline-sm text-headline-sm font-bold text-primary">{money.eur(price.total)}</span>
                <span className="font-body-md text-body-md text-on-surface-variant"> au total</span>
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant leading-snug">≈ {money.mga(price.total)}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                {`${travelersLabel(filters.adults, filters.kids)} · ${money.eur(price.adult)} / adulte${
                  filters.kids ? `, ${money.eur(price.child)} / enfant` : ""
                }`}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface font-semibold leading-snug mt-1">
                {c.nights} nuits, {c.includes}
              </p>
            </div>
            <Link
              aria-label={`Voir le circuit : ${c.title}`}
              className="h-10 px-4 shrink-0 rounded-full bg-primary group-hover:bg-on-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center gap-1 transition-all focus-visible:outline-none after:absolute after:inset-0 after:content-['']"
              href={c.href}
            >
              <span>Voir le circuit</span>
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

const mapPosition = (id: string) => {
  const p = MAP_POSITIONS[id];
  if (!p) return null;
  return {
    left: `${((p.x - MAP_VIEWBOX.x) / MAP_VIEWBOX.width) * 100}%`,
    top: `${((p.y - MAP_VIEWBOX.y) / MAP_VIEWBOX.height) * 100}%`,
  };
};

/** Vue carte : une étiquette de prix par circuit filtré ; la liste à côté reste l'accès principal au clavier et aux lecteurs d'écran. */
function CircuitMap({ circuits }: { circuits: Circuit[] }) {
  const money = useMoney();
  const { filters } = useCatalog();
  const total = (c: Circuit) => money.eur(groupPrice(c, filters.adults, filters.kids).total);
  const [active, setActive] = useState<string | null>(null);
  const { x, y, width, height } = MAP_VIEWBOX;

  return (
    <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-space-lg">
      <div className="relative w-full max-w-[520px] mx-auto aspect-[620/680] rounded-lg bg-secondary-fixed/30">
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full" viewBox={`${x} ${y} ${width} ${height}`}>
          <text className="fill-on-surface-variant/60 italic" fontSize="16" x="56" y="250">
            Canal du Mozambique
          </text>
          <text className="fill-on-surface-variant/60 italic" fontSize="16" x="540" y="460">
            Océan Indien
          </text>
          <path className="fill-surface-container-lowest stroke-outline-variant" d={ISLAND} strokeLinejoin="round" strokeWidth="2" />
          <ellipse className="fill-surface-container-lowest stroke-outline-variant" cx="406" cy="70" rx="9" ry="6" strokeWidth="2" />
          <ellipse className="fill-surface-container-lowest stroke-outline-variant" cx="503" cy="232" rx="4" ry="15" strokeWidth="2" />
        </svg>
        {circuits.map((c) => {
          const style = mapPosition(c.id);
          if (!style) return null;
          const on = active === c.id;
          const tone = on ? "bg-primary text-on-primary" : "bg-surface-container-lowest text-on-surface";
          return (
            <Link
              key={c.id}
              aria-hidden="true"
              className={`absolute -translate-x-1/2 -translate-y-full flex flex-col items-center transition-transform ${on ? "z-20 scale-110" : "z-10 hover:z-20"}`}
              href={c.href}
              onBlur={() => setActive(null)}
              onFocus={() => setActive(c.id)}
              onMouseEnter={() => setActive(c.id)}
              onMouseLeave={() => setActive(null)}
              style={style}
              tabIndex={-1}
              title={c.title}
            >
              <span className={`px-2.5 py-1 rounded-full shadow-md font-label-md text-label-md font-bold whitespace-nowrap ${tone}`}>
                {total(c)}
              </span>
              <span className={`w-2.5 h-2.5 rotate-45 -mt-1.5 shadow-md ${tone}`}></span>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-space-sm min-w-0">
        <p className="font-body-md text-body-md text-on-surface-variant">
          {`Prix total pour ${travelersLabel(filters.adults, filters.kids)}. Survolez un circuit pour le repérer sur la carte.`}
        </p>
        <ol className="flex flex-col gap-2 xl:max-h-[520px] xl:overflow-y-auto pr-1">
          {circuits.map((c) => (
            <li key={c.id}>
              <Link
                className={`flex items-center justify-between gap-3 p-3 rounded-lg transition-colors ${
                  active === c.id ? "bg-primary/10" : "bg-surface-container-low hover:bg-surface-container"
                }`}
                href={c.href}
                onBlur={() => setActive(null)}
                onFocus={() => setActive(c.id)}
                onMouseEnter={() => setActive(c.id)}
                onMouseLeave={() => setActive(null)}
              >
                <span className="min-w-0">
                  <span className="block font-label-lg text-label-lg text-on-surface font-bold truncate">{c.title}</span>
                  <span className="block font-body-sm text-body-sm text-on-surface-variant">
                    {c.regionLabel} · {c.days} jours
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-label-lg text-label-lg text-primary font-bold">{total(c)}</span>
                  <span className="block font-body-sm text-body-sm text-primary font-semibold">Voir le circuit →</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Squelettes de cartes : même gabarit que `CircuitCard`, pour que la page ne saute pas à l'arrivée des résultats. */
export function CatalogSkeleton({ count = 4, wide = false }: { count?: number; wide?: boolean }) {
  return (
    <div
      aria-busy="true"
      aria-label="Chargement des circuits"
      className={`grid gap-gutter-desktop ${wide ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm flex motion-safe:animate-pulse ${wide ? "flex-col md:flex-row" : "flex-col"}`}
        >
          <div className={`bg-surface-container-high ${wide ? "h-56 md:h-auto md:w-1/2 md:min-h-[16rem]" : "h-56"}`}></div>
          <div className="p-space-lg flex flex-col gap-3 flex-1">
            <div className="h-3 w-1/3 rounded-full bg-surface-container-high"></div>
            <div className="h-5 w-4/5 rounded-full bg-surface-container-high"></div>
            <div className="h-3 w-3/5 rounded-full bg-surface-container"></div>
            <div className="h-3 w-2/5 rounded-full bg-surface-container"></div>
            <div className="mt-auto pt-space-sm border-t border-surface-container-high flex items-end justify-between">
              <div className="flex flex-col gap-2 w-1/3">
                <div className="h-5 rounded-full bg-surface-container-high"></div>
                <div className="h-3 rounded-full bg-surface-container"></div>
              </div>
              <div className="h-10 w-32 rounded-full bg-surface-container-high"></div>
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">Chargement des circuits…</span>
    </div>
  );
}

function OfflineNotice() {
  return (
    <div
      className="bg-tertiary-fixed/60 text-on-tertiary-fixed-variant p-space-md rounded-lg flex flex-col sm:flex-row sm:items-center gap-space-sm"
      role="status"
    >
      <span aria-hidden="true" className="material-symbols-outlined text-[24px]">
        wifi_off
      </span>
      <p className="font-body-md text-body-md flex-1">
        <strong className="font-bold">Connexion perdue.</strong> Les circuits restent consultables et filtrables, mais les photos, les
        fiches détaillées et la réservation attendent le retour du réseau.
      </p>
      <button
        className="self-start sm:self-auto h-10 px-5 rounded-full bg-on-tertiary-fixed-variant text-on-tertiary font-label-md text-label-md font-bold"
        onClick={() => window.location.reload()}
        type="button"
      >
        Réessayer
      </button>
    </div>
  );
}

/** Aucun résultat : propose les filtres dont le retrait rend le plus de circuits, avec le nombre obtenu. */
function NoResults({ chips }: { chips: Chip[] }) {
  const { update, clearFilters, countWith } = useCatalog();
  const suggestions = chips
    .map((chip) => ({ chip, count: countWith(chip.clear) }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <div className="bg-surface-container-lowest p-space-xl rounded-lg shadow-sm flex flex-col items-center text-center gap-space-md">
      <span aria-hidden="true" className="material-symbols-outlined text-[48px] text-outline">
        travel_explore
      </span>
      <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">Aucun circuit ne réunit tous ces critères</h4>
      {suggestions.length > 0 ? (
        <>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            Assouplissez les filtres : chaque suggestion indique combien de circuits elle fait réapparaître.
          </p>
          <ul aria-label="Assouplir les filtres" className="flex flex-col sm:flex-row flex-wrap justify-center gap-space-sm">
            {suggestions.map(({ chip, count }) => (
              <li key={chip.id}>
                <button
                  className="h-11 pl-4 pr-3 rounded-full border border-primary text-primary font-label-md text-label-md font-semibold flex items-center gap-2 hover:bg-primary/10 transition-colors"
                  onClick={() => update(chip.clear)}
                  type="button"
                >
                  Retirer « {chip.label} »
                  <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold">
                    {`${count} circuit${count > 1 ? "s" : ""}`}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Aucun filtre ne suffit à lui seul : repartez de tout le catalogue ou composez un voyage sur-mesure.
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-space-sm pt-space-xs">
        <button
          className="h-11 px-6 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold"
          onClick={clearFilters}
          type="button"
        >
          Tout effacer
        </button>
        <Link
          className="h-11 px-6 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md inline-flex items-center"
          href="/reservation/dates"
        >
          Composer un voyage sur-mesure
        </Link>
      </div>
    </div>
  );
}

/** Interrupteur de filtre : désactivé avec une explication tant que la donnée nécessaire manque. */
function Switch({
  checked,
  label,
  detail,
  disabledHint,
  onChange,
}: {
  checked: boolean;
  label: string;
  detail: string;
  disabledHint?: string;
  onChange: (on: boolean) => void;
}) {
  return (
    <label
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low ${
        disabledHint ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-surface-container"
      }`}
      title={disabledHint}
    >
      <input
        checked={checked}
        className="peer sr-only"
        disabled={Boolean(disabledHint)}
        onChange={(e) => onChange(e.target.checked)}
        role="switch"
        type="checkbox"
      />
      <span
        aria-hidden="true"
        className="relative w-9 h-5 shrink-0 rounded-full bg-outline-variant transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:bg-surface-container-lowest after:shadow after:transition-transform peer-checked:after:translate-x-4"
      ></span>
      <span className="font-label-md text-label-md text-on-surface font-semibold">
        {label}
        <span className="font-normal text-on-surface-variant">{detail}</span>
      </span>
    </label>
  );
}

export function CatalogResults() {
  const {
    filters,
    update,
    clearFilters,
    results,
    resultsRef,
    sort,
    setSort,
    view,
    setView,
    shown,
    showMore,
    ready,
    online,
    liteData,
    countFor,
  } = useCatalog();
  const money = useMoney();

  const visible = results.slice(0, shown);
  const chips = activeChips(filters, money.eur);
  const remaining = results.length - visible.length;
  const customAfter = customTripIndex(visible.length, view);
  const budget = parseBudget(filters.budget);
  const withinBudget = budget ? countFor("budget", (c) => fitsBudget(c, filters)) : 0;
  const inSeasonCount = filters.departure ? countFor("season", (c) => seasonFit(c, filters.departure) === true) : 0;
  const month = filters.departure
    ? new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(new Date(`${filters.departure}T00:00:00`))
    : "";

  const viewButton = (id: View, icon: string, label: string) => (
    <button
      aria-pressed={view === id}
      className={`h-8 px-3 rounded-full flex items-center justify-center gap-1.5 font-label-md text-label-md transition-colors ${
        view === id ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface"
      }`}
      onClick={() => setView(id)}
      type="button"
    >
      <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
        {icon}
      </span>
      {label}
    </button>
  );

  return (
    <div ref={resultsRef} className="flex flex-col gap-space-lg" id="resultats">
      <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
          <h3 aria-live="polite" className="font-headline-sm text-headline-sm text-on-surface font-bold focus:outline-none" tabIndex={-1}>
            {!ready
              ? "Recherche des circuits…"
              : results.length === 0
                ? "Aucun circuit ne correspond"
                : results.length === CIRCUITS.length
                  ? `Les ${CIRCUITS.length} circuits`
                  : `${results.length} circuit${results.length > 1 ? "s" : ""} sur ${CIRCUITS.length}`}
          </h3>
          <div className="flex flex-wrap items-center gap-space-sm">
            {budget !== null && (
              <Switch
                checked={filters.withinBudget}
                detail={` (${withinBudget})`}
                label={`Dans mon budget de ${money.eur(budget)}`}
                onChange={(on) => update({ withinBudget: on })}
              />
            )}
            <Switch
              checked={filters.inSeason}
              detail={filters.departure ? ` (${inSeasonCount} en ${month})` : " (choisir une date)"}
              disabledHint={filters.departure ? undefined : "Choisissez d'abord une date de départ"}
              label="Compatibles avec mes dates"
              onChange={(on) => update({ inSeason: on })}
            />
            <div className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container px-3 py-1.5 rounded-full transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary">
              <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="sort-select">
                Trier par :
              </label>
              <select
                className="bg-transparent border-0 outline-none font-label-md text-label-md text-on-surface font-bold cursor-pointer"
                id="sort-select"
                onChange={(e) => setSort(e.target.value as SortId)}
                value={sort}
              >
                {SORTS.map((s) => {
                  const pending = s.id === "note" && !REVIEWS_VERIFIED;
                  return (
                    <option key={s.id} disabled={pending} value={s.id}>
                      {pending ? `${s.label} (avis en attente)` : s.label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div aria-label="Mode d'affichage" className="flex items-center p-1 bg-surface-container-low rounded-full" role="group">
              {viewButton("grid", "grid_view", "Grille")}
              {viewButton("list", "view_list", "Liste")}
              {viewButton("map", "map", "Carte")}
            </div>
          </div>
        </div>

        {ready && chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-space-sm border-t border-surface-container-high">
            <span className="font-label-md text-label-md text-on-surface-variant mr-1">Filtres actifs :</span>
            <ul aria-label="Filtres actifs" className="contents">
              {chips.map((chip) => (
                <li key={chip.id}>
                  <button
                    aria-label={`Retirer le filtre : ${chip.label}`}
                    className="h-8 pl-3 pr-2 rounded-full bg-primary/10 text-primary font-label-md text-label-md font-semibold flex items-center gap-1 hover:bg-primary/20 transition-colors"
                    onClick={() => update(chip.clear)}
                    type="button"
                  >
                    {chip.label}
                    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                      close
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="ml-1 font-label-md text-label-md text-primary font-bold underline underline-offset-4"
              onClick={clearFilters}
              type="button"
            >
              Tout effacer
            </button>
          </div>
        )}
      </div>

      {!online && <OfflineNotice />}
      {online && liteData && ready && results.length > 0 && view !== "map" && (
        <p className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant" role="status">
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
            network_check
          </span>
          Connexion lente : photos allégées, chargées au fil du défilement.
        </p>
      )}

      {!ready ? (
        <CatalogSkeleton wide={view === "list"} />
      ) : results.length === 0 ? (
        <NoResults chips={chips} />
      ) : view === "map" ? (
        <CircuitMap circuits={results} />
      ) : (
        <div className={`grid gap-gutter-desktop ${view === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          {visible.map((c, i) => {
            const featured = view === "grid" && i === 0 && visible.length % 2 === 1;
            return (
              <Fragment key={c.id}>
                <CircuitCard circuit={c} className={featured ? "col-span-full" : ""} priority={i < 2} wide={view === "list" || featured} />
                {i === customAfter && <CustomTripCard />}
              </Fragment>
            );
          })}
        </div>
      )}

      {ready && view !== "map" && results.length > PAGE_SIZE && (
        <div className="flex flex-col items-center gap-space-sm">
          <p aria-live="polite" className="font-body-md text-body-md text-on-surface-variant">
            {visible.length} circuits affichés sur {results.length}
          </p>
          {remaining > 0 && (
            <button
              className="h-11 px-6 rounded-full border border-primary text-primary font-label-md text-label-md font-bold hover:bg-primary/10 transition-colors"
              onClick={showMore}
              type="button"
            >
              {`Voir ${Math.min(remaining, PAGE_SIZE)} circuit${Math.min(remaining, PAGE_SIZE) > 1 ? "s" : ""} de plus`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
