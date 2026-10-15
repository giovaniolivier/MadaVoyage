import type { Metadata } from "next";
import Link from "next/link";
import { Amount, CurrencyToggle, ExpeditionSearch, ExploreProvider, FavoriteButton } from "@/components/explore/Explore";
import { SeasonBadge, TrendChips, TrustBar } from "@/components/explore/HeroBits";
import BudgetTeaser from "@/components/home/BudgetTeaser";
import HowItWorks from "@/components/home/HowItWorks";
import MiniFaq from "@/components/home/MiniFaq";
import Newsletter from "@/components/home/Newsletter";
import PaymentMethods from "@/components/home/PaymentMethods";
import PartnerLogos from "@/components/explore/PartnerLogos";
import { CIRCUITS } from "@/components/circuits/catalog-data";
import { DESTINATIONS as BOOKABLE, eur as formatEur, mga as formatMga } from "@/components/reservation/pricing";
import Pending from "@/components/ui/Pending";
import {
  FAMILIES_IMPACT,
  FAMILIES_SUPPORTED,
  RATING,
  REVIEWS_COUNT,
  REVIEWS_SOURCE,
  REVIEWS_VERIFIED,
  SERVICE_PROMISE,
  WHATSAPP,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "MadaVoyage — Écotourisme et circuits sur-mesure à Madagascar",
  description:
    "Tsingy, Nosy Be, Isalo, Allée des Baobabs : composez votre expédition à Madagascar avec des guides locaux certifiés, des écolodges labellisés et un impact positif.",
};

function FromPrice({ eur, mga, nights }: { eur: string; mga: string; nights: number }) {
  return (
    <div className="flex flex-col">
      <span className="font-body-md text-body-md text-on-surface-variant">À partir de</span>
      <div className="flex items-baseline gap-1.5">
        <span className="font-headline-sm text-headline-sm text-primary font-bold">
          <Amount eur={eur} mga={mga} />
        </span>
        <span className="font-body-md text-body-md text-on-surface-variant">/ pers.</span>
      </div>
      <span className="font-body-md text-body-md text-on-surface-variant">
        {nights} nuits · base 2 adultes · lodge, vols intérieurs et transferts inclus
      </span>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  icon,
  title,
  children,
  actions,
}: {
  eyebrow: string;
  icon: string;
  title: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-secondary font-label-md text-label-md uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
          <span>{eyebrow}</span>
        </div>
        <h2 className="font-display-lg text-display-lg text-on-surface tracking-tight">{title}</h2>
        {children && <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">{children}</p>}
      </div>
      {actions}
    </div>
  );
}

function Stars({ size = 16 }: { size?: number }) {
  return (
    <div aria-hidden="true" className="flex items-center text-tertiary">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="material-symbols-outlined" style={{ fontSize: size, fontVariationSettings: "'FILL' 1" }}>
          star
        </span>
      ))}
    </div>
  );
}

const DESTINATIONS = [
  {
    id: "nosy-be",
    name: "Archipel de Nosy Be & Mitsio",
    alt: "Eaux turquoise et banc de sable de l'archipel de Nosy Be",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMBI4fC-1m6CDy1XRA0Za4X5khehryYVku88Grson1o_4dwVQQimNFmdVojDNdbbcUVL2XZ-TSgnsftczLI159q8KhCyldGtqahJZHD9NmnCfGd9txdnZRca7Xu5Gez_q6ObFZvAhaqfFiROFwdPzO0krY-jNh5WBQHNwC_k9B-ev3f0r473Igd55rUZ3ZQpLJZY6UvGDy76Z9jOTptpx-hZJ1E4nhXo_AqPtXMFpXKVd4aC503M8",
    icon: "scuba_diving",
    theme: "Faune marine",
    days: "6 à 8 jours",
    text: "Nagez avec les tortues et les requins-baleines, puis flânez sur l'île aux parfums d'ylang-ylang.",
    eur: formatEur(BOOKABLE["nosy-be"].fromPrice),
    mga: formatMga(BOOKABLE["nosy-be"].fromPrice),
    nights: BOOKABLE["nosy-be"].fromNights,
    href: "/circuits?region=nord",
  },
  {
    id: "sainte-marie",
    name: "Île Sainte-Marie & Nattes",
    alt: "Lagon bordé de cocotiers à l'île Sainte-Marie",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMZ3UqfLWcPcFXNPjYJKOKEimkvdcD_Op8qGZPD_1V9-w7H6iKhRpnRee2YQJlxEx64uGSqScGy_k7r_WEeFX_EYHxTM3Tc_BJKm-7DYCBbVyEApiVKPfOaYZaVdgGXYutlBrAsyJ7jD9GyakJr_PZ3cLwj3cDHuPbkSqVjl0hYYzU7XFdqG1U0-60f7PTUIvFFGO5MvGn2YwbwhGj4Z5251hy7SCYXXufdfWeBTXEeiCn_gTLECQ",
    icon: "waves",
    theme: "Baleines à bosse",
    days: "5 à 7 jours",
    text: "Lagons préservés, cimetière des pirates et baleines à bosse au large, de juillet à septembre.",
    eur: formatEur(BOOKABLE["sainte-marie"].fromPrice),
    mga: formatMga(BOOKABLE["sainte-marie"].fromPrice),
    nights: BOOKABLE["sainte-marie"].fromNights,
    href: "/circuits?region=est",
  },
  {
    id: "isalo",
    name: "Parc national de l'Isalo",
    alt: "Piscine naturelle dans un canyon de l'Isalo",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnEfcc0C3xZ8aOHMwitXjwzo4W6DbJJhy447X_qzJYNCrLNUDH8CNGFeg-8X7y6EdsfNCaWDjOyTGL4RKW6PZQNmi-4KOdfdmVTTcE5_GPadcaw20ELV3Kh8nA1SnZr_e0DkyJA_lqK9rJYYQNON507ngNE2qmnTiOvUCivs2o7zbYYL03ZgYMsVFzR2Pgkh5lwQCBinD_VL2cHRqRleIaZnVWMNiemuGVC8ayndkywIeFEuH1X8c",
    icon: "hiking",
    theme: "Trek & canyons",
    crop: "160%",
    days: "4 à 6 jours",
    text: "Randonnée dans les canyons de grès, baignade en piscine naturelle et lémuriens catta en liberté.",
    eur: "490 €",
    mga: "2 401 000 Ar",
    nights: 5,
    href: "/circuits/rn7",
  },
  {
    id: "diego-suarez",
    name: "Diego Suarez & Tsingy rouges",
    alt: "Mer d'Émeraude près de Diego Suarez",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcpEix6A9DBSbjhJlIMRFk4Sx9K0yBiih6blbHStFyBlzuuV9yZJU13bwd5olptdY4g05--4ytfCXgHeQCk-BTyN2kQS9yZx2_ZFt1KEgsnEdsAGbZy5BcMSFuw8O9JcrUNjQqeweUx6WpPYQwHnrGua_uASZAOHCVajHKXVjkD_FD8gyPMyoyJK2NHi9tuWQbqIH66r4-izVMGkYskDkfGY84B8CXRMGmMYG8IffMPn0EW-zjOLY",
    icon: "kitesurfing",
    theme: "Kitesurf & baies",
    days: "7 à 9 jours",
    text: "Navigation sur la mer d'Émeraude et balade parmi les cheminées de fée ocres des Tsingy rouges.",
    eur: formatEur(BOOKABLE["grand-nord"].fromPrice),
    mga: formatMga(BOOKABLE["grand-nord"].fromPrice),
    nights: BOOKABLE["grand-nord"].fromNights,
    href: "/circuits?region=nord",
  },
];

function DestinationCard({ d }: { d: (typeof DESTINATIONS)[number] }) {
  return (
    <div className="group flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden">
        <div
          aria-label={d.alt}
          className="w-full h-full bg-cover bg-bottom group-hover:scale-105 transition-transform duration-500"
          role="img"
          style={{ backgroundImage: `url('${d.img}')`, ...("crop" in d && { backgroundSize: d.crop, backgroundPosition: "center 35%" }) }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/70 via-transparent to-transparent"></div>
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface-container-lowest/95 text-on-surface font-label-md text-label-md shadow-sm flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-secondary">{d.icon}</span> {d.theme}
        </span>
        <FavoriteButton compact id={d.id} name={d.name} />
        <span className="absolute bottom-3 left-3 text-surface font-label-md text-label-md flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">schedule</span> {d.days} conseillés
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">{d.name}</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1.5 line-clamp-2">{d.text}</p>
        </div>
        <div className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between gap-3">
          <FromPrice eur={d.eur} mga={d.mga} nights={d.nights} />
          <Link
            aria-label={`Découvrir : ${d.name}`}
            className="w-10 h-10 shrink-0 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-primary-container transition-all"
            href={d.href}
          >
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Note et nombre d'avis lus dans le catalogue, pour qu'un même circuit affiche les mêmes chiffres partout. */
function ratingOf(id: string) {
  const c = CIRCUITS.find((x) => x.id === id)!;
  return ` (${c.reviews} avis)`;
}

/** Durée et prix lus dans le catalogue : la formule et la fiche circuit annoncent la même offre. */
function offerOf(id: string) {
  const c = CIRCUITS.find((x) => x.id === id)!;
  return { duration: `${c.days} jours / ${c.nights} nuits`, eur: formatEur(c.priceEur), mga: formatMga(c.priceEur) };
}

const FORMULAS = [
  {
    region: "Nord et archipels",
    circuit: "diego",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqvdyYb9W9BODyxVlrFFDInPbT6pIFAZ4RviAHb09HNjJI5mGUAfF2ADtlO5N6gMeMQIx2e5Tu3RUz7b2ozMKgSMRbnEKXwuRoG4o36c6bMdQGJPp7uYVc9KmGbhu6S_MRlVcnfYHSLYk4th7RRDm4T5orwYJaT9TaKaHtCfemZc1vmemC0OYa-7pAvjC2VAR1nq2m6oGn_rVi4PZVekf2syISQ1lkKV_cBTI2GEiWEN_xfyP6Dd4",
    alt: "Cascade dans la forêt de la Montagne d'Ambre",
    ...offerOf("diego"),
    title: "Le Grand Nord, lagon et montagne d'Ambre",
    text: "Diego Suarez, la baie des Sakalava, les Tsingy rouges et la forêt brumeuse de la montagne d'Ambre.",
    items: ["Boutre traditionnel sur la mer d'Émeraude", "Montagne d'Ambre avec guide naturaliste", "Écolodges côtiers et 4x4 privatif"],
    href: "/circuits?region=nord",
    featured: "",
  },
  {
    region: "Hautes Terres et Sud",
    circuit: "rn7",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuANzmWHaUb9VtlgvUg29raTuNu1ex10gd1daErkQkVxu0yrw8p7GB4ekSkfuqYQlHBoXKPF7fUJXl9-uEUBxqJiP5XjnP1HTQLYdrZX64nnMXT7-VztaWKQsO7dcOGaAvcpe0wg8OPjBWDrotB2BB2yQJxrSDyeZQV69Lyh_OEnw79UwSLl7yDbpH76fi-kHg31FBI6FzeSIA9Cx0FbE4yERRSsnq70ihlyI55AcPCtzDx8v9GfWeM",
    alt: "Rizières en terrasses le long de la RN7",
    ...offerOf("rn7"),
    title: "La RN7 mythique et le massif de l'Isalo",
    text: "D'Antananarivo à Tuléar : rizières d'Ambalavao, forêt de Ranomafana, canyons de l'Isalo et plages d'Ifaty.",
    items: ["Indri et microcèbes de nuit à Ranomafana", "2 jours de randonnée dans l'Isalo", "Vol retour Tuléar – Antananarivo inclus"],
    href: "/circuits/rn7",
    featured: "Le plus réservé",
  },
  {
    region: "Aventure et expédition",
    circuit: "tsiribihina",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB14LcPdxgEqG6Qo4Inl4JsP5Ihst4iGVjrzxOvAvb1Ip-0MRSmdVJTe8NLNp5ZMhGA9NWPSp8ATCOYCDsp-KVq-uHaHPLgYd5Akw4L5M4lcbHzm66svzmmxC4cpZaJUsq6dqM8vvrgHgCYWuL5jAd1pwcE4Broex8MbKTn_xpaeJoksG8DypiZBKzjI8-crf1OwNk737PmhKEHID9mTeomkn4EWney14cqO8YlL8KM8njTmBAON7k",
    alt: "Aiguilles calcaires et pont suspendu des Tsingy de Bemaraha",
    ...offerOf("tsiribihina"),
    title: "La piste de l'Ouest, baobabs et Grands Tsingy",
    text: "Descente de la Tsiribihina en chaland, allée des Baobabs au couchant et via ferrata dans les Tsingy de Bemaraha.",
    items: ["2 jours en chaland sur la Tsiribihina", "Ponts suspendus des Grands Tsingy", "Coucher de soleil sur l'allée des Baobabs"],
    href: "/circuits?region=ouest",
    featured: "",
  },
];

function FormulaCard({ f }: { f: (typeof FORMULAS)[number] }) {
  return (
    <div
      className={`flex flex-col bg-surface-container-lowest rounded-2xl p-6 transition-all ${
        f.featured ? "shadow-xl ring-2 ring-primary/40" : "shadow-sm hover:shadow-lg"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-label-md text-label-md font-bold">{f.region}</span>
        {REVIEWS_VERIFIED && (
          <span className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md whitespace-nowrap">
            <span className="material-symbols-outlined text-[16px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            {ratingOf(f.circuit)}
          </span>
        )}
      </div>
      <div className="relative h-48 rounded-xl overflow-hidden mb-5">
        <div
          aria-label={f.alt}
          className="w-full h-full bg-cover bg-center"
          role="img"
          style={{ backgroundImage: `url('${f.img}')` }}
        ></div>
        {f.featured && (
          <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-tertiary text-on-tertiary font-label-lg text-label-lg whitespace-nowrap shadow-md flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">local_fire_department</span> {f.featured}
          </span>
        )}
        <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-on-surface/70 backdrop-blur-sm text-surface font-label-md text-label-md">
          {f.duration}
        </span>
      </div>
      <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{f.title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant mb-5">{f.text}</p>
      <ul className="space-y-2.5 mb-6 flex-1">
        {f.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 font-body-md text-body-md text-on-surface">
            <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check_circle</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between gap-3">
        <div>
          <span className="font-body-md text-body-md text-on-surface-variant">Tout inclus dès</span>
          <div className="font-headline-md text-headline-md text-primary font-bold">
            <Amount eur={f.eur} mga={f.mga} />{" "}
            <span className="font-body-md text-body-md text-on-surface-variant font-normal">/ pers., base 2</span>
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant">
            <Amount alternate eur={f.eur} mga={f.mga} />
          </span>
        </div>
        <Link
          aria-label={`Voir le circuit : ${f.title}`}
          className="h-11 px-5 shrink-0 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center hover:bg-primary-container transition-all"
          href={f.href}
        >
          Voir le circuit
        </Link>
      </div>
    </div>
  );
}

const REVIEWS = [
  {
    name: "Claire & Mathieu B.",
    photoBy: "Claire",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuANzmWHaUb9VtlgvUg29raTuNu1ex10gd1daErkQkVxu0yrw8p7GB4ekSkfuqYQlHBoXKPF7fUJXl9-uEUBxqJiP5XjnP1HTQLYdrZX64nnMXT7-VztaWKQsO7dcOGaAvcpe0wg8OPjBWDrotB2BB2yQJxrSDyeZQV69Lyh_OEnw79UwSLl7yDbpH76fi-kHg31FBI6FzeSIA9Cx0FbE4yERRSsnq70ihlyI55AcPCtzDx8v9GfWeM",
    alt: "Rizières en terrasses photographiées par Claire sur la RN7",
    trip: "Circuit RN7 & Isalo",
    travel: "septembre 2026",
    published: "9 oct. 2026",
    iso: "2026-10-09",
    text: "Dix jours inoubliables sur la RN7. Notre chauffeur-guide Jean-Luc a repéré des caméléons nains que nous n'aurions jamais vus seuls.",
  },
  {
    name: "Alexandre V. & famille",
    photoBy: "Alexandre",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvGIKjRcgmLwYvqiv4oKncg5q6lpLOjuprKW0XoN0_fgcltE-cDG5-YkSlS1ycPVIQzWsf4raaqpxtfQKSS9KGpnCJHSsXztptX9HX4_JukqGXKwCITt3lenzos4PoC8zpmD8yTuQ9P_Wlkh1t5O_fDREH61ns16d9IR_g2bboEjAoQ02MFoudFUP0oZkJ9j2p5LoKW5513Ut9kKqegq6X-9eSvmI4IWSO7grBBiJUf1t9M1z8f00",
    alt: "Allée des Baobabs au coucher du soleil, photographiée par Alexandre",
    trip: "Piste de l'Ouest & Morondava",
    travel: "septembre 2026",
    published: "2 oct. 2026",
    iso: "2026-10-02",
    text: "L'allée des Baobabs au lever du jour restera gravée. Nous avons même planté de jeunes baobabs avec l'association Fihavanana.",
  },
  {
    name: "Sophie M.",
    photoBy: "Sophie",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMBI4fC-1m6CDy1XRA0Za4X5khehryYVku88Grson1o_4dwVQQimNFmdVojDNdbbcUVL2XZ-TSgnsftczLI159q8KhCyldGtqahJZHD9NmnCfGd9txdnZRca7Xu5Gez_q6ObFZvAhaqfFiROFwdPzO0krY-jNh5WBQHNwC_k9B-ev3f0r473Igd55rUZ3ZQpLJZY6UvGDy76Z9jOTptpx-hZJ1E4nhXo_AqPtXMFpXKVd4aC503M8",
    alt: "Banc de sable de Nosy Be photographié par Sophie depuis le catamaran",
    trip: "Archipel de Nosy Be",
    travel: "août 2026",
    published: "21 sept. 2026",
    iso: "2026-09-21",
    text: "Catamaran aux îles Mitsio, équipage malgache d'une gentillesse rare, et aucun frais caché sur place. Une agence de très haut vol.",
  },
];

function ReviewCard({ r }: { r: (typeof REVIEWS)[number] }) {
  return (
    <article className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div aria-label={r.alt} className="relative h-40 bg-cover bg-center" role="img" style={{ backgroundImage: `url('${r.img}')` }}>
        <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-on-surface/70 backdrop-blur-sm text-surface font-label-md text-label-md flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">photo_camera</span> Photo de {r.photoBy}
        </span>
      </div>
      <div className="p-6 flex flex-col gap-4 flex-1">
        {REVIEWS_VERIFIED ? <Stars /> : <Pending>Exemple · avis réel en attente</Pending>}
        <p className="font-body-md text-body-md text-on-surface leading-relaxed">« {r.text} »</p>
        <footer className="mt-auto pt-4 border-t border-outline-variant/40">
          <div className="font-label-lg text-label-lg text-on-surface font-bold">{r.name}</div>
          <div className="font-body-md text-body-md text-on-surface-variant">
            {r.trip} · voyage en {r.travel}
          </div>
          {REVIEWS_VERIFIED && (
            <a
              className="mt-2 flex items-start gap-1 font-label-md text-label-md text-secondary hover:underline underline-offset-4"
              href={REVIEWS_SOURCE.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>
                Avis vérifié sur {REVIEWS_SOURCE.name}, publié le <time dateTime={r.iso}>{r.published}</time>
              </span>
            </a>
          )}
        </footer>
      </div>
    </article>
  );
}

export default function Page() {
  return (
    <main className="w-full pt-20 bg-surface min-h-[calc(100vh-20rem)]">
      <ExploreProvider>
        <div className="flex flex-col w-full">
          <section className="relative w-full -mt-20 pt-24 min-h-[740px] flex flex-col justify-between overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              role="img"
              aria-label="Allée des Baobabs de Morondava au coucher du soleil"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAvGIKjRcgmLwYvqiv4oKncg5q6lpLOjuprKW0XoN0_fgcltE-cDG5-YkSlS1ycPVIQzWsf4raaqpxtfQKSS9KGpnCJHSsXztptX9HX4_JukqGXKwCITt3lenzos4PoC8zpmD8yTuQ9P_Wlkh1t5O_fDREH61ns16d9IR_g2bboEjAoQ02MFoudFUP0oZkJ9j2p5LoKW5513Ut9kKqegq6X-9eSvmI4IWSO7grBBiJUf1t9M1z8f00')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-on-surface/40 to-on-surface/70"></div>
            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply pointer-events-none"></div>

            <div className="relative z-10 max-w-[80rem] mx-auto px-6 lg:px-12 w-full pt-16 pb-8 flex flex-col justify-between h-full">
              <div className="max-w-3xl space-y-6">
                <SeasonBadge />
                <h1 className="font-display-lg text-display-lg text-surface tracking-tight leading-tight">
                  Votre budget, votre Madagascar.
                </h1>
                <p className="font-body-lg text-[20px] leading-relaxed text-surface font-medium max-w-2xl [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]">
                  Indiquez votre budget : nous composons le séjour qui tient dedans, vols intérieurs et guides locaux compris.
                </p>

                <TrendChips />
              </div>

              <TrustBar />
            </div>
          </section>

          <div className="max-w-[80rem] mx-auto px-6 lg:px-12 w-full -mt-10 relative z-20">
            <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-4 lg:p-6 transition-all">
              <ExpeditionSearch />
            </div>
            <div className="mt-6 px-2">
              <PaymentMethods />
            </div>
          </div>

          <div className="flex flex-col gap-20 py-20">
            <section className="max-w-[80rem] mx-auto px-6 lg:px-12 w-full">
              <SectionHeading
                actions={
                  <div className="flex items-center gap-3">
                    <CurrencyToggle compact />
                    <Link
                      className="px-5 py-2.5 rounded-full bg-surface-container text-primary font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center gap-1"
                      href="/circuits"
                    >
                      Voir les 18 sanctuaires <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                }
                eyebrow="Sélection d'exception"
                icon="travel_explore"
                title="Destinations incontournables"
              >
                Récifs, forêts humides et massifs de grès : des paysages façonnés par des millions d'années d'isolement.
              </SectionHeading>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {DESTINATIONS.map((d) => (
                  <DestinationCard key={d.id} d={d} />
                ))}
              </div>
            </section>

            <section className="w-full bg-surface-container-low py-20">
              <div className="max-w-[80rem] mx-auto px-6 lg:px-12">
                <SectionHeading eyebrow="Comment ça marche" icon="route" title="Votre voyage en 5 étapes">
                  Les mêmes étapes que dans la réservation en ligne. {SERVICE_PROMISE}
                </SectionHeading>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-7">
                    <HowItWorks />
                  </div>
                  <div className="lg:col-span-5 grid">
                    <BudgetTeaser />
                  </div>
                </div>
              </div>
            </section>

            <section className="max-w-[80rem] mx-auto px-6 lg:px-12 w-full">
              <SectionHeading eyebrow="Circuits signature MadaVoyage" icon="verified" title="Formules clé en main">
                Chauffeur-guide francophone, écolodges labellisés et permis des parcs nationaux inclus.
              </SectionHeading>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {FORMULAS.map((f) => (
                  <FormulaCard key={f.title} f={f} />
                ))}
              </div>
            </section>

            <section className="w-full bg-surface-container py-20">
              <div className="max-w-[80rem] mx-auto px-6 lg:px-12">
                <SectionHeading
                  actions={
                    REVIEWS_VERIFIED ? (
                      <a
                        className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
                        href={REVIEWS_SOURCE.href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Stars size={20} />
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{RATING}/5</span>
                        <span className="font-body-md text-body-md text-on-surface-variant whitespace-nowrap">
                          {REVIEWS_COUNT} avis sur {REVIEWS_SOURCE.name}
                        </span>
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">open_in_new</span>
                      </a>
                    ) : (
                      <Pending>Note globale en attente des premiers avis publiés</Pending>
                    )
                  }
                  eyebrow={REVIEWS_VERIFIED ? "Avis vérifiés" : "Témoignages"}
                  icon="reviews"
                  title="Ce que racontent nos voyageurs"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                  {REVIEWS.map((r) => (
                    <ReviewCard key={r.name} r={r} />
                  ))}
                </div>

                <div className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-6">
                  Réseau hôtelier labellisé et accréditations
                </div>
                <PartnerLogos />
              </div>
            </section>

            <section className="max-w-[80rem] mx-auto px-6 lg:px-12 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden bg-secondary text-on-secondary shadow-xl">
                <div className="p-8 lg:p-14 flex flex-col gap-6 justify-center">
                  <div className="flex items-center gap-2 font-label-md text-label-md uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                    <span>Notre engagement</span>
                  </div>
                  <h2>
                    <span className="block font-display-lg text-[72px] leading-none font-extrabold tracking-tight">
                      {FAMILIES_SUPPORTED}
                    </span>
                    <span className="block font-headline-md text-headline-md mt-3">
                      familles rurales soutenues par le fonds Fihavanana depuis {FAMILIES_IMPACT.since}
                    </span>
                  </h2>
                  <p className="font-label-md text-label-md text-on-secondary/90 flex flex-wrap items-center gap-2">
                    <span>
                      Source :{" "}
                      <Link className="underline underline-offset-4" href={FAMILIES_IMPACT.href}>
                        {FAMILIES_IMPACT.source}
                      </Link>
                    </span>
                    {!FAMILIES_IMPACT.verified && <Pending onDark>Chiffre provisoire, en attente du rapport publié</Pending>}
                  </p>
                  <p className="font-body-lg text-body-lg text-on-secondary/90 max-w-lg">
                    Une part de chaque réservation finance cantines scolaires, reboisement et formation des guides, dans les villages que
                    vous traversez.
                  </p>
                  <Link
                    className="self-start h-12 px-6 rounded-full bg-surface-container-lowest text-secondary font-label-lg text-label-lg flex items-center gap-2 hover:shadow-lg transition-all"
                    href="/engagement"
                  >
                    Voir les preuves et le rapport d'impact
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </Link>
                </div>
                <div
                  aria-label="Cascade dans la forêt de la montagne d'Ambre, zone de reboisement soutenue par le fonds"
                  className="min-h-[280px] bg-cover bg-center"
                  role="img"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqvdyYb9W9BODyxVlrFFDInPbT6pIFAZ4RviAHb09HNjJI5mGUAfF2ADtlO5N6gMeMQIx2e5Tu3RUz7b2ozMKgSMRbnEKXwuRoG4o36c6bMdQGJPp7uYVc9KmGbhu6S_MRlVcnfYHSLYk4th7RRDm4T5orwYJaT9TaKaHtCfemZc1vmemC0OYa-7pAvjC2VAR1nq2m6oGn_rVi4PZVekf2syISQ1lkKV_cBTI2GEiWEN_xfyP6Dd4')",
                  }}
                ></div>
              </div>
            </section>

            <section className="max-w-[80rem] mx-auto px-6 lg:px-12 w-full">
              <SectionHeading eyebrow="Avant de partir" icon="help" title="Vos questions fréquentes">
                Les trois sujets qui reviennent le plus souvent. Les autres réponses sont dans le centre d'aide.
              </SectionHeading>
              <MiniFaq />
            </section>

            <section className="max-w-[80rem] mx-auto px-6 lg:px-12 w-full">
              <div className="relative rounded-3xl overflow-hidden p-8 lg:p-14 bg-gradient-to-r from-on-primary-fixed-variant to-primary text-on-primary shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl space-y-4">
                  <span className="px-3.5 py-1 rounded-full bg-surface-container-lowest/20 backdrop-blur-md text-surface font-label-md text-label-md uppercase tracking-wider inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">bolt</span> Réservation instantanée
                  </span>
                  <h2 className="font-display-lg text-display-lg tracking-tight text-surface">
                    Composez votre itinéraire sur-mesure en quelques minutes
                  </h2>
                  <p className="font-body-lg text-body-lg text-surface-variant">
                    {SERVICE_PROMISE} Une question en chemin ? Notre équipe à Antananarivo répond sur WhatsApp.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 w-full sm:w-auto shrink-0">
                  <Link
                    className="h-14 w-full sm:w-auto px-8 rounded-full bg-tertiary hover:bg-on-tertiary-fixed-variant text-on-tertiary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    href="/reservation/dates"
                  >
                    <span className="material-symbols-outlined text-[22px]">calendar_add_on</span>
                    <span>Planifier mon voyage</span>
                  </Link>
                  <a
                    className="group h-11 px-2 text-surface font-label-md text-label-md flex items-center gap-1.5"
                    href={WHATSAPP.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span className="underline underline-offset-4 decoration-surface/50 group-hover:decoration-surface">
                      ou écrire sur WhatsApp
                    </span>
                  </a>
                </div>
              </div>
            </section>

            <section className="max-w-[80rem] mx-auto px-6 lg:px-12 w-full">
              <Newsletter />
            </section>
          </div>
        </div>
      </ExploreProvider>
    </main>
  );
}
