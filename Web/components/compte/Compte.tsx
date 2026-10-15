"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { signOut } from "@/components/auth/session";
import Dialog, { QrCode } from "@/components/ui/Dialog";

const TRIP_START = new Date(2026, 9, 14);
const TRIP_END = new Date(2026, 9, 24);
const DAY_MS = 86_400_000;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      aria-label="Se déconnecter"
      className="h-12 w-12 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-surface-container-highest transition-colors"
      onClick={() => {
        signOut();
        router.push("/connexion");
      }}
      title="Se déconnecter"
      type="button"
    >
      <span className="material-symbols-outlined text-body-md">logout</span>
    </button>
  );
}

export function DepartureCountdown() {
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => setToday(startOfDay(new Date())), []);

  let label = "Départ dans";
  let value = "…";
  if (today !== null) {
    const before = Math.round((TRIP_START.getTime() - today) / DAY_MS);
    if (before > 1) value = `${before} Jours`;
    else if (before === 1) value = "Demain";
    else if (before === 0) value = "Aujourd'hui";
    else if (today <= TRIP_END.getTime()) {
      label = "Voyage en cours";
      value = `Jour ${1 - before}`;
    } else {
      label = "Voyage";
      value = "Terminé";
    }
  }

  return (
    <div className="flex flex-col">
      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{label}</span>
      <span className="font-headline-sm text-headline-sm text-tertiary font-bold">{value}</span>
    </div>
  );
}

const NAV = [
  { href: "#voyages", icon: "explore", label: "Mes Voyages & Carnet" },
  { href: "#documents", icon: "confirmation_number", label: "Documents & Vouchers (3)" },
  { href: "#preferences", icon: "family_restroom", label: "Préférences & Famille" },
  { href: "#support", icon: "support_agent", label: "Conciergerie Dédiée 24/7" },
];

export function AccountNav() {
  const [active, setActive] = useState(NAV[0].href);

  return (
    <nav
      aria-label="Sections du compte"
      className="flex items-center gap-space-xs bg-surface-container-low p-space-xs rounded-full overflow-x-auto"
    >
      {NAV.map((item) => {
        const current = item.href === active;
        return (
          <a
            key={item.href}
            aria-current={current ? "location" : undefined}
            className={`px-space-lg py-space-xs rounded-full font-label-lg text-label-lg flex items-center gap-space-xs whitespace-nowrap transition-colors ${
              current ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            }`}
            href={item.href}
            onClick={() => setActive(item.href)}
          >
            <span className="material-symbols-outlined text-body-md">{item.icon}</span>
            <span>{item.label}</span>
            {current && <span className="w-2 h-2 rounded-full bg-secondary"></span>}
          </a>
        );
      })}
    </nav>
  );
}

const ITINERARY = [
  {
    day: "14 oct.",
    icon: "flight_land",
    title: "Envol vers Nosy Be",
    text: "Vol Madagascar Airlines TNR → NOS, accueil par Faly et installation en Suite Baobab au Manga Soa Lodge.",
  },
  {
    day: "15 oct.",
    icon: "forest",
    title: "Réserve de Lokobe en pirogue",
    text: "Approche en pirogue traditionnelle, lémuriens noirs et caméléons panthères. Horaire de départ à confirmer.",
  },
  {
    day: "16 oct.",
    icon: "storefront",
    title: "Nosy Komba",
    text: "Village d'artisans brodeurs et rencontre avec les lémuriens macaco en semi-liberté.",
  },
  {
    day: "17 oct.",
    icon: "scuba_diving",
    title: "Réserve marine de Nosy Tanikely",
    text: "Snorkeling parmi les tortues imbriquées et les jardins de corail.",
  },
  {
    day: "18 oct.",
    icon: "spa",
    title: "Journée libre au lodge",
    text: "Plage privée, spa à l'ylang-ylang ou atelier cuisine malgache pour Enzo.",
  },
  {
    day: "19 oct.",
    icon: "sailing",
    title: "Cap sur l'archipel des Mitsio",
    text: "Traversée en boutre et nuit en bivouac face à Nosy Tsarabanjina.",
  },
  {
    day: "20 oct.",
    icon: "landscape",
    title: "Mitsio sauvage",
    text: "Orgues basaltiques de Grande Mitsio, plongée et pique-nique de poisson grillé.",
  },
  {
    day: "21 oct.",
    icon: "park",
    title: "Plantation dans le Sambirano",
    text: "Retour à Nosy Be et plantation de vos 22 arbres avec la pépinière communautaire.",
  },
  {
    day: "22 oct.",
    icon: "wb_twilight",
    title: "Mont Passot & lacs sacrés",
    text: "Panorama sur les lacs de cratère au coucher du soleil.",
  },
  {
    day: "23 oct.",
    icon: "restaurant",
    title: "Dernière journée sur l'île",
    text: "Matinée libre puis dîner langouste privé sur la plage du lodge.",
  },
  {
    day: "24 oct.",
    icon: "flight_takeoff",
    title: "Retour vers Antananarivo",
    text: "Transfert à l'aéroport de Fascene et vol Madagascar Airlines NOS → TNR.",
  },
];

const VOUCHERS = {
  lodge: {
    icon: "hotel",
    title: "Manga Soa Lodge 4★",
    reference: "MSL-8902-NOSY",
    details: [
      ["Hébergement", "Suite Baobab"],
      ["Séjour", "14 → 24 oct. 2026 · 10 nuits"],
      ["Voyageurs", "2 adultes · 1 enfant"],
    ],
  },
  lokobe: {
    icon: "forest",
    title: "MNP Réserve de Lokobe",
    reference: "MNP-9921",
    details: [
      ["Permis", "Écotourisme · 1 journée"],
      ["Date", "15 oct. 2026"],
      ["Passagers", "3 · éco-guidage inclus"],
    ],
  },
  flight: {
    icon: "airlines",
    title: "Vol Intérieur Madagascar Airlines",
    reference: "TZ-402-99",
    details: [
      ["Trajet", "TNR ⇄ NOS (aller-retour)"],
      ["Aller", "14 oct. 2026"],
      ["Retour", "24 oct. 2026"],
    ],
  },
} as const;

type VoucherId = keyof typeof VOUCHERS;

const PRIMARY_BUTTON = "h-10 px-space-md rounded-full bg-primary text-on-primary font-label-md text-label-md";
const SECONDARY_BUTTON =
  "h-10 px-space-md rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-space-xs";

function PrintButton() {
  return (
    <button className={SECONDARY_BUTTON} onClick={() => window.print()} type="button">
      <span className="material-symbols-outlined text-[16px]">print</span> Imprimer / PDF
    </button>
  );
}

export function ItineraryButton({ className, children }: { className: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button className={className} onClick={() => setOpen(true)} type="button">
        {children}
      </button>
      {open && (
        <Dialog
          footer={
            <>
              <PrintButton />
              <button className={PRIMARY_BUTTON} onClick={close} type="button">
                Fermer
              </button>
            </>
          }
          icon="route"
          onClose={close}
          size="lg"
          title="Itinéraire jour par jour · Nosy Be & Archipels"
        >
          <ol className="flex flex-col gap-space-sm">
            {ITINERARY.map((step, i) => (
              <li key={step.day} className="flex gap-space-md p-space-sm rounded bg-surface-container-low">
                <div className="flex flex-col items-center shrink-0 w-14">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Jour {i + 1}</span>
                  <span className="material-symbols-outlined text-primary">{step.icon}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{step.day}</span>
                </div>
                <div>
                  <p className="font-label-lg text-label-lg text-on-surface font-bold">{step.title}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Dialog>
      )}
    </>
  );
}

export function VoucherQrButton({ id }: { id: VoucherId }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const voucher = VOUCHERS[id];

  return (
    <>
      <button
        aria-label={`Agrandir le QR code : ${voucher.title}`}
        className="w-14 h-14 bg-surface-container-lowest p-1 rounded flex items-center justify-center shadow-sm hover:ring-2 hover:ring-primary transition-shadow flex-shrink-0"
        onClick={() => setOpen(true)}
        type="button"
      >
        <span className="material-symbols-outlined text-[44px] text-on-surface">qr_code</span>
      </button>
      {open && (
        <Dialog
          footer={
            <>
              <PrintButton />
              <button className={PRIMARY_BUTTON} onClick={close} type="button">
                Fermer
              </button>
            </>
          }
          icon={voucher.icon}
          onClose={close}
          title={voucher.title}
        >
          <div className="flex flex-col items-center gap-space-xs py-space-sm">
            <QrCode className="w-56 h-56 text-black" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">Référence</span>
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
            Montez la luminosité de votre écran au maximum lors du contrôle. Ce QR code reste accessible hors connexion.
          </p>
        </Dialog>
      )}
    </>
  );
}

export function CertificateButton({ className, children }: { className: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button className={className} onClick={() => setOpen(true)} type="button">
        {children}
      </button>
      {open && (
        <Dialog
          footer={
            <>
              <PrintButton />
              <button className={PRIMARY_BUTTON} onClick={close} type="button">
                Fermer
              </button>
            </>
          }
          icon="workspace_premium"
          onClose={close}
          title="Certificat de reboisement"
        >
          <div className="border-2 border-secondary rounded-lg p-space-lg text-center flex flex-col gap-space-xs">
            <span className="material-symbols-outlined text-secondary text-[40px] mx-auto">park</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Madagascar National Parks & MadaVoyage certifient que</p>
            <p className="font-headline-sm text-headline-sm text-on-surface font-bold">Alexandre Fontaine</p>
            <p className="font-body-md text-body-md text-on-surface">
              a contribué à la plantation de <strong>12 arbres endémiques</strong> lors de l'expédition « Sanctuaires de Sainte-Marie & Île
              aux Nattes » en août 2024.
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant pt-space-xs">Certificat n° MNP-REB-2024-0812</p>
          </div>
        </Dialog>
      )}
    </>
  );
}

const PROFILES_KEY = "mv_compte_regimes";

const TRAVELERS = [
  {
    id: "alexandre",
    name: "Alexandre Fontaine",
    role: "Adulte Principal",
    roleClass: "bg-surface-container-high text-primary",
    rows: [
      ["Passeport FR :", "22AF98104"],
      ["Validité :", "12/2029"],
      ["Nationalité :", "Française"],
    ],
    regime: "Omnivore sans restriction.",
  },
  {
    id: "clara",
    name: "Clara Fontaine",
    role: "Adulte",
    roleClass: "bg-surface-container-high text-primary",
    rows: [
      ["Passeport FR :", "24CF12890"],
      ["Validité :", "06/2030"],
      ["Nationalité :", "Française"],
    ],
    regime: "Locavore, sans fruits de mer (allergie déclarée).",
  },
  {
    id: "enzo",
    name: "Enzo Fontaine",
    role: "Enfant (8 ans)",
    roleClass: "bg-secondary-fixed text-on-secondary-fixed",
    rows: [
      ["Passeport FR :", "25EF77412"],
      ["Validité :", "09/2028"],
      ["Date naiss. :", "14/05/2018"],
    ],
    regime: "Menu adapté enfant, snacks fruits exotiques.",
  },
] as const;

type Regimes = Record<string, string>;
const DEFAULT_REGIMES: Regimes = Object.fromEntries(TRAVELERS.map((t) => [t.id, t.regime]));

export function TravelerProfiles() {
  const [regimes, setRegimes] = useState<Regimes>(DEFAULT_REGIMES);
  const [draft, setDraft] = useState<Regimes | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(PROFILES_KEY);
      if (stored) setRegimes({ ...DEFAULT_REGIMES, ...JSON.parse(stored) });
    } catch {
      window.localStorage.removeItem(PROFILES_KEY);
    }
  }, []);

  const editing = draft !== null;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-xs">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary">diversity_3</span>
            Composition Familiale &amp; Profils Voyageurs
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Informations biométriques certifiées pour les vols Madagascar Airlines et la billetterie parcs MNP.
          </p>
        </div>
        {!editing && (
          <button
            className="h-10 px-space-md rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-space-xs self-start sm:self-auto transition-colors"
            onClick={() => {
              setDraft(regimes);
              setSaved(false);
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-body-sm">edit</span>
            <span>Modifier les régimes alimentaires</span>
          </button>
        )}
      </div>

      <form
        className="flex flex-col gap-space-md"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft) return;
          setRegimes(draft);
          window.localStorage.setItem(PROFILES_KEY, JSON.stringify(draft));
          setDraft(null);
          setSaved(true);
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {TRAVELERS.map((t) => (
            <div key={t.id} className="p-space-md rounded bg-surface-container-low flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-lg text-label-lg text-on-surface font-bold">{t.name}</span>
                <span className={`px-space-xs py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${t.roleClass}`}>{t.role}</span>
              </div>
              <div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                {t.rows.map(([label, value], i) => (
                  <div key={label} className="flex items-center justify-between">
                    <span>{label}</span>
                    <span className={i === 0 ? "font-bold text-on-surface font-label-sm" : "text-on-surface"}>{value}</span>
                  </div>
                ))}
              </div>
              {editing ? (
                <label className="flex flex-col gap-1 pt-space-xs font-label-sm text-label-sm text-secondary">
                  Régime de {t.name.split(" ")[0]}
                  <textarea
                    className="rounded bg-surface-container-lowest p-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                    maxLength={160}
                    onChange={(e) => setDraft((d) => ({ ...d, [t.id]: e.target.value }))}
                    rows={2}
                    value={draft?.[t.id] ?? ""}
                  />
                </label>
              ) : (
                <div className="pt-space-xs text-body-sm text-on-surface-variant">
                  <span className="font-label-sm text-label-sm text-secondary">Régime :</span> {regimes[t.id]}
                </div>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <div className="flex flex-wrap items-center justify-end gap-space-sm">
            <p className="font-body-sm text-body-sm text-on-surface-variant mr-auto">
              Les données de passeport ne sont modifiables que par la conciergerie, sur présentation du document.
            </p>
            <button className={SECONDARY_BUTTON} onClick={() => setDraft(null)} type="button">
              Annuler
            </button>
            <button className={PRIMARY_BUTTON} type="submit">
              Enregistrer
            </button>
          </div>
        )}
        <div aria-live="polite" role="status">
          {saved && (
            <p className="font-body-sm text-body-sm text-secondary flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Régimes enregistrés. Le lodge et votre guide en seront informés.
            </p>
          )}
        </div>
      </form>
    </>
  );
}
