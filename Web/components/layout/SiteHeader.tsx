"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/components/auth/session";
import { CIRCUITS, type RegionId } from "@/components/circuits/catalog-data";
import { CURRENCIES, type Currency } from "@/components/currency/currency";
import { useCurrency, useMoney } from "@/components/currency/useCurrency";
import { LANGS, setLang, useLang, type Lang } from "@/components/i18n/lang";
import { exchangeRate } from "@/components/reservation/pricing";
import { rateDateLabel } from "@/lib/exchange-rate";
import { TAGLINE } from "@/lib/site";
import { isTunnel } from "./tunnel";

const T = {
  FR: {
    circuits: "Circuits",
    simulator: "Simulateur de budget",
    trips: "Mes voyages",
    help: "Aide",
    plan: "Planifier mon voyage",
    signIn: "Se connecter",
    account: "Mon compte",
    prefs: "Langue et devise",
    language: "Langue",
    currency: "Devise",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    note: "",
    EUR: "Euro",
    MGA: "Ariary malgache",
    USD: "Dollar américain",
    billing: "Devise de facturation",
    saveExit: "Enregistrer et quitter",
    exit: "Quitter",
    saved: "Votre réservation reste enregistrée sur cet appareil : reprenez-la avec « Planifier mon voyage ».",
    newTab: "(nouvel onglet)",
  },
  MG: {
    circuits: "Toerana",
    simulator: "Tetibola",
    trips: "Ny diako",
    help: "Fanampiana",
    plan: "Hikarakara ny diako",
    signIn: "Hiditra",
    account: "Ny kaontiko",
    prefs: "Fiteny sy vola",
    language: "Fiteny",
    currency: "Vola",
    openMenu: "Sokafy ny menio",
    closeMenu: "Akatony ny menio",
    note: "Mbola andalam-pandikana amin'ny teny malagasy ny ambin'ny tranonkala.",
    EUR: "Euro",
    MGA: "Ariary malagasy",
    USD: "Dolara amerikanina",
    billing: "Vola fandoavana",
    saveExit: "Tehirizo dia mivoaha",
    exit: "Mivoaha",
    saved: "Voatahiry ato amin'ity fitaovana ity ny famandrihanao : tohizo amin'ny « Hikarakara ny diako ».",
    newTab: "(tabilao vaovao)",
  },
  EN: {
    circuits: "Tours",
    simulator: "Budget planner",
    trips: "My trips",
    help: "Help",
    plan: "Plan my trip",
    signIn: "Sign in",
    account: "My account",
    prefs: "Language & currency",
    language: "Language",
    currency: "Currency",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    note: "The rest of the site is being translated into English.",
    EUR: "Euro",
    MGA: "Malagasy ariary",
    USD: "US dollar",
    billing: "Billing currency",
    saveExit: "Save and exit",
    exit: "Exit",
    saved: "Your booking stays saved on this device: pick it up again with “Plan my trip”.",
    newTab: "(new tab)",
  },
} satisfies Record<Lang, Record<string, string>>;

type Labels = (typeof T)["FR"];

const REGIONS: { id: RegionId; label: string; desc: string; tag: string; icon: string; tone: string }[] = [
  {
    id: "nord",
    label: "Nord & Nosy Be",
    desc: "Archipels, Diego Suarez, Mer d'Émeraude",
    tag: "Lagon",
    icon: "sailing",
    tone: "text-primary bg-primary-fixed",
  },
  {
    id: "est",
    label: "Est & Sainte-Marie",
    desc: "Andasibe, baleines, forêt primaire",
    tag: "Forêt",
    icon: "forest",
    tone: "text-secondary bg-secondary-fixed",
  },
  {
    id: "hautes-terres",
    label: "Hautes Terres & RN7",
    desc: "Isalo, Ranomafana, grand Sud",
    tag: "Savane",
    icon: "landscape",
    tone: "text-tertiary bg-tertiary-fixed",
  },
  {
    id: "ouest",
    label: "Ouest & Tsingy",
    desc: "Morondava, allée des Baobabs, Bemaraha",
    tag: "Minéral",
    icon: "terrain",
    tone: "text-on-surface bg-surface-container-highest",
  },
];

const regionStats = Object.fromEntries(
  REGIONS.map((r) => {
    const list = CIRCUITS.filter((c) => c.region === r.id);
    return [r.id, { count: list.length, from: Math.min(...list.map((c) => c.priceEur)) }];
  }),
) as Record<RegionId, { count: number; from: number }>;

const rateHint = (code: Exclude<Currency, "EUR">) => {
  const rate = exchangeRate();
  const value =
    code === "MGA"
      ? `${new Intl.NumberFormat("fr-FR").format(rate.mgaPerEur)}\u00a0Ar`
      : `${new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(rate.usdPerEur)}\u00a0$`;
  return `1\u00a0€ = ${value} · ${rateDateLabel(rate)}`.replace(/\u202f/g, "\u00a0");
};

type NavItem = {
  href: string;
  key: "simulator" | "trips" | "help";
  icon: string;
  match: (path: string) => boolean;
  private?: boolean;
};

const NAV: NavItem[] = [
  { href: "/simulateur", key: "simulator", icon: "calculate", match: (p) => p.startsWith("/simulateur") },
  { href: "/carnet", key: "trips", icon: "luggage", match: (p) => p.startsWith("/carnet"), private: true },
  { href: "/aide", key: "help", icon: "help", match: (p) => p.startsWith("/aide") },
];

/** Une seule entrée « Circuits » : le menu des régions et le catalogue complet ne font plus double emploi. */
const isCircuitsPage = (p: string) => p.startsWith("/circuits") || p.startsWith("/hebergements");

const linkBase =
  "relative px-space-md py-space-sm rounded-full font-label-md text-label-md transition-colors after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0.5 after:h-[3px] after:rounded-full after:bg-primary after:transition-all";
const linkIdle = "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/70 after:w-0";
const linkActive = "text-primary font-bold after:w-5";

function selectRegion(id: RegionId) {
  window.dispatchEvent(new CustomEvent("mv:catalog-region", { detail: id }));
}

/** Ferme un panneau au clic extérieur ou à la touche Échap. */
function useDismiss(open: boolean, close: () => void, ...refs: React.RefObject<HTMLElement | null>[]) {
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!refs.some((r) => r.current?.contains(e.target as Node))) closeRef.current();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}

function PrefsPanel({ t }: { t: Labels }) {
  const lang = useLang();
  const [currency, setCurrency] = useCurrency();
  return (
    <div className="flex flex-col gap-space-md">
      <fieldset className="flex flex-col gap-space-xs">
        <legend className="font-label-md text-label-md font-bold text-on-surface mb-space-xs">{t.language}</legend>
        <div className="grid grid-cols-3 gap-1 p-1 bg-surface-container-low rounded-full">
          {LANGS.map((l) => (
            <button
              aria-pressed={lang === l.code}
              className={`h-10 rounded-full font-label-md text-label-md transition-colors ${
                lang === l.code
                  ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface font-semibold"
              }`}
              key={l.code}
              lang={l.html}
              onClick={() => setLang(l.code)}
              title={l.label}
              type="button"
            >
              {l.code}
            </button>
          ))}
        </div>
        {t.note && (
          <p className="flex items-start gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-tertiary">translate</span>
            {t.note}
          </p>
        )}
      </fieldset>
      <fieldset className="flex flex-col gap-1">
        <legend className="font-label-md text-label-md font-bold text-on-surface mb-space-xs">{t.currency}</legend>
        {CURRENCIES.map((c) => {
          const checked = currency === c.code;
          return (
            <label
              className={`flex items-center gap-space-sm px-space-sm h-12 rounded cursor-pointer transition-colors ${
                checked ? "bg-primary-fixed/60" : "hover:bg-surface-container-low"
              }`}
              key={c.code}
            >
              <input
                checked={checked}
                className="sr-only peer"
                name="header-currency"
                onChange={() => setCurrency(c.code)}
                type="radio"
                value={c.code}
              />
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md font-bold ${
                  checked ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface"
                }`}
              >
                {c.symbol}
              </span>
              <span className="flex flex-col leading-tight flex-1">
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  {c.code} · {t[c.code]}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{c.code === "EUR" ? t.billing : rateHint(c.code)}</span>
              </span>
              {checked && <span className="material-symbols-outlined text-[20px] text-primary">check</span>}
            </label>
          );
        })}
      </fieldset>
    </div>
  );
}

function PrefsMenu({ t, compact, always = false }: { t: Labels; compact: boolean; always?: boolean }) {
  const lang = useLang();
  const [currency] = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open, () => setOpen(false), ref);
  const symbol = CURRENCIES.find((c) => c.code === currency)!.symbol;

  return (
    <div className={`relative ${always ? "" : "hidden md:block"}`} ref={ref}>
      <button
        aria-controls="prefs-menu"
        aria-expanded={open}
        aria-label={`${t.prefs} : ${lang}, ${currency}`}
        className={`flex items-center gap-space-xs px-space-sm rounded-full font-label-md text-label-md font-semibold text-on-surface transition-all ${
          compact ? "h-10" : "h-11"
        } ${open ? "bg-surface-container-high" : "bg-surface-container-low hover:bg-surface-container-high"}`}
        onClick={() => setOpen((o) => !o)}
        title={t.prefs}
        type="button"
      >
        <span className="material-symbols-outlined text-[20px] text-primary">language</span>
        <span>
          {lang} · {symbol}
        </span>
        <span className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform ${open ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>
      {open && (
        <div
          aria-label={t.prefs}
          className="fixed left-4 right-4 top-16 md:absolute md:left-auto md:right-0 md:top-full md:w-80 mt-space-sm p-space-md bg-surface-container-lowest rounded-lg shadow-[0_16px_40px_-8px_rgba(31,41,51,0.25)] border border-outline-variant/40"
          id="prefs-menu"
          role="dialog"
        >
          <PrefsPanel t={t} />
        </div>
      )}
    </div>
  );
}

function RegionCard({ region, onPick }: { region: (typeof REGIONS)[number]; onPick: () => void }) {
  const money = useMoney();
  const stats = regionStats[region.id];
  return (
    <Link
      className="group flex flex-col gap-space-sm p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container-high focus-visible:bg-surface-container-high transition-colors"
      href={`/circuits?region=${region.id}`}
      onClick={() => {
        selectRegion(region.id);
        onPick();
      }}
    >
      <span className="flex items-center justify-between">
        <span className={`w-10 h-10 rounded-full flex items-center justify-center ${region.tone}`}>
          <span className="material-symbols-outlined text-[22px]">{region.icon}</span>
        </span>
        <span className="font-label-md text-label-md px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface-variant">
          {region.tag}
        </span>
      </span>
      <span className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-primary transition-colors">
        {region.label}
      </span>
      <span className="font-body-md text-body-md text-on-surface-variant">{region.desc}</span>
      <span className="mt-auto pt-space-sm flex items-center justify-between font-label-md text-label-md">
        <span className="text-on-surface-variant">
          {stats.count} circuit{stats.count > 1 ? "s" : ""}
        </span>
        <span className="text-on-surface">
          dès <strong className="text-primary">{money.eur(stats.from)}</strong>
        </span>
      </span>
    </Link>
  );
}

function MegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="hidden xl:block absolute inset-x-0 top-full bg-surface-container-lowest border-t border-outline-variant/40 shadow-[0_24px_40px_-16px_rgba(31,41,51,0.25)]"
      id="mega-destinations"
      lang="fr"
    >
      <div className="max-w-[1440px] mx-auto px-margin-desktop py-space-lg flex flex-col gap-space-md">
        <div className="grid grid-cols-4 gap-gutter">
          {REGIONS.map((r) => (
            <RegionCard key={r.id} onPick={onClose} region={r} />
          ))}
        </div>
        <div className="flex items-center justify-between gap-space-md pt-space-sm">
          <p className="font-body-md text-body-md text-on-surface-variant">Prix des circuits par personne, base 2 adultes.</p>
          <div className="flex items-center gap-space-md">
            <Link
              className="flex items-center gap-space-xs font-label-md text-label-md font-semibold text-on-surface-variant hover:text-primary"
              href="/simulateur"
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-[18px]">calculate</span>
              Pas sûr du budget ? Simuler
            </Link>
            <Link
              className="flex items-center gap-space-xs h-10 px-space-md rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-on-primary-fixed-variant transition-colors"
              href="/circuits"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("mv:catalog-region", { detail: "all" }));
                onClose();
              }}
            >
              Voir les {CIRCUITS.length} circuits
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ t, pathname, signedIn, name }: { t: Labels; pathname: string; signedIn: boolean; name?: string }) {
  const money = useMoney();
  const [regionsOpen, setRegionsOpen] = useState(false);
  const row = "flex items-center gap-space-sm h-12 px-space-md rounded font-label-lg text-label-lg transition-colors";

  return (
    <nav
      aria-label="Navigation mobile"
      className="xl:hidden absolute inset-x-0 top-full bg-surface-container-lowest border-t border-outline-variant/40 shadow-[0_24px_40px_-16px_rgba(31,41,51,0.3)] max-h-[calc(100dvh-4rem)] overflow-y-auto"
      id="mobile-nav"
    >
      <div className="max-w-2xl mx-auto px-margin py-space-md flex flex-col gap-space-md">
        {signedIn ? (
          <Link className="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low" href="/compte">
            <span className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-lg text-label-lg font-bold">
              {initials(name)}
            </span>
            <span className="flex flex-col flex-1">
              <span className="font-label-lg text-label-lg text-on-surface font-bold">{name}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">{t.account}</span>
            </span>
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </Link>
        ) : (
          <Link
            className="flex items-center justify-center gap-space-xs h-12 rounded-full border-2 border-primary text-primary font-label-lg text-label-lg font-bold"
            href="/connexion"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            {t.signIn}
          </Link>
        )}

        <ul className="flex flex-col gap-1">
          <li>
            <button
              aria-controls="mobile-regions"
              aria-expanded={regionsOpen}
              className={`${row} w-full ${
                isCircuitsPage(pathname)
                  ? "bg-primary-fixed/50 text-primary font-bold border-l-[3px] border-primary"
                  : "text-on-surface hover:bg-surface-container-low"
              }`}
              onClick={() => setRegionsOpen((o) => !o)}
              type="button"
            >
              <span
                className={`material-symbols-outlined text-[22px] ${isCircuitsPage(pathname) ? "text-primary" : "text-on-surface-variant"}`}
              >
                explore
              </span>
              <span className="flex-1 text-left">{t.circuits}</span>
              <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${regionsOpen ? "rotate-180" : ""}`}>
                expand_more
              </span>
            </button>
            {regionsOpen && (
              <ul className="flex flex-col gap-1 pl-space-lg py-space-xs" id="mobile-regions" lang="fr">
                <li>
                  <Link
                    className="flex items-center gap-space-sm px-space-md py-space-sm rounded hover:bg-surface-container-low"
                    href="/circuits"
                    onClick={() => window.dispatchEvent(new CustomEvent("mv:catalog-region", { detail: "all" }))}
                  >
                    <span className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-on-primary">
                      <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                    </span>
                    <span className="flex-1 font-label-md text-label-md text-on-surface font-bold">Tous les circuits</span>
                    <span className="font-label-md text-label-md text-on-surface-variant">{CIRCUITS.length}</span>
                  </Link>
                </li>
                {REGIONS.map((r) => (
                  <li key={r.id}>
                    <Link
                      className="flex items-center gap-space-sm px-space-md py-space-sm rounded hover:bg-surface-container-low"
                      href={`/circuits?region=${r.id}`}
                      onClick={() => selectRegion(r.id)}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center ${r.tone}`}>
                        <span className="material-symbols-outlined text-[18px]">{r.icon}</span>
                      </span>
                      <span className="flex-1 font-label-md text-label-md text-on-surface font-semibold">{r.label}</span>
                      <span className="font-label-md text-label-md text-on-surface-variant">dès {money.eur(regionStats[r.id].from)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          {NAV.filter((item) => signedIn || !item.private).map((item) => {
            const active = item.match(pathname);
            return (
              <li key={item.href}>
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`${row} ${
                    active
                      ? "bg-primary-fixed/50 text-primary font-bold border-l-[3px] border-primary"
                      : "text-on-surface hover:bg-surface-container-low"
                  }`}
                  href={item.href}
                >
                  <span className={`material-symbols-outlined text-[22px] ${active ? "text-primary" : "text-on-surface-variant"}`}>
                    {item.icon}
                  </span>
                  {t[item.key]}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="md:hidden p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant/50">
          <PrefsPanel t={t} />
        </div>

        <Link
          className="sm:hidden flex items-center justify-center h-12 rounded-full bg-tertiary text-on-tertiary font-label-lg text-label-lg font-bold shadow-[0_4px_14px_rgba(167,57,30,0.35)]"
          href="/reservation/dates"
        >
          {t.plan}
        </Link>
      </div>
    </nav>
  );
}

function initials(name?: string) {
  return (name ?? "")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const lang = useLang();
  const t = T[lang];
  const session = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useDismiss(megaOpen, () => setMegaOpen(false), headerRef);
  useDismiss(mobileOpen, () => setMobileOpen(false), headerRef);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const solid = scrolled || megaOpen || mobileOpen;
  const compact = scrolled;
  const accountActive = pathname.startsWith("/compte");

  if (isTunnel(pathname)) {
    return (
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.06)]"
        lang={LANGS.find((l) => l.code === lang)!.html}
      >
        <div className="max-w-[1440px] mx-auto h-16 px-margin lg:px-margin-desktop flex items-center justify-between gap-space-md">
          <Link aria-label="MadaVoyage, accueil" className="flex items-center gap-space-sm" href="/">
            <span className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
                forest
              </span>
            </span>
            <span className="hidden sm:inline font-headline-sm text-[20px] tracking-tight text-on-surface font-extrabold leading-none">
              Mada<span className="text-primary">Voyage</span>
            </span>
          </Link>
          <div className="flex items-center gap-space-xs sm:gap-space-sm">
            <PrefsMenu always compact t={t} />
            <a
              className="h-10 px-space-sm sm:px-space-md rounded-full flex items-center gap-1.5 text-on-surface font-label-lg text-label-lg hover:bg-surface-container-low transition-colors"
              href="/aide"
              rel="noopener"
              target="_blank"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[22px] text-primary">
                help
              </span>
              <span className="hidden sm:inline">{t.help}</span>
              <span className="sr-only">
                <span className="sm:hidden">{t.help} </span>
                {t.newTab}
              </span>
            </a>
            <Link
              aria-describedby="tunnel-saved"
              className="h-10 px-space-md rounded-full flex items-center gap-1.5 ring-1 ring-outline-variant text-on-surface font-label-lg text-label-lg hover:bg-surface-container-low transition-colors"
              href="/"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                bookmark_added
              </span>
              <span className="hidden sm:inline">{t.saveExit}</span>
              <span aria-hidden="true" className="sm:hidden">
                {t.exit}
              </span>
              <span className="sr-only sm:hidden">{t.saveExit}</span>
            </Link>
            <span className="sr-only" id="tunnel-saved">
              {t.saved}
            </span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        solid
          ? "bg-surface-container-lowest shadow-[0_2px_16px_rgba(31,41,51,0.12)]"
          : "bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
      }`}
      data-scrolled={scrolled || undefined}
      lang={LANGS.find((l) => l.code === lang)!.html}
      ref={headerRef}
    >
      <div
        className={`max-w-[1440px] mx-auto px-margin lg:px-margin-desktop flex items-center justify-between gap-space-lg transition-[height] duration-300 ${
          compact ? "h-16" : "h-20"
        }`}
      >
        <div className="flex items-center gap-space-xl">
          <Link aria-label="MadaVoyage, accueil" className="flex items-center gap-space-sm group" href="/">
            <div
              className={`rounded-full bg-primary flex items-center justify-center text-on-primary transition-all duration-300 group-hover:scale-105 ${
                compact ? "w-9 h-9" : "w-10 h-10"
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">forest</span>
            </div>
            <div className="flex flex-col">
              <span
                className={`tracking-tight text-on-surface font-extrabold leading-none transition-all ${
                  compact ? "font-headline-sm text-[20px]" : "font-headline-sm text-headline-sm"
                }`}
              >
                Mada<span className="text-primary">Voyage</span>
              </span>
              <span
                className={`font-label-sm text-label-sm tracking-widest uppercase text-secondary font-bold overflow-hidden transition-all duration-300 ${
                  compact ? "max-h-0 opacity-0" : "max-h-5 opacity-100 mt-0.5"
                }`}
                lang="fr"
              >
                {TAGLINE}
              </span>
            </div>
          </Link>

          <nav
            aria-label="Navigation principale"
            className="hidden xl:flex items-center gap-space-xs p-1 bg-surface-container-low/60 rounded-full"
          >
            <button
              aria-controls="mega-destinations"
              aria-expanded={megaOpen}
              className={`flex items-center gap-space-xs ${linkBase} ${
                megaOpen ? "bg-surface-container-high text-on-surface after:w-0" : isCircuitsPage(pathname) ? linkActive : linkIdle
              }`}
              onClick={() => setMegaOpen((o) => !o)}
              type="button"
            >
              <span>{t.circuits}</span>
              <span
                className={`material-symbols-outlined text-[18px] -my-[3px] text-on-surface-variant transition-transform ${megaOpen ? "rotate-180" : ""}`}
              >
                expand_more
              </span>
            </button>
            {NAV.filter((item) => session || !item.private).map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`${linkBase} ${active ? linkActive : linkIdle}`}
                  href={item.href}
                  key={item.href}
                >
                  {t[item.key]}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-space-sm">
          <PrefsMenu compact={compact} t={t} />
          <Link
            className={`hidden sm:inline-flex items-center justify-center px-space-lg rounded-full bg-tertiary text-on-tertiary font-label-lg text-label-lg shadow-[0_4px_14px_rgba(167,57,30,0.35)] hover:bg-on-tertiary-fixed-variant active:scale-95 transition-all ${
              compact ? "h-10" : "h-12"
            }`}
            href="/reservation/dates"
          >
            {t.plan}
          </Link>
          {session ? (
            <Link
              aria-current={accountActive ? "page" : undefined}
              aria-label={`${t.account} (${session.name})`}
              className={`w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md font-bold transition-shadow ${
                accountActive ? "ring-2 ring-offset-2 ring-primary" : "hover:ring-2 hover:ring-offset-2 hover:ring-primary/40"
              }`}
              href="/compte"
              title={t.account}
            >
              {initials(session.name)}
            </Link>
          ) : (
            <Link
              aria-label={t.signIn}
              className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors"
              href="/connexion"
              title={t.signIn}
            >
              <span className="material-symbols-outlined text-[22px]">person</span>
            </Link>
          )}
          <button
            aria-controls="mobile-nav"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t.closeMenu : t.openMenu}
            className="xl:hidden w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-on-surface"
            onClick={() => setMobileOpen((o) => !o)}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">{mobileOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {(megaOpen || mobileOpen) && (
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-full h-screen bg-on-surface/40 ${mobileOpen ? "xl:hidden" : "hidden xl:block"}`}
          onClick={() => {
            setMegaOpen(false);
            setMobileOpen(false);
          }}
        />
      )}
      {megaOpen && <MegaMenu onClose={() => setMegaOpen(false)} />}
      {mobileOpen && <MobileMenu name={session?.name} pathname={pathname} signedIn={!!session} t={t} />}
    </header>
  );
}
