import type { Metadata } from "next";
import Link from "next/link";
import Pending from "@/components/ui/Pending";
import { PARTNERS_EMAIL, SOLIDARITY_TEXT, SUPPORT_HOURS, WHATSAPP } from "@/lib/site";

export const metadata: Metadata = {
  title: "Espace partenaires | MadaVoyage",
  description:
    "Lodges, guides et agences : travaillez avec MadaVoyage. Conditions de partenariat, pacte Fihavanana et contact de l'équipe partenaires.",
};

const PROFILES = [
  {
    icon: "cottage",
    title: "Lodges et hébergements",
    text: "Disponibilités, tarifs nets et contrats de saison. Paiement à 30 jours après le départ des voyageurs.",
  },
  {
    icon: "hiking",
    title: "Guides et associations locales",
    text: "Missions planifiées à l'avance, rémunération fixée avant le départ et versée en Mobile Money.",
  },
  {
    icon: "travel_explore",
    title: "Agences et voyagistes",
    text: "Circuits en marque blanche et tarifs professionnels pour vos clients à Madagascar.",
  },
];

export default function Page() {
  return (
    <main className="w-full pt-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-margin lg:px-margin-desktop py-space-xl flex flex-col gap-space-xl">
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
          <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
              home
            </span>
            <span>Accueil</span>
          </Link>
          <span aria-hidden="true" className="material-symbols-outlined text-[14px] text-outline-variant">
            chevron_right
          </span>
          <span aria-current="page" className="text-primary font-bold">
            Espace partenaires
          </span>
        </nav>

        <header className="flex flex-col gap-space-sm">
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Espace partenaires</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Lodges, guides et agences : nous travaillons avec des acteurs locaux qui signent le pacte Fihavanana. {SOLIDARITY_TEXT}
          </p>
          <Pending>Connexion à l&apos;espace en ligne en préparation : contactez l&apos;équipe partenaires</Pending>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
          {PROFILES.map((p) => (
            <li key={p.title} className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-sm">
              <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
                  {p.icon}
                </span>
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">{p.title}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">{p.text}</p>
            </li>
          ))}
        </ul>

        <section
          aria-labelledby="contact-partenaires"
          className="bg-surface-container-low rounded-lg p-space-lg flex flex-col gap-space-md"
        >
          <h2 className="font-headline-sm text-headline-sm text-on-surface" id="contact-partenaires">
            Devenir partenaire
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Présentez votre activité en quelques lignes (lieu, capacité, photos). Réponse sous 5 jours ouvrés. {SUPPORT_HOURS.long}.
          </p>
          <div className="flex flex-wrap gap-space-sm">
            <a
              className="inline-flex items-center gap-2 px-space-lg h-12 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-on-primary-fixed-variant transition-colors"
              href={`${PARTNERS_EMAIL.href}?subject=${encodeURIComponent("Demande de partenariat")}`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                mail
              </span>
              {PARTNERS_EMAIL.display}
            </a>
            <a
              aria-label={`Écrire sur WhatsApp au ${WHATSAPP.display} (nouvel onglet)`}
              className="inline-flex items-center gap-2 px-space-lg h-12 rounded-full border border-outline text-on-surface font-label-md text-label-md font-bold hover:bg-surface-container-high transition-colors"
              href={WHATSAPP.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                chat
              </span>
              WhatsApp {WHATSAPP.display}
            </a>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Lire le{" "}
            <Link className="text-primary font-semibold underline underline-offset-4" href="/engagement">
              pacte Fihavanana
            </Link>{" "}
            avant de nous écrire.
          </p>
        </section>
      </div>
    </main>
  );
}
