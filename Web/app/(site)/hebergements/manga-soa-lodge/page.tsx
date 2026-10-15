import type { Metadata } from "next";
import Link from "next/link";
import { BookingSummary, LodgeActions, LodgeGallery, LodgeProvider, RoomCard, RoomSelectButton } from "@/components/lodge/Lodge";

export const metadata: Metadata = {
  title: "Manga Soa Lodge 4★ à Nosy Be · Écolodge solaire | MadaVoyage",
  description:
    "Suites en palissandre face au canal du Mozambique, 100 % solaire, cuisine locavore : choisissez votre hébergement au Manga Soa Lodge et intégrez-le à votre séjour Nosy Be.",
};

export default function Page() {
  return (
    <>
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-20rem)]">
        <div className="flex flex-col w-full">
          <LodgeProvider>
            <div className="relative w-full max-w-[1440px] mx-auto px-margin-desktop py-space-md">
              <div className="absolute top-12 left-1/3 -z-10 w-96 h-96 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute top-96 right-12 -z-10 w-80 h-80 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>

              <section className="flex flex-col gap-space-md mb-space-lg">
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                  <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                    <span className="material-symbols-outlined text-[16px]">home</span>
                    <span>Accueil</span>
                  </Link>
                  <span className="opacity-40">/</span>
                  <Link className="hover:text-primary transition-colors" href="/circuits">
                    Circuits
                  </Link>
                  <span className="opacity-40">/</span>
                  <Link className="hover:text-primary transition-colors" href="/circuits?q=nosy">
                    Nosy Be
                  </Link>
                  <span className="opacity-40">/</span>
                  <span>Hébergements Éco-Luxe</span>
                  <span className="opacity-40">/</span>
                  <span aria-current="page" className="text-on-surface font-semibold">
                    Manga Soa Lodge 4★
                  </span>
                </nav>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex flex-wrap items-center gap-space-xs">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[14px]">eco</span> Écolabel International
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[14px]">solar_power</span> 100% Solaire &amp; Eau Captée
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[14px]">hotel_class</span> Écolodge 4 Étoiles
                      </span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mt-1">
                      Manga Soa Lodge 4★ · <span className="text-primary font-normal">Sanctuaire Éco-Luxe &amp; Océan</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-body-sm text-body-sm text-on-surface-variant">
                      <span className="flex items-center gap-1 text-on-surface font-medium">
                        <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                        Baie de Befefika, Île de Nosy Be (Madagascar) · Face au coucher du soleil
                      </span>
                      <span className="text-outline-variant">•</span>
                      <span className="flex items-center gap-1.5">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-label-sm text-label-sm font-bold">
                          ★ 4.9 / 5
                        </span>
                        <a className="underline underline-offset-4 hover:text-primary transition-colors" href="#avis">
                          148 avis éco-voyageurs vérifiés
                        </a>
                      </span>
                      <span className="text-outline-variant">•</span>
                      <span className="flex items-center gap-1 text-secondary font-semibold">
                        <span className="material-symbols-outlined text-[16px]">verified</span> Partenaire Certifié ONTM
                      </span>
                    </div>
                  </div>

                  <LodgeActions />
                </div>
              </section>

              <LodgeGallery />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
                <div className="lg:col-span-8 flex flex-col gap-space-xl">
                  <section className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-md">
                    <div className="flex items-center gap-space-xs text-primary">
                      <span className="material-symbols-outlined">cabin</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold">L'Esprit Manga Soa Lodge</h2>
                    </div>
                    <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                      Perché délicatement entre une colline de forêt tropicale primaire et les eaux chaudes du canal du Mozambique, Manga
                      Soa Lodge est un sanctuaire éco-responsable conçu pour préserver la quiétude absolue. Chaque pavillon a été érigé sans
                      abattage majeur, sculpté par des ébénistes malgaches en palissandre durable et coiffé de toitures végétales en
                      feuilles de Ravenala séchées.
                    </p>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Ici, le luxe s'exprime par le silence, les senteurs d'ylang-ylang et de vanille portées par la brise marine, ainsi que
                      l'harmonie symbiotique avec la faune locale. Vous observerez lémuriens macaco et caméléons directement depuis votre
                      varangue privée.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
                      <div className="p-3 bg-surface-container-low rounded flex flex-col items-center text-center gap-1">
                        <span className="material-symbols-outlined text-primary text-[24px]">forest</span>
                        <span className="font-label-sm text-label-sm text-on-surface font-semibold">Réserve Naturelle</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">5 hectares préservés</span>
                      </div>
                      <div className="p-3 bg-surface-container-low rounded flex flex-col items-center text-center gap-1">
                        <span className="material-symbols-outlined text-secondary text-[24px]">wb_sunny</span>
                        <span className="font-label-sm text-label-sm text-on-surface font-semibold">100% Solaire</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Autonomie certifiée</span>
                      </div>
                      <div className="p-3 bg-surface-container-low rounded flex flex-col items-center text-center gap-1">
                        <span className="material-symbols-outlined text-tertiary text-[24px]">set_meal</span>
                        <span className="font-label-sm text-label-sm text-on-surface font-semibold">Pêche Responsable</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Piroguiers de Befefika</span>
                      </div>
                      <div className="p-3 bg-surface-container-low rounded flex flex-col items-center text-center gap-1">
                        <span className="material-symbols-outlined text-primary-container text-[24px]">water</span>
                        <span className="font-label-sm text-label-sm text-on-surface font-semibold">Eau Épurée</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Captage &amp; dessalement</span>
                      </div>
                    </div>
                  </section>

                  <section className="flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs text-primary">
                        <span className="material-symbols-outlined">bed</span>
                        <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Options d'Hébergement Disponibles</h2>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary bg-secondary-container px-3 py-1 rounded-full font-semibold">
                        Disponibilités confirmées pour vos dates
                      </span>
                    </div>

                    <RoomCard id="baobab">
                      <div className="md:w-5/12 h-52 md:h-auto rounded-md overflow-hidden relative shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          alt="Suite Baobab : grande terrasse en teck et lit king size orientés vers l'océan"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ_KmyY5cwHrDjU0wSlM7JfyLzaPvKHKTJb9KWBKls_Pvq_UTLzgMMNxLTnidIH587SRgOzaB8pW34yIOa8XqAtOQp6wkN30mam_3ki9uXVlFnpovzvsNQ5S22vQisJqn4s_B50LX87AmRwP4mHXn4HzRAe5afrcgV5zc_9K40osXoquas2cN08h1w_dQxqnOHLFESHYTbrJ7kc8jYtlhOlp0yMQ-OCxtt3G9Awlj1-gqaYZya3MY"
                        />
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 text-white font-label-sm text-label-sm">
                          85 m² int. + 35 m² varangue
                        </span>
                      </div>
                      <div className="md:w-7/12 flex flex-col justify-between gap-space-md">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                              Suite Baobab · Vue Océan &amp; Jardin Botanique
                            </h3>
                            <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded font-semibold">
                              Idéal 3 voyageurs
                            </span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Capacité : 3 personnes (2 adultes, 1 enfant) · 1 Lit King Size + 1 Méridienne d'artisanat
                          </p>
                          <ul className="grid grid-cols-2 gap-1.5 my-2 font-body-sm text-body-sm text-on-surface">
                            <li className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-primary">deck</span> Terrasse privée de 35 m²
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-primary">shower</span> Douche extérieure ciel
                              ouvert
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-primary">spa</span> Literie bio 100% coton brut
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-primary">wifi</span> Starlink bas-carbone illimité
                            </li>
                          </ul>
                        </div>
                        <div className="pt-space-sm border-t border-surface-container-high flex items-end justify-between">
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="font-headline-md text-headline-md font-extrabold text-primary">85,00 €</span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant">/ nuit</span>
                            </div>
                            <span className="font-body-sm text-body-sm text-outline">~ 416 500 Ar / nuit · Total 850,00 € (10 nuits)</span>
                          </div>
                          <RoomSelectButton id="baobab" label="Basculer vers cette suite" />
                        </div>
                      </div>
                    </RoomCard>

                    <RoomCard id="ylang">
                      <div className="md:w-5/12 h-44 md:h-auto rounded-md overflow-hidden relative shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          alt="Bungalow Ylang-Ylang niché sous les arbres en fleurs avec sa terrasse privée"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8dJZkfwTbrEh5iRGWSesiK-H6zJUv_9ATLGA0hZc_WTkrHc8Nq4CuJ7AKQeNC8mLPtLFCrdj6Qn4VMX8ydjYNeEwzwH3NV2UtQ7F9DRuBG9HdXj7JIUeBBBnX73v5YYTuNJP3AeSY2lL2zGcIgyipf_GCCtIxWv18HZwSLrj05oza7b3gEws5aGuiPV6jR5kRoFqE6ARiGo9VAZEImv_WE8tlhQQnLu79cvocynS_HWy07GpeuL0"
                        />
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 text-white font-label-sm text-label-sm">
                          45 m² · Vue Jardin Fleuri
                        </span>
                      </div>
                      <div className="md:w-7/12 flex flex-col justify-between gap-space-md">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Bungalow Ylang-Ylang</h3>
                            <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                              Idéal couple
                            </span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Capacité : 2 adultes · 1 Lit Queen Size · Ambiance intime et feutrée
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                            Conçu en bordure de la plantation aromatique de vanille et d'ylang-ylang, idéal pour les amoureux en quête de
                            tranquillité.
                          </p>
                        </div>
                        <div className="pt-space-sm border-t border-surface-container-high flex items-end justify-between">
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">70,00 €</span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant">/ nuit</span>
                            </div>
                            <span className="font-body-sm text-body-sm text-outline">~ 343 000 Ar / nuit · (700,00 € / 10 nuits)</span>
                          </div>
                          <RoomSelectButton id="ylang" label="Basculer vers ce bungalow" />
                        </div>
                      </div>
                    </RoomCard>

                    <RoomCard id="ravinala">
                      <div className="md:w-5/12 h-44 md:h-auto rounded-md overflow-hidden relative shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          alt="Villa Ravinala avec piscine privée à débordement face au coucher du soleil"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW87w9TZ2-Rs3Qa7TJsCdjqwNqqJNT92m7QBqwJe-xPSF5biYdOcmR4QPqx6Ob5wA2DVnRJH60o9BPftwoTSsFVb7YSxOW96TUiwrXdaswihM9iNONeeke7yXH4sfQZYq6vcv70KnimliFiVc3OJ8NHr1aNT7q7Ighw6_5cdr4DUlJ8WN1rsafB3gzBg77_8fwEVvocyVpqqCgq6rOH6uWlzOqdqhmRPusMFOiXw6qYR2MGjfWntc"
                        />
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 text-white font-label-sm text-label-sm">
                          140 m² · Piscine Privative
                        </span>
                      </div>
                      <div className="md:w-7/12 flex flex-col justify-between gap-space-md">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Villa Familiale Ravinala</h3>
                            <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded font-bold">
                              Prestige &amp; Espace
                            </span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Capacité : Jusqu'à 6 personnes (4 adultes, 2 enfants) · 2 Suites séparées
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                            Bassin de nage privatif d'eau de source à débordement face à la baie, salon extérieur et service d'un majordome
                            dédié.
                          </p>
                        </div>
                        <div className="pt-space-sm border-t border-surface-container-high flex items-end justify-between">
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">130,00 €</span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant">/ nuit</span>
                            </div>
                            <span className="font-body-sm text-body-sm text-outline">~ 637 000 Ar / nuit · (1 300,00 € / 10 nuits)</span>
                          </div>
                          <RoomSelectButton id="ravinala" label="Basculer vers cette villa" />
                        </div>
                      </div>
                    </RoomCard>
                  </section>

                  <section className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-md">
                    <div className="flex items-center gap-space-xs text-primary">
                      <span className="material-symbols-outlined">nature_people</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                        Équipements &amp; Services Éco-Responsables
                      </h2>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      L'excellence hôtelière 4 étoiles repensée avec un impact environnemental minimaliste et contrôlé.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                          <span className="material-symbols-outlined text-[20px]">solar_power</span>
                        </div>
                        <div>
                          <h4 className="font-headline-sm text-[16px] font-bold text-on-surface">Micro-Centrale Solaire Autonome</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                            Parc photovoltaïque sur toiture technique discrète, batteries lithium de dernière génération assurant
                            l'électricité 24/7 sans groupe électrogène bruyant.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant shrink-0">
                          <span className="material-symbols-outlined text-[20px]">water_drop</span>
                        </div>
                        <div>
                          <h4 className="font-headline-sm text-[16px] font-bold text-on-surface">Dessalinisateur &amp; Eau de Source</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                            Double circuit : eau douce filtrée par osmose inverse solaire pour les douches et eau osmosée reminéralisée
                            offerte en carafes de verre consignées.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface shrink-0">
                          <span className="material-symbols-outlined text-[20px]">spa</span>
                        </div>
                        <div>
                          <h4 className="font-headline-sm text-[16px] font-bold text-on-surface">Cosmétiques 100% Locaux &amp; Végétaux</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                            Savons et shampoings biodégradables saponifiés à froid à Madagascar, formulés aux huiles essentielles de
                            Ravintsara et d'Ylang-Ylang.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface shrink-0">
                          <span className="material-symbols-outlined text-[20px]">sailing</span>
                        </div>
                        <div>
                          <h4 className="font-headline-sm text-[16px] font-bold text-on-surface">Ponton Privé &amp; Mobilité Douce</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                            Départs en pirogues traditionnelles à voile ou navettes maritimes vers les îles voisines (Nosy Komba, Nosy
                            Tanikely) sans encombrement routier.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col md:flex-row gap-space-lg items-center">
                    <div className="md:w-5/12 h-56 rounded-md overflow-hidden shrink-0 w-full">
                      <img
                        className="w-full h-full object-cover"
                        alt="Thon mi-cuit au poivre sauvage et légumes du potager servi face à la mer"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3pHT_CjcwDEIyizHV2Yk8cdafjKFFKbD3bfbivi9n4RylXl3F4izx5YaUdLLBYgWtwVWYfvYxUYpwqi8MGmW70qj_snSSMa-dTYUmSeMHTWiPJZqzdDqM12rgWBXO7I3xPRiQK5cEV1K4IBZCbKvvxtLsaR4734NRSBLpjqv0MKFjgU3UDpAPsPEO4Mz46TAgUe8yakfN4peiAxqziCmFZA8-2vZyNe8ITDe05AwfAzXwf2pgwMI"
                      />
                    </div>
                    <div className="md:w-7/12 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-tertiary">
                        <span className="material-symbols-outlined">restaurant</span>
                        <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">Gastronomie Locavore</span>
                      </div>
                      <h3 className="font-headline-md text-headline-md font-bold text-on-surface">La Table de Manga Soa</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        Sous une vaste nef en charpente d'ébène et toiture de palmes, notre chef malgache met en valeur les trésors du
                        terroir insulaire : poissons et crustacés du matin débarqués par les pêcheurs du village, légumes du verger bio et
                        vanille bourbon de nos plantations partenaires.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="px-2.5 py-1 rounded bg-surface-container-low font-label-sm text-label-sm text-on-surface">
                          Petit-déjeuner bio inclus
                        </span>
                        <span className="px-2.5 py-1 rounded bg-surface-container-low font-label-sm text-label-sm text-on-surface">
                          Option demi-pension disponible
                        </span>
                        <span className="px-2.5 py-1 rounded bg-surface-container-low font-label-sm text-label-sm text-on-surface">
                          Options végétariennes &amp; sans gluten
                        </span>
                      </div>
                    </div>
                  </section>

                  <section className="bg-surface-container-low p-space-lg rounded-lg flex flex-col gap-space-md">
                    <div className="flex items-center gap-space-xs text-secondary">
                      <span className="material-symbols-outlined">handshake</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold">L'Engagement Solidaire "Fihavanana"</h2>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      En séjournant au Manga Soa Lodge via MadaVoyage, votre présence participe directement à l'économie vertueuse des
                      communautés locales du nord de Nosy Be.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-space-xs">
                      <div className="bg-surface-container-lowest p-4 rounded-md flex flex-col gap-1 shadow-sm">
                        <span className="font-headline-lg text-headline-lg font-bold text-secondary">100%</span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">Emplois Locaux</span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Tous nos collaborateurs et guides résident dans les villages voisins de Befefika et Ampangarina, formés avec
                          rémunération équitable.
                        </p>
                      </div>
                      <div className="bg-surface-container-lowest p-4 rounded-md flex flex-col gap-1 shadow-sm">
                        <span className="font-headline-lg text-headline-lg font-bold text-primary">5%</span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">Fonds Scolaire</span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Chaque nuitée finance la cantine scolaire bio et les fournitures de l'école primaire publique d'Ampangarina.
                        </p>
                      </div>
                      <div className="bg-surface-container-lowest p-4 rounded-md flex flex-col gap-1 shadow-sm">
                        <span className="font-headline-lg text-headline-lg font-bold text-tertiary">0 km</span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">Circuit Pêche</span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Achats directs sans intermédiaires auprès de 12 familles de pêcheurs traditionnels en pirogues à balancier.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section
                    className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-lg scroll-mt-28"
                    id="avis"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Avis des Éco-Voyageurs</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Basé sur 148 retours d'expériences certifiés par l'ONTM et MadaVoyage
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-display-lg text-display-lg font-extrabold text-primary leading-none">4.9</span>
                        <div className="flex flex-col">
                          <div className="flex text-amber-500">
                            <span className="material-symbols-outlined text-[18px]">star</span>
                            <span className="material-symbols-outlined text-[18px]">star</span>
                            <span className="material-symbols-outlined text-[18px]">star</span>
                            <span className="material-symbols-outlined text-[18px]">star</span>
                            <span className="material-symbols-outlined text-[18px]">star</span>
                          </div>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Excellence globale</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2 border-y border-surface-container-high">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between font-label-sm text-label-sm">
                          <span className="text-on-surface-variant">Confort &amp; Suites</span>
                          <span className="font-bold text-on-surface">4.9/5</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "98%" }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between font-label-sm text-label-sm">
                          <span className="text-on-surface-variant">Hospitalité Malgache</span>
                          <span className="font-bold text-on-surface">5.0/5</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full" style={{ width: "100%" }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between font-label-sm text-label-sm">
                          <span className="text-on-surface-variant">Gastronomie du chef</span>
                          <span className="font-bold text-on-surface">4.8/5</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full bg-tertiary-container rounded-full" style={{ width: "96%" }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between font-label-sm text-label-sm">
                          <span className="text-on-surface-variant">Impact Écologique</span>
                          <span className="font-bold text-on-surface">5.0/5</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full" style={{ width: "100%" }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-label-md text-label-md font-bold text-on-surface">
                            SL
                          </div>
                          <div>
                            <h4 className="font-label-md text-label-md font-bold text-on-surface">Sophie &amp; Laurent M.</h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              Séjour en Suite Baobab · Août 2025 · Voyage en couple
                            </p>
                          </div>
                        </div>
                        <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed/40 px-2 py-0.5 rounded">
                          Avis Vérifié MadaVoyage
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed italic">
                        « Un véritable paradis sur terre. Prendre sa douche sous les étoiles au milieu des bruissements de la forêt
                        tropicale avec vue sur les eaux calmes du canal du Mozambique est une expérience inoubliable. L'équipe d'Ampangarina
                        est d'une délicatesse et d'une bienveillance rares. »
                      </p>
                    </div>
                  </section>
                </div>

                <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start flex flex-col gap-space-md">
                  <BookingSummary />

                  <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                        <span className="material-symbols-outlined text-[22px]">sunny</span>
                      </div>
                      <div>
                        <h4 className="font-label-md text-label-md font-bold text-on-surface">Météo Prévisionnelle (Octobre)</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">28°C · Eau à 27°C · Saison idéale des baleines</p>
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary font-bold">100% Calme</span>
                  </div>
                </aside>
              </div>
            </div>
          </LodgeProvider>
        </div>
      </main>
    </>
  );
}
