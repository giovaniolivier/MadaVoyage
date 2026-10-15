"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { SEASON_RULES, seasonOf, zoneFit, type ZoneFit } from "@/lib/season-rules";
import { CIRCUITS, groupPrice, REGIONS, type Circuit, type RegionId } from "@/components/circuits/catalog-data";
import { useMoney } from "@/components/currency/useCurrency";
import { FavoriteButton } from "@/components/explore/Explore";
import { destinationFromParam, stayMonths, stayStart, travelersCount, useBooking, type DestinationId } from "./booking-store";
import { useDatesText } from "./dates-i18n";
import { numberLocale, ratingText, useDestinationText, type DestinationText, type Sort } from "./destination-i18n";
import { DESTINATIONS, exchangeRate, FLIGHT_SOURCE, zoneEstimate } from "./pricing";
import { AirportDot, CircuitDot, DestinationMap, ZoneDot } from "./DestinationMap";
import { ZONE_CARDS as CARDS, type Theme, type ZoneCard as Card } from "./destination-cards";
import { ChooseAndContinue, ClosedNotice } from "./DestinationDetail";
import { OfflineNotice, useOnline, ZonePhoto } from "./zone-states";

type Region = "all" | RegionId;

const REGION_FALLBACK: Partial<Record<Region, string>> = {
  "hautes-terres": "/circuits/rn7",
  ouest: "/circuits?q=baobabs",
};

const THEMES: { id: Theme; icon: string }[] = [
  { id: "lagon", icon: "scuba_diving" },
  { id: "trek", icon: "hiking" },
  { id: "culture", icon: "groups" },
  { id: "pirogue", icon: "sailing" },
];

const SORTS: Sort[] = ["recommended", "price-asc", "price-desc", "rating", "carbon"];

const REGION_PARAMS: Record<string, Region> = {
  menabe: "ouest",
  tsiribihina: "ouest",
  baobabs: "ouest",
  isalo: "hautes-terres",
  andringitra: "hautes-terres",
  "grande-traversee": "hautes-terres",
  andasibe: "est",
  pangalanes: "est",
};

const THEME_PARAMS: Record<string, Theme> = { lagon: "lagon", faune: "trek", aventure: "trek", immersion: "culture" };

const FIT_STYLE: Record<ZoneFit["level"] | "off", { icon: string; cls: string }> = {
  ideal: { icon: "event_available", cls: "bg-secondary/10 text-secondary" },
  possible: { icon: "info", cls: "bg-surface-container text-on-surface" },
  rain: { icon: "thunderstorm", cls: "bg-error-container text-on-error-container" },
  off: { icon: "event_busy", cls: "bg-tertiary-fixed/50 text-on-surface" },
  closed: { icon: "block", cls: "bg-error text-on-error" },
};

const fitScore = (fit: ZoneFit | null) => (fit ? { ideal: 0, possible: 1, rain: 2, closed: 10 }[fit.level] + fit.off.length : 0);

const seasonIcon = (month: number) => {
  const rule = seasonOf(month);
  return rule.tone === "warning" ? "thunderstorm" : rule.dry ? "wb_sunny" : "rainy";
};

const linkClass = "font-semibold text-primary underline underline-offset-2 hover:decoration-2";

const CHOOSE_CLASS =
  "px-space-lg py-2.5 rounded-full bg-tertiary hover:bg-on-tertiary-fixed-variant text-on-tertiary font-label-lg text-label-lg shadow-sm transition-colors flex items-center gap-1.5";

/** Régions de l'Explorer sans zone réservable à cette étape : elles ne se visitent qu'en circuit. */
const circuitRegions = REGIONS.filter((r) => r.id !== "all" && !CARDS.some((c) => c.region === r.id)).map((r) => r.id);

const matches = (c: Card, r: Region, t: Theme | null) => (r === "all" || c.region === r) && (!t || c.themes.includes(t));

/** Libellé du badge de saison d'une zone, dans la langue affichée. */
function fitLabel(tx: DestinationText, seasons: { label: string }[], fit: ZoneFit, month: number) {
  if (fit.level === "closed") return tx.fitClosed;
  if (fit.level === "rain") return tx.fitRain(seasons[SEASON_RULES.indexOf(seasonOf(month))].label);
  return fit.level === "ideal" ? tx.fitIdeal : tx.fitPossible;
}

function chip(active: boolean) {
  return `px-space-md py-1.5 rounded-full border font-label-md text-label-md transition-colors flex items-center gap-1 shrink-0 ${
    active
      ? "border-transparent bg-primary text-on-primary font-bold shadow-sm"
      : "border-transparent bg-surface-container text-on-surface hover:bg-surface-container-high aria-disabled:bg-transparent aria-disabled:border-dashed aria-disabled:border-outline aria-disabled:text-on-surface-variant aria-disabled:opacity-70 aria-disabled:cursor-not-allowed"
  }`;
}

/** Filtre sans résultat : il reste focalisable et affiche sa raison en infobulle au survol et au focus. */
function FilterChip({
  active,
  empty,
  reason,
  onSelect,
  children,
}: {
  active: boolean;
  empty: boolean;
  reason: string;
  onSelect: () => void;
  children: ReactNode;
}) {
  const [tip, setTip] = useState<{ left: number; top: number } | null>(null);
  const ref = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (!tip) return;
    const close = () => setTip(null);
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("scroll", close, true);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [tip]);
  const show = () => {
    if (!empty || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const half = Math.min(128, window.innerWidth / 2 - 8);
    setTip({ left: Math.min(Math.max(r.left + r.width / 2, half + 8), window.innerWidth - half - 8), top: r.bottom + 6 });
  };
  return (
    <>
      <button
        aria-describedby={empty ? id : undefined}
        aria-disabled={empty || undefined}
        aria-pressed={active}
        className={chip(active)}
        onBlur={() => setTip(null)}
        onClick={() => !empty && onSelect()}
        onFocus={show}
        onMouseEnter={show}
        onMouseLeave={() => setTip(null)}
        ref={ref}
        type="button"
      >
        {children}
      </button>
      {empty && (
        <span className="sr-only" id={id}>
          {reason}
        </span>
      )}
      {tip && (
        <span
          aria-hidden="true"
          className="fixed z-50 -translate-x-1/2 w-max max-w-64 rounded px-2.5 py-1.5 bg-on-surface text-surface font-body-sm text-body-sm shadow-lg pointer-events-none"
          style={tip}
        >
          {reason}
        </span>
      )}
    </>
  );
}

const VIEWS: { id: "list" | "map"; icon: string }[] = [
  { id: "list", icon: "view_agenda" },
  { id: "map", icon: "map" },
];

/** Barre fixe sous `lg` : le corps de page est rembourré de sa hauteur pour ne rien masquer en bas. */
function MobileBar({ children }: { children: React.ReactNode }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const sync = () => {
      document.body.style.paddingBottom = `${bar.offsetHeight}px`;
    };
    const observer = new ResizeObserver(sync);
    observer.observe(bar);
    window.addEventListener("resize", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
      document.body.style.paddingBottom = "";
    };
  }, []);

  return (
    <div
      className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-surface-container-lowest border-t border-outline-variant shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-space-md py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-space-md"
      ref={barRef}
    >
      {children}
    </div>
  );
}

/** Contenu de la page de l'étape 2 dans la langue choisie : titre, fil des étapes et retour aux dates. */
export function DestinationMain({ children }: { children: React.ReactNode }) {
  const tx = useDestinationText();
  const dt = useDatesText();
  const [booking] = useBooking();
  return (
    <main className="w-full pt-20 bg-background" lang={dt.html}>
      <h1 className="sr-only">{tx.pageTitle}</h1>
      <div className="max-w-[1280px] mx-auto px-gutter-desktop min-h-[calc(100vh-80px)]">
        <div className="flex flex-col w-full">
          <nav aria-label={dt.stepsLabel} className="py-space-md mt-space-md bg-surface-container-low rounded-lg px-space-lg shadow-sm">
            <div className="relative max-w-4xl mx-auto">
              <div
                aria-hidden="true"
                className="absolute top-[18px] left-[10%] right-[10%] h-1 bg-surface-container-highest rounded-full"
              ></div>
              <div aria-hidden="true" className="absolute top-[18px] left-[10%] w-[20%] h-1 bg-primary rounded-full"></div>
              <ol className="relative grid grid-cols-5">
                <li className="relative z-10 min-w-0 px-1 flex flex-col items-center text-center">
                  <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                      check
                    </span>
                  </div>
                  <Link
                    className="group mt-2 flex flex-col items-center font-label-md text-label-md font-bold text-on-surface after:absolute after:inset-0"
                    href="/reservation/dates"
                    title={`${dt.range(booking)} · ${dt.travelers(booking)}`}
                  >
                    <span className="sr-only sm:not-sr-only">
                      1. {dt.steps[0]} <span className="sr-only">{tx.stepDone}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="hidden sm:block font-body-sm text-body-sm text-on-surface-variant font-medium lg:whitespace-nowrap"
                    >
                      {dt.compactRange(booking)} · {dt.travelersShort(travelersCount(booking))}
                    </span>
                    <span className="sr-only">
                      {dt.range(booking)} · {dt.travelers(booking)}
                    </span>
                    <span className="font-label-sm text-label-sm text-primary underline underline-offset-2 group-hover:decoration-2">
                      {tx.stepEdit}
                    </span>
                  </Link>
                </li>

                <li aria-current="step" className="relative z-10 min-w-0 px-1 flex flex-col items-center text-center">
                  <div className="w-9 h-9 rounded-full bg-surface-container-lowest ring-4 ring-primary flex items-center justify-center shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  </div>
                  <span className="mt-2 font-label-md text-label-md font-bold text-primary">2. {dt.steps[1]}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">{tx.stepCurrent}</span>
                </li>

                {tx.stepSubs.map((sub, i) => {
                  const n = i + 3;
                  return (
                    <li className="relative z-10 min-w-0 px-1 flex flex-col items-center text-center" key={n}>
                      <div
                        aria-hidden="true"
                        className="w-9 h-9 rounded-full bg-surface-container-lowest ring-2 ring-outline text-on-surface flex items-center justify-center font-label-md text-label-md"
                      >
                        {n}
                      </div>
                      <span className="mt-2 sr-only sm:not-sr-only font-label-md text-label-md font-bold text-on-surface">
                        {n}. {dt.steps[n - 1]} <span className="sr-only">{tx.stepUpcoming}</span>
                      </span>
                      <span className="hidden sm:block font-body-sm text-body-sm text-on-surface-variant font-medium">{sub}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </nav>

          <Link
            className="self-start my-space-md flex items-center gap-1 font-label-md text-label-md font-semibold text-primary underline underline-offset-2 hover:decoration-2"
            href="/reservation/dates"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            {tx.backToDates}
          </Link>

          {children}
        </div>
      </div>
    </main>
  );
}

/** Bouton « i » qui ouvre un encadré sous le titre ; se ferme avec Échap ou un clic à l'extérieur. */
function InfoTip({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!button.current?.contains(target) && !panel.current?.contains(target)) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <>
      <button
        aria-controls={id}
        aria-expanded={open}
        className="w-9 h-9 shrink-0 rounded-full inline-flex items-center justify-center text-primary hover:bg-primary/10 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        onClick={() => setOpen((o) => !o)}
        ref={button}
        type="button"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
          info
        </span>
        <span className="sr-only">{label}</span>
      </button>
      <div
        className={
          open
            ? "absolute left-0 right-0 top-full mt-1 z-40 p-space-md rounded-lg bg-surface-container-lowest shadow-xl ring-1 ring-outline-variant flex flex-col gap-space-sm font-body-md text-body-md font-normal text-on-surface"
            : "hidden"
        }
        id={id}
        ref={panel}
      >
        {children}
      </div>
    </>
  );
}

/** Taux du jour utilisé pour les montants en Ariary de cette page. */
function RateNote() {
  const tx = useDestinationText();
  const dt = useDatesText();
  const rate = exchangeRate();
  const [year, month, day] = new Intl.DateTimeFormat("en-CA", { timeZone: "Indian/Antananarivo" })
    .format(new Date(rate.date))
    .split("-")
    .map(Number);
  const value = new Intl.NumberFormat(numberLocale(dt.html)).format(rate.mgaPerEur).replace(/[\u202f\u00a0]/g, "\u00a0");
  return <>{tx.rateNote(value, `${day}\u00a0${tx.months[month - 1]}\u00a0${year}`)}</>;
}

/** Un circuit choisi dans l'Explorer hors des destinations sur mesure (Isalo, Ouest…) remplace le choix de destination. */
export function DestinationExplorer() {
  const [booking] = useBooking();
  const circuit = booking.circuit && !destinationFromParam(booking.circuit) ? CIRCUITS.find((c) => c.id === booking.circuit) : undefined;
  return circuit ? <CircuitChoice circuit={circuit} /> : <DestinationList />;
}

function CircuitChoice({ circuit }: { circuit: Circuit }) {
  const [booking, update] = useBooking();
  const { eur, mga } = useMoney();
  const tx = useDestinationText();
  const dt = useDatesText();
  const price = groupPrice(circuit, booking.adults, booking.children);
  const ages = booking.childAges.slice(0, booking.children).filter((a): a is number => a !== null);
  const youngest = ages.length ? Math.min(...ages) : null;
  return (
    <section aria-labelledby="circuit-choice" className="flex flex-col gap-space-md">
      <h2 className="font-headline-md text-headline-md font-bold text-on-surface" id="circuit-choice">
        {tx.circuitTitle}
      </h2>
      <p className="font-body-md text-body-md text-on-surface-variant">
        {tx.circuitIntro} <RateNote />
      </p>
      <article className="grid md:grid-cols-2 bg-surface-container-lowest rounded-lg shadow-md overflow-hidden" lang="fr">
        <ZonePhoto alt={circuit.image.alt} className="w-full h-56 md:h-full object-cover" src={circuit.image.src} />
        <div className="p-space-md flex flex-col gap-space-sm">
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">{circuit.regionLabel}</p>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{circuit.title}</h3>
          <p className="flex items-center gap-1 font-body-md text-body-md text-on-surface" lang={dt.html}>
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-tertiary text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <strong>{ratingText(circuit.rating, dt.html)}</strong> {tx.reviews(circuit.reviews)} ·{" "}
            {tx.circuitLength(circuit.days, circuit.nights)}
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant">{circuit.places.join(" · ")}</p>
          <p className="font-body-md text-body-md text-on-surface">
            <span lang={dt.html}>{tx.circuitIncludes}</span> {circuit.includes}.
          </p>
          <div lang={dt.html}>
            <p className="font-body-md text-body-md text-on-surface">
              {tx.priceFrom} <strong className="font-label-lg text-label-lg">{eur(price.total)}</strong>{" "}
              <span className="text-on-surface-variant">({mga(price.total)})</span> {tx.circuitPrice(dt.travelers(booking))}
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {tx.circuitPerPerson(eur(price.adult), booking.children ? eur(price.child) : null)}
            </p>
          </div>
          {youngest !== null && youngest < circuit.minAge && (
            <p className="p-3 rounded bg-tertiary-fixed/60 text-on-tertiary-fixed-variant font-body-md text-body-md" lang={dt.html}>
              {tx.circuitMinAge(circuit.minAge, youngest)}
            </p>
          )}
          <div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-space-sm" lang={dt.html}>
            <Link
              className="px-space-lg py-3 rounded-full bg-tertiary hover:bg-on-tertiary-fixed-variant text-on-tertiary font-label-lg text-label-lg flex items-center justify-center gap-2"
              href="/reservation/budget"
            >
              {tx.circuitContinue}
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                arrow_forward
              </span>
            </Link>
            <Link className={linkClass} href="/circuits">
              {tx.circuitOther}
            </Link>
          </div>
        </div>
      </article>
      <button className={`self-start ${linkClass}`} onClick={() => update({ circuit: null })} type="button">
        {tx.circuitSwitch}
      </button>
    </section>
  );
}

function DestinationList() {
  const [booking] = useBooking();
  const { eur, mga } = useMoney();
  const tx = useDestinationText();
  const dt = useDatesText();
  const [region, setRegion] = useState<Region>("all");
  const [theme, setTheme] = useState<Theme | null>(null);
  const [sort, setSort] = useState<Sort>("recommended");
  const [hovered, setHovered] = useState<DestinationId | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const viewsRef = useRef<HTMLDivElement>(null);
  const switchView = (view: "list" | "map") => {
    setMobileView(view);
    const grid = viewsRef.current;
    if (grid && grid.getBoundingClientRect().top < 144) grid.scrollIntoView({ block: "start" });
  };

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const key = p.get("destination") ?? p.get("circuit") ?? "";
    if (REGION_PARAMS[key]) setRegion(REGION_PARAMS[key]);
    const t = THEME_PARAMS[p.get("theme") ?? ""];
    if (t) setTheme(t);
  }, []);

  const start = stayStart(booking);
  const month = start ? Number(start.slice(5, 7)) - 1 : null;
  const rule = month === null ? null : seasonOf(month);
  const months = stayMonths(booking);
  const fitOf = (id: DestinationId) => (month === null ? null : zoneFit(id, month, months));
  const chosenId = booking.destinationChosen ? booking.destination : null;
  const online = useOnline();

  const cards = useMemo(() => {
    const list = CARDS.filter((c) => matches(c, region, theme));
    const price = (c: Card) => zoneEstimate(c.id, booking).total;
    const stay = stayMonths(booking);
    const fit = (c: Card) => fitScore(month === null ? null : zoneFit(c.id, month, stay));
    const rating = (a: Card, b: Card) => b.rating - a.rating || b.reviews - a.reviews;
    const by: Record<Sort, (a: Card, b: Card) => number> = {
      recommended: (a, b) => fit(a) - fit(b) || rating(a, b) || price(a) - price(b),
      "price-asc": (a, b) => price(a) - price(b),
      "price-desc": (a, b) => price(b) - price(a),
      rating,
      carbon: (a, b) => a.carbon - b.carbon,
    };
    const isChosen = (c: Card) => (chosenId === c.id ? 0 : 1);
    return list.sort((a, b) => isChosen(a) - isChosen(b) || by[sort](a, b));
  }, [region, theme, sort, month, chosenId, booking]);
  const countFor = (r: Region, t: Theme | null) => CARDS.filter((c) => matches(c, r, t)).length;

  const selected = chosenId ? CARDS.find((c) => c.id === chosenId)! : null;
  const selectedInfo = selected ? tx.zones[selected.id] : null;
  const selectedClosed = selected ? fitOf(selected.id)?.closed : undefined;
  const unavailable = CARDS.filter((c) => fitOf(c.id)?.level === "closed").map((c) => c.id);
  const showCard = (id: DestinationId) => {
    const el = document.getElementById(`zone-${id}`);
    if (!el || !el.offsetParent) {
      if (!el) resetFilters();
      setMobileView("list");
      window.setTimeout(() => showCard(id), 50);
      return;
    }
    el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    el.focus({ preventScroll: true });
  };
  const fallbackHref = REGION_FALLBACK[region];
  const fallback = region === "all" ? undefined : tx.fallback[region];
  const season = rule ? dt.seasons[SEASON_RULES.indexOf(rule)] : null;
  const filtered = region !== "all" || theme !== null;
  const resetFilters = () => {
    setRegion("all");
    setTheme(null);
  };

  return (
    <>
      {!online && (
        <div className="mb-space-lg">
          <OfflineNotice />
        </div>
      )}
      <section
        aria-label={tx.filtersLabel}
        className="mb-space-lg flex flex-col gap-space-sm bg-surface-container-lowest p-space-md rounded-lg shadow-sm"
      >
        <div className="flex items-center gap-space-xs overflow-x-auto pb-1 max-w-full" role="group" aria-label={tx.regionGroup}>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider pr-2 shrink-0">
            {tx.regionPrefix}
          </span>
          {REGIONS.map((r) => {
            const n = countFor(r.id, theme);
            return (
              <FilterChip
                active={region === r.id}
                empty={n === 0 && region !== r.id}
                key={r.id}
                onSelect={() => setRegion(r.id)}
                reason={circuitRegions.includes(r.id as RegionId) ? tx.emptyCircuitRegion : tx.emptyRegionTheme}
              >
                {tx.regions[r.id]}
                <span aria-hidden="true" className="tabular-nums">
                  ({n})
                </span>
                <span className="sr-only">, {tx.zonesLabel(n)}</span>
              </FilterChip>
            );
          })}
        </div>

        <div className="flex items-center gap-space-xs overflow-x-auto pb-1 max-w-full" role="group" aria-label={tx.themeGroup}>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider pr-2 shrink-0">
            {tx.themePrefix}
          </span>
          {THEMES.map((t) => {
            const n = countFor(region, t.id);
            return (
              <FilterChip
                active={theme === t.id}
                empty={n === 0 && theme !== t.id}
                key={t.id}
                onSelect={() => setTheme((cur) => (cur === t.id ? null : t.id))}
                reason={tx.emptyTheme}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                  {t.icon}
                </span>
                {tx.themes[t.id]}
                <span aria-hidden="true" className="tabular-nums">
                  ({n})
                </span>
                <span className="sr-only">, {tx.zonesLabel(n)}</span>
              </FilterChip>
            );
          })}
        </div>

        <div className="flex items-center gap-x-space-sm gap-y-1 flex-wrap pt-1 border-t border-surface-container-high">
          <label
            className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider shrink-0"
            htmlFor="destination-sort"
          >
            {tx.sortLabel}
          </label>
          <select
            aria-describedby="destination-sort-hint"
            className="bg-surface-container-low text-on-surface font-label-md text-label-md rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
            id="destination-sort"
            onChange={(e) => setSort(e.target.value as Sort)}
            value={sort}
          >
            {SORTS.map((s) => (
              <option key={s} value={s}>
                {tx.sorts[s].label}
              </option>
            ))}
          </select>
          <p className="font-body-md text-body-md text-on-surface-variant" id="destination-sort-hint">
            {tx.sorts[sort].hint}
          </p>
        </div>
      </section>

      <div className="lg:hidden sticky top-20 z-30 mb-space-md flex justify-center">
        <div aria-label={tx.viewsLabel} className="inline-flex p-1 rounded-full bg-surface-container-lowest shadow-md" role="group">
          {VIEWS.map((v) => (
            <button
              aria-pressed={mobileView === v.id}
              className={`px-space-md py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 ${
                mobileView === v.id ? "bg-primary text-on-primary font-bold" : "text-on-surface hover:bg-surface-container"
              }`}
              key={v.id}
              onClick={() => switchView(v.id)}
              type="button"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                {v.icon}
              </span>
              {v.id === "list" ? tx.viewList : tx.viewMap}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start pb-space-xl scroll-mt-36" ref={viewsRef}>
        <div className={`lg:col-span-6 ${mobileView === "map" ? "hidden" : "flex"} lg:flex flex-col gap-space-lg`}>
          <div className="relative flex items-center justify-between gap-space-sm">
            <div>
              <div className="flex items-center gap-1">
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">{tx.recommendedTitle}</h2>
                <InfoTip label={tx.aboutResults}>
                  <p>
                    {tx.intro} <RateNote />
                  </p>
                  <p>
                    {tx.allZones(CARDS.length)}
                    {sort === "recommended" ? tx.byDates : ""}. {dt.joinList(circuitRegions.map((r) => tx.regions[r]))}{" "}
                    {tx.circuitOnly(circuitRegions.length)}{" "}
                    <Link className={linkClass} href="/circuits">
                      {tx.explorerLink}
                    </Link>
                    .
                  </p>
                </InfoTip>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant flex items-start gap-1.5 mt-1">
                {season && start && month !== null ? (
                  <>
                    <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[18px] mt-0.5">
                      {seasonIcon(month)}
                    </span>
                    <span>
                      <strong className="text-on-surface first-letter:uppercase inline-block">{dt.monthLabel(start.slice(0, 7))}</strong>
                      {tx.colon} {season.label.toLowerCase()}. {season.advice}
                    </span>
                  </>
                ) : (
                  tx.noDates
                )}
              </p>
            </div>
          </div>
          <p
            aria-live="polite"
            className={filtered ? "-mt-space-xs p-space-sm rounded bg-primary/5 font-body-md text-body-md text-on-surface" : "sr-only"}
          >
            {filtered && (
              <>
                <strong>{tx.filteredCount(cards.length, CARDS.length)}</strong> {tx.filteredMatch(cards.length)}{" "}
                <button className={linkClass} onClick={resetFilters} type="button">
                  {tx.showAll}
                </button>
              </>
            )}
          </p>

          {cards.length === 0 && (
            <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col items-start gap-space-sm">
              <span aria-hidden="true" className="material-symbols-outlined text-[32px] text-outline">
                travel_explore
              </span>
              <p className="font-headline-sm text-headline-sm text-on-surface">{tx.noResultsTitle}</p>
              <p className="font-body-md text-body-md text-on-surface-variant">{fallback?.text ?? tx.noResultsText}</p>
              <div className="flex flex-wrap gap-space-sm pt-1">
                {fallback && fallbackHref && (
                  <Link
                    className="px-space-md py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md"
                    href={fallbackHref}
                  >
                    {fallback.cta}
                  </Link>
                )}
                <button
                  className="px-space-md py-2 rounded-full bg-surface-container-high text-primary font-label-md text-label-md"
                  onClick={resetFilters}
                  type="button"
                >
                  {tx.resetFilters}
                </button>
              </div>
            </div>
          )}

          {cards.map((c) => {
            const active = c.id === chosenId;
            const info = DESTINATIONS[c.id];
            const zone = tx.zones[c.id];
            const fit = fitOf(c.id);
            const est = zoneEstimate(c.id, booking);
            const offLabels = new Set(fit?.off.map((a) => a.label));
            const closed = fit?.closed;
            const fitOff = fit && fit.level !== "rain" && !closed && fit.off.length > 0;
            const fitStyle = fit ? FIT_STYLE[fitOff ? "off" : fit.level] : null;
            const outsideRange = est.nights < c.nights[0] || est.nights > c.nights[1];
            return (
              <article
                aria-labelledby={`zone-${c.id}-title`}
                className={`bg-surface-container-lowest rounded-lg overflow-hidden relative transition-all duration-300 scroll-mt-36 lg:scroll-mt-28 focus:outline-none ${
                  active ? "shadow-md ring-2 ring-primary" : hovered === c.id ? "shadow-md ring-2 ring-secondary" : "shadow-sm"
                }`}
                id={`zone-${c.id}`}
                key={c.id}
                onBlur={() => setHovered(null)}
                onFocus={() => setHovered(c.id)}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                tabIndex={-1}
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <ZonePhoto alt={zone.alt} className={`w-full h-full object-cover ${closed ? "grayscale" : ""}`} src={c.img} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>
                  <FavoriteButton id={c.favoriteId} name={zone.name} />
                  <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                    <span className="inline-block px-2 py-0.5 rounded bg-surface-container-lowest text-on-surface font-label-sm text-label-sm uppercase tracking-wider mb-1.5">
                      {zone.badge}
                    </span>
                    <h3 className="font-headline-sm text-headline-sm font-bold leading-snug" id={`zone-${c.id}-title`}>
                      {zone.name}
                    </h3>
                    <p className="font-body-md text-body-md font-medium">{zone.places}</p>
                  </div>
                </div>
                <div className="p-space-md flex flex-col gap-space-sm">
                  {(active || (fit && fitStyle)) && (
                    <div className="flex flex-wrap items-center gap-2">
                      {active && (
                        <p className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold">
                          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                            check_circle
                          </span>
                          {tx.chosen}
                        </p>
                      )}
                      {fit && fitStyle && month !== null && (
                        <p
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-md text-label-md font-bold ${fitStyle.cls}`}
                        >
                          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                            {fitStyle.icon}
                          </span>
                          {fitOff ? tx.fitOff(tx.activities[fit.off[0].label].label) : fitLabel(tx, dt.seasons, fit, month)}
                        </p>
                      )}
                    </div>
                  )}
                  <p className="font-body-md text-body-md text-on-surface-variant">{zone.text}</p>
                  {fit?.level === "rain" && season && (
                    <p className="font-body-md text-body-md text-on-surface">{tx.rainNote(season.advice)}</p>
                  )}
                  <ul className="flex items-center gap-x-space-md gap-y-1 flex-wrap font-body-md text-body-md text-on-surface">
                    {c.highlights.map((h, i) => {
                      const off = h.seasonal && offLabels.has(h.seasonal);
                      return (
                        <li className={`flex items-center gap-1 ${off ? "text-on-surface-variant" : ""}`} key={h.label}>
                          <span
                            aria-hidden="true"
                            className={`material-symbols-outlined text-[16px] ${off ? "text-outline" : "text-secondary"}`}
                          >
                            {off ? "event_busy" : h.icon}
                          </span>
                          <span className={off ? "line-through" : ""}>{zone.highlights[i]}</span>
                          {off && <span className="sr-only"> {tx.offTag}</span>}
                        </li>
                      );
                    })}
                  </ul>
                  <ul className="p-3 bg-surface-container-low rounded flex flex-col gap-1 font-body-md text-body-md text-on-surface">
                    <li className="flex items-start gap-1.5">
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary">
                        date_range
                      </span>
                      <span>
                        {tx.advisedLength} <strong>{tx.nightsRange(c.nights)}</strong>
                        {outsideRange && <span className="text-on-surface-variant">{tx.yourStay(est.nights)}</span>}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary">
                        flight_takeoff
                      </span>
                      <span>
                        {tx.flightFrom} {tx.flightLine(zone.flight, zone.flightNote)}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary">
                        thermostat
                      </span>
                      <span>{zone.climate}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[18px] text-tertiary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span>
                        <strong>{tx.ratingLine(ratingText(c.rating, dt.html), c.reviews)}</strong>{" "}
                        <span className="text-on-surface-variant">({tx.reviewsSource})</span>
                      </span>
                    </li>
                  </ul>
                  <div className="pt-space-xs flex flex-col gap-space-sm border-t border-surface-container-high">
                    <p className="font-body-md text-body-md text-on-surface">
                      {tx.priceFrom} <strong className="font-label-lg text-label-lg">{eur(est.total)}</strong>{" "}
                      <span className="text-[14px] font-medium">({mga(est.total)})</span>
                      <span className="block">{tx.forNights(est.nights, dt.travelers(booking))}</span>
                      <span className="block text-on-surface-variant">
                        {tx.perPerson(eur(est.adult), booking.children ? eur(est.child) : null)}
                      </span>
                      <span className="block text-on-surface-variant">{tx.baseNights(est.nights - info.fromNights, info.fromNights)}</span>
                    </p>
                    <div className="flex items-center justify-between gap-space-sm flex-wrap">
                      <Link className={`${linkClass} flex items-center gap-1`} href={`/destinations/${c.id}`}>
                        {tx.seeDetail}
                        <span className="sr-only">{tx.seeDetailSr(zone.name)}</span>
                      </Link>
                      {!closed && (
                        <ChooseAndContinue className={CHOOSE_CLASS} id={c.id}>
                          {active ? tx.continueZone : tx.choose}
                          <span className="sr-only"> : {zone.name}</span>
                          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                            arrow_forward
                          </span>
                        </ChooseAndContinue>
                      )}
                    </div>
                    {closed && <ClosedNotice closed={closed} id={c.id} />}
                  </div>
                </div>
              </article>
            );
          })}

          <div className="flex items-start gap-3 text-on-surface">
            <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[24px] shrink-0">
              luggage
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant">
              <strong className="text-on-surface font-semibold">{tx.includedTitle}</strong> {tx.includedText}{" "}
              <a className={linkClass} href={FLIGHT_SOURCE.href} rel="noopener noreferrer" target="_blank">
                {tx.flightSource}
                <span className="sr-only"> {dt.newTab}</span>
              </a>
              {tx.flightSourceAfter}.
            </p>
          </div>

          <div className="bg-surface-container-low p-space-md rounded flex flex-col gap-space-md text-on-surface font-body-md text-body-md">
            <p className="flex items-start gap-space-sm text-on-surface-variant">
              <span aria-hidden="true" className="material-symbols-outlined text-primary text-[24px] shrink-0">
                health_and_safety
              </span>
              <span>
                <strong className="text-on-surface font-semibold">{tx.insuranceTitle}</strong> {tx.insuranceText}{" "}
                <Link className={linkClass} href="/aide#faq-assurance">
                  {tx.insuranceLink}
                </Link>
              </span>
            </p>
            <p className="flex items-start gap-space-sm text-on-surface-variant">
              <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[24px] shrink-0">
                volunteer_activism
              </span>
              <span>
                {dt.solidarity}{" "}
                <Link className={linkClass} href="/engagement">
                  {tx.fundLink}
                </Link>
              </span>
            </p>
          </div>
        </div>

        <div className={`lg:col-span-6 lg:sticky lg:top-24 ${mobileView === "list" ? "hidden" : "block"} lg:block`}>
          <section
            aria-labelledby="destination-map-title"
            className="bg-surface-container-lowest rounded-lg shadow-xl p-space-md flex flex-col gap-space-sm lg:max-h-[calc(100vh_-_7rem)] lg:overflow-y-auto"
          >
            <h2 className="flex items-center gap-2 font-label-lg text-label-lg font-bold text-on-surface">
              <span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px]">
                map
              </span>
              <span id="destination-map-title">{tx.mapTitle}</span>
            </h2>

            <div className="bg-primary/5 rounded p-space-sm">
              <DestinationMap
                highlighted={hovered}
                onHover={setHovered}
                onShow={showCard}
                priceOf={(id) => eur(zoneEstimate(id, booking).total)}
                selected={chosenId}
                unavailable={unavailable}
                visible={cards.map((c) => c.id)}
              />
            </div>

            <ul aria-label={tx.legend} className="flex flex-wrap gap-x-space-md gap-y-1 font-body-sm text-body-sm text-on-surface-variant">
              <li className="flex items-center gap-1.5">
                <ZoneDot /> {tx.legendZone}
              </li>
              <li className="flex items-center gap-1.5">
                <CircuitDot /> {tx.legendCircuit}
              </li>
              <li className="flex items-center gap-1.5">
                <AirportDot /> {tx.legendAirport}
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-hidden="true" className="w-5 border-t-2 border-dashed border-primary"></span> {tx.legendFlight}
              </li>
            </ul>

            {selected && selectedInfo ? (
              <>
                <div className="p-3 rounded bg-surface-container-low border-l-4 border-primary">
                  <p className="font-label-sm text-label-sm font-bold text-primary uppercase">{tx.chosen}</p>
                  <p className="font-label-lg text-label-lg font-bold text-on-surface">{selectedInfo.short}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {tx.choiceDetail(tx.flightLine(selectedInfo.flight, selectedInfo.flightNote), selectedInfo.lodge)}
                  </p>
                </div>
                {selectedClosed ? (
                  <ClosedNotice closed={selectedClosed} id={selected.id} />
                ) : (
                  <div className="hidden lg:block">
                    <ChooseAndContinue className={`${CHOOSE_CLASS} w-full justify-center py-3.5`} id={selected.id}>
                      {tx.continueWith(selectedInfo.short)}
                      <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                        arrow_forward
                      </span>
                    </ChooseAndContinue>
                  </div>
                )}
              </>
            ) : (
              <p className="p-3 rounded bg-surface-container-low font-body-md text-body-md text-on-surface">{tx.noChoice}</p>
            )}
          </section>
        </div>
      </div>

      <MobileBar>
        {selected && selectedInfo ? (
          <>
            <p className="min-w-0 font-body-md text-body-md text-on-surface">
              <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">{tx.barChoice}</span>
              <strong className="block truncate">{selectedInfo.short}</strong>
              {selectedClosed ? (
                <span className="text-error font-semibold">{tx.barClosed((tx.closures[selected.id] ?? selectedClosed).period)}</span>
              ) : (
                <span className="text-on-surface-variant">{tx.barFrom(eur(zoneEstimate(selected.id, booking).total))}</span>
              )}
            </p>
            {selectedClosed ? (
              <Link
                className="shrink-0 px-space-md py-2.5 rounded-full bg-on-error-container text-error-container font-label-lg text-label-lg flex items-center gap-1.5"
                href="/reservation/dates"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                  edit_calendar
                </span>
                {tx.editDates}
              </Link>
            ) : (
              <ChooseAndContinue className={`${CHOOSE_CLASS} shrink-0`} id={selected.id}>
                {tx.barContinue}
                <span className="sr-only">{tx.barWith(selectedInfo.short)}</span>
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </ChooseAndContinue>
            )}
          </>
        ) : (
          <>
            <p className="min-w-0 font-body-md text-body-md text-on-surface">{tx.barNone}</p>
            <button
              className="shrink-0 px-space-md py-2 rounded-full bg-surface-container-high text-primary font-label-md text-label-md"
              onClick={() => switchView(mobileView === "list" ? "map" : "list")}
              type="button"
            >
              {mobileView === "list" ? tx.seeMap : tx.seeList}
            </button>
          </>
        )}
      </MobileBar>
    </>
  );
}
