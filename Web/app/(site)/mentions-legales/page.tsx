import type { Metadata } from "next";
import Link from "next/link";
import { BALANCE_DUE_DAYS, CANCELLATION, LICENSE, PAYMENT_FEES, SOLIDARITY_TEXT } from "@/lib/site";
import LegalTabs from "@/components/legal/LegalTabs";
import PrintButton from "@/components/ui/PrintButton";
import { OpenCookieManagerButton } from "@/components/consent/CookieConsent";

export const metadata: Metadata = {
  title: "Mentions légales, CGV & confidentialité — MadaVoyage",
  description:
    "Mentions légales, conditions générales de vente, politique RGPD et cookies de MadaVoyage S.A., agence écotouristique agréée à Madagascar.",
};

export default function Page() {
  return (
    <main className="w-full pt-20 bg-background min-h-screen">
      <div className="flex flex-col w-full">
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-32 right-12 w-96 h-96 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
          <div className="absolute top-96 -left-20 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-margin-desktop py-space-lg flex flex-col gap-space-xl">
            <div className="flex flex-wrap items-center justify-between gap-space-sm">
              <nav aria-label="Fil d'Ariane" className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span>Accueil</span>
                </Link>
                <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
                <span className="text-on-surface-variant">Informations Légales</span>
                <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
                <span className="text-primary font-bold">Mentions Légales &amp; CGV</span>
              </nav>
              <div className="flex items-center gap-space-sm">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  Version consolidée au 15 Janvier 2025
                </span>
                <PrintButton className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-lowest font-label-sm text-label-sm text-primary hover:bg-surface-container transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[15px]">print</span>
                  <span>Télécharger PDF (240 Ko)</span>
                </PrintButton>
              </div>
            </div>

            <section className="relative rounded-lg bg-surface-container-low p-space-xl shadow-sm overflow-hidden">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                <div className="lg:col-span-8 flex flex-col gap-space-md">
                  <div className="flex items-center gap-space-sm flex-wrap">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[15px]">verified_user</span>
                      Agrément Officiel Ministère du Tourisme
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[15px]">eco</span>
                      Charte RSE &amp; Fihavanana Éthique
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">
                      Licence Catégorie A #1248/2024-MTA
                    </span>
                  </div>
                  <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
                    Cadre Légal, Transparence &amp; Protection des Données
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                    MadaVoyage S.A. opère sous agrément officiel du Ministère du Tourisme de Madagascar ({LICENSE}). Notre engagement
                    écotouristique repose sur une traçabilité financière irréprochable, la protection juridique absolue de vos séjours et la
                    stricte confidentialité numérique.
                  </p>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-space-sm">
                  <div className="bg-surface-container-lowest rounded p-space-md shadow-sm flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                        Fonds de Séquestre Garanti
                      </span>
                      <span className="material-symbols-outlined text-secondary text-[20px]">account_balance</span>
                    </div>
                    <div className="font-headline-md text-headline-md text-on-surface font-extrabold">100% Dépositaire</div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Comptes cantonnés auprès de la BMOI (Groupe BPCE) &amp; BNI Madagascar. Vos acomptes sont protégés par cantonnement
                      légal jusqu'au jour du départ.
                    </p>
                    <div className="pt-2 flex items-center gap-space-sm text-primary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                      <span>Audit de Conformité Annuel Réussi</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <LegalTabs
              panes={{
                mentions: (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-desktop">
                      <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
                        <div className="flex flex-col gap-space-sm">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[24px]">apartment</span>
                          </div>
                          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Structure Juridique</span>
                          <h2 className="font-headline-sm text-headline-sm text-on-surface">MadaVoyage S.A.</h2>
                          <p className="font-body-md text-body-md text-on-surface-variant">
                            Société anonyme de droit malgache régie par la loi sur les sociétés commerciales.
                          </p>
                          <div className="flex flex-col gap-1.5 pt-space-xs font-body-sm text-body-sm text-on-surface-variant">
                            <div className="flex justify-between py-1 bg-surface-container-low px-2.5 rounded">
                              <span className="font-medium text-on-surface">Capital Social :</span>
                              <span className="font-mono text-primary font-semibold">250 000 000 MGA (~51 000 €)</span>
                            </div>
                            <div className="flex justify-between py-1 bg-surface-container-low px-2.5 rounded">
                              <span className="font-medium text-on-surface">RCS Antananarivo :</span>
                              <span className="font-mono">B 2024-4902</span>
                            </div>
                            <div className="flex justify-between py-1 bg-surface-container-low px-2.5 rounded">
                              <span className="font-medium text-on-surface">NIF :</span>
                              <span className="font-mono">400129845</span>
                            </div>
                            <div className="flex justify-between py-1 bg-surface-container-low px-2.5 rounded">
                              <span className="font-medium text-on-surface">STAT :</span>
                              <span className="font-mono">79112 11 2024</span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-2 text-on-surface-variant font-body-sm text-body-sm flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-[18px] text-primary shrink-0">pin_drop</span>
                          <span>Immeuble Aro, Rue Pasteur, Antanimena, Antananarivo 101, Madagascar</span>
                        </div>
                      </div>

                      <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
                        <div className="flex flex-col gap-space-sm">
                          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                            <span className="material-symbols-outlined text-[24px]">verified</span>
                          </div>
                          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                            Licences d'Exploitation
                          </span>
                          <h2 className="font-headline-sm text-headline-sm text-on-surface">Autorisations Nationales</h2>
                          <p className="font-body-md text-body-md text-on-surface-variant">
                            Exploitation touristique encadrée par arrêté officiel et adhésion aux institutions de tutelle.
                          </p>
                          <div className="flex flex-col gap-2 pt-space-xs font-body-sm text-body-sm">
                            <div className="p-2.5 rounded bg-surface-container-low flex flex-col gap-0.5">
                              <div className="flex items-center gap-1 font-label-md text-label-md text-primary font-bold">
                                <span className="material-symbols-outlined text-[16px]">card_membership</span>
                                <span>Licence Tourisme Catégorie A</span>
                              </div>
                              <span className="text-on-surface-variant font-mono text-[11px]">Arrêté Ministériel N° 1248/2024-MTA</span>
                            </div>
                            <div className="p-2.5 rounded bg-surface-container-low flex flex-col gap-0.5">
                              <div className="flex items-center gap-1 font-label-md text-label-md text-secondary font-bold">
                                <span className="material-symbols-outlined text-[16px]">park</span>
                                <span>Membre Actif ONTM &amp; Partenaire MNP</span>
                              </div>
                              <span className="text-on-surface-variant text-[11px]">
                                Madagascar National Parks N° Partenaire 2024-MNP-09
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-2 text-on-surface-variant font-body-sm text-body-sm flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px] text-secondary">badge</span>
                          <span>Guide National Naturaliste Référent : N° GNN-441-MG</span>
                        </div>
                      </div>

                      <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
                        <div className="flex flex-col gap-space-sm">
                          <div className="w-12 h-12 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                            <span className="material-symbols-outlined text-[24px]">security</span>
                          </div>
                          <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary">
                            Couverture &amp; Caution
                          </span>
                          <h2 className="font-headline-sm text-headline-sm text-on-surface">Assurance RC &amp; Séquestre</h2>
                          <p className="font-body-md text-body-md text-on-surface-variant">
                            Protection financière internationale couvrant rapatriement, accidents et défaut de prestation.
                          </p>
                          <div className="flex flex-col gap-2 pt-space-xs font-body-sm text-body-sm">
                            <div className="p-2.5 rounded bg-surface-container-low flex flex-col gap-0.5">
                              <span className="font-label-md text-label-md text-on-surface font-semibold">
                                Assurances ARO &amp; Allianz
                              </span>
                              <span className="font-mono text-tertiary text-[12px] font-bold">Police RCP-MDV-88219</span>
                              <span className="text-on-surface-variant text-[11px]">Couverture : 5 000 000 000 MGA / sinistre</span>
                            </div>
                            <div className="p-2.5 rounded bg-surface-container-low flex flex-col gap-0.5">
                              <span className="font-label-md text-label-md text-on-surface font-semibold">
                                Garantie Voyageurs BMOI / BNI
                              </span>
                              <span className="text-on-surface-variant text-[11px]">
                                Compte séquestre dédié aux acomptes clients #30004-0012-99002-14
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-2 text-on-surface-variant font-body-sm text-body-sm flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px] text-tertiary">health_and_safety</span>
                          <span>Assistance Rapatriement Sanitaire 24/7 incluse</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-surface-container rounded-lg p-space-lg flex flex-col lg:flex-row items-center justify-between gap-space-lg">
                      <div className="flex items-start gap-space-md max-w-3xl">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-sm">
                          <span className="material-symbols-outlined text-[24px]">dns</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <h3 className="font-headline-sm text-headline-sm text-on-surface">
                            Hébergement Web &amp; Infrastructure Souveraine
                          </h3>
                          <p className="font-body-md text-body-md text-on-surface-variant">
                            L'infrastructure MadaVoyage est hébergée sur des serveurs éco-conçus à haute efficacité énergétique certifiés
                            ISO 27001 (Scaleway SAS, Paris, France) avec une redondance télécoms et base de données synchronisée sur le nœud
                            souverain Telma Datacenter Andraharo (Antananarivo, Madagascar).
                          </p>
                          <div className="flex flex-wrap items-center gap-space-sm pt-2">
                            <span className="inline-flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                              <span className="material-symbols-outlined text-[16px] text-secondary">power</span> PUE &lt; 1.15
                              Éco-Datacenter
                            </span>
                            <span className="inline-flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                              <span className="material-symbols-outlined text-[16px] text-primary">encrypted</span> Chiffrement TLS 1.3 /
                              ChaCha20
                            </span>
                            <span className="inline-flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                              <span className="material-symbols-outlined text-[16px] text-secondary">cloud_done</span> 99.98% SLA Haute
                              Disponibilité
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 flex flex-col gap-2 w-full lg:w-auto">
                        <a
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg hover:bg-on-primary-container transition-colors shadow-sm"
                          href="mailto:legal@madavoyage.mg"
                        >
                          <span className="material-symbols-outlined text-[18px]">mail</span>
                          <span>Contacter le DPO / Juridique</span>
                        </a>
                        <span className="text-center font-body-sm text-body-sm text-on-surface-variant">legal@madavoyage.mg</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-desktop">
                      <div className="bg-surface-container-lowest rounded p-space-md shadow-sm flex items-start gap-space-md">
                        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined text-[20px]">person_pin</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Direction de la Publication</span>
                          <span className="font-headline-sm text-headline-sm text-on-surface">Dr. Mialy Razafindrakoto</span>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Présidente Directrice Générale, MadaVoyage S.A. Titulaire du Doctorat en Écologie Tropicale appliquée à
                            l'Écotourisme.
                          </p>
                        </div>
                      </div>
                      <div className="bg-surface-container-lowest rounded p-space-md shadow-sm flex items-start gap-space-md">
                        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0">
                          <span className="material-symbols-outlined text-[20px]">copyright</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                            Propriété Intellectuelle &amp; Photographies
                          </span>
                          <span className="font-headline-sm text-headline-sm text-on-surface">Droits Réservés &amp; Crédits Guides</span>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Tous droits de reproduction réservés. Les photographies de biodiversité sont sous licence exclusive MadaVoyage
                            et Madagascar National Parks.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ),
                cgv: (
                  <>
                    <div className="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm flex flex-col gap-space-lg">
                      <div className="flex flex-col gap-space-xs">
                        <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm">
                          <span className="material-symbols-outlined text-[16px]">local_florist</span>
                          <span>Contrat d'engagement réciproque &amp; Tourisme Durable</span>
                        </div>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface">
                          Conditions Générales de Vente (CGV Écotourisme)
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                          Ces conditions régissent l'ensemble des réservations d'expéditions, séjours botaniques, treks et séjours
                          éco-responsables commercialisés par MadaVoyage. Tout contrat valide un pacte de respect communautaire et
                          écologique.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
                        <div className="p-space-md rounded bg-surface-container-low flex flex-col gap-space-sm">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[22px]">payments</span>
                          </div>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface">Modalités de Règlement</h3>
                          <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
                            <li className="flex items-start gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-primary shrink-0">check_circle</span>
                              <span>
                                <strong>Acompte de 30%</strong> à la réservation pour bloquer les autorisations parcs et écogîtes.
                              </span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-primary shrink-0">check_circle</span>
                              <span>
                                <strong>Solde à J-{BALANCE_DUE_DAYS}</strong> avant le départ (ou à l'arrivée pour les extensions).
                              </span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-primary shrink-0">check_circle</span>
                              <span>Devises acceptées : EUR (€) et MGA (Ariary) au cours BCM officiel. {PAYMENT_FEES}</span>
                            </li>
                          </ul>
                        </div>
                        <div className="p-space-md rounded bg-surface-container-low flex flex-col gap-space-sm">
                          <div className="w-10 h-10 rounded-full bg-secondary/15 text-secondary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[22px]">published_with_changes</span>
                          </div>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface">Annulation et avoir</h3>
                          <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
                            <li className="flex items-start gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">check_circle</span>
                              <span>{CANCELLATION.free}</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">check_circle</span>
                              <span>{CANCELLATION.late}</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">check_circle</span>
                              <span>
                                <strong>Force majeure météo :</strong> Réacheminement alternatif immédiat sans surcoût voyageur.
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="p-space-md rounded bg-surface-container-low flex flex-col gap-space-sm">
                          <div className="w-10 h-10 rounded-full bg-tertiary-container/20 text-tertiary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[22px]">forest</span>
                          </div>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface">Fonds Fihavanana</h3>
                          <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
                            <li className="flex items-start gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-tertiary shrink-0">check_circle</span>
                              <span>{SOLIDARITY_TEXT}</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-tertiary shrink-0">check_circle</span>
                              <span>
                                En cas de report, la contribution suit la nouvelle réservation ; en cas d&apos;annulation, elle est
                                remboursée avec le reste du prix.
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-col gap-space-sm pt-space-sm">
                        <div className="p-space-md rounded bg-surface-container">
                          <span className="font-label-md text-label-md text-primary font-bold">
                            Article 4 - Respect des Aires Protégées et Consignes Naturalistes
                          </span>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                            L'observation des lémuriens diurnes et nocturnes, amphibiens et flore endémique s'effectue strictement avec un
                            guide agréé MNP. Aucun contact tactile, nourrissage ou éclairage direct au flash n'est toléré sous peine
                            d'exclusion sans indemnisation de l'expédition.
                          </p>
                        </div>
                        <div className="p-space-md rounded bg-surface-container">
                          <span className="font-label-md text-label-md text-primary font-bold">
                            Article 7 - Assurances et Secours en Terrains Isolés
                          </span>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                            Tous nos véhicules 4x4 d'expédition sont équipés de balises Garmin InReach par satellite et trousses de premiers
                            secours d'urgence. Le voyageur reconnaît être en condition physique adéquate pour les treks cochés lors de la
                            réservation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ),
                rgpd: (
                  <>
                    <div className="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm flex flex-col gap-space-lg">
                      <div className="flex flex-col gap-space-xs">
                        <span className="font-label-sm text-label-sm text-primary uppercase font-bold">
                          Conformité RGPD (UE 2016/679) &amp; Loi Malgache 2014-038
                        </span>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface">
                          Politique de Confidentialité &amp; Protection des Données Personnelles
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                          Chez MadaVoyage, nous appliquons le principe de sobriété numérique absolue. Vos données ne sont ni vendues, ni
                          monétisées, ni transmises à des tiers sans lien direct avec votre séjour.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-desktop">
                        <div className="bg-surface-container-low rounded p-space-md flex flex-col gap-space-sm">
                          <div className="flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined text-[22px]">database</span>
                            <span className="font-headline-sm text-headline-sm text-on-surface">Données collectées</span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                            Nom, prénoms, numéro de passeport (nécessaire à l'édition des permis officiels parcs nationaux MNP), coordonnées
                            téléphoniques, restrictions alimentaires et coordonnées d'urgence médicale.
                          </p>
                          <div className="mt-auto pt-2">
                            <span className="font-label-sm text-label-sm text-secondary font-semibold">
                              Durée de conservation : 24 mois post-voyage, puis anonymisation automatique.
                            </span>
                          </div>
                        </div>
                        <div className="bg-surface-container-low rounded p-space-md flex flex-col gap-space-sm">
                          <div className="flex items-center gap-2 text-secondary">
                            <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
                            <span className="font-headline-sm text-headline-sm text-on-surface">Vos droits fondamentaux</span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                            Vous disposez d'un droit d'accès, de rectification, de portabilité et d'effacement de vos données personnelles
                            (Droit à l'oubli). Toute demande est traitée sous 72 heures ouvrées par notre équipe juridique.
                          </p>
                          <div className="mt-auto pt-2">
                            <a
                              className="text-primary font-label-sm text-label-sm hover:underline font-bold flex items-center gap-1"
                              href="mailto:dpo@madavoyage.mg"
                            >
                              <span>Exercer mes droits : dpo@madavoyage.mg</span>
                              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="p-space-md rounded bg-surface-container flex items-center justify-between flex-wrap gap-space-sm">
                        <div className="flex items-center gap-space-sm">
                          <span className="material-symbols-outlined text-primary text-[28px]">lock_reset</span>
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface">Registre des traitements &amp; DPO Déclaré</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              Conformité validée auprès de la Commission Malgache de l'Informatique et des Libertés (CMIL).
                            </span>
                          </div>
                        </div>
                        <button
                          className="px-4 py-2 rounded-full bg-surface-container-lowest text-primary font-label-sm text-label-sm shadow-sm hover:bg-surface-bright transition-colors"
                          type="button"
                        >
                          Demander l'export de mes données (JSON/CSV)
                        </button>
                      </div>
                    </div>
                  </>
                ),
                cookies: (
                  <>
                    <div className="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm flex flex-col gap-space-lg">
                      <div className="flex flex-col gap-space-xs">
                        <div className="flex items-center gap-space-xs text-primary font-label-sm text-label-sm">
                          <span className="material-symbols-outlined text-[16px]">cookie</span>
                          <span>Audience Responsable &amp; Sans Traces Intrusives</span>
                        </div>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface">
                          Politique relative aux Cookies &amp; Traceurs Numériques
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                          Nous appliquons les recommandations CNIL et du W3C Sustainable Web. Nous refusons catégoriquement les pixels
                          publicitaires Facebook, Google Ads ou réseaux tiers de profilage commercial.
                        </p>
                      </div>
                      <div className="flex flex-col gap-space-sm">
                        <div className="overflow-x-auto rounded bg-surface-container-low p-space-md">
                          <table className="w-full text-left font-body-sm text-body-sm">
                            <thead>
                              <tr className="text-on-surface font-label-md text-label-md pb-2 border-b-0">
                                <th className="py-2 pr-4">Traceur / Cookie</th>
                                <th className="py-2 pr-4">Finalité Opérationnelle</th>
                                <th className="py-2 pr-4">Durée</th>
                                <th className="py-2">Statut</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y-0 text-on-surface-variant">
                              <tr className="py-2">
                                <td className="py-2.5 font-mono text-primary font-semibold">mv_session_currency</td>
                                <td className="py-2.5">Mémorise votre choix de devise (EUR / MGA) et le panier d'itinéraire.</td>
                                <td className="py-2.5">Session</td>
                                <td className="py-2.5">
                                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-bold">
                                    Strictement Nécessaire
                                  </span>
                                </td>
                              </tr>
                              <tr className="py-2">
                                <td className="py-2.5 font-mono text-primary font-semibold">mv_calc_itinerary</td>
                                <td className="py-2.5">Sauvegarde temporaire de la simulation budgétaire en cours.</td>
                                <td className="py-2.5">30 jours</td>
                                <td className="py-2.5">
                                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-label-sm">
                                    Fonctionnel
                                  </span>
                                </td>
                              </tr>
                              <tr className="py-2">
                                <td className="py-2.5 font-mono text-primary font-semibold">_matomo_eco</td>
                                <td className="py-2.5">
                                  Mesure anonyme des pages consultées sans adresse IP conservée (serveur souverain).
                                </td>
                                <td className="py-2.5">13 mois</td>
                                <td className="py-2.5">
                                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                                    Optionnel
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="flex items-center justify-between pt-space-xs">
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Vous pouvez réinitialiser vos préférences de consentement à tout instant.
                          </span>
                          <OpenCookieManagerButton className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-sm text-label-sm hover:bg-on-primary-container transition-colors shadow-sm">
                            Rouvrir le Panneau de Gestion des Cookies
                          </OpenCookieManagerButton>
                        </div>
                      </div>
                    </div>
                  </>
                ),
              }}
            />

            <section className="bg-surface-container-low rounded-lg p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-md">
                <div className="w-12 h-12 rounded-full bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">contact_support</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Une question sur vos droits ou votre réservation ?</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Notre service juridique et conciergerie écotouristique répond du Lundi au Samedi de 8h à 19h (GMT+3).
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-space-sm shrink-0">
                <a
                  className="px-4 py-2.5 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface-container transition-colors flex items-center gap-1.5"
                  href="tel:+261202245890"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">phone</span>
                  <span>+261 (0)20 22 458 90</span>
                </a>
                <Link
                  className="px-4 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:bg-on-primary-container transition-colors"
                  href="/aide"
                >
                  Poser une question
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
