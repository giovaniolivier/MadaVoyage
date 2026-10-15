import type { RegionId } from "@/components/circuits/catalog-data";
import type { DestinationId } from "./booking-data";
import { DESTINATIONS } from "./pricing";

export type Theme = "lagon" | "trek" | "culture" | "pirogue";

export type Photo = { img: string; alt: string };

export type ZoneCard = {
  id: DestinationId;
  region: RegionId;
  themes: Theme[];
  rank: number;
  carbon: number;
  /** Note et nombre d'avis : ceux de `DESTINATIONS`, partagés avec l'Explorer. */
  rating: number;
  reviews: number;
  badge: string;
  places: string;
  text: string;
  img: string;
  alt: string;
  /** Photos supplémentaires de la fiche destination. */
  gallery: Photo[];
  /** Durée de séjour conseillée sur place, en nuits. */
  nights: [number, number];
  /** Identifiant partagé avec les favoris de l'accueil et du portail. */
  favoriteId: string;
  /** `seasonal` : nom de l'activité dans `ZONE_SEASONS`, pour signaler qu'elle est hors saison aux dates choisies. */
  highlights: { icon: string; label: string; seasonal?: string }[];
  climate: string;
  lodge: string;
};

export const ZONE_CARDS: ZoneCard[] = [
  {
    id: "nosy-be",
    region: "nord",
    themes: ["lagon", "trek", "culture", "pirogue"],
    rank: 1,
    carbon: 2,
    rating: DESTINATIONS["nosy-be"].rating,
    reviews: DESTINATIONS["nosy-be"].reviews,
    badge: "Refuge marin & Corail",
    places: "Nosy Komba · Tanikely · Archipel des Mitsio",
    text: "Lagons turquoise, forêt primaire de Lokobe et plantations de vanille : l'archipel idéal pour une première immersion en famille.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPrL3U80oEPqDau96uxP3rTvhKFPWMg4k15UG894Y-5akV7w0Bd13cA_sdaLmqaaVDQuTCR4EpNFGyUM3vzSAxUcbMGbCpiQYzqiCvAs4UjLM9pofJ_i7qXqhIbX87783HOKaDksoNtMO8-_gy-tIdUqepRr3zvgwyBuvETj-ApRv7SCt-yjKhxQE-WFKXB1lSBhGDG5OXj4kiYosCWojOD2gyLajn6jZB-sTTXN6eLSrSur1lT8s",
    alt: "Vue aérienne de l'archipel de Nosy Be : lagon turquoise, plage de sable blanc et pirogue à balancier",
    gallery: [
      {
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMBI4fC-1m6CDy1XRA0Za4X5khehryYVku88Grson1o_4dwVQQimNFmdVojDNdbbcUVL2XZ-TSgnsftczLI159q8KhCyldGtqahJZHD9NmnCfGd9txdnZRca7Xu5Gez_q6ObFZvAhaqfFiROFwdPzO0krY-jNh5WBQHNwC_k9B-ev3f0r473Igd55rUZ3ZQpLJZY6UvGDy76Z9jOTptpx-hZJ1E4nhXo_AqPtXMFpXKVd4aC503M8",
        alt: "Eaux turquoise et banc de sable de l'archipel de Nosy Be",
      },
    ],
    nights: [7, 10],
    favoriteId: "nosy-be",
    highlights: [
      { icon: "forest", label: "Sanctuaire Lokobe (Lémur Macaco)" },
      { icon: "scuba_diving", label: "Tortues marines de Tanikely" },
      { icon: "spa", label: "Plantations de Vanille & Ylang" },
      { icon: "sailing", label: "Pirogues traditionnelles Sakalava" },
    ],
    climate: "Eau 27°C / Air 28°C",
    lodge: "Manga Soa Lodge",
  },
  {
    id: "sainte-marie",
    region: "est",
    themes: ["lagon", "pirogue"],
    rank: 2,
    carbon: 1,
    rating: DESTINATIONS["sainte-marie"].rating,
    reviews: DESTINATIONS["sainte-marie"].reviews,
    badge: "Lagon & Île aux Nattes",
    places: "Île aux Nattes · Ambodifotatra · Baie d'Ampanihy",
    text: "Piscines naturelles rocheuses, criques secrètes et cimetière des forbans pirates.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBLFYoICt7t1CLo54CGRzxW4uAXOyhG_kAnN3RkGJoieqZ9EbgzuhM6eIOWTAuAELWp95FY0TCYL3q7JKMsexQvIe0yqqQ3Nl6ydQX6zP6pSrNH2sp6wE6DxngOXb-09Pv1aq0-MxkTFsZydwKtA-w1ppn-QrYmVTqKWB8SJz-N1ko3MDUNUM4nCjVrfxWO-WjHaYm0u316ggqvD214-oxf8xoOeS-g4WaIyNiYxVVWNcmKhTl1HQ",
    alt: "Lagon de Sainte-Marie et de l'île aux Nattes avec banc de sable blanc et pirogue locale",
    gallery: [
      {
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMZ3UqfLWcPcFXNPjYJKOKEimkvdcD_Op8qGZPD_1V9-w7H6iKhRpnRee2YQJlxEx64uGSqScGy_k7r_WEeFX_EYHxTM3Tc_BJKm-7DYCBbVyEApiVKPfOaYZaVdgGXYutlBrAsyJ7jD9GyakJr_PZ3cLwj3cDHuPbkSqVjl0hYYzU7XFdqG1U0-60f7PTUIvFFGO5MvGn2YwbwhGj4Z5251hy7SCYXXufdfWeBTXEeiCn_gTLECQ",
        alt: "Lagon bordé de cocotiers à l'île Sainte-Marie",
      },
    ],
    nights: [5, 7],
    favoriteId: "sainte-marie",
    highlights: [
      { icon: "waves", label: "Baleines à bosse", seasonal: "Baleines à bosse" },
      { icon: "directions_boat", label: "Traversée en pirogue" },
      { icon: "history_edu", label: "Histoire des pirates" },
    ],
    climate: "Eau 26°C / Air 27°C",
    lodge: "Écolodges partenaires",
  },
  {
    id: "grand-nord",
    region: "nord",
    themes: ["trek"],
    rank: 3,
    carbon: 3,
    rating: DESTINATIONS["grand-nord"].rating,
    reviews: DESTINATIONS["grand-nord"].reviews,
    badge: "Canyon & Lagons Sauvages",
    places: "Diego Suarez · Mer d'Émeraude · Montagne d'Ambre",
    text: "Aux confins de la baie des Courriers : cascades et lémuriens couronnés de la Montagne d'Ambre, lagon de la mer d'Émeraude.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAe_5UZqDN0nKgRn0NRbXuBxD_SknMEKJZ8B7_1EAGBFF_3R_n6fm0v1DCPKmfDX1DPqdIxmB22GkloT8PdtAB0BKaLtZLdMC0HATla8UQ2XUMQ6uzYBrejdfsRKCeUXkgQI5Tk5nZUJK3qqxKY-WGZfGOhPQOUMUoQDgsAxXPktBRjCW3gbF4QN21alMnaESwJqCMCrY6eBjxNwJUV3ArRp1pbN4YOeAz9Q39dS8DLAEaDtVNPB6o",
    alt: "Tsingy Rouges du nord de Madagascar face à la mer d'Émeraude",
    gallery: [
      {
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcpEix6A9DBSbjhJlIMRFk4Sx9K0yBiih6blbHStFyBlzuuV9yZJU13bwd5olptdY4g05--4ytfCXgHeQCk-BTyN2kQS9yZx2_ZFt1KEgsnEdsAGbZy5BcMSFuw8O9JcrUNjQqeweUx6WpPYQwHnrGua_uASZAOHCVajHKXVjkD_FD8gyPMyoyJK2NHi9tuWQbqIH66r4-izVMGkYskDkfGY84B8CXRMGmMYG8IffMPn0EW-zjOLY",
        alt: "Mer d'Émeraude près de Diego Suarez",
      },
      {
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqvdyYb9W9BODyxVlrFFDInPbT6pIFAZ4RviAHb09HNjJI5mGUAfF2ADtlO5N6gMeMQIx2e5Tu3RUz7b2ozMKgSMRbnEKXwuRoG4o36c6bMdQGJPp7uYVc9KmGbhu6S_MRlVcnfYHSLYk4th7RRDm4T5orwYJaT9TaKaHtCfemZc1vmemC0OYa-7pAvjC2VAR1nq2m6oGn_rVi4PZVekf2syISQ1lkKV_cBTI2GEiWEN_xfyP6Dd4",
        alt: "Cascade dans la forêt de la Montagne d'Ambre",
      },
    ],
    nights: [7, 9],
    favoriteId: "diego-suarez",
    highlights: [
      { icon: "landscape", label: "Tsingy d'Irodo" },
      { icon: "park", label: "Parc Montagne d'Ambre" },
      { icon: "kitesurfing", label: "Mer d'Émeraude" },
    ],
    climate: "Eau 26°C / Air 30°C",
    lodge: "Écolodges partenaires",
  },
];

export const zoneCard = (id: DestinationId) => ZONE_CARDS.find((c) => c.id === id)!;
