/**
 * Bulletin « État des vols et des routes », saisi par l'équipe terrain. Exemple de maquette : à brancher sur le bulletin réel
 * avant la mise en ligne. Au-delà de `maxAgeHours`, la page n'affiche plus d'état vert et signale l'âge des données.
 */
export type RouteState = "normal" | "disrupted";

export type RouteStatus = { id: string; label: string; state: RouteState; detail: string; source: string };

export const TRAVEL_STATUS: { updatedAt: string; maxAgeHours: number; items: RouteStatus[] } = {
  updatedAt: "2026-10-13T05:30:00Z",
  maxAgeHours: 6,
  items: [
    { id: "vols", label: "Vols intérieurs Madagascar Airlines", state: "normal", detail: "Vols du jour au programme", source: "horaires Madagascar Airlines" },
    { id: "rn7", label: "RN7 et Isalo", state: "normal", detail: "Route praticable", source: "nos chauffeurs" },
    {
      id: "bemaraha",
      label: "Bacs vers les Tsingy de Bemaraha",
      state: "disrupted",
      detail: "Attente prolongée au bac de Belo-sur-Tsiribihina",
      source: "nos chauffeurs",
    },
    { id: "nosybe", label: "Mer à Nosy Be", state: "normal", detail: "Sorties en bateau maintenues", source: "nos guides de Nosy Be" },
  ],
};
