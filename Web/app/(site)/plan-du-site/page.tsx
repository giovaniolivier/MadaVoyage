import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Plan du site | MadaVoyage",
  description: "Toutes les pages de MadaVoyage : circuits, hébergements, réservation, espace voyageur, aide et informations légales.",
};

const SECTIONS: { title: string; icon: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Découvrir Madagascar",
    icon: "explore",
    links: [
      { href: "/", label: "Accueil" },
      { href: "/circuits", label: "Explorer les circuits" },
      { href: "/circuits/rn7", label: "La Traversée RN7 & Isalo" },
      { href: "/hebergements/manga-soa-lodge", label: "Manga Soa Lodge 4★ · Nosy Be" },
      { href: "/simulateur", label: "Simulateur de budget MGA/EUR" },
      { href: "/etats-vides", label: "Suggestions quand une recherche ne donne rien" },
    ],
  },
  {
    title: "Réserver un séjour",
    icon: "event_available",
    links: [
      { href: "/reservation/dates", label: "Étape 1 · Séjour" },
      { href: "/reservation/destination", label: "Étape 2 · Destination" },
      { href: "/reservation/budget", label: "Étape 3 · Budget" },
      { href: "/reservation/composition", label: "Étape 4 · Offre : hébergement" },
      { href: "/reservation/options", label: "Étape 4 · Offre : options et activités" },
      { href: "/reservation/recapitulatif", label: "Étape 5 · Paiement : récapitulatif" },
      { href: "/reservation/paiement", label: "Étape 5 · Paiement : passeports des voyageurs" },
      { href: "/reservation/otp", label: "Étape 5 · Paiement : validation Mobile Money" },
      { href: "/reservation/confirmation", label: "Confirmation de réservation" },
    ],
  },
  {
    title: "Espace voyageur",
    icon: "person",
    links: [
      { href: "/connexion", label: "Connexion & inscription" },
      { href: "/compte", label: "Mon compte" },
      { href: "/carnet", label: "Carnet de voyage" },
      { href: "/modification", label: "Modification, annulation & remboursement" },
      { href: "/avis", label: "Laisser un avis" },
    ],
  },
  {
    title: "Aide & informations",
    icon: "support_agent",
    links: [
      { href: "/aide", label: "Centre d'aide & conciergerie 24/7" },
      { href: "/engagement", label: "Notre engagement Fihavanana" },
      { href: "/partenaires", label: "Espace partenaires" },
      { href: "/portail", label: "Grands sanctuaires & circuits" },
      { href: "/mentions-legales", label: "Mentions légales, CGV & cookies" },
      { href: "/maintenance", label: "Alertes pistes & maintenance" },
      { href: "/piste-introuvable", label: "Page introuvable (404)" },
    ],
  },
];

export default function Page() {
  return (
    <main className="w-full pt-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-margin lg:px-margin-desktop py-space-xl flex flex-col gap-space-xl">
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
          <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Accueil</span>
          </Link>
          <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
          <span className="text-primary font-bold">Plan du site</span>
        </nav>

        <header className="flex flex-col gap-space-sm">
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Plan du site</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Toutes les pages de MadaVoyage, regroupées par usage, du choix du circuit jusqu&apos;au carnet de voyage.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-desktop">
          {SECTIONS.map((s) => (
            <section key={s.title} className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md">
              <h2 className="flex items-center gap-space-sm font-headline-sm text-headline-sm text-on-surface">
                <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                </span>
                {s.title}
              </h2>
              <ul className="flex flex-col">
                {s.links.map((l) => (
                  <li key={l.href} className="border-b border-surface-container last:border-0">
                    <Link
                      className="flex items-center justify-between gap-space-sm py-2.5 font-body-md text-body-md text-on-surface hover:text-primary transition-colors"
                      href={l.href}
                    >
                      {l.label}
                      <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
