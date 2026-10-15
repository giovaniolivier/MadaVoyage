import type { Metadata } from "next";
import Link from "next/link";
import CircuitActions from "@/components/circuits/rn7/CircuitActions";
import RateLabel from "@/components/currency/RateLabel";
import Rn7Booking from "@/components/circuits/rn7/Rn7Booking";
import Rn7Itinerary from "@/components/circuits/rn7/Rn7Itinerary";
import { SOLIDARITY_TEXT, WHATSAPP } from "@/lib/site";

export const metadata: Metadata = {
  title: "La Mythique Route Nationale 7 (RN7) — MadaVoyage",
  description:
    "Circuit de 10 jours d'Antananarivo à Ifaty par la RN7 : Antsirabe, Ranomafana, Anja, Isalo et lagon Vezo. Départs garantis et éco-lodges.",
};

export default function Page() {
  return (
    <main className="w-full pt-20 bg-surface min-h-[calc(100vh-20rem)]">
      <div className="flex flex-col w-full">
        <section className="relative w-full bg-surface-container-lowest overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-margin-desktop pt-8 pb-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span>Accueil</span>
                </Link>
                <span className="text-outline-variant">/</span>
                <Link className="hover:text-primary transition-colors" href="/circuits">
                  Explorer
                </Link>
                <span className="text-outline-variant">/</span>
                <Link className="hover:text-primary transition-colors" href="/circuits">
                  Circuits Signature
                </Link>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface font-semibold">La Mythique Route Nationale 7 (RN7)</span>
              </nav>

              <CircuitActions />
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Circuit Signature
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[15px] text-secondary">schedule</span> 10 jours / 9 nuits
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[15px]">eco</span> Éco-Trek &amp; Faune Endémique
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface shadow-sm font-label-sm text-label-sm font-bold">
                  <span
                    className="material-symbols-outlined text-[16px] text-tertiary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span>4.9 / 5</span>
                  <span className="text-on-surface-variant font-normal">(214 avis éco-voyageurs)</span>
                </span>
              </div>
              <h1 className="font-display-lg text-display-lg text-on-surface max-w-4xl tracking-tight leading-tight">
                La Mythique Route Nationale 7 : <span className="text-primary font-bold">Des Hautes Terres au Lagon d’Ifaty</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                980 km de contrastes géologiques et d’immersions humaines. Des collines sculptées en terrasses du pays Betsileo jusqu’aux
                sables scintillants du canal du Mozambique, en passant par les canyons jurassiques de l’Isalo et les sanctuaires de
                lémuriens.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[440px]">
              <div className="md:col-span-7 h-full rounded-2xl overflow-hidden relative shadow-md group">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  role="img"
                  aria-label="Canyons de grès du parc national de l’Isalo au coucher du soleil, falaises ocre sous un ciel doré"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB2noX3tPjQSLaxnJ5KMj963NCv6bS0x1WbVDzgXhpfrn3zLy2GTzbd1lOu-XOZd3xPY92Daxd6-moqifovqZUO29ZSsDPLfkbbrxNN604xK-UH5wCl8yoL7IROXquPJ88mX8HKEY_OmapL9kmkXjVBJTAXqggRbiX3htWKJiZmJyCnf6BoL-Gy0taCTRktnR65ZNIaRRjzXv22tDedp3XPQzE9X59ISyv7_xrnOR5mYmTgWCddpq4')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm text-label-sm w-fit mb-2">
                    <span className="material-symbols-outlined text-[14px] text-tertiary">terrain</span> Étape Majeure : Isalo Jurassique
                  </span>
                  <h2 className="font-headline-md text-headline-md text-white font-bold">Les cathédrales rocheuses de l’Isalo</h2>
                  <p className="font-body-sm text-body-sm text-white/90">
                    Baignade dans les oasis de fougères et canyons sculptés par les millénaires.
                  </p>
                </div>
              </div>

              <div className="md:col-span-5 grid grid-rows-2 gap-4 h-full">
                <div className="rounded-2xl overflow-hidden relative shadow-md group">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    role="img"
                    aria-label="Lémur catta sauvage sur les rochers de granit de la réserve communautaire d’Anja"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBjQQHZrlR3GODApmOOusdGxS7c7aM8ogVsRG8dLa65V96AFN-w15CvsD2vVwjR5SWMCQO06vMCi_wTl3t6xSHC4bZ4LYDw_4MY6VsyP3-ZOAin2jaeOSjXieEc9augX4kjfyAO6JluEKWqT8KWZVM5hivOsq6fEo7gH4CaOvmVULL7isuaRfIBq4cEwsZ0DQ3JUO4pMOsgijHQaHDSBtGAUa9tYidpLqaWswWmznR9ogzFdvVM6hs')",
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4">
                    <span className="font-label-md text-label-md text-white font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary-fixed">pets</span> Faune Endémique &amp; Makis
                      Catta (Anja)
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden relative shadow-md group">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    role="img"
                    aria-label="Lagon turquoise d’Ifaty avec des pirogues à balancier vezo sous un ciel dégagé"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDaaoMXXUHDoGaX4IOTT2Kw2stOLa16_HG1QWdGNWfqIY2fep4xIfQmqSkpxJZwSY_oZ1S9Xf-QN5dFKIp6CRDBaQDFeIUDNmCeoumvktYYjy5VbY67UDAUmsYg10vujBNu2Gl79B3q99cf_4T55uyRFVNHu3UgOzr6LPJz4TmO1AXTnZs5ghhN6szTkss1DrWVhSyUx5hksrkK-cW0sujbXQgCjyS1v3Rn6ycIGUYMO0tNfiIPYjg')",
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4">
                    <span className="font-label-md text-label-md text-white font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary-fixed">water</span> Final au Lagon d’Ifaty &amp;
                      Forêt de Baobabs
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 bg-surface-container rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">directions_car</span>
                </div>
                <div>
                  <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Distance totale</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">980 km</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[20px]">hiking</span>
                </div>
                <div>
                  <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Niveau d’effort</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Modéré (2-4h/j)</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[20px]">diversity_3</span>
                </div>
                <div>
                  <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                    Taille du groupe
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">2 à 8 personnes</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-[20px]">compost</span>
                </div>
                <div>
                  <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Impact Carbone</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">100% Compensé</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-margin-desktop py-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
            <div className="lg:col-span-8 space-y-12">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-0.5 bg-primary"></span>
                  <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                    L’Essentiel de l’Aventure
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold mb-6">
                  Quatre merveilles indissociables de la RN7
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-secondary-container/50 flex items-center justify-center text-on-secondary-container mb-4">
                      <span className="material-symbols-outlined text-[26px]">grass</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">Rizières en terrasses des Betsileo</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Balade au cœur des amphithéâtres verdoyants façonnés par des siècles de savoir-faire agricole traditionnel classé au
                      patrimoine mondial.
                    </p>
                  </div>

                  <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary mb-4">
                      <span className="material-symbols-outlined text-[26px]">forest</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">Pistage des lémuriens à Ranomafana</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Immersion matinale dans la forêt primaire brumeuse avec des pisteurs experts à la recherche de l'Hapalémur doré et des
                      caméléons nains.
                    </p>
                  </div>

                  <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed mb-4">
                      <span className="material-symbols-outlined text-[26px]">wb_twilight</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">Canyons lunaires de l’Isalo</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Randonnée à travers les formations de grès rouge, baignade régénérante dans la Piscine Naturelle et coucher de soleil
                      doré à la Fenêtre de l’Isalo.
                    </p>
                  </div>

                  <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed mb-4">
                      <span className="material-symbols-outlined text-[26px]">sailing</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">
                      Farniente éco-luxe sur le lagon d’Ifaty
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Détente les pieds dans l’eau turquoise, sorties en pirogue traditionnelle avec les pêcheurs Vezo et exploration de la
                      forêt épineuse de baobabs.
                    </p>
                  </div>
                </div>
              </div>

              <Rn7Itinerary />

              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                      Topographie &amp; Repérage
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Carte interactive &amp; Dénivelé altimétrique
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-secondary font-label-md text-label-md font-semibold">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Tracé certifié MNP / ONTM</span>
                  </div>
                </div>

                <div
                  className="w-full h-72 rounded-xl bg-cover bg-center relative overflow-hidden mb-6 shadow-inner"
                  data-location="Route Nationale 7 Madagascar, Antsirabe, Ranomafana, Isalo, Ifaty"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDIKXhzGFPEbwWcX2BxnyFkzteFEGXGNyGOOR9NA88_vemnvtl5_5xr6fxEAZqs0_XCbwU4r13fjRS3QfKBo07CkPWH_Hy7VYJxoei3JjjGRYOymj4hmnSo9vcutnP1Yjm3SDDLRlhAUwYEEKLUXzy6BzCn87laZ9-GjhfbOohLfarzaGBkj0CY6K6U-f-WgpLCPzx_ND06Py8YckYpboISqmhdBXaXGtVDoHHO0Rzp4jI2X42gZtM')",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 bg-surface-container-lowest/90 backdrop-blur-md p-3 rounded-xl shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-primary animate-ping"></span>
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        Tana (1 280 m) → Fianarantsoa (1 200 m) → Isalo (820 m) → Ifaty (0 m)
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      980 km asphaltés &amp; pistes côtières
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                      Profil altimétrique de l’itinéraire (Hautes Terres vers Océan)
                    </span>
                    <span className="font-label-sm text-label-sm text-primary font-bold">Max: 1 500m • Min: 0m</span>
                  </div>
                  <svg className="w-full h-24 overflow-visible" fill="none" viewBox="0 0 600 80" xmlns="http://www.w3.org/2000/svg">
                    <path
                      className="text-primary-container/20"
                      d="M 0,25 Q 75,10 150,30 T 300,35 T 450,55 L 600,75 L 600,80 L 0,80 Z"
                      fill="currentColor"
                    ></path>
                    <path
                      className="text-primary"
                      d="M 0,25 Q 75,10 150,30 T 300,35 T 450,55 L 600,75"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="3"
                    ></path>

                    <circle className="fill-primary" cx="10" cy="25" r="4"></circle>
                    <text className="font-label-sm text-[10px] fill-on-surface font-bold" x="10" y="16">
                      Tana 1280m
                    </text>
                    <circle className="fill-secondary" cx="150" cy="30" r="4"></circle>
                    <text className="font-label-sm text-[10px] fill-on-surface font-bold" x="150" y="22">
                      Ranomafana 900m
                    </text>
                    <circle className="fill-tertiary" cx="360" cy="40" r="4"></circle>
                    <text className="font-label-sm text-[10px] fill-on-surface font-bold" x="360" y="32">
                      Isalo 820m
                    </text>
                    <circle className="fill-primary-container" cx="585" cy="75" r="4"></circle>
                    <text className="font-label-sm text-[10px] fill-on-surface font-bold" x="525" y="68">
                      Ifaty 0m
                    </text>
                  </svg>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-0.5 bg-primary"></span>
                  <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">Transparence Totale</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold mb-6">Conditions du séjour &amp; Prestations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="font-headline-sm text-headline-sm text-secondary font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[22px]">check_circle</span> Ce qui est inclus
                    </h4>
                    <ul className="space-y-2.5 font-body-md text-body-md text-on-surface-variant">
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check</span>
                        <span>Véhicule 4x4 tout-terrain privatisé avec climatisation et carburant illimité.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check</span>
                        <span>Chauffeur-accompagnateur francophone certifié durant les 10 jours.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check</span>
                        <span>
                          Tous les droits d'entrée et guides locaux obligatoires dans les Parcs Nationaux (Ranomafana, Isalo, Anja).
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check</span>
                        <span>9 nuits en éco-lodges de charme sélectionnés pour leur démarche RSE.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check</span>
                        <span>Demi-pension terroir (petits-déjeuners gourmands et dîners complets).</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check</span>
                        <span>{SOLIDARITY_TEXT}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-headline-sm text-headline-sm text-tertiary font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[22px]">cancel</span> Ce qui n’est pas inclus
                    </h4>
                    <ul className="space-y-2.5 font-body-md text-body-md text-on-surface-variant">
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">close</span>
                        <span>Vols internationaux jusqu’à Antananarivo et vol intérieur retour Tuléar - Tana.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">close</span>
                        <span>Déjeuners de midi libres (compter 6 à 10 € / repas dans les restaurants recommandés).</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">close</span>
                        <span>Boissons alcoolisées et dépenses personnelles.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">close</span>
                        <span>Pourboires pour le chauffeur-guide et les pisteurs de parcs.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">close</span>
                        <span>Assurance assistance-rapatriement, vivement conseillée.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">Témoignages Vécus</span>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface font-extrabold">
                      Avis de notre communauté d’éco-voyageurs
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container-lowest px-4 py-2 rounded-full shadow-sm">
                    <span
                      className="material-symbols-outlined text-[20px] text-tertiary-container"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">4.9</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">/ 5 (214 retours)</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary-container/50 text-on-secondary-container font-headline-sm flex items-center justify-center font-bold">
                            HM
                          </div>
                          <div>
                            <span className="block font-label-md text-label-md text-on-surface font-bold">Hélène &amp; Marc V.</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">Voyage en Septembre 2025 • Lyon</span>
                          </div>
                        </div>
                        <div className="flex text-tertiary-container">
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                        </div>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface">
                        « Le voyage d’une vie ! Notre chauffeur Faly a été prévenant, cultivé et prudent. La transition des Hautes Terres
                        fraîches jusqu’aux eaux tièdes d’Ifaty est spectaculaire. La réserve villageoise d’Anja nous a profondément touchés.
                        »
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-surface-container flex items-center gap-1.5 text-secondary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">verified</span> Voyage vérifié avec MadaVoyage
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary font-headline-sm flex items-center justify-center font-bold">
                            TC
                          </div>
                          <div>
                            <span className="block font-label-md text-label-md text-on-surface font-bold">Thibault &amp; Claire D.</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">Voyage en Novembre 2025 • Bruxelles</span>
                          </div>
                        </div>
                        <div className="flex text-tertiary-container">
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                        </div>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface">
                        « L’Isalo sous les étoiles et les baignades dans les oasis sont magiques. Organisation millimétrée, lodges
                        éco-responsables magnifiques et une vraie fierté de savoir qu’une partie de notre budget va directement à l'école
                        locale. »
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-surface-container flex items-center gap-1.5 text-secondary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">verified</span> Voyage vérifié avec MadaVoyage
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4 w-full sticky top-28 space-y-6">
              <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xl border border-surface-container-high/60 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-bold">
                    Départs Garantis 2026
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-right">
                    <RateLabel />
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg font-black text-on-surface">1 290 €</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">/ personne</span>
                  </div>
                  <p className="font-label-sm text-label-sm text-primary font-semibold">soit ~ 6 321 000 Ar au cours officiel</p>
                </div>

                <Rn7Booking />

                <div className="mt-6 p-4 rounded-2xl bg-secondary-container/20 border-l-4 border-secondary space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">volunteer_activism</span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">Engagement Fihavanana</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{SOLIDARITY_TEXT}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-surface-container flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[24px]">support_agent</span>
                  </div>
                  <div className="flex-1">
                    <span className="block font-label-md text-label-md text-on-surface font-bold">Une question sur la RN7 ?</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Joignable 7j/7 sur WhatsApp ou appel</span>
                  </div>
                  <a
                    className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:bg-secondary hover:text-on-secondary transition-colors"
                    href={`${WHATSAPP.href}?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20le%20circuit%20RN7`}
                    rel="noopener noreferrer"
                    target="_blank"
                    title="Contacter par WhatsApp"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                  </a>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md font-bold text-on-surface">Climat en cours sur la RN7</span>
                  <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-semibold">
                    <span className="material-symbols-outlined text-[16px]">sunny</span> Période Optimale
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1 font-body-sm text-body-sm">
                  <div className="bg-surface-container p-2 rounded-xl">
                    <span className="block text-on-surface-variant text-[11px]">Hautes Terres</span>
                    <span className="font-bold text-on-surface">22°C</span>
                  </div>
                  <div className="bg-surface-container p-2 rounded-xl">
                    <span className="block text-on-surface-variant text-[11px]">Isalo Sud</span>
                    <span className="font-bold text-on-surface">29°C</span>
                  </div>
                  <div className="bg-surface-container p-2 rounded-xl">
                    <span className="block text-on-surface-variant text-[11px]">Ifaty Lagon</span>
                    <span className="font-bold text-on-surface">27°C (Eau)</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
