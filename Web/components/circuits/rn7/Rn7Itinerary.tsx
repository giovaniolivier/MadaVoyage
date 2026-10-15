"use client";

import { useId, useState } from "react";

type Tag = { label: string; impact?: boolean };

type Day = {
  id: string;
  badge: string;
  route: string;
  title: string;
  text: string;
  tags: Tag[];
  image: { src: string; alt: string };
};

const DAYS: Day[] = [
  {
    id: "j1",
    badge: "J1",
    route: "Antananarivo → Antsirabe • 170 km",
    title: "La ville d’eau et les artisans des Hautes Terres",
    text: "Départ matinal d’Antananarivo à travers la RN7 sinueuse bordée de collines de latérite rouge et de maisons traditionnelles à varangues. Arrivée à Antsirabe pour explorer les ateliers de cornes de zébu, de miniatures recyclées et une balade contemplative en pousse-pousse coloré.",
    tags: [{ label: "Hébergement : Eco-Lodge Couleur Café" }, { label: "Repas : Dîner terroir inclus" }],
    image: {
      alt: "Pousse-pousse coloré dans une rue arborée d'Antsirabe, architecture coloniale en arrière-plan",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4Z1_e4JO9ADm71giDfMG0qHnOQj75RRBYCMgMb54fh0GlhuIUDceXlUZld4YjmVANwYiptWx_aEPqTCK86J61JEppqk3iPgm6UuTbE5yFj5VWEaMlWMnfpftpX5htuNfzMTc13Dd6UQ8i8VDOPAsM4Sr7MpssjZFVxD6V7UIK0VCxvFB-MOii0glQvmF8TnoufEeQrjBHBDtctrjWciBVLNTZmyfOb-sNvoI8zeWM020f01T5b7I",
    },
  },
  {
    id: "j2-3",
    badge: "J2-3",
    route: "Ambositra & Parc National de Ranomafana • 230 km",
    title: "Artisans Zafimaniry & Forêt Tropicale Humide MNP",
    text: "Halte culturelle à Ambositra, capitale de la marqueterie et des sculptures sur bois des Zafimaniry. Poursuite vers l’est tropical jusqu’aux brumes de Ranomafana. Journée entière consacrée à la traque des lémuriens avec les guides écologiques certifiés Madagascar National Parks.",
    tags: [{ label: "Hébergement : Thermal Rainforest Lodge" }, { label: "Guide MNP privé inclus" }],
    image: {
      alt: "Canopée dense de la forêt tropicale de Ranomafana avec cascades et fougères dans la brume",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCeKdFNoVb7NehMLZsX7tZ518obJeNJ3NLf2Mu0TKNmOz0RpJbhxsmtbrXfigOXWlBWEvnJnJkDIo1TRQxIOioWwSlHdIm2qgKnAxyEWv570k7LkRHbM6DqpIJWwdFMF8b1lnw6eIOS2rsA7YR-GRaRJ4RzTenJzEHHswGcMvCbIozJtxXED0shkqGdznZMSfthdYCB6-u24AZx-MYKDlqGft0Vwt2saH-3Kp4h8s5QnQYfC5_6aY",
    },
  },
  {
    id: "j4-5",
    badge: "J4-5",
    route: "Fianarantsoa & Réserve Villageoise d’Anja • 150 km",
    title: "Vieille ville Betsileo & Sanctuaire communautaire des Makis",
    text: "Ascension pédestre de la vieille ville historique de Fianarantsoa. Le lendemain, étape émouvante à la Réserve d'Anja : un modèle mondial d’éco-gestion villageoise où les makis catta vivent en liberté totale entre d'immenses blocs de granit sacrés.",
    tags: [{ label: "Impact Fihavanana : Soutien direct aux écoles", impact: true }, { label: "Hébergement : Camp Écologique Tsaranoro" }],
    image: {
      alt: "Groupe de makis catta sauvages sur un énorme bloc de granit dans la réserve d'Anja",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsG13al8pzFgEuWspDJ8Krv5QWpALg72EdQ6OGDtdBvSZQiYvNjqCwOdDjzN1ianNORsetMl6EJuLPFI7AfLu1iBI5bA2vSX2NBdIladTwmxnIBobLG-DnRIYBBjnRArsV2E2R9UeBxmxkkjD4DDRDAQMr0XyLOsp3EX56j2fBs-kNHRzLXHiKAp3PCntnH15-jL1RzCLEZOWXNE5lQ4_eguCvJj0YQtALeDkS42d4kjdDl7ULlzI",
    },
  },
  {
    id: "j6-7",
    badge: "J6-7",
    route: "Massif de l’Isalo • 210 km",
    title: "Randonnée dans les Canyons & Coucher de Soleil Doré",
    text: "Le Colorado malgache se déploie. Marche à travers le plateau désertique, descente dans les canyons frais pour rejoindre la Piscine Naturelle aux eaux cristallines. Fin d'après-midi contemplative devant la fameuse Fenêtre de l'Isalo aux teintes pourpres.",
    tags: [{ label: "Hébergement : Le Jardin du Roy Lodge" }, { label: "Rando guidée : 5h modérée" }],
    image: {
      alt: "Soleil couchant à travers la Fenêtre de l'Isalo, au-dessus des vastes plaines",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZL96L8mHHCbeFOE99XufQQIT0Zx5nw2cI3B3H6NwE1r1X1T-5zBciEa-8rRgXbZaaTHYgHg1CiU5DFwq5VywEdMAgHa4TOBnIWYjIDEZaYhrM9r06ugqenxHIjKqoozG9ELKFBK6DLH7Xy_9inTrtAgs_UG2hAr7ZoNrRbZFy3W4D5SDxaa2kuCH9ZrkaTir2i_ZBAm_ImkoWwtEBGFDjAVY3HkvWIiJ6eqhttWC1zC5AIP6gOgU",
    },
  },
  {
    id: "j8-10",
    badge: "J8-10",
    route: "Tuléar, Forêt de Baobabs & Ifaty • 240 km",
    title: "Lagon Turquoise & Culture Maritime Vezo",
    text: "Arrivée à Tuléar puis transfert vers la côte d'Ifaty. Randonnée botanique dans la forêt de baobabs épineux de Reniala. Initiation à la navigation en pirogue à balancier avec les pêcheurs nomades Vezo et temps libre face au canal du Mozambique.",
    tags: [{ label: "Hébergement : Dunes d’Ifaty Eco-Resort" }, { label: "Transfert aéroport Tuléar inclus" }],
    image: {
      alt: "Baobabs millénaires en forme de bouteille dans la forêt épineuse de Reniala près d'Ifaty",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuARPWCRgf9TsLVW_mQx9nuQuCLdjzT89kW0CrvdnNXewIc1aQfTTBItyt3ueSl_X577RdMSOZ-pDmezVYQoPuiSnOsaHYFW-gapXkHY5IQSN4oy44D66ObDzakwsK1ZkN3tiVTWgwgSr_tHT4EQx1xcc8geydSbI49TOrCxbXEX1qZmrc6tbiAfM0cN8xUd89YyBYNnSwLentpv0P_sPb0zssWZrnp3YeyQ9xCXO-C6sJMpw6zzUXA",
    },
  },
];

export default function Rn7Itinerary() {
  const [open, setOpen] = useState<Set<string>>(() => new Set([DAYS[0].id]));
  const ids = useId();
  const allOpen = open.size === DAYS.length;

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">Carnet de Route</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold">Itinéraire détaillé au fil des kilomètres</h2>
        </div>
        <button
          className="font-label-md text-label-md text-primary hover:underline font-semibold"
          onClick={() => setOpen(allOpen ? new Set() : new Set(DAYS.map((d) => d.id)))}
          type="button"
        >
          {allOpen ? "Tout replier" : "Tout déplier"}
        </button>
      </div>
      <div className="space-y-4">
        {DAYS.map((day) => {
          const expanded = open.has(day.id);
          const panelId = `${ids}-${day.id}`;
          return (
            <div key={day.id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
              <h3>
                <button
                  aria-controls={panelId}
                  aria-expanded={expanded}
                  className="w-full flex items-start justify-between gap-4 text-left group"
                  onClick={() => toggle(day.id)}
                  type="button"
                >
                  <span className="flex items-center gap-4">
                    <span className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center font-headline-sm text-headline-sm font-bold text-primary shrink-0">
                      {day.badge}
                    </span>
                    <span className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">{day.route}</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{day.title}</span>
                    </span>
                  </span>
                  <span
                    className={`material-symbols-outlined text-outline-variant group-hover:text-on-surface transition-all ${expanded ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    expand_more
                  </span>
                </button>
              </h3>
              <div
                className={`${expanded ? "flex" : "hidden"} mt-4 pt-4 border-t border-surface-container flex-col md:flex-row gap-6`}
                id={panelId}
              >
                <div className="flex-1 space-y-2">
                  <p className="font-body-md text-body-md text-on-surface-variant">{day.text}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {day.tags.map((tag) => (
                      <span
                        key={tag.label}
                        className={`px-2.5 py-1 rounded-md font-label-sm text-label-sm ${
                          tag.impact ? "bg-secondary-container/40 text-on-secondary-container" : "bg-surface-container text-on-surface"
                        }`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                  <div
                    aria-label={day.image.alt}
                    className="w-full h-full bg-cover bg-center"
                    role="img"
                    style={{ backgroundImage: `url('${day.image.src}')` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
