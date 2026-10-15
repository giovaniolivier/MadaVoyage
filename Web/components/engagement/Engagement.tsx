"use client";

import { useCallback, useState } from "react";
import Dialog from "@/components/ui/Dialog";
import { FAMILIES_IMPACT, FAMILIES_SUPPORTED, SOLIDARITY_RATE } from "@/lib/site";

const FILTERS = [
  { id: "all", label: "Tous les Projets" },
  { id: "foret", label: "Forêt Primaire" },
  { id: "littoral", label: "Littoral & Corail" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const STATUS = {
  actif: {
    label: "En cours actif",
    dot: "bg-secondary",
    text: "text-secondary",
    badge: "bg-secondary/15 text-secondary",
    bar: "bg-secondary",
  },
  extension: {
    label: "Phase d'extension",
    dot: "bg-primary",
    text: "text-primary",
    badge: "bg-primary/15 text-primary",
    bar: "bg-primary",
  },
  atteint: {
    label: "Objectif 2025 atteint",
    dot: "bg-tertiary",
    text: "text-tertiary",
    badge: "bg-tertiary/15 text-tertiary",
    bar: "bg-tertiary",
  },
} as const;

type Project = {
  id: string;
  pin: string;
  pinClass: string;
  region: string;
  title: string;
  text: string;
  progress: number;
  status: keyof typeof STATUS;
  category: Exclude<FilterId, "all"> | "communautes";
};

const PROJECTS: Project[] = [
  {
    id: "sambirano",
    pin: "Sambirano · Agroforesterie",
    pinClass: "top-12 left-16",
    region: "Vallée du Sambirano",
    title: "Cacaoyers Bio & Vanille Sous Ombrage",
    text: "Transition agro-écologique de 85 planteurs vers des variétés ancestrales sans intrants chimiques.",
    progress: 84,
    status: "actif",
    category: "foret",
  },
  {
    id: "nosy-faly",
    pin: "Nosy Faly · Mangroves",
    pinClass: "top-6 right-1/3",
    region: "Baie de Nosy Faly",
    title: "Replantation des Palétuviers",
    text: "Restauration de 18 hectares de mangrove avec les pêcheurs pour protéger les nurseries de poissons et de crabes.",
    progress: 61,
    status: "extension",
    category: "littoral",
  },
  {
    id: "andasibe",
    pin: "Andasibe · Reforestation Indri",
    pinClass: "top-44 right-20",
    region: "Andasibe-Mantadia",
    title: "Corridor Biologique Mitsinjo",
    text: "Restauration de 42 hectares de forêt dense humide pour interconnecter 3 groupes familiaux d'Indri-indri.",
    progress: 98,
    status: "extension",
    category: "foret",
  },
  {
    id: "ranohira",
    pin: "Isalo · Puits Solaires Ranohira",
    pinClass: "bottom-28 left-28",
    region: "Ranohira (Isalo)",
    title: "Adduction d'Eau Potable Scolaire",
    text: "Mise en service du forage profond et panneaux photovoltaïques alimentant l'école communale et le dispensaire.",
    progress: 100,
    status: "atteint",
    category: "communautes",
  },
  {
    id: "salary",
    pin: "Salary · Récif Vezo Protégé",
    pinClass: "bottom-12 right-36",
    region: "Baie de Salary",
    title: "Aire Marine Gérée par les Vezo",
    text: "Fermetures temporaires de pêche du poulpe et suivi du récif corallien par 40 pêcheurs formés à la plongée scientifique.",
    progress: 76,
    status: "actif",
    category: "littoral",
  },
];

export function ImpactMap() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const visible = PROJECTS.filter((p) => filter === "all" || p.category === filter);
  const count = (id: FilterId) => PROJECTS.filter((p) => id === "all" || p.category === id).length;

  const select = (id: string) => {
    setSelected(id);
    document.getElementById(`projet-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <div className="bg-surface-container-low p-space-xl rounded shadow-[0_2px_8px_-2px_rgba(15,163,177,0.06)]">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg mb-space-xl">
        <div>
          <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm mb-space-xs font-bold">
            <span className="material-symbols-outlined text-[16px]">location_searching</span>
            <span>Traçabilité Géographique Totale</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Carte d'Impact & Projets en Direct</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-1">
            Visualisez où et comment nos micro-financements agissent sur la biodiversité malgache.
          </p>
        </div>
        <div
          aria-label="Filtrer les projets"
          className="flex flex-wrap items-center gap-space-sm p-1 bg-surface-container-lowest rounded-full shadow-sm"
          role="group"
        >
          {FILTERS.map((f) => (
            <button
              key={f.id}
              aria-pressed={filter === f.id}
              className={`px-space-md py-space-xs rounded-full font-label-sm text-label-sm transition-colors ${
                filter === f.id
                  ? "bg-primary text-on-primary font-bold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface font-semibold"
              }`}
              onClick={() => {
                setFilter(f.id);
                setSelected(null);
              }}
              type="button"
            >
              {`${f.label} (${count(f.id)})`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative w-full h-[480px] rounded overflow-hidden shadow-md">
            <div
              aria-label="Carte de Madagascar situant les projets financés par MadaVoyage"
              className="w-full h-full bg-cover bg-center"
              role="img"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSc87VH_c4XNIM83XSXMpE8NwGnue0YSERjCcf0epLlH5yQDzKGmPfKBoptB1MvgKIHaVCkxiCmm8Ynu0DCe2zPEg9Nxgkhdcc8hNyljLbZNr4FKOXHt10-8OYxaA1hSWiLQ_7TfCZOIrIdV7eSKcOATstS3NG0CF_UkPCLTplQb4wSds00QaoGyfgfIuaup6d2ZkVJpIvFDLSYCdomRdoTINhKtjJutf6Ef9yzqlKbu1P00YQ5js')",
              }}
            ></div>
            {visible.map((p) => {
              const status = STATUS[p.status];
              const active = selected === p.id;
              return (
                <button
                  key={p.id}
                  aria-pressed={active}
                  className={`absolute ${p.pinClass} p-space-sm backdrop-blur-md rounded shadow-lg flex items-center gap-space-xs hover:scale-105 transition-transform ${
                    active
                      ? "bg-on-surface text-surface ring-2 ring-secondary-fixed scale-105"
                      : "bg-surface-container-lowest/95 text-on-surface"
                  }`}
                  onClick={() => select(p.id)}
                  type="button"
                >
                  <span className={`w-3 h-3 rounded-full ${status.dot} ${p.status === "actif" ? "animate-pulse" : ""}`}></span>
                  <span className="font-label-sm text-label-sm font-bold">{p.pin}</span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-space-sm mt-space-sm px-space-xs text-on-surface-variant font-body-sm text-body-sm">
            {Object.values(STATUS).map((s) => (
              <span key={s.label} className="flex items-center gap-1">
                <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`}></span> {s.label}
              </span>
            ))}
            <span>Cliquez sur un repère pour voir le projet</span>
          </div>
        </div>

        <ul aria-live="polite" className="lg:col-span-5 flex flex-col gap-space-sm lg:max-h-[520px] lg:overflow-y-auto pr-1">
          {visible.map((p) => {
            const status = STATUS[p.status];
            const active = selected === p.id;
            return (
              <li
                key={p.id}
                className={`p-space-md bg-surface-container-lowest rounded shadow-sm hover:shadow-md transition-all scroll-mt-28 ${
                  active ? "ring-2 ring-primary" : ""
                }`}
                id={`projet-${p.id}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-label-sm text-label-sm uppercase tracking-wider font-bold ${status.text}`}>{p.region}</span>
                  <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${status.badge}`}>
                    {p.progress === 100 ? "Objectif 100%" : `${p.progress}% Réalisé`}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{p.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{p.text}</p>
                <div
                  aria-label={`Avancement : ${p.progress} %`}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={p.progress}
                  className="w-full bg-surface-container-high h-1.5 rounded-full mt-space-sm overflow-hidden"
                  role="progressbar"
                >
                  <div className={`${status.bar} h-full rounded-full`} style={{ width: `${p.progress}%` }}></div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

const REPORT = [
  ["Arbres endémiques replantés", "24 500"],
  ["Part reversée aux communautés", `${SOLIDARITY_RATE} de chaque réservation`],
  ["Écoles soutenues", "14"],
  ["Guides certifiés MNP", "64"],
  ["Familles bénéficiaires", `${FAMILIES_SUPPORTED} depuis ${FAMILIES_IMPACT.since}`],
  ["Artisans accompagnés", "115"],
  ["Bouteilles plastiques évitées", "128 000 / an"],
  ["Taux de survie des semis", "92,4 % sur 3 ans"],
];

export function ImpactReportButton({ className, children }: { className: string; children: React.ReactNode }) {
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
              <button
                className="h-10 px-space-md rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-space-xs"
                onClick={() => window.print()}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">print</span> Imprimer / PDF
              </button>
              <button
                className="h-10 px-space-md rounded-full bg-primary text-on-primary font-label-md text-label-md"
                onClick={close}
                type="button"
              >
                Fermer
              </button>
            </>
          }
          icon="eco"
          onClose={close}
          size="lg"
          title="Rapport d'impact RSE 2025 · Synthèse"
        >
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Indicateurs consolidés au 31 décembre 2025, audités par l'ONG Mitsinjo et l'Office National du Tourisme de Madagascar.
          </p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            {REPORT.map(([term, value]) => (
              <div key={term} className="p-space-sm rounded bg-surface-container-low">
                <dt className="font-body-sm text-body-sm text-on-surface-variant">{term}</dt>
                <dd className="font-headline-sm text-headline-sm font-bold text-on-surface">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Le rapport complet est disponible sur demande auprès de notre équipe à{" "}
            <a
              className="text-primary font-semibold hover:underline"
              href="mailto:impact@madavoyage.mg?subject=Rapport%20d%27impact%20RSE%202025"
            >
              impact@madavoyage.mg
            </a>
            .
          </p>
        </Dialog>
      )}
    </>
  );
}
