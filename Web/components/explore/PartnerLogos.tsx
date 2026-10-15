import Pending from "@/components/ui/Pending";

/**
 * Logos monochromes de démonstration : à remplacer par les fichiers officiels fournis par chaque partenaire.
 * Un logo ne s'affiche que si `writtenConsent` vaut `true`, c'est-à-dire avec l'accord écrit du partenaire archivé.
 */
const PARTNERS: { name: string; tagline: string; mark: React.ReactNode; writtenConsent: boolean }[] = [
  {
    writtenConsent: false,
    name: "Madagascar National Parks",
    tagline: "Parcs nationaux",
    mark: (
      <>
        <path d="M20 4 L34 30 H6 Z" />
        <rect height="8" width="4" x="18" y="30" />
      </>
    ),
  },
  {
    writtenConsent: false,
    name: "ONTM",
    tagline: "Office du tourisme",
    mark: (
      <>
        <circle cx="20" cy="20" fill="none" r="15" strokeWidth="4" />
        <path d="M20 9 C27 15 27 25 20 31 C13 25 13 15 20 9 Z" />
      </>
    ),
  },
  {
    writtenConsent: false,
    name: "Relais de la Reine",
    tagline: "Isalo",
    mark: <path d="M6 30 L9 12 L15 20 L20 8 L25 20 L31 12 L34 30 Z" />,
  },
  {
    writtenConsent: false,
    name: "Princesse Bora",
    tagline: "Lodge & Spa · Sainte-Marie",
    mark: (
      <>
        <path d="M4 24 C10 18 14 18 20 24 C26 30 30 30 36 24" fill="none" strokeWidth="4" />
        <path d="M4 33 C10 27 14 27 20 33 C26 39 30 39 36 33" fill="none" strokeWidth="4" />
        <circle cx="28" cy="10" r="5" />
      </>
    ),
  },
  {
    writtenConsent: false,
    name: "Anjajavy",
    tagline: "Le Lodge",
    mark: (
      <>
        <rect height="20" rx="2" width="6" x="17" y="18" />
        <path d="M20 4 C30 6 34 12 34 18 C28 14 24 14 20 18 C16 14 12 14 6 18 C6 12 10 6 20 4 Z" />
      </>
    ),
  },
];

export default function PartnerLogos() {
  const shown = PARTNERS.filter((p) => p.writtenConsent);

  if (!shown.length) {
    return (
      <div className="flex flex-col gap-4">
        <ul aria-hidden="true" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {PARTNERS.map((p) => (
            <li
              key={p.name}
              className="h-16 rounded-xl border border-dashed border-outline-variant flex items-center justify-center gap-2 text-outline"
            >
              <span className="material-symbols-outlined text-[20px]">image</span>
              <span className="font-label-md text-label-md">Logo partenaire</span>
            </li>
          ))}
        </ul>
        <Pending>Logos en attente de l&apos;accord écrit de chaque partenaire</Pending>
      </div>
    );
  }

  return (
    <ul
      aria-label="Partenaires"
      className="flex items-center gap-8 xl:justify-between overflow-x-auto pb-2 -mx-6 px-6 lg:-mx-12 lg:px-12 xl:mx-0 xl:px-0"
    >
      {shown.map((p) => (
        <li
          key={p.name}
          className="flex items-center gap-3 shrink-0 text-on-surface-variant grayscale hover:text-on-surface transition-colors"
        >
          <svg aria-hidden="true" className="w-10 h-10 shrink-0 fill-current stroke-current" viewBox="0 0 40 40">
            {p.mark}
          </svg>
          <div className="leading-tight">
            <div className="font-label-lg text-label-lg font-bold whitespace-nowrap">{p.name}</div>
            <div className="font-label-md text-label-md whitespace-nowrap">{p.tagline}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
