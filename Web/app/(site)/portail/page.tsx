import type { Metadata } from "next";
import Link from "next/link";
import { CurrencyToggle, ExpeditionSearch, ExploreProvider, FavoriteButton, Price } from "@/components/explore/Explore";
import { SeasonBadge, TrendChips, TrustBar } from "@/components/explore/HeroBits";
import { CIRCUITS } from "@/components/circuits/catalog-data";
import { eur as formatEur, mga as formatMga } from "@/components/reservation/pricing";
import Pending from "@/components/ui/Pending";
import {
  RATING,
  REVIEWS_COUNT,
  REVIEWS_VERIFIED,
  SERVICE_PROMISE,
  SOLIDARITY_RATE,
  SOLIDARITY_TEXT,
  TRAVELERS_COUNT,
  WHATSAPP,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Grands Sanctuaires & Circuits de Madagascar — MadaVoyage",
  description:
    "Nosy Be, Isalo, Allée des Baobabs, Sainte-Marie, Diego Suarez : explorez les destinations incontournables de Madagascar et nos circuits signature avec guides locaux.",
};

/** Durée, prix et avis lus dans le catalogue : la formule et la fiche circuit annoncent la même offre. */
function offerOf(id: string) {
  const c = CIRCUITS.find((x) => x.id === id)!;
  return {
    duration: `${c.days} jours / ${c.nights} nuits`,
    eur: formatEur(c.priceEur),
    mga: formatMga(c.priceEur),
    rating: `${c.rating.toFixed(1).replace(".", ",")} (${c.reviews} avis)`,
  };
}

function OfferRating({ id }: { id: string }) {
  if (!REVIEWS_VERIFIED) return null;
  return (
    <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md font-medium">
      <span className="material-symbols-outlined text-[18px] text-tertiary">star</span> {offerOf(id).rating}
    </div>
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

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-20 pb-12 flex flex-col justify-between h-full">
              <div className="max-w-3xl space-y-6">
                <SeasonBadge />
                <h1 className="font-display-lg text-display-lg text-surface tracking-tight leading-tight">
                  L’Émerveillement Sauvage de l’Océan Indien.
                </h1>
                <p className="font-body-lg text-[20px] leading-relaxed text-surface font-medium max-w-2xl [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]">
                  Tsingy, lagons de Nosy Be, chant de l’Indri à Andasibe : des expéditions sur-mesure avec des guides locaux.
                </p>
                <TrendChips />
              </div>
              <TrustBar />
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-20 pt-6 pb-2">
            <nav
              aria-label="Fil d'Ariane"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm font-label-md text-label-md text-on-surface-variant"
            >
              <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span className="">Accueil</span>
              </Link>
              <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
              <Link href="/circuits" className="hover:text-primary transition-colors">
                Découverte Madagascar
              </Link>
              <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
              <span className="text-primary font-semibold">Grands Sanctuaires &amp; Circuits</span>
            </nav>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full -mt-10 relative z-20">
            <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-6 lg:p-8 transition-all">
              <ExpeditionSearch />
            </div>
          </div>

          <section className="max-w-7xl mx-auto px-6 lg:px-8 w-full pt-24 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 text-secondary font-label-lg text-label-lg uppercase tracking-wider mb-2 font-bold">
                  <span className="material-symbols-outlined text-[20px]">travel_explore</span>
                  <span className="">Sélection d’Exception</span>
                </div>
                <h2 className="font-display-lg text-display-lg text-on-surface tracking-tight">Destinations Incontournables</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-xl text-[16px]">
                  Écosystèmes endémiques à 90%, atolls immaculés et massifs jurassiques façonnés par des millions d’années d’isolement.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <CurrencyToggle />
                <Link
                  className="px-6 py-3 rounded-full bg-surface-container text-primary font-label-lg text-label-lg hover:bg-surface-container-high transition-colors flex items-center gap-1.5 font-bold"
                  href="/circuits"
                >
                  Voir les 18 sanctuaires <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    role="img"
                    aria-label="Eaux turquoise de l’archipel de Nosy Be"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBMBI4fC-1m6CDy1XRA0Za4X5khehryYVku88Grson1o_4dwVQQimNFmdVojDNdbbcUVL2XZ-TSgnsftczLI159q8KhCyldGtqahJZHD9NmnCfGd9txdnZRca7Xu5Gez_q6ObFZvAhaqfFiROFwdPzO0krY-jNh5WBQHNwC_k9B-ev3f0r473Igd55rUZ3ZQpLJZY6UvGDy76Z9jOTptpx-hZJ1E4nhXo_AqPtXMFpXKVd4aC503M8')",
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1.5 rounded-full bg-tertiary text-on-tertiary font-label-md text-label-md font-bold shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">stars</span> Coup de cœur
                    </span>
                  </div>
                  <FavoriteButton id="nosy-be" name="Archipel de Nosy Be & Mitsio" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-surface font-label-md text-label-md font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">schedule</span> 6 à 8 jours
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-bold">
                      Lagon &amp; Corail
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between gap-5">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors font-bold">
                      Archipel de Nosy Be &amp; Mitsio
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                      Tortues marines, requins-baleines et plantations d'Ylang-Ylang.
                    </p>
                  </div>
                  <div className="pt-4 bg-surface-container-low p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">Dès</span>
                      <div className="font-headline-sm text-headline-sm text-primary font-bold">
                        <Price
                          eur="450 €"
                          mga="2 205 000 Ar"
                          secondaryClassName="font-body-md text-body-md text-on-surface-variant font-normal"
                        />
                      </div>
                    </div>
                    <Link
                      className="px-4 py-2 rounded-full bg-primary font-label-md text-label-md font-bold text-on-primary hover:bg-primary-container transition-all flex items-center gap-1"
                      href="/circuits"
                    >
                      <span className="">Découvrir</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="group flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    role="img"
                    aria-label="Lagon sauvage de l’île Sainte-Marie"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDMZ3UqfLWcPcFXNPjYJKOKEimkvdcD_Op8qGZPD_1V9-w7H6iKhRpnRee2YQJlxEx64uGSqScGy_k7r_WEeFX_EYHxTM3Tc_BJKm-7DYCBbVyEApiVKPfOaYZaVdgGXYutlBrAsyJ7jD9GyakJr_PZ3cLwj3cDHuPbkSqVjl0hYYzU7XFdqG1U0-60f7PTUIvFFGO5MvGn2YwbwhGj4Z5251hy7SCYXXufdfWeBTXEeiCn_gTLECQ')",
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-secondary font-label-md text-label-md font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">waves</span> Baleines
                    </span>
                  </div>
                  <FavoriteButton id="sainte-marie" name="Île Sainte-Marie & Nattes" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-surface font-label-md text-label-md font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">schedule</span> 5 à 7 jours
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-bold">Île aux Nattes</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between gap-5">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors font-bold">
                      Île Sainte-Marie &amp; Nattes
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                      Refuge de corsaires, lagons préservés et ballet annuel des baleines à bosse.
                    </p>
                  </div>
                  <div className="pt-4 bg-surface-container-low p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">Dès</span>
                      <div className="font-headline-sm text-headline-sm text-primary font-bold">
                        <Price
                          eur="420 €"
                          mga="2 058 000 Ar"
                          secondaryClassName="font-body-md text-body-md text-on-surface-variant font-normal"
                        />
                      </div>
                    </div>
                    <Link
                      className="px-4 py-2 rounded-full bg-primary font-label-md text-label-md font-bold text-on-primary hover:bg-primary-container transition-all flex items-center gap-1"
                      href="/circuits"
                    >
                      <span className="">Découvrir</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="group flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    role="img"
                    aria-label="Canyon de grès du parc national de l’Isalo"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCnEfcc0C3xZ8aOHMwitXjwzo4W6DbJJhy447X_qzJYNCrLNUDH8CNGFeg-8X7y6EdsfNCaWDjOyTGL4RKW6PZQNmi-4KOdfdmVTTcE5_GPadcaw20ELV3Kh8nA1SnZr_e0DkyJA_lqK9rJYYQNON507ngNE2qmnTiOvUCivs2o7zbYYL03ZgYMsVFzR2Pgkh5lwQCBinD_VL2cHRqRleIaZnVWMNiemuGVC8ayndkywIeFEuH1X8c')",
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1.5 rounded-full bg-tertiary text-on-tertiary font-label-md text-label-md font-bold shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">stars</span> Top Aventure
                    </span>
                  </div>
                  <FavoriteButton id="isalo" name="Parc National de l'Isalo" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-surface font-label-md text-label-md font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">schedule</span> 4 à 6 jours
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-bold">
                      Trek &amp; Canyons
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between gap-5">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors font-bold">
                      Parc National de l'Isalo
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                      Canyons jurassiques déchiquetés, piscines naturelles et lémuriens catta.
                    </p>
                  </div>
                  <div className="pt-4 bg-surface-container-low p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">Dès</span>
                      <div className="font-headline-sm text-headline-sm text-primary font-bold">
                        <Price
                          eur="490 €"
                          mga="2 401 000 Ar"
                          secondaryClassName="font-body-md text-body-md text-on-surface-variant font-normal"
                        />
                      </div>
                    </div>
                    <Link
                      className="px-4 py-2 rounded-full bg-primary font-label-md text-label-md font-bold text-on-primary hover:bg-primary-container transition-all flex items-center gap-1"
                      href="/circuits/rn7"
                    >
                      <span className="">Découvrir</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="group flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    role="img"
                    aria-label="Mer d’Émeraude près de Diego Suarez"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBcpEix6A9DBSbjhJlIMRFk4Sx9K0yBiih6blbHStFyBlzuuV9yZJU13bwd5olptdY4g05--4ytfCXgHeQCk-BTyN2kQS9yZx2_ZFt1KEgsnEdsAGbZy5BcMSFuw8O9JcrUNjQqeweUx6WpPYQwHnrGua_uASZAOHCVajHKXVjkD_FD8gyPMyoyJK2NHi9tuWQbqIH66r4-izVMGkYskDkfGY84B8CXRMGmMYG8IffMPn0EW-zjOLY')",
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-secondary font-label-md text-label-md font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">air</span> Mer d'Émeraude
                    </span>
                  </div>
                  <FavoriteButton id="diego-suarez" name="Diego Suarez & Tsingy Rouges" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-surface font-label-md text-label-md font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">schedule</span> 7 à 9 jours
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-bold">Baies &amp; Tsingy</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between gap-5">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors font-bold">
                      Diego Suarez &amp; Tsingy Rouges
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                      Navigation sur la Mer d'Émeraude et cathédrales ocres sculptées d’Irodo.
                    </p>
                  </div>
                  <div className="pt-4 bg-surface-container-low p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">Dès</span>
                      <div className="font-headline-sm text-headline-sm text-primary font-bold">
                        <Price
                          eur="520 €"
                          mga="2 548 000 Ar"
                          secondaryClassName="font-body-md text-body-md text-on-surface-variant font-normal"
                        />
                      </div>
                    </div>
                    <Link
                      className="px-4 py-2 rounded-full bg-primary font-label-md text-label-md font-bold text-on-primary hover:bg-primary-container transition-all flex items-center gap-1"
                      href="/circuits"
                    >
                      <span className="">Découvrir</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full bg-surface-container-low py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="inline-flex items-center gap-2 font-label-lg text-label-lg text-secondary uppercase tracking-wider bg-secondary-container/40 px-4 py-1.5 rounded-full mb-3 font-bold">
                  <span className="material-symbols-outlined text-[18px]">verified</span> Circuits Signature MadaVoyage
                </span>
                <h2 className="font-display-lg text-display-lg text-on-surface tracking-tight">Formules Expéditions Clé en Main</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-3 text-[16px]">
                  Véhicule tout-terrain avec chauffeur-guide pisteur francophone, hébergements écolodge labellisés, permis des parcs
                  nationaux inclus.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                <div className="flex flex-col bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-label-md text-label-md font-bold uppercase">
                      Nord &amp; Archipels
                    </span>
                    <OfferRating id="diego" />
                  </div>
                  <div className="relative h-56 rounded-xl overflow-hidden mb-5">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      role="img"
                      aria-label="Cascade dans la forêt de la Montagne d’Ambre"
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqvdyYb9W9BODyxVlrFFDInPbT6pIFAZ4RviAHb09HNjJI5mGUAfF2ADtlO5N6gMeMQIx2e5Tu3RUz7b2ozMKgSMRbnEKXwuRoG4o36c6bMdQGJPp7uYVc9KmGbhu6S_MRlVcnfYHSLYk4th7RRDm4T5orwYJaT9TaKaHtCfemZc1vmemC0OYa-7pAvjC2VAR1nq2m6oGn_rVi4PZVekf2syISQ1lkKV_cBTI2GEiWEN_xfyP6Dd4')",
                      }}
                    ></div>
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-on-surface/70 backdrop-blur-sm text-surface font-label-md text-label-md font-medium">
                      {offerOf("diego").duration}
                    </div>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold">
                    Le Grand Nord Lagon &amp; Montagne d’Ambre
                  </h3>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 text-[15px] leading-relaxed flex-1">
                    Diego Suarez, la baie des Sakalava, les Tsingy Rouges et la canopée brumeuse des Montagnes d’Ambre avec observation de
                    la faune endémique.
                  </p>
                  <div className="pt-4 bg-surface-container-low p-4 rounded-xl flex items-center justify-between mt-auto">
                    <div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">Dès</span>
                      <div className="font-headline-md text-headline-md text-primary font-bold">
                        <Price
                          eur={offerOf("diego").eur}
                          mga={offerOf("diego").mga}
                          secondaryClassName="font-body-md text-body-md text-on-surface-variant font-normal"
                        />
                      </div>
                    </div>
                    <Link
                      className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold hover:bg-primary-container transition-all"
                      href="/circuits"
                    >
                      Voir le circuit
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col bg-surface-container-lowest rounded-2xl p-6 shadow-xl relative transform lg:-translate-y-2 ring-2 ring-primary/30">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-tertiary text-on-tertiary font-label-md text-label-md font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">local_fire_department</span> Le Grand Classique Madagascar
                  </div>
                  <div className="flex items-center justify-between mb-4 mt-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-secondary/15 text-secondary font-label-md text-label-md font-bold uppercase">
                      Hautes Terres &amp; Sud
                    </span>
                    <OfferRating id="rn7" />
                  </div>
                  <div className="relative h-56 rounded-xl overflow-hidden mb-5">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      role="img"
                      aria-label="Rizières en terrasses le long de la RN7"
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuANzmWHaUb9VtlgvUg29raTuNu1ex10gd1daErkQkVxu0yrw8p7GB4ekSkfuqYQlHBoXKPF7fUJXl9-uEUBxqJiP5XjnP1HTQLYdrZX64nnMXT7-VztaWKQsO7dcOGaAvcpe0wg8OPjBWDrotB2BB2yQJxrSDyeZQV69Lyh_OEnw79UwSLl7yDbpH76fi-kHg31FBI6FzeSIA9Cx0FbE4yERRSsnq70ihlyI55AcPCtzDx8v9GfWeM')",
                      }}
                    ></div>
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-on-surface/70 backdrop-blur-sm text-surface font-label-md text-label-md font-medium">
                      {offerOf("rn7").duration}
                    </div>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold">
                    La Mythique RN7 &amp; Massif de l’Isalo
                  </h3>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 text-[15px] leading-relaxed flex-1">
                    D’Antananarivo à Tuléar : rizières étagées d'Ambalavao, forêt tropicale de Ranomafana, canyons de l'Isalo et séjour
                    balnéaire à Ifaty.
                  </p>
                  <div className="pt-4 bg-surface-container p-4 rounded-xl flex items-center justify-between mt-auto">
                    <div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">Dès</span>
                      <div className="font-headline-md text-headline-md text-primary font-bold">
                        <Price
                          eur={offerOf("rn7").eur}
                          mga={offerOf("rn7").mga}
                          secondaryClassName="font-body-md text-body-md text-on-surface-variant font-normal"
                        />
                      </div>
                    </div>
                    <Link
                      className="px-5 py-2.5 rounded-full bg-tertiary text-on-tertiary font-label-lg text-label-lg font-bold hover:bg-on-tertiary-fixed-variant transition-all shadow-sm"
                      href="/circuits/rn7"
                    >
                      Voir le circuit
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3.5 py-1.5 rounded-full bg-tertiary/10 text-tertiary font-label-md text-label-md font-bold uppercase">
                      Aventure &amp; Piste
                    </span>
                    <OfferRating id="tsiribihina" />
                  </div>
                  <div className="relative h-56 rounded-xl overflow-hidden mb-5">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      role="img"
                      aria-label="Aiguilles calcaires des Tsingy de Bemaraha"
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB14LcPdxgEqG6Qo4Inl4JsP5Ihst4iGVjrzxOvAvb1Ip-0MRSmdVJTe8NLNp5ZMhGA9NWPSp8ATCOYCDsp-KVq-uHaHPLgYd5Akw4L5M4lcbHzm66svzmmxC4cpZaJUsq6dqM8vvrgHgCYWuL5jAd1pwcE4Broex8MbKTn_xpaeJoksG8DypiZBKzjI8-crf1OwNk737PmhKEHID9mTeomkn4EWney14cqO8YlL8KM8njTmBAON7k')",
                      }}
                    ></div>
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-on-surface/70 backdrop-blur-sm text-surface font-label-md text-label-md font-medium">
                      {offerOf("tsiribihina").duration}
                    </div>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold">
                    Piste Ouest des Baobabs &amp; Grands Tsingy
                  </h3>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 text-[15px] leading-relaxed flex-1">
                    Descente du fleuve Tsiribihina, allée des Baobabs au crépuscule et via ferrata sur les cathédrales calcaires
                    vertigineuses de Bemaraha.
                  </p>
                  <div className="pt-4 bg-surface-container-low p-4 rounded-xl flex items-center justify-between mt-auto">
                    <div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">Dès</span>
                      <div className="font-headline-md text-headline-md text-primary font-bold">
                        <Price
                          eur={offerOf("tsiribihina").eur}
                          mga={offerOf("tsiribihina").mga}
                          secondaryClassName="font-body-md text-body-md text-on-surface-variant font-normal"
                        />
                      </div>
                    </div>
                    <Link
                      className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold hover:bg-primary-container transition-all"
                      href="/circuits"
                    >
                      Voir le circuit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 flex flex-col gap-6">
                <span className="inline-flex items-center gap-2 font-label-lg text-label-lg text-primary uppercase tracking-wider font-bold">
                  <span className="material-symbols-outlined text-[20px]">nature</span> Écosystèmes &amp; Endémisme
                </span>
                <h2 className="font-display-lg text-display-lg text-on-surface tracking-tight leading-tight">
                  Un Continent en Miniature, Préservé Avec Vous.
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant text-[16px] leading-relaxed">
                  Madagascar abrite plus de 100 espèces de lémuriens, 300 espèces d'oiseaux et 6 des 8 espèces de baobabs de la planète. En
                  voyageant avec MadaVoyage, vos droits d’accès financent directement les patrouilles de gardes forestiers de Madagascar
                  National Parks.
                </p>
                <div className="grid grid-cols-2 gap-5 pt-2">
                  <div className="p-5 rounded-2xl bg-surface-container-low flex flex-col">
                    <span className="font-display-lg text-display-lg text-secondary font-extrabold leading-none">92%</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface mt-2 font-bold">Faune Endémique</span>
                    <span className="font-body-md text-body-md text-on-surface-variant mt-1">Espèces uniques au monde</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-surface-container-low flex flex-col">
                    <span className="font-display-lg text-display-lg text-primary font-extrabold leading-none">43</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface mt-2 font-bold">Parcs Nationaux</span>
                    <span className="font-body-md text-body-md text-on-surface-variant mt-1">Sanctuaires contrôlés</span>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-secondary/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-on-secondary shrink-0">
                    <span className="material-symbols-outlined text-[26px]">forest</span>
                  </div>
                  <div>
                    <div className="font-label-lg text-label-lg text-on-surface font-bold text-[16px]">
                      {SOLIDARITY_RATE} reversé au fonds Fihavanana
                    </div>
                    <div className="font-body-md text-body-md text-on-surface-variant mt-0.5">{SOLIDARITY_TEXT}</div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 relative">
                <div className="p-4 bg-surface-container-lowest rounded-3xl shadow-lg">
                  <div
                    className="w-full h-[520px] rounded-2xl bg-cover bg-center relative overflow-hidden"
                    data-location="Madagascar"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA3gx9CUBkveUejhZIFe_JpGNe3gPAl7r8-HTAXnVhEvVAPeUPhWdcYSD8SejgS33vUNW2LjCSdN1uTyOR9ke20Ae2ZcvMJLLaUI1fkF9UYL9EgEgFtMZ_Ru5_tiwudyjYkvrD7pVE-D7mAMABWj3PNKW2a-YJmOh99Y2142kQxtTrNDapu0WSu8tappqNlwLfViAydlLrwtKaMzJGmC97ragmOeHhQF62DwOfr2w9zIsoVNxW6Nng')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute top-[18%] left-[62%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg ring-4 ring-surface-container-lowest">
                        <span className="material-symbols-outlined text-[16px]">anchor</span>
                      </div>
                      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-surface-container-lowest text-on-surface px-3.5 py-1.5 rounded-xl shadow-lg whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        <span className="font-label-md text-label-md font-bold">Nosy Be (Archipel)</span>
                      </div>
                    </div>
                    <div className="absolute top-[48%] left-[32%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary shadow-lg ring-4 ring-surface-container-lowest">
                        <span className="material-symbols-outlined text-[16px]">park</span>
                      </div>
                      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-surface-container-lowest text-on-surface px-3.5 py-1.5 rounded-xl shadow-lg whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                        <span className="font-label-md text-label-md font-bold">Allée des Baobabs (Morondava)</span>
                      </div>
                    </div>
                    <div className="absolute top-[52%] left-[58%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                      <div className="w-9 h-9 rounded-full bg-on-surface text-surface flex items-center justify-center shadow-lg ring-4 ring-surface-container-lowest">
                        <span className="material-symbols-outlined text-[18px]">location_city</span>
                      </div>
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-surface-container-lowest text-on-surface px-3.5 py-1.5 rounded-xl shadow-lg whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span className="font-label-md text-label-md font-bold">Antananarivo (Hub Central)</span>
                      </div>
                    </div>
                    <div className="absolute top-[75%] left-[45%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-lg ring-4 ring-surface-container-lowest">
                        <span className="material-symbols-outlined text-[16px]">landscape</span>
                      </div>
                      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-surface-container-lowest text-on-surface px-3.5 py-1.5 rounded-xl shadow-lg whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        <span className="font-label-md text-label-md font-bold">Isalo &amp; Canyons de l'Ouest</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md p-3.5 rounded-xl flex items-center justify-between text-on-surface font-label-md text-label-md">
                      <div className="flex items-center gap-5">
                        <span className="flex items-center gap-2 font-medium">
                          <span className="w-3 h-3 rounded-full bg-primary"></span> Côtier &amp; Marin
                        </span>
                        <span className="flex items-center gap-2 font-medium">
                          <span className="w-3 h-3 rounded-full bg-secondary"></span> Forêt &amp; Trek
                        </span>
                        <span className="flex items-center gap-2 font-medium">
                          <span className="w-3 h-3 rounded-full bg-tertiary"></span> Piste &amp; Baobabs
                        </span>
                      </div>
                      <span className="text-on-surface-variant font-medium">Couverture Nationale 22 Régions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full bg-surface-container py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <span className="font-label-lg text-label-lg text-primary uppercase tracking-wider font-bold">
                    {REVIEWS_VERIFIED ? "Témoignages Vérifiés" : "Témoignages"}
                  </span>
                  <h2 className="font-display-lg text-display-lg text-on-surface tracking-tight mt-1">Ce que Racontent Nos Voyageurs</h2>
                </div>
                {REVIEWS_VERIFIED ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-tertiary">
                      <span className="material-symbols-outlined text-[22px]">star</span>
                      <span className="material-symbols-outlined text-[22px]">star</span>
                      <span className="material-symbols-outlined text-[22px]">star</span>
                      <span className="material-symbols-outlined text-[22px]">star</span>
                      <span className="material-symbols-outlined text-[22px]">star</span>
                    </div>
                    <span className="font-headline-md text-headline-md text-on-surface font-bold">{RATING}/5</span>
                    <span className="font-body-lg text-body-lg text-on-surface-variant">({REVIEWS_COUNT} avis vérifiés)</span>
                  </div>
                ) : (
                  <Pending>Exemples de mise en page · note et avis réels en attente</Pending>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-tertiary mb-3">
                      <span className="material-symbols-outlined text-[18px]">star</span>
                      <span className="material-symbols-outlined text-[18px]">star</span>
                      <span className="material-symbols-outlined text-[18px]">star</span>
                      <span className="material-symbols-outlined text-[18px]">star</span>
                      <span className="material-symbols-outlined text-[18px]">star</span>
                    </div>
                    <p className="font-body-lg text-body-lg text-on-surface italic leading-relaxed text-[16px]">
                      « Dix jours inoubliables sur la RN7. Notre chauffeur-guide connaissait chaque recoin, chaque plante médicinale et a
                      repéré des caméléons nains rarissimes. La logistique 4x4 était impeccable ! »
                    </p>
                  </div>
                  <div className="flex items-center gap-3.5 pt-6 mt-6 border-t-0 bg-surface-container-low -mx-6 -mb-6 p-4 rounded-b-2xl">
                    <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center font-headline-sm text-headline-sm text-primary font-bold">
                      C
                    </div>
                    <div>
                      <div className="font-label-lg text-label-lg text-on-surface font-bold">Claire &amp; Mathieu B.</div>
                      <div className="font-body-md text-body-md text-on-surface-variant">Circuit RN7 &amp; Isalo • Septembre 2026</div>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-tertiary mb-3">
                      <span className="material-symbols-outlined text-[18px]">star</span>
                      <span className="material-symbols-outlined text-[18px]">star</span>
                      <span className="material-symbols-outlined text-[18px]">star</span>
                      <span className="material-symbols-outlined text-[18px]">star</span>
                      <span className="material-symbols-outlined text-[18px]">star</span>
                    </div>
                    <p className="font-body-lg text-body-lg text-on-surface italic leading-relaxed text-[16px]">
                      « L'Allée des Baobabs au lever du jour restera gravée dans notre mémoire à jamais. L'impact écologique nous tenait à
                      cœur : nous avons pu participer à la plantation de jeunes baobabs avec Fihavanana. »
                    </p>
                  </div>
                  <div className="flex items-center gap-3.5 pt-6 mt-6 border-t-0 bg-surface-container-low -mx-6 -mb-6 p-4 rounded-b-2xl">
                    <div className="w-11 h-11 rounded-full bg-secondary/20 flex items-center justify-center font-headline-sm text-headline-sm text-secondary font-bold">
                      A
                    </div>
                    <div>
                      <div className="font-label-lg text-label-lg text-on-surface font-bold">Alexandre V. &amp; Famille</div>
                      <div className="font-body-md text-body-md text-on-surface-variant">Piste Ouest &amp; Morondava • Août 2026</div>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-tertiary mb-3">
                      <span className="material-symbols-outlined text-[18px]">star</span>
                      <span className="material-symbols-outlined text-[18px]">star</span>
                      <span className="material-symbols-outlined text-[18px]">star</span>
                      <span className="material-symbols-outlined text-[18px]">star</span>
                      <span className="material-symbols-outlined text-[18px]">star</span>
                    </div>
                    <p className="font-body-lg text-body-lg text-on-surface italic leading-relaxed text-[16px]">
                      « Croisière en catamaran aux îles Mitsio et observation des baleines à Sainte-Marie. Équipage malgache d’une
                      gentillesse sans pareille. Transparence totale et prestations de très haut vol. »
                    </p>
                  </div>
                  <div className="flex items-center gap-3.5 pt-6 mt-6 border-t-0 bg-surface-container-low -mx-6 -mb-6 p-4 rounded-b-2xl">
                    <div className="w-11 h-11 rounded-full bg-tertiary/20 flex items-center justify-center font-headline-sm text-headline-sm text-tertiary font-bold">
                      S
                    </div>
                    <div>
                      <div className="font-label-lg text-label-lg text-on-surface font-bold">Sophie de Montmirail</div>
                      <div className="font-body-md text-body-md text-on-surface-variant">Archipel Nosy Be • Juillet 2026</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <div className="text-center font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-6 font-bold">
                  Réseau Hôtelier Labellisé &amp; Accréditations Internationales
                </div>
                <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 opacity-85">
                  <div className="flex items-center gap-2.5 text-on-surface font-headline-sm text-headline-sm font-bold">
                    <span className="material-symbols-outlined text-primary text-[28px]">verified_user</span>
                    <span className="">MNP Madagascar</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-on-surface font-headline-sm text-headline-sm font-bold">
                    <span className="material-symbols-outlined text-secondary text-[28px]">nature</span>
                    <span className="">ONTM Tourisme</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-on-surface font-headline-sm text-headline-sm font-bold">
                    <span className="material-symbols-outlined text-tertiary text-[28px]">hotel</span>
                    <span className="">Relais de la Reine</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-on-surface font-headline-sm text-headline-sm font-bold">
                    <span className="material-symbols-outlined text-primary text-[28px]">villa</span>
                    <span className="">Princesse Bora Lodge</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-on-surface font-headline-sm text-headline-sm font-bold">
                    <span className="material-symbols-outlined text-secondary text-[28px]">eco</span>
                    <span className="">Anjajavy Le Lodge</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
            <div className="relative rounded-3xl overflow-hidden p-8 lg:p-14 bg-gradient-to-r from-on-primary-fixed-variant to-primary text-on-primary shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl space-y-4">
                <span className="px-4 py-1.5 rounded-full bg-surface-container-lowest/20 backdrop-blur-md text-surface font-label-md text-label-md uppercase tracking-wider inline-flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined text-[18px]">bolt</span> Réservation instantanée
                </span>
                <h2 className="font-display-lg text-display-lg tracking-tight text-surface">
                  Composez votre itinéraire sur-mesure en quelques minutes
                </h2>
                <p className="font-body-lg text-body-lg text-surface-variant text-[16px]">
                  {SERVICE_PROMISE} Une question en chemin ? Notre équipe à Antananarivo répond sur WhatsApp.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full sm:w-auto shrink-0">
                <Link
                  className="h-14 px-8 rounded-full bg-tertiary hover:bg-on-tertiary-fixed-variant text-on-tertiary font-label-lg text-label-lg flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all font-bold"
                  href="/reservation/dates"
                >
                  <span className="material-symbols-outlined text-[22px]">calendar_add_on</span>
                  <span className="">Planifier mon voyage</span>
                </Link>
                <a
                  className="h-14 px-8 rounded-full bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 backdrop-blur-md text-surface font-label-lg text-label-lg flex items-center justify-center gap-2.5 transition-all font-bold"
                  href={WHATSAPP.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span className="">WhatsApp · {WHATSAPP.display}</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </ExploreProvider>
    </main>
  );
}
