"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { OpenCookieManagerButton } from "@/components/consent/CookieConsent";

const TABS = [
  { id: "voyage", icon: "travel_explore", label: "Mon Voyage en Cours" },
  { id: "albums", icon: "photo_library", label: "Voyages Passés & Albums" },
  { id: "documents", icon: "receipt_long", label: "Mes Documents & Vouchers PDF" },
  { id: "preferences", icon: "tune", label: "Préférences & Devises" },
  { id: "eco", icon: "handshake", label: "Programme Éco-Solidarité" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const VOUCHERS = {
  flight: {
    icon: "airlines",
    title: "Vol intérieur Madagascar Airlines TZ 314",
    reference: "TZ-893-XLA",
    referenceLabel: "Code PNR",
    details: [
      ["Trajet", "Antananarivo (TNR) → Nosy Be (NOS)"],
      ["Horaires", "14 oct. • 08:30 → 10:05"],
      ["Sièges", "12A, 12B, 12C"],
      ["Bagages", "20 kg / pers • Premium Éco"],
    ],
  },
  hotel: {
    icon: "hotel",
    title: "Vanila Hotel & Spa 4★",
    reference: "VN-88412-MG",
    referenceLabel: "Bon d'échange",
    details: [
      ["Séjour", "Suite Océan • 10 nuits • Demi-pension"],
      ["Check-in", "14 oct. dès 14:00"],
      ["Réception", "+261 32 07 200 45"],
    ],
  },
  transfer: {
    icon: "directions_car",
    title: "Transfert privé 4x4 A/R",
    reference: "TRF-NOS-1410",
    referenceLabel: "Code transfert",
    details: [
      ["Trajet", "Aéroport Fascene ⇄ Vanila Hotel"],
      ["Véhicule", "Toyota Prado TX climatisé"],
      ["Chauffeur", "Mamisoa • +261 34 56 789 01"],
      ["Accueil", "Pancarte « MadaVoyage – RAKOTO »"],
    ],
  },
  park: {
    icon: "nature",
    title: "Pass Madagascar National Parks — Lokobe",
    reference: "MNP-LOK-0922",
    referenceLabel: "Pass écotourisme",
    details: [
      ["Excursion", "17 octobre • départ 07:45"],
      ["Programme", "Traversée en pirogue • Forêt noire • Déjeuner"],
      ["Équipement", "Gilets, jumelles, sacs étanches"],
    ],
  },
} as const;

export type VoucherId = keyof typeof VOUCHERS;

type CarnetState = {
  tab: TabId;
  selectTab: (id: TabId) => void;
  openVoucher: (id: VoucherId) => void;
};

const CarnetContext = createContext<CarnetState | null>(null);

function useCarnet() {
  const ctx = useContext(CarnetContext);
  if (!ctx) throw new Error("useCarnet doit être utilisé dans <CarnetProvider>");
  return ctx;
}

export function CarnetProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<TabId>("voyage");
  const [voucher, setVoucher] = useState<VoucherId | null>(null);
  const closeVoucher = useCallback(() => setVoucher(null), []);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("onglet");
    const match = TABS.find((t) => t.id === requested);
    if (match) setTab(match.id);
  }, []);

  return (
    <CarnetContext.Provider value={{ tab, selectTab: setTab, openVoucher: setVoucher }}>
      {children}
      {voucher && <VoucherDialog id={voucher} onClose={closeVoucher} />}
    </CarnetContext.Provider>
  );
}

export function CarnetTabList() {
  const { tab, selectTab } = useCarnet();
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});

  const onKeyDown = (e: React.KeyboardEvent) => {
    const index = TABS.findIndex((t) => t.id === tab);
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next === null) return;
    e.preventDefault();
    selectTab(TABS[next].id);
    tabRefs.current[TABS[next].id]?.focus();
  };

  return (
    <div
      aria-label="Rubriques du carnet de route"
      className="flex items-center gap-space-xs mt-space-lg overflow-x-auto pb-space-xs"
      role="tablist"
      onKeyDown={onKeyDown}
    >
      {TABS.map((t) => {
        const selected = t.id === tab;
        return (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[t.id] = el;
            }}
            aria-controls={`carnet-panel-${t.id}`}
            aria-selected={selected}
            className={`px-space-md py-space-sm rounded-full font-label-md text-label-md flex items-center gap-space-xs flex-shrink-0 transition-colors ${
              selected
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
            id={`carnet-tab-${t.id}`}
            role="tab"
            tabIndex={selected ? 0 : -1}
            onClick={() => selectTab(t.id)}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
            <span>{t.label}</span>
            {t.id === "voyage" && <span aria-hidden="true" className="w-2 h-2 rounded-full bg-secondary-fixed"></span>}
          </button>
        );
      })}
    </div>
  );
}

export function CarnetPanels({ children }: { children: React.ReactNode }) {
  const { tab } = useCarnet();
  const panes: Record<TabId, React.ReactNode> = {
    voyage: children,
    albums: <AlbumsPane />,
    documents: <DocumentsPane />,
    preferences: <PreferencesPane />,
    eco: <EcoPane />,
  };

  return (
    <>
      {TABS.map((t) => (
        <div
          key={t.id}
          aria-labelledby={`carnet-tab-${t.id}`}
          className={`${t.id === tab ? "flex" : "hidden"} flex-col gap-space-xl`}
          id={`carnet-panel-${t.id}`}
          role="tabpanel"
          tabIndex={0}
        >
          {panes[t.id]}
        </div>
      ))}
    </>
  );
}

export function VoucherButton({
  id,
  className,
  children,
  label,
}: {
  id: VoucherId;
  className?: string;
  children: React.ReactNode;
  label?: string;
}) {
  const { openVoucher } = useCarnet();
  return (
    <button aria-label={label} className={className} onClick={() => openVoucher(id)} type="button">
      {children}
    </button>
  );
}

function QrCode({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm0-4h2v2h-2v-2zm-4-6h2v2h-2V8zm4 0h2v2h-2V8zm-2 2h2v2h-2v-2z"></path>
    </svg>
  );
}

function VoucherDialog({ id, onClose }: { id: VoucherId; onClose: () => void }) {
  const voucher = VOUCHERS[id];
  const closeRef = useRef<HTMLButtonElement>(null);
  const ids = useId();

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div aria-hidden="true" className="absolute inset-0 bg-on-surface/60 backdrop-blur-sm" onClick={onClose}></div>
      <div
        aria-labelledby={`${ids}-title`}
        aria-modal="true"
        className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-space-lg shadow-2xl relative flex flex-col gap-space-md"
        role="dialog"
      >
        <button
          ref={closeRef}
          aria-label="Fermer"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          onClick={onClose}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
        <div className="flex items-center gap-space-sm text-primary pr-10">
          <span className="material-symbols-outlined text-[26px]">{voucher.icon}</span>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface" id={`${ids}-title`}>
            {voucher.title}
          </h3>
        </div>
        <div className="flex flex-col items-center gap-space-xs py-space-sm">
          <QrCode className="w-56 h-56 text-black" />
          <span className="font-label-sm text-label-sm text-on-surface-variant">{voucher.referenceLabel}</span>
          <span className="font-headline-md text-headline-md font-bold tracking-widest text-on-surface">{voucher.reference}</span>
        </div>
        <dl className="grid grid-cols-[auto,1fr] gap-x-space-md gap-y-space-xs font-body-sm text-body-sm">
          {voucher.details.map(([term, value]) => (
            <div key={term} className="contents">
              <dt className="text-on-surface-variant">{term}</dt>
              <dd className="font-semibold text-on-surface text-right">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Montez la luminosité de votre écran au maximum lors du contrôle. Ce document reste accessible hors connexion.
        </p>
        <div className="flex flex-wrap gap-space-sm justify-end">
          <button
            className="h-10 px-space-md rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-space-xs"
            onClick={() => window.print()}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">print</span> Imprimer / PDF
          </button>
          <button
            className="h-10 px-space-md rounded-full bg-primary text-on-primary font-label-md text-label-md"
            onClick={onClose}
            type="button"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

const PAST_TRIPS = [
  {
    icon: "route",
    title: "La Mythique RN7 — Antananarivo → Ifaty",
    dates: "Mars 2025 • 10 jours • 3 voyageurs",
    photos: 126,
    reviewed: false,
    href: "/circuits/rn7",
  },
  {
    icon: "forest",
    title: "Forêts primaires d'Andasibe & canal des Pangalanes",
    dates: "Août 2023 • 6 jours • 2 voyageurs",
    photos: 84,
    reviewed: true,
    href: "/circuits",
  },
];

function AlbumsPane() {
  return (
    <section className="flex flex-col gap-space-md">
      <h2 className="font-headline-lg text-headline-lg text-on-surface">Vos voyages passés</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-desktop">
        {PAST_TRIPS.map((trip) => (
          <article key={trip.title} className="rounded-lg bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
            <div className="flex items-start gap-space-sm">
              <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">{trip.icon}</span>
              </span>
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{trip.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{trip.dates}</p>
              </div>
            </div>
            <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-secondary">photo_library</span>
              {trip.photos} photos sauvegardées dans l'album
            </div>
            <div className="flex flex-wrap items-center gap-space-sm">
              {trip.reviewed ? (
                <span className="px-space-sm py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-bold inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check</span> Avis publié
                </span>
              ) : (
                <Link
                  className="h-10 px-space-md rounded-full bg-primary text-on-primary font-label-md text-label-md inline-flex items-center gap-space-xs"
                  href="/avis"
                >
                  <span className="material-symbols-outlined text-[16px]">rate_review</span> Laisser un avis
                </Link>
              )}
              <Link
                className="h-10 px-space-md rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md inline-flex items-center gap-space-xs"
                href={trip.href}
              >
                Revoir le circuit
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DocumentsPane() {
  return (
    <section className="flex flex-col gap-space-md">
      <div className="flex flex-wrap items-end justify-between gap-space-sm">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Documents & vouchers</h2>
        <button
          className="h-10 px-space-md rounded-full bg-tertiary hover:bg-on-tertiary-fixed-variant text-on-tertiary font-label-md text-label-md flex items-center gap-space-xs"
          onClick={() => window.print()}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span> Carnet complet (PDF)
        </button>
      </div>
      <ul className="rounded-lg bg-surface-container-lowest shadow-sm divide-y divide-surface-container">
        {(Object.keys(VOUCHERS) as VoucherId[]).map((id) => {
          const v = VOUCHERS[id];
          return (
            <li key={id} className="flex flex-wrap items-center justify-between gap-space-sm p-space-md">
              <div className="flex items-center gap-space-sm min-w-0">
                <span className="material-symbols-outlined text-primary text-[22px]">{v.icon}</span>
                <div className="min-w-0">
                  <div className="font-label-md text-label-md font-bold text-on-surface truncate">{v.title}</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">
                    {v.referenceLabel} : {v.reference}
                  </div>
                </div>
              </div>
              <VoucherButton
                className="h-9 px-space-md rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-space-xs"
                id={id}
              >
                <span className="material-symbols-outlined text-[16px]">qr_code_2</span> Afficher
              </VoucherButton>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const PREFS_KEY = "mv_carnet_prefs";

type Prefs = { currency: "EUR" | "MGA"; emailReminders: boolean; smsAlerts: boolean };

const DEFAULT_PREFS: Prefs = { currency: "EUR", emailReminders: true, smsAlerts: false };

function PreferencesPane() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(PREFS_KEY) ?? "null");
      if (stored && typeof stored === "object") setPrefs({ ...DEFAULT_PREFS, ...stored });
    } catch {
      // Préférences illisibles : on garde les valeurs par défaut.
    }
  }, []);

  const update = (patch: Partial<Prefs>) => {
    setPrefs((p) => ({ ...p, ...patch }));
    setSaved(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      // Stockage indisponible : les choix valent pour cette visite.
    }
    setSaved(true);
  };

  return (
    <form className="rounded-lg bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-lg max-w-2xl" onSubmit={submit}>
      <h2 className="font-headline-lg text-headline-lg text-on-surface">Préférences du carnet</h2>
      <fieldset className="flex flex-col gap-space-xs">
        <legend className="font-label-md text-label-md font-bold text-on-surface mb-space-xs">Devise d'affichage des montants</legend>
        {(
          [
            ["EUR", "Euro (€) avec équivalent en Ariary"],
            ["MGA", "Ariary malgache (Ar) avec équivalent en euros"],
          ] as const
        ).map(([value, label]) => (
          <label key={value} className="flex items-center gap-space-sm font-body-md text-body-md text-on-surface cursor-pointer">
            <input
              checked={prefs.currency === value}
              className="accent-primary w-4 h-4"
              name="currency"
              onChange={() => update({ currency: value })}
              type="radio"
              value={value}
            />
            {label}
          </label>
        ))}
      </fieldset>
      <fieldset className="flex flex-col gap-space-xs">
        <legend className="font-label-md text-label-md font-bold text-on-surface mb-space-xs">Notifications de voyage</legend>
        <label className="flex items-center gap-space-sm font-body-md text-body-md text-on-surface cursor-pointer">
          <input
            checked={prefs.emailReminders}
            className="accent-primary w-4 h-4"
            onChange={(e) => update({ emailReminders: e.target.checked })}
            type="checkbox"
          />
          Rappels de départ et documents par e-mail
        </label>
        <label className="flex items-center gap-space-sm font-body-md text-body-md text-on-surface cursor-pointer">
          <input
            checked={prefs.smsAlerts}
            className="accent-primary w-4 h-4"
            onChange={(e) => update({ smsAlerts: e.target.checked })}
            type="checkbox"
          />
          Alertes météo et marées par SMS
        </label>
      </fieldset>
      <div className="flex flex-wrap items-center gap-space-sm">
        <button className="h-11 px-space-lg rounded-full bg-primary text-on-primary font-label-md text-label-md" type="submit">
          Enregistrer mes préférences
        </button>
        <OpenCookieManagerButton className="h-11 px-space-md rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md">
          Gérer les cookies
        </OpenCookieManagerButton>
        <span aria-live="polite" className="font-body-sm text-body-sm text-secondary flex items-center gap-1" role="status">
          {saved && (
            <>
              <span className="material-symbols-outlined text-[16px]">check_circle</span> Préférences enregistrées
            </>
          )}
        </span>
      </div>
    </form>
  );
}

const CONTRIBUTIONS = [
  { icon: "park", label: "14 palétuviers plantés à Nosy Faly", points: "+1 400 pts" },
  { icon: "solar_power", label: "Électrification solaire de l'école d'Anja", points: "+650 pts" },
  { icon: "volunteer_activism", label: "Guides locaux certifiés rémunérés au juste prix", points: "+400 pts" },
];

function EcoPane() {
  return (
    <section className="rounded-lg bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md max-w-3xl">
      <h2 className="font-headline-lg text-headline-lg text-on-surface">Programme Éco-Solidarité Fihavanana</h2>
      <p className="font-body-md text-body-md text-on-surface-variant">
        Vous cumulez <span className="font-bold text-secondary">2 450 points</span>. Encore 700 points pour atteindre le niveau Ravinala.
      </p>
      <div
        aria-label="Progression vers le niveau Ravinala"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={78}
        className="w-full bg-surface-container h-2 rounded-full overflow-hidden"
        role="progressbar"
      >
        <div className="bg-secondary h-full rounded-full" style={{ width: "78%" }}></div>
      </div>
      <ul className="flex flex-col gap-space-xs">
        {CONTRIBUTIONS.map((c) => (
          <li
            key={c.label}
            className="flex items-center justify-between gap-space-sm p-space-sm rounded bg-surface-container-low font-body-sm text-body-sm"
          >
            <span className="flex items-center gap-space-xs text-on-surface">
              <span className="material-symbols-outlined text-secondary text-[18px]">{c.icon}</span>
              {c.label}
            </span>
            <span className="font-bold text-secondary flex-shrink-0">{c.points}</span>
          </li>
        ))}
      </ul>
      <Link
        className="self-start h-10 px-space-md rounded-full bg-secondary text-on-secondary font-label-md text-label-md inline-flex items-center gap-space-xs"
        href="/engagement"
      >
        <span className="material-symbols-outlined text-[16px]">eco</span> Découvrir notre charte d'engagement
      </Link>
    </section>
  );
}
