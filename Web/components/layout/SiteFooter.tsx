import Link from "next/link";
import { OpenCookieManagerButton } from "@/components/consent/CookieConsent";
import { PaymentLogos } from "@/components/home/PaymentMethods";
import {
  ACCREDITATIONS,
  AGENCIES,
  EMAIL,
  HEAD_OFFICE,
  LICENSE,
  PHONE,
  SOCIALS,
  SOLIDARITY_RATE,
  SOLIDARITY_USES,
  SUPPORT_HOURS,
  TAGLINE,
  WHATSAPP,
} from "@/lib/site";
import FooterPrefs from "./FooterPrefs";

type FooterLink = { href: string; label: string };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Circuits phares",
    links: [
      { href: "/circuits/rn7", label: "La traversée RN7 et Isalo" },
      { href: "/circuits?region=nord", label: "Archipel de Nosy Be" },
      { href: "/circuits?region=est", label: "Forêts d'Andasibe" },
      { href: "/circuits?region=ouest", label: "Tsingy de Bemaraha et baobabs" },
      { href: "/hebergements", label: "Tous nos hébergements" },
    ],
  },
  {
    title: "Préparer mon voyage",
    links: [
      { href: "/simulateur", label: "Simulateur de budget" },
      { href: "/reservation/dates", label: "Voyage sur mesure" },
      { href: "/connexion", label: "Se connecter" },
      { href: "/compte", label: "Espace voyageur" },
      { href: "/aide#etat-parcs", label: "État des vols et des routes" },
    ],
  },
  {
    title: "Aide et confiance",
    links: [
      { href: "/aide", label: "Santé et vaccins" },
      { href: "/aide", label: "Visa et formalités" },
      { href: "/modification", label: "Modifier ou annuler" },
      { href: "/avis", label: "Avis des voyageurs" },
      { href: "/engagement", label: "Pacte Fihavanana" },
      { href: "/partenaires", label: "Espace partenaires" },
      { href: "/plan-du-site", label: "Plan du site" },
    ],
  },
];

const LEGAL: FooterLink[] = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/mentions-legales#rgpd", label: "Confidentialité" },
  { href: "/mentions-legales#cgv", label: "CGV" },
];

const BADGES = [
  { id: "ontm", icon: "verified", tone: "text-primary", title: "Agence agréée", pendingTitle: "Agence agréée" },
  { id: "mnp", icon: "park", tone: "text-secondary", title: "Partenaire officiel", pendingTitle: "Partenariat" },
] as const;

const titleClass = "font-label-md text-label-md font-extrabold uppercase tracking-wider text-on-surface mb-space-xs";
const linkClass = "font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors";

function LinkList({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="flex flex-col gap-space-sm">
      <h2 className={titleClass}>{title}</h2>
      <ul className="flex flex-col gap-space-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link className={linkClass} href={l.href}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SOCIAL_ICONS = [
  {
    name: "Facebook",
    href: SOCIALS.facebook,
    icon: <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v9h4v-9h3l1-4h-4V9c0-.6.4-1 1-1z" />,
  },
  {
    name: "Instagram",
    href: SOCIALS.instagram,
    icon: (
      <>
        <rect fill="none" height="18" rx="5" stroke="currentColor" strokeWidth="2" width="18" x="3" y="3" />
        <circle cx="12" cy="12" fill="none" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.3" />
      </>
    ),
  },
  {
    name: "YouTube",
    href: SOCIALS.youtube,
    icon: (
      <>
        <rect height="14" rx="4" width="22" x="1" y="5" />
        <path className="fill-surface-container-low" d="M10 9v6l5-3z" />
      </>
    ),
  },
];

export default function SiteFooter() {
  return (
    <footer className="w-full bg-surface-container-low text-on-surface-variant border-t border-outline-variant/40">
      <div className="max-w-[1440px] mx-auto px-margin lg:px-margin-desktop pt-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl pb-space-xl">
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            <Link className="flex items-center gap-space-sm self-start" href="/">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[20px]">forest</span>
              </div>
              <span className="flex flex-col">
                <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface font-extrabold leading-none">
                  Mada<span className="text-primary">Voyage</span>
                </span>
                <span className="font-label-sm text-label-sm tracking-widest uppercase text-secondary font-bold mt-0.5">{TAGLINE}</span>
              </span>
            </Link>
            <p className="font-body-md text-body-md max-w-sm">
              Agence réceptive d'écotourisme à Madagascar. {SOLIDARITY_RATE} de chaque réservation finance le{" "}
              <Link className="text-primary font-semibold hover:underline underline-offset-4" href="/engagement">
                fonds Fihavanana
              </Link>{" "}
              : {SOLIDARITY_USES}.
            </p>

            <address className="not-italic flex flex-col gap-space-sm font-body-md text-body-md">
              <span className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[20px] text-primary">apartment</span>
                <span>
                  <strong className="text-on-surface">Siège :</strong> {HEAD_OFFICE}
                  <br />
                  <strong className="text-on-surface">Agences :</strong> {AGENCIES.join(" · ")}
                </span>
              </span>
              <a
                aria-label={`Appeler le ${PHONE.display}`}
                className="flex items-center gap-space-sm hover:text-primary transition-colors"
                href={PHONE.href}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary">
                  call
                </span>
                <span>
                  <strong className="text-on-surface">Téléphone :</strong> {PHONE.display}
                </span>
              </a>
              <a
                aria-label={`Écrire sur WhatsApp au ${WHATSAPP.display} (nouvel onglet)`}
                className="flex items-center gap-space-sm hover:text-primary transition-colors"
                href={WHATSAPP.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-secondary">
                  chat
                </span>
                <span>
                  <strong className="text-on-surface">WhatsApp :</strong> {WHATSAPP.display}
                </span>
              </a>
              <a className="flex items-center gap-space-sm hover:text-primary transition-colors" href={EMAIL.href}>
                <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary">
                  mail
                </span>
                {EMAIL.display}
              </a>
              <span className="flex items-start gap-space-sm">
                <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary">
                  schedule
                </span>
                <span>
                  <strong className="text-on-surface">Assistance :</strong> {SUPPORT_HOURS.long}.
                  <br />
                  {SUPPORT_HOURS.urgent}.
                </span>
              </span>
            </address>

            <ul aria-label="Réseaux sociaux" className="flex items-center gap-space-sm">
              {SOCIAL_ICONS.map((s) => (
                <li key={s.name}>
                  <a
                    aria-label={`MadaVoyage sur ${s.name}`}
                    className="w-11 h-11 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
                    href={s.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg aria-hidden="true" className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      {s.icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Pied de page" className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-space-xl">
            {COLUMNS.map((col) => (
              <LinkList key={col.title} links={col.links} title={col.title} />
            ))}
          </nav>
        </div>

        <div className="py-space-lg border-t border-outline-variant/50 flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg">
          <ul aria-label="Agrément et partenariats" className="flex flex-wrap items-center gap-space-md">
            {BADGES.map((b) => {
              const { name, short, displayAllowed, logo } = ACCREDITATIONS[b.id];
              return (
                <li key={b.id}>
                  <span className="flex items-center gap-space-sm px-space-md min-h-12 py-1.5 rounded-full bg-surface-container-lowest">
                    {displayAllowed && logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={`Logo ${short}`} className="h-8 w-auto" src={logo} />
                    ) : (
                      <span aria-hidden="true" className={`material-symbols-outlined text-[22px] ${b.tone}`}>
                        {b.icon}
                      </span>
                    )}
                    <span className="leading-tight">
                      <span className="block font-label-md text-label-md font-bold text-on-surface">
                        {displayAllowed ? b.title : b.pendingTitle}
                      </span>
                      <span className="block font-body-sm text-body-sm">{name}</span>
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
          <PaymentLogos size="sm" />
          <FooterPrefs />
        </div>

        <div className="py-space-md border-t border-outline-variant/50 flex flex-col md:flex-row md:items-center justify-between gap-space-sm font-body-sm text-body-sm">
          <p>
            © {new Date().getFullYear()} MadaVoyage {TAGLINE} · {LICENSE} · Taux de change :{" "}
            <a className="underline underline-offset-2" href="https://www.exchangerate-api.com" rel="noopener noreferrer" target="_blank">
              Rates By Exchange Rate API
            </a>
          </p>
          <ul aria-label="Informations légales" className="flex items-center gap-x-space-md gap-y-1 flex-wrap">
            {LEGAL.map((l) => (
              <li key={l.label}>
                <Link className="hover:text-primary transition-colors" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <OpenCookieManagerButton className="hover:text-primary transition-colors">Cookies</OpenCookieManagerButton>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

/** Pied de page du tunnel : les seules mentions obligatoires, ouvertes dans un nouvel onglet pour ne pas quitter la réservation. */
export function TunnelFooter() {
  return (
    <footer className="bg-surface-container-low text-on-surface-variant">
      <div className="max-w-[1440px] mx-auto px-margin lg:px-margin-desktop py-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-sm font-body-md text-body-md">
        <p className="flex items-center gap-space-xs">
          <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary">
            lock
          </span>
          Paiement sécurisé · © {new Date().getFullYear()} MadaVoyage · {LICENSE}
        </p>
        <ul aria-label="Informations légales" className="flex items-center gap-x-space-md gap-y-1 flex-wrap">
          {LEGAL.map((l) => (
            <li key={l.label}>
              <a className="hover:text-primary transition-colors" href={l.href} rel="noopener" target="_blank">
                {l.label}
                <span className="sr-only"> (nouvel onglet)</span>
              </a>
            </li>
          ))}
          <li>
            <OpenCookieManagerButton className="hover:text-primary transition-colors">Cookies</OpenCookieManagerButton>
          </li>
        </ul>
      </div>
    </footer>
  );
}
