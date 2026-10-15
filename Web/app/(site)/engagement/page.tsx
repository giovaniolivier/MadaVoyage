import type { Metadata } from "next";
import Link from "next/link";
import { ImpactMap, ImpactReportButton } from "@/components/engagement/Engagement";
import { FAMILIES_IMPACT, FAMILIES_SUPPORTED, LICENSE, SOLIDARITY_RATE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Engagement Fihavanana & écotourisme régénératif | MadaVoyage",
  description: `Reforestation, ${SOLIDARITY_RATE} de chaque réservation reversé aux communautés, guides rémunérés équitablement : découvrez la charte éthique de MadaVoyage et la carte de nos projets à Madagascar.`,
};

export default function Page() {
  return (
    <>
      <main className="flex-1 w-full pt-20 bg-surface">
        <div className="flex flex-col w-full">
          <section className="relative w-full overflow-hidden bg-on-surface text-surface">
            <div className="absolute -top-32 -right-24 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="relative max-w-[1440px] mx-auto px-margin-desktop pt-space-xl pb-32">
              <div className="flex flex-wrap items-center justify-between gap-space-md mb-space-lg">
                <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-lowest/10 backdrop-blur-md">
                  <span className="material-symbols-outlined text-[18px] text-secondary-fixed">diversity_1</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed">
                    Manifeste Écotouristique & Régénératif
                  </span>
                </div>
                <div className="flex items-center gap-space-sm font-label-md text-label-md text-surface-container-highest/60">
                  <Link className="hover:text-surface transition-colors" href="/">
                    MadaVoyage
                  </Link>
                  <span>/</span>
                  <span className="text-secondary-fixed">Engagement Fihavanana</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-end">
                <div className="lg:col-span-8 flex flex-col gap-space-md">
                  <h1 className="font-display-lg text-display-lg font-extrabold text-surface leading-[1.1] tracking-tight">
                    Le Fihavanana : <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-fixed via-primary-fixed to-inverse-primary">
                      L'Art Malgache de Vivre en Harmonie
                    </span>{" "}
                    <br />
                    avec la Terre et les Hommes.
                  </h1>
                  <p className="font-body-lg text-body-lg text-surface-container-highest/90 max-w-2xl mt-space-sm leading-relaxed">
                    Chez MadaVoyage, nous ne concevons pas le tourisme comme une simple visite, mais comme une alliance équitable et durable
                    avec les sanctuaires de la Grande Île. Chaque pas sur la terre rouge régénère nos forêts et autonomise les familles
                    locales.
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col justify-end">
                  <div className="p-space-lg rounded bg-surface-container-lowest/10 backdrop-blur-md shadow-xl flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-surface-container-highest/70">
                        Principe Fondateur
                      </span>
                      <span className="material-symbols-outlined text-secondary-fixed text-[24px]">verified</span>
                    </div>
                    <p className="font-body-md text-body-md italic text-surface leading-snug">
                      « Ny firaisankina no hery » — L'union fait la force. Le Fihavanana transcende le voyage : c'est la promesse que votre
                      venue élève chaque village traversé.
                    </p>
                    <div className="flex items-center gap-space-xs mt-space-xs text-primary-fixed font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">park</span>
                      <span>100% Impliqué sur le territoire malgache</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-[1440px] mx-auto px-margin-desktop -mt-16 relative z-10 w-full mb-space-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
              <div className="p-space-lg rounded bg-surface-container-lowest shadow-[0_10px_24px_-4px_rgba(15,163,177,0.12)] hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-space-md">
                  <div className="w-12 h-12 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[24px]">forest</span>
                  </div>
                  <span className="px-space-sm py-0.5 rounded-full font-label-sm text-label-sm bg-secondary/10 text-secondary font-bold">
                    100% Carbone
                  </span>
                </div>
                <div>
                  <div className="font-headline-lg text-headline-lg font-extrabold text-on-surface tracking-tight mb-space-xs">24 500</div>
                  <p className="font-headline-sm text-headline-sm text-primary font-semibold mb-space-xs">Arbres Endémiques</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Replantés dans la forêt primaire d'Andasibe et le delta du Sambirano pour neutraliser chaque transfert.
                  </p>
                </div>
                <div className="mt-space-md pt-space-sm flex items-center gap-space-xs text-secondary font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span>+3 200 pousses ce semestre</span>
                </div>
              </div>

              <div className="p-space-lg rounded bg-surface-container-lowest shadow-[0_10px_24px_-4px_rgba(15,163,177,0.12)] hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-space-md">
                  <div className="w-12 h-12 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[24px]">volunteer_activism</span>
                  </div>
                  <span className="px-space-sm py-0.5 rounded-full font-label-sm text-label-sm bg-tertiary/10 text-tertiary font-bold">
                    Direct & Transparent
                  </span>
                </div>
                <div>
                  <div className="font-headline-lg text-headline-lg font-extrabold text-on-surface tracking-tight mb-space-xs">
                    {SOLIDARITY_RATE}
                  </div>
                  <p className="font-headline-sm text-headline-sm text-tertiary font-semibold mb-space-xs">Reversé aux Communautés</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Prélevés de façon systématique sur chaque réservation au profit des écoles rurales et dispensaires sans intermédiaire.
                  </p>
                </div>
                <div className="mt-space-md pt-space-sm flex items-center gap-space-xs text-tertiary font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  <span>14 écoles soutenues en 2025</span>
                </div>
              </div>

              <div className="p-space-lg rounded bg-surface-container-lowest shadow-[0_10px_24px_-4px_rgba(15,163,177,0.12)] hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-space-md">
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">badge</span>
                  </div>
                  <span className="px-space-sm py-0.5 rounded-full font-label-sm text-label-sm bg-primary/10 text-primary font-bold">
                    100% Malgaches
                  </span>
                </div>
                <div>
                  <div className="font-headline-lg text-headline-lg font-extrabold text-on-surface tracking-tight mb-space-xs">2,5x</div>
                  <p className="font-headline-sm text-headline-sm text-primary font-semibold mb-space-xs">Revenu Équitable Certifié</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Éco-gardes et guides naturalistes rétribués bien au-delà des indices régionaux, avec mutuelle santé complète.
                  </p>
                </div>
                <div className="mt-space-md pt-space-sm flex items-center gap-space-xs text-primary font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[16px]">shield_with_heart</span>
                  <span>64 guides certifiés MNP</span>
                </div>
              </div>

              <div className="p-space-lg rounded bg-surface-container-lowest shadow-[0_10px_24px_-4px_rgba(15,163,177,0.12)] hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-space-md">
                  <div className="w-12 h-12 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[24px]">water_drop</span>
                  </div>
                  <span className="px-space-sm py-0.5 rounded-full font-label-sm text-label-sm bg-secondary/10 text-secondary font-bold">
                    Zéro Plastique
                  </span>
                </div>
                <div>
                  <div className="font-headline-lg text-headline-lg font-extrabold text-on-surface tracking-tight mb-space-xs">0</div>
                  <p className="font-headline-sm text-headline-sm text-secondary font-semibold mb-space-xs">Plastique à Usage Unique</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Gourdes isothermes en inox offertes et stations de filtration solaire UV équipant chaque bivouac et 4x4.
                  </p>
                </div>
                <div className="mt-space-md pt-space-sm flex items-center gap-space-xs text-secondary font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[16px]">clean_hands</span>
                  <span>128 000 bouteilles évitées/an</span>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-[1440px] mx-auto px-margin-desktop py-space-xl w-full">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-space-xl gap-space-md">
              <div>
                <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-secondary/15 text-secondary font-label-sm text-label-sm mb-space-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">potted_plant</span>
                  <span>Notre Modèle Holistique</span>
                </div>
                <h2 className="font-display-lg text-display-lg font-extrabold text-on-surface">Les 3 Piliers du Tourisme Solidaire</h2>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                L'écotourisme ne se résume pas à observer la faune : il restaure activement les écosystèmes et offre une alternative
                économique digne aux riverains des aires protégées.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
              <article className="bg-surface-container-lowest rounded overflow-hidden shadow-[0_2px_8px_-2px_rgba(15,163,177,0.06)] flex flex-col group hover:shadow-[0_10px_24px_-4px_rgba(15,163,177,0.12)] transition-all duration-300">
                <div className="relative h-72 w-full overflow-hidden bg-surface-container">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt="Indri indri perché dans la canopée brumeuse d'Andasibe-Mantadia"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnhxn4ehKlLsx1_5ioLDCntqbG9ciPpeZqKZFMplEQQMCzp5FvUN0Euohegc07gPictd81rE_peF9h8CbEeX3om-roL4UOkY93zMa_l2Xk2YBRdGwzPQDqp3FoJeFIi0jLozvdVb-BBn2nGi1v8LIKUd0a6Ss4BwhbceMLtbmisp0rhE952NCV9AxcLBSdYrRg7ENAcMlyoExlhozrgGPjAbLZEOJcwnz9nHxlx406P9lCW5T9BQo"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full font-label-sm text-label-sm text-secondary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">pets</span>
                    <span>Pilier 01</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-surface">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed">Sanctuaires & Faune</span>
                    <h3 className="font-headline-md text-headline-md font-bold text-surface">Préservation des Espèces Vulnérables</h3>
                  </div>
                </div>
                <div className="p-space-lg flex-1 flex flex-col justify-between">
                  <div>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                      En collaboration étroite avec <strong>Madagascar National Parks</strong>, nos expéditions financent des patrouilles
                      d'éco-surveillance contre le braconnage et la déforestation dans les corridors vitaux d'Andasibe, de Lokobe et du
                      Menabe.
                    </p>
                    <ul className="flex flex-col gap-space-sm mb-space-md font-body-sm text-body-sm text-on-surface">
                      <li className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        <span>
                          Protection active du lémurien chanteur <em>Indri-indri</em>
                        </span>
                      </li>
                      <li className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        <span>Suivi satellite et nurseries des tortues marines d'Ifaty</span>
                      </li>
                      <li className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        <span>Pépinières de palissandre et baobabs Grandidier</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-space-md bg-surface-container-low/50 -mx-space-lg -mb-space-lg p-space-md flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Taux de survie des semis</span>
                    <span className="font-label-md text-label-md text-secondary font-bold">92,4% sur 3 ans</span>
                  </div>
                </div>
              </article>

              <article className="bg-surface-container-lowest rounded overflow-hidden shadow-[0_2px_8px_-2px_rgba(15,163,177,0.06)] flex flex-col group hover:shadow-[0_10px_24px_-4px_rgba(15,163,177,0.12)] transition-all duration-300">
                <div className="relative h-72 w-full overflow-hidden bg-surface-container">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt="Écoliers souriants devant leur classe rurale à Ranohira"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfYeWgkJu621CTQ2lz5PcNpQqn_o4GTDuL3H04maq8VnIbUi7gPEc_XDBXSot8fhyoqRMlwdF8TkBfm43T7igyTWNAaFjn76WhsC3Z989y9aoTb76kg7xaEYpf6I8rC90rRdve7P_RjerClCQkaG1VmVfeSWZAQx53DLzZbBpvcxUnHvn2ahnC5f2NTClrGgN-TMZ44yDNs8Ofh-mEcA4Ghb82OmPgF8v6iu13kZpstqPG0sp0KDk"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full font-label-sm text-label-sm text-tertiary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">home_work</span>
                    <span>Pilier 02</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-surface">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary-fixed">
                      Développement Équitable
                    </span>
                    <h3 className="font-headline-md text-headline-md font-bold text-surface">Émancipation des Communautés Hôtes</h3>
                  </div>
                </div>
                <div className="p-space-lg flex-1 flex flex-col justify-between">
                  <div>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                      Nous réinvestissons directement les dividendes du voyage dans les infrastructures vitales choisies démocratiquement
                      par les assemblées villageoises (<em>Fokonolona</em>). Pas d'assistanat, une vraie émancipation économique.
                    </p>
                    <ul className="flex flex-col gap-space-sm mb-space-md font-body-sm text-body-sm text-on-surface">
                      <li className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                        <span>Financement de 120 repas scolaires/jour à Ampangarina</span>
                      </li>
                      <li className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                        <span>3 puits artésiens à pompage solaire installés à Ranohira</span>
                      </li>
                      <li className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                        <span>Coopératives maraîchères bio fournissant nos bivouacs</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-space-md bg-surface-container-low/50 -mx-space-lg -mb-space-lg p-space-md flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Bénéficiaires directs</span>
                    <span className="font-label-md text-label-md text-tertiary font-bold">
                      {FAMILIES_SUPPORTED} familles rurales depuis {FAMILIES_IMPACT.since}
                    </span>
                  </div>
                </div>
              </article>

              <article className="bg-surface-container-lowest rounded overflow-hidden shadow-[0_2px_8px_-2px_rgba(15,163,177,0.06)] flex flex-col group hover:shadow-[0_10px_24px_-4px_rgba(15,163,177,0.12)] transition-all duration-300">
                <div className="relative h-72 w-full overflow-hidden bg-surface-container">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt="Pêcheurs Vezo naviguant en pirogue à balancier dans la baie de Salary"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGbgNai3SOvsJ8Ggb3QiP7MU9Ub6-u9iVkFO6F1wCcPfhzmkSzHOPVWA0nQENhjilnwzBmaRLMe9MdRC39bzTLxJ2OwzX13he4JjTpBCy6iLsDBcFnoy2uRfSuBbr1hch-JAz-FnfQXwj2cTqZIYQaUZeAVFgMGUgUIP3D_PwvGaRarRofyql_lnxn6WrA1BKIlLqXcCiADmNIQveLMn7uelXUPKl7SHFcRQoqxbtuUNo0y-e52LM"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full font-label-sm text-label-sm text-primary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">palette</span>
                    <span>Pilier 03</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-surface">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed">Héritage Vivant</span>
                    <h3 className="font-headline-md text-headline-md font-bold text-surface">Authenticité & Savoir-Faire Ancestral</h3>
                  </div>
                </div>
                <div className="p-space-lg flex-1 flex flex-col justify-between">
                  <div>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                      MadaVoyage célèbre l'artisanat d'exception de l'île. Nous soutenons la transmission des techniques manuelles reconnues
                      par l'UNESCO, en éliminant les intermédiaires spéculatifs pour garantir aux maîtres-artisans le juste fruit de leur
                      art.
                    </p>
                    <ul className="flex flex-col gap-space-sm mb-space-md font-body-sm text-body-sm text-on-surface">
                      <li className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                        <span>Piroguiers Vezo : navigation à la voile sans moteur</span>
                      </li>
                      <li className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                        <span>Sculpteurs de bois Zafimaniry d'Ambositra labellisés</span>
                      </li>
                      <li className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                        <span>Ateliers de filature de soie sauvage (Landibe) à Soatanana</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-space-md bg-surface-container-low/50 -mx-space-lg -mb-space-lg p-space-md flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Artisans accompagnés</span>
                    <span className="font-label-md text-label-md text-primary font-bold">115 maîtres & apprentis</span>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section className="max-w-[1440px] mx-auto px-margin-desktop py-space-xl w-full">
            <ImpactMap />
          </section>

          <section className="max-w-[1440px] mx-auto px-margin-desktop py-space-xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
              <div className="lg:col-span-5 flex flex-col gap-space-md">
                <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[16px] text-primary">policy</span>
                  <span>Transparence & Rigueur Légale</span>
                </div>
                <h2 className="font-display-lg text-display-lg font-extrabold text-on-surface leading-tight">
                  Notre Charte Éthique & Écolabellisation
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Nous refusons le « greenwashing ». Nos actions sont encadrées par des conventions bipartites officielles et soumises aux
                  audits environnementaux annuels de l'Office National du Tourisme de Madagascar et de l'UICN.
                </p>
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-start gap-space-sm p-space-sm rounded bg-surface-container-low">
                    <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">verified_user</span>
                    <div>
                      <h5 className="font-label-md text-label-md font-bold text-on-surface">{LICENSE}</h5>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Certification de conformité d'opérateur éco-responsable agréé par le Ministère malgache du Tourisme.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-space-sm p-space-sm rounded bg-surface-container-low">
                    <span className="material-symbols-outlined text-secondary text-[22px] mt-0.5">nature_people</span>
                    <div>
                      <h5 className="font-label-md text-label-md font-bold text-on-surface">Partenaire Madagascar National Parks (MNP)</h5>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Reversement contractuel pour la gestion durable des 43 parcs et réserves nationales.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="p-space-lg rounded bg-surface-container-lowest shadow-[0_2px_8px_-2px_rgba(15,163,177,0.06)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <span className="material-symbols-outlined text-secondary text-[32px]">workspace_premium</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">Norme MNP-2025</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-xs">
                      Respect Inconditionnel des « Fady »
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Sensibilisation stricte aux tabous culturels sacrés locaux pour préserver la quiétude spirituelle des tombeaux royaux
                      et des arbres sacrés lors de chaque circuit.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-sm flex items-center justify-between text-secondary font-label-sm text-label-sm font-bold">
                    <span>Guide éthique remis au départ</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </div>
                </div>

                <div className="p-space-lg rounded bg-surface-container-lowest shadow-[0_2px_8px_-2px_rgba(15,163,177,0.06)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <span className="material-symbols-outlined text-primary text-[32px]">handshake</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">Commerce Équitable</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-xs">Achats 100% Circuit Court</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Toutes les denrées consommées en bivouac et lodges sont acquises au prix fort auprès des marchés de brousse locaux.
                      Zéro importation superflue.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-sm flex items-center justify-between text-primary font-label-sm text-label-sm font-bold">
                    <span>Traçabilité d'approvisionnement</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </div>
                </div>

                <div className="p-space-lg rounded bg-surface-container-lowest shadow-[0_2px_8px_-2px_rgba(15,163,177,0.06)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <span className="material-symbols-outlined text-tertiary text-[32px]">energy_savings_leaf</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">Bilan Carbone Négatif</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-xs">
                      Reboisement Compensatoire 120%
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Nous surcompensons les émissions de transport en plantant un surplus systématique de 20% pour garantir l'expansion
                      nette de la couverture forestière.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-sm flex items-center justify-between text-tertiary font-label-sm text-label-sm font-bold">
                    <span>Audité par l'ONG Mitsinjo</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </div>
                </div>

                <div className="p-space-lg rounded bg-surface-container-lowest shadow-[0_2px_8px_-2px_rgba(15,163,177,0.06)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <span className="material-symbols-outlined text-primary text-[32px]">shield</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">Bien-être Animal</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-xs">
                      Observation Éthique Non-Intrusive
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Interdiction formelle de nourrir, toucher ou appâter les lémuriens et caméléons. Distance minimale de sécurité de 5
                      mètres scrupuleusement observée.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-sm flex items-center justify-between text-primary font-label-sm text-label-sm font-bold">
                    <span>Conforme code éthique UICN</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-[1440px] mx-auto px-margin-desktop py-space-xl w-full">
            <div className="text-center max-w-2xl mx-auto mb-space-xl">
              <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-secondary/15 text-secondary font-label-sm text-label-sm mb-space-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                <span>Paroles du Terrain</span>
              </div>
              <h2 className="font-display-lg text-display-lg font-extrabold text-on-surface">Ceux qui vivent le Fihavanana au quotidien</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                Derrière chaque séjour, il y a des visages, des voix et des vies transformées par le voyage éco-responsable.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              <div className="p-space-lg rounded bg-surface-container-lowest shadow-[0_2px_8px_-2px_rgba(15,163,177,0.06)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-tertiary mb-space-md">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface italic leading-relaxed mb-space-lg">
                    « Grâce à MadaVoyage, nous ne sommes plus de simples accompagnateurs précaires. Nous sommes reconnus comme les gardiens
                    scientifiques de nos forêts, formés à la botanique avec un revenu qui met nos familles à l'abri durablement. »
                  </p>
                </div>
                <div className="flex items-center gap-space-md pt-space-md bg-surface-container-low/40 -mx-space-lg -mb-space-lg p-space-md rounded-b">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      alt="Portrait de Faly, guide naturaliste à Andasibe"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvJ7QdkGm1oUzBEauaXWqknqkP3slx4AeRHcnkiBRbau3QIQN_al9hO6JyDnoBRNoYdoTwKuVtsZZHEi7eazBbx2B5waDPAe2fzsuyk6i_5V8Gq2XTI9Na1pI4L8xGWw0kk7xS375quA-vk8vHej5SqREL4cBuwkFT0_kBUdw1t-IwFFdop8ercasI6t0v_t2eTkW4Rnu0a21qQ8QL8cy4rFl5B_i_MvxO7fJhVADr1BmJAyvy8A0"
                    />
                  </div>
                  <div>
                    <h5 className="font-label-lg text-label-lg font-bold text-on-surface">Faly R.</h5>
                    <p className="font-body-sm text-body-sm text-primary font-medium">Guide Naturaliste Assermenté (Andasibe)</p>
                  </div>
                </div>
              </div>

              <div className="p-space-lg rounded bg-surface-container-lowest shadow-[0_2px_8px_-2px_rgba(15,163,177,0.06)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-tertiary mb-space-md">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface italic leading-relaxed mb-space-lg">
                    « La cantine financée par les voyageurs a augmenté le taux de scolarisation de 45% dans notre village de Ranohira. Les
                    enfants viennent chaque jour avec l'assurance d'un repas équilibré et d'eau potable au robinet solaire. »
                  </p>
                </div>
                <div className="flex items-center gap-space-md pt-space-md bg-surface-container-low/40 -mx-space-lg -mb-space-lg p-space-md rounded-b">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      alt="Portrait de Soa Razanadrasoa, directrice d'école"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqeQgDHtweBYgSfoYoHc9-V1Muo34XHsrpBQgEFqnRz8dROG-DIsbEK72qFVsNVj5M9Pa9Cnu03PQNCEk-kRhu2nlOxmXR_-dhpiMDTGk4y0DD7eJNUw8jgqYeP4XIQG-Lk6jwwQQfbM2hbb6iHErQlnKpHAt7zi7VLOr--ERrW9rIgQirfemX_Yb8zZnIqCDmZOJZm2zYfkJJlbIh_zkkSgHxiAZLUG0OMXzVsC6Hn0V9kqHAfCo"
                    />
                  </div>
                  <div>
                    <h5 className="font-label-lg text-label-lg font-bold text-on-surface">Soa Razanadrasoa</h5>
                    <p className="font-body-sm text-body-sm text-tertiary font-medium">Directrice de l'école rurale d'Ampangarina</p>
                  </div>
                </div>
              </div>

              <div className="p-space-lg rounded bg-surface-container-lowest shadow-[0_2px_8px_-2px_rgba(15,163,177,0.06)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-tertiary mb-space-md">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface italic leading-relaxed mb-space-lg">
                    « Planter nos propres arbres avec les gardes forestiers après avoir entendu le chant mythique de l'Indri reste le
                    souvenir le plus marquant de ma vie de voyageur. Ici, on ne consomme pas un pays : on s'y relie corps et âme. »
                  </p>
                </div>
                <div className="flex items-center gap-space-md pt-space-md bg-surface-container-low/40 -mx-space-lg -mb-space-lg p-space-md rounded-b">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      alt="Portrait d'Alexandre, voyageur en tenue de trek"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBErR9UpCjbXl09prSyslPWWN-oU0Zx2u9vC-Ub6m7UquAvX3S1FAmuP1SK6P99ReOJYbjzoAXqSqfGDHWqRzb47ips19KKpaTDpeKwECIFATnyGrwLkEQhPPcAYAuhrSsUQvtmxht3Yj3WUDhxHqRU77eyvc07le-lfn5pY8posE0iLzHH8hBQU_U4mJNQ-BO2ozj5WRfvxpqsjv33WaQ-IL4oNj2i-yUfQUHgxa_Yv3gNHsHCd0Y"
                    />
                  </div>
                  <div>
                    <h5 className="font-label-lg text-label-lg font-bold text-on-surface">Alexandre B.</h5>
                    <p className="font-body-sm text-body-sm text-secondary font-medium">Voyageur certifié · Expédition RN7 & Isalo</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-[1440px] mx-auto px-margin-desktop py-space-xl w-full mb-space-xl">
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-primary via-on-primary-container to-on-surface text-on-primary p-space-xl lg:p-24 shadow-2xl">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-fixed/20 rounded-full blur-[80px] pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-tertiary-container/30 rounded-full blur-[80px] pointer-events-none"></div>
              <div className="relative z-10 max-w-3xl flex flex-col items-start gap-space-md">
                <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md">
                  <span className="material-symbols-outlined text-[16px] text-secondary-fixed">travel_explore</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed font-bold">
                    Expéditions 2025 Ouvertes
                  </span>
                </div>
                <h2 className="font-display-lg text-display-lg font-extrabold text-on-primary leading-tight">
                  Prenez part à l'aventure solidaire. <br />
                  Planifiez votre expédition dès aujourd'hui.
                </h2>
                <p className="font-body-lg text-body-lg text-surface-container-low max-w-2xl leading-relaxed">
                  Chaque réservation contribue directement à la replantation d'arbres endémiques et à la rémunération juste des communautés
                  hôtes. Rejoignez les voyageurs qui font la différence.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-space-md mt-space-md w-full sm:w-auto">
                  <Link
                    className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-space-xl rounded-full bg-tertiary text-on-tertiary font-label-lg text-label-lg shadow-[0_4px_14px_rgba(167,57,30,0.35)] hover:opacity-95 active:scale-95 transition-all"
                    href="/circuits"
                  >
                    <span className="material-symbols-outlined text-[20px] mr-2">explore</span>
                    <span>Découvrir nos circuits certifiés</span>
                  </Link>
                  <ImpactReportButton className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-space-lg rounded-full bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 backdrop-blur-md text-on-primary font-label-lg text-label-lg transition-colors group">
                    <span className="material-symbols-outlined text-[20px] mr-2 text-secondary-fixed group-hover:translate-y-0.5 transition-transform">
                      description
                    </span>
                    <span>Consulter notre rapport d'impact RSE 2025</span>
                  </ImpactReportButton>
                </div>

                <div className="pt-space-lg flex flex-wrap items-center gap-space-lg font-body-sm text-body-sm text-surface-container-highest/80">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-secondary-fixed">check_circle</span>
                    <span>Prix immédiat, sans engagement</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-secondary-fixed">lock</span>
                    <span>Paiement sécurisé et échelonné</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-secondary-fixed">eco</span>
                    <span>100% Compensation certifiée</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
