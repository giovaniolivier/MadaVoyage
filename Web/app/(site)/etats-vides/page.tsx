import type { Metadata } from "next";
import Link from "next/link";
import {
  EmptyStatesProvider,
  FilterSummary,
  OpenAdvisorButton,
  SmartAdjustment,
  StateTabs,
  StateViews,
  SwitchStateButton,
} from "@/components/etats-vides/EmptyStatesDemo";

export const metadata: Metadata = {
  title: "États vides & exploration — MadaVoyage",
  description:
    "Quand une recherche ne donne rien, MadaVoyage propose des alternatives : saisons, budgets réalistes et sanctuaires accessibles à Madagascar.",
};

export default function Page() {
  return (
    <EmptyStatesProvider>
      <main className="w-full pt-20 bg-background min-h-screen">
        <div className="flex flex-col w-full">
          <div className="relative w-full max-w-7xl mx-auto px-margin-desktop py-space-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md mb-space-xl">
              <div>
                <div className="flex items-center gap-space-xs text-primary font-label-sm text-label-sm uppercase tracking-wider mb-1">
                  <span className="material-symbols-outlined text-[16px]">travel_explore</span>
                  <span>Expérience Utilisateur • États d'Attente Bienveillants</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Gestion des États Vides &amp; Exploration
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
                  Chez MadaVoyage, une recherche sans résultat n'est jamais une impasse : nous décodons la météo locale, ajustons les
                  réalités logistiques de la Grande Île et guidons chaque voyageur vers la meilleure alternative.
                </p>
              </div>

              <StateTabs />
            </div>

            <StateViews
              search={
                <>
                  <FilterSummary />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-stretch">
                    <div className="lg:col-span-5 bg-surface-container-high rounded-lg p-space-xl flex flex-col justify-between relative overflow-hidden shadow-sm">
                      <div className="absolute -right-8 -bottom-8 opacity-25 pointer-events-none text-primary">
                        <svg fill="currentColor" height="280" viewBox="0 0 200 200" width="280">
                          <path d="M100 20 C55.8 20 20 55.8 20 100 C20 144.2 55.8 180 100 180 C144.2 180 180 144.2 180 100 C180 55.8 144.2 20 100 20 Z M100 160 C66.9 160 40 133.1 40 100 C40 66.9 66.9 40 100 40 C133.1 40 160 66.9 160 100 C160 133.1 133.1 160 100 160 Z"></path>
                          <circle cx="100" cy="100" r="15"></circle>
                          <polygon points="100,50 112,88 150,100 112,112 100,150 88,112 50,100 88,88"></polygon>
                        </svg>
                      </div>
                      <div className="relative z-10 flex flex-col items-start">
                        <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-tertiary-container shadow-md mb-space-md">
                          <span className="material-symbols-outlined text-[34px]">cyclone</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm mb-3">
                          <span className="material-symbols-outlined text-[14px]">warning</span>
                          <span>Sanctuaire Momentanément Inaccessible</span>
                        </div>
                        <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-2">
                          Les Tsingy de Bemaraha veillent et dorment en février.
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                          Notre charte écotouristique privilégie avant tout la préservation des écosystèmes fragiles et votre entière
                          sécurité sur les pistes de l'Ouest malgache.
                        </p>
                      </div>

                      <div className="relative z-10 bg-surface/90 backdrop-blur-md rounded p-space-md shadow-sm">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b-0">
                          <div className="flex items-center gap-2 text-primary font-label-sm text-label-sm">
                            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                            <span>Période Idéale : Mai à Novembre</span>
                          </div>
                          <span className="text-tertiary font-label-sm text-label-sm font-bold">Fermé MNP</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          En saison des pluies (janvier-mars), les pistes d'argile rouge (RN8) sont impraticables et les bacs sur la
                          Manambolo et la Tsiribihina sont suspendus en raison des crues torrentielles.
                        </p>
                      </div>
                    </div>

                    <div className="lg:col-span-7 bg-surface-container-lowest rounded-lg p-space-xl flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex items-center gap-2 text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-2">
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          <span>Transparence &amp; Réalité Terrain</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-space-sm">
                          Pourquoi cette combinaison est impossible en ce moment ?
                        </h3>
                        <div className="space-y-space-md mt-space-md">
                          <div className="flex items-start gap-space-md">
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                              <span className="material-symbols-outlined text-[20px]">water_drop</span>
                            </div>
                            <div>
                              <h4 className="font-headline-sm text-headline-sm text-on-surface">
                                Météo &amp; Réglementation Parc National
                              </h4>
                              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                                L'organisme Madagascar National Parks (MNP) ordonne chaque année la fermeture administrative des Grands
                                Tsingy entre mi-décembre et fin avril pour régénération des sols et prévention des accidents sur les
                                passerelles suspendues.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-space-md">
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-tertiary shrink-0">
                              <span className="material-symbols-outlined text-[20px]">payments</span>
                            </div>
                            <div>
                              <h4 className="font-headline-sm text-headline-sm text-on-surface">
                                Équilibre budgétaire d'une expédition Ouest
                              </h4>
                              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                                Un budget de 300 € ne permet pas de couvrir la logistique minimale d'un bivouac éthique à Bemaraha. Nos
                                expéditions respectueuses démarrent à partir de <strong>980 € (~ 4 750 000 Ar)</strong>, intégrant les
                                droits de conservation MNP, le guidage local certifié, un véhicule 4x4 tout-terrain avec chauffeur et les
                                campements zéro-déchet.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-space-md">
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0">
                              <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                            </div>
                            <div>
                              <h4 className="font-headline-sm text-headline-sm text-on-surface">
                                Rémunération équitable des équipes locales
                              </h4>
                              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                                Chaque voyage finance directement 14 porteurs, pisteurs botanistes et cuisiniers locaux à un tarif supérieur
                                de 35% aux standards du secteur, garantissant le respect humain de nos circuits.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <SmartAdjustment />
                    </div>
                  </div>

                  <div className="flex flex-col gap-space-md mt-space-md">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-xs">
                      <div>
                        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
                          Plans de Secours Écotouristiques
                        </span>
                        <h3 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                          Sanctuaires accessibles et radieux en ce moment
                        </h3>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                        Des sanctuaires préservés adaptés à votre saison ou facilement configurables selon vos envies d'authenticité.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-desktop">
                      <div className="bg-surface-container-lowest rounded-lg overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
                        <div>
                          <div className="relative h-48 w-full overflow-hidden">
                            <div
                              className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                              aria-label="Mer turquoise de Nosy Be, cocotiers et pirogue traditionnelle sur le sable blanc"
                              role="img"
                              style={{
                                backgroundImage:
                                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3y902hRjI7OMJ8oPWm_WozR23H6xJx9pisPh7k3wEExq9QNXJiRlPqN0WIMhiYMBNXqVUAJRAWHu8s6_lf8b3K17j10GeXjp3Ibm6pmfj2L16nzWKEu5_Iv2W8mP9vJ3Ec98S7tHr6ohVOdJpgX8VhduVh9PQmS-LvIGskbwT-e77Zp1CjONWck3tQiNDvYm3zB-O1rWxa26K_WHxoiqi0H8UHmYkFZWPD1msI9iPi_-gf120YrI')",
                              }}
                            ></div>
                            <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full font-label-sm text-label-sm text-primary font-bold shadow-sm">
                              Climat Ensoleillé
                            </div>
                            <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full font-label-sm text-label-sm text-secondary flex items-center gap-1 shadow-sm">
                              <span className="material-symbols-outlined text-[14px]">eco</span>
                              <span>Réserve Marine Lokobe</span>
                            </div>
                          </div>
                          <div className="p-space-lg flex flex-col gap-space-xs">
                            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                              Archipel du Nord • Accessible toute l'année
                            </span>
                            <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                              Archipel de Nosy Be &amp; Baie des Russes
                            </h4>
                            <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                              Plages préservées, observation de la faune aquatique éco-régulée et forêts de mangroves vierges protégées par
                              les villages Sakalava.
                            </p>
                          </div>
                        </div>
                        <div className="p-space-lg pt-0 flex items-center justify-between border-t-0">
                          <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-on-surface-variant">À partir de</span>
                            <div className="flex items-baseline gap-1">
                              <span className="font-headline-md text-headline-md text-primary">450 €</span>
                              <span className="font-body-sm text-body-sm text-outline">~ 2 180 000 Ar</span>
                            </div>
                          </div>
                          <Link
                            className="px-space-md py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors shadow-sm"
                            href="/circuits"
                          >
                            Voir l'itinéraire
                          </Link>
                        </div>
                      </div>

                      <div className="bg-surface-container-lowest rounded-lg overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
                        <div>
                          <div className="relative h-48 w-full overflow-hidden">
                            <div
                              className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                              aria-label="Forêt tropicale d'Andasibe-Mantadia avec fougères arborescentes et un lémurien indri sur une branche"
                              role="img"
                              style={{
                                backgroundImage:
                                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBErzZr6-Ks_Chby4JpDJl_aY_Vpi8zSqPdzgmg4hpgAe6GI1Uf2CPbqj990z3UAbdW1EAgm0DagAJzAv3bbGyIAzUZzGVqZI4U5pIqZhg3nfiVIcdx4YpNUTBNE9jHYP9uO15hS5X6m-pTqkqZR3N8RqAZdaN3Ulhwdjrsgt6hTZH8joL06tEgJEXdxXkWOz7uSk0o2JPN1FYfVQO4BY8khgwvrze-uEkFh_8tZNLTSVolYQyh06k')",
                              }}
                            ></div>
                            <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full font-label-sm text-label-sm text-secondary font-bold shadow-sm">
                              Accessible RN2
                            </div>
                            <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full font-label-sm text-label-sm text-tertiary flex items-center gap-1 shadow-sm">
                              <span className="material-symbols-outlined text-[14px]">pets</span>
                              <span>Chant de l'Indri-Indri</span>
                            </div>
                          </div>
                          <div className="p-space-lg flex flex-col gap-space-xs">
                            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                              Hautes Terres &amp; Forêt Humide • 4 Jours
                            </span>
                            <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                              Sanctuaire d'Andasibe-Mantadia
                            </h4>
                            <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                              Pistes goudronnées impeccables depuis Antananarivo. Écoutez le chant ancestral du plus grand lémurien au monde
                              au cœur d'une forêt de brume.
                            </p>
                          </div>
                        </div>
                        <div className="p-space-lg pt-0 flex items-center justify-between border-t-0">
                          <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-on-surface-variant">À partir de</span>
                            <div className="flex items-baseline gap-1">
                              <span className="font-headline-md text-headline-md text-primary">650 €</span>
                              <span className="font-body-sm text-body-sm text-outline">~ 3 150 000 Ar</span>
                            </div>
                          </div>
                          <Link
                            className="px-space-md py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors shadow-sm"
                            href="/circuits"
                          >
                            Voir l'itinéraire
                          </Link>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-surface-container via-surface to-surface-container-high rounded-lg p-space-lg flex flex-col justify-between shadow-sm relative overflow-hidden">
                        <div className="relative z-10 flex flex-col gap-space-sm">
                          <div className="w-12 h-12 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-md">
                            <span className="material-symbols-outlined text-[24px]">support_agent</span>
                          </div>
                          <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-widest font-bold">
                            Création Personnalisée
                          </span>
                          <h4 className="font-headline-sm text-headline-sm text-on-surface">
                            Votre itinéraire calibré au centime et au jour près
                          </h4>
                          <p className="font-body-md text-body-md text-on-surface-variant">
                            Vous avez un budget fixe ou des dates non modifiables ? Indiquez-les dans la réservation en ligne : le
                            configurateur vous propose aussitôt un parcours qui les respecte.
                          </p>
                          <div className="bg-surface rounded p-space-sm shadow-xs flex items-center gap-space-sm">
                            <span className="material-symbols-outlined text-[20px] text-secondary">handshake</span>
                            <span className="font-body-sm text-body-sm text-on-surface font-medium">100% sans frais d'intermédiaire</span>
                          </div>
                        </div>
                        <div className="relative z-10 pt-space-md">
                          <OpenAdvisorButton className="w-full py-3 rounded-full bg-tertiary text-on-tertiary font-label-lg text-label-lg hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2">
                            <span>Co-créer mon circuit solidaire</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </OpenAdvisorButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              }
              carnet={
                <>
                  <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col lg:flex-row items-center justify-between gap-space-xl relative overflow-hidden">
                    <div className="flex flex-col gap-space-sm max-w-xl z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm w-fit">
                        <span className="material-symbols-outlined text-[16px]">park</span>
                        <span>Programme Régénération Fihavanana</span>
                      </div>
                      <h2 className="font-display-lg text-display-lg text-on-surface tracking-tight">
                        Votre carnet de voyage est encore vierge de poussière rouge.
                      </h2>
                      <p className="font-body-lg text-body-lg text-on-surface-variant">
                        Bienvenue Alexandre. Aucune réservation active n'est enregistrée pour le moment. Votre premier voyage à Madagascar
                        financera directement la replantation de 10 baobabs et palétuviers endémiques.
                      </p>
                      <div className="flex flex-wrap items-center gap-space-md pt-space-sm">
                        <Link
                          className="px-space-lg py-3.5 rounded-full bg-tertiary text-on-tertiary font-label-lg text-label-lg shadow-md hover:opacity-95 transition-all flex items-center gap-2"
                          href="/reservation/destination"
                        >
                          <span>Concevoir mon premier séjour</span>
                          <span className="material-symbols-outlined text-[18px]">explore</span>
                        </Link>
                        <SwitchStateButton
                          className="px-space-md py-3.5 rounded-full bg-surface-container text-primary font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center gap-2"
                          to="search"
                        >
                          <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                          <span>Parcourir les parcs nationaux</span>
                        </SwitchStateButton>
                      </div>
                    </div>

                    <div className="w-full lg:w-96 shrink-0 relative z-10">
                      <div className="bg-surface-container-low rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary text-[24px]">energy_savings_leaf</span>
                            <span className="font-label-lg text-label-lg text-on-surface">Votre Dotation Éco</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm">
                            Offert
                          </span>
                        </div>
                        <div className="h-44 w-full rounded overflow-hidden relative">
                          <div
                            className="w-full h-full bg-cover bg-center"
                            aria-label="Allée des Baobabs au coucher du soleil"
                            role="img"
                            style={{
                              backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYJNUlAdBJzwZcjr-yowyqMoQkiWO6x3v0Yj9EELwMz4PxY3trR1r1XXqdpLSZcROOFJLqraDaBJ3psQrGlq6kPOB6bCYONGBjnSWe39PmdcYmZaFtLWHgVXCHwdB2ON0PhgFsPOFZhaFx5VqBuWBskIiF1UAgh_Ed5pJZv17o5rLW_o6BMVhgsl0VYYXkrAxNUnrGYgcd3J1MPXYQmowl8R-e09-3dFINJo7EHZH6-Uj3MFWCEs8')",
                            }}
                          ></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                            <span className="text-white font-label-sm text-label-sm font-semibold">10 Arbres réservés à Morondava</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                          <span>Certificat blockchain carbone</span>
                          <span className="text-secondary font-bold">Activé dès validation</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
                    <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-sm">
                      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[24px]">map</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">1. Pistes &amp; Tracés GPS Hors-Ligne</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Retrouvez vos cartes topographiques des parcs, les numéros d'urgence des gardes forestiers et vos vouchers sans
                        aucune connexion 4G requise.
                      </p>
                    </div>
                    <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-sm">
                      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[24px]">diversity_3</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">2. Contact Direct avec votre Guide</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Un fil de messagerie sécurisé et bienveillant avec votre chauffeur-pisteurs et les hébergements écologiques avant le
                        décollage.
                      </p>
                    </div>
                    <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-sm">
                      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-tertiary">
                        <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">3. Double Facturation Transparente</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Suivez au centime près la répartition des pourboires et le virement direct vers le fond de reforestation de la
                        communauté d'accueil.
                      </p>
                    </div>
                  </div>
                </>
              }
            />

            <div className="mt-space-xl p-space-lg rounded-lg bg-surface-container-low shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-md">
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
                </div>
                <div>
                  <span className="font-label-md text-label-md text-on-surface font-bold block">Comparateur de scénarios UX</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Basculez entre le cas d'échec de filtres et l'accueil d'un compte sans voyage enregistré.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SwitchStateButton
                  className="px-space-md py-2 rounded-full bg-surface text-primary font-label-sm text-label-sm hover:bg-surface-container transition-colors shadow-xs"
                  to="search"
                >
                  Voir État 1 : Filtres sans issue
                </SwitchStateButton>
                <SwitchStateButton
                  className="px-space-md py-2 rounded-full bg-surface text-secondary font-label-sm text-label-sm hover:bg-surface-container transition-colors shadow-xs"
                  to="carnet"
                >
                  Voir État 2 : Carnet nouveau compte
                </SwitchStateButton>
              </div>
            </div>
          </div>
        </div>
      </main>
    </EmptyStatesProvider>
  );
}
