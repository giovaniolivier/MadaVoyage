import type { Metadata } from "next";
import Link from "next/link";
import { Ariary } from "@/components/currency/RateLabel";
import {
  ActionPanels,
  ActionTabs,
  CancellationForm,
  ModificationProvider,
  RefundOptions,
  RefundSummaryRow,
} from "@/components/modification/ModificationFlow";
import { BALANCE_DUE_DAYS, CANCELLATION, PHONE, WHATSAPP } from "@/lib/site";

export const metadata: Metadata = {
  title: "Modifier ou annuler mon voyage — MadaVoyage",
  description:
    "Reportez sans frais ou simulez l'annulation de votre circuit MadaVoyage : barème officiel, avoir éco-solidaire ou remboursement.",
};

export default function Page() {
  return (
    <ModificationProvider>
      <main className="flex-1 w-full pt-20 bg-surface">
        <div className="flex flex-col w-full">
          <div className="relative w-full max-w-[1440px] mx-auto px-margin-desktop py-space-lg">
            <div className="absolute -top-10 right-20 w-96 h-96 rounded-full bg-primary-container/10 blur-3xl pointer-events-none -z-10"></div>
            <div className="absolute top-96 left-12 w-80 h-80 rounded-full bg-secondary/5 blur-3xl pointer-events-none -z-10"></div>

            <nav
              aria-label="Fil d'Ariane"
              className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm mb-space-md flex-wrap"
            >
              <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Accueil</span>
              </Link>
              <span className="text-outline-variant">/</span>
              <Link className="hover:text-primary transition-colors" href="/compte">
                Mon Compte
              </Link>
              <span className="text-outline-variant">/</span>
              <Link className="hover:text-primary transition-colors" href="/compte">
                Voyages
              </Link>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface font-semibold">Dossier #MDV-2026-8902</span>
              <span className="text-outline-variant">/</span>
              <span className="text-primary font-bold">Gestion & Remboursement</span>
            </nav>

            <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm mb-space-xl relative overflow-hidden">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-[32px]">format_image_left</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs flex-wrap mb-1">
                      <span className="px-space-sm py-0.5 rounded-full bg-secondary/15 text-secondary font-label-sm text-label-sm uppercase font-bold tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        Confirmé & Verrouillé
                      </span>
                      <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                        Réf: #MDV-2026-8902
                      </span>
                      <span className="px-space-sm py-0.5 rounded-full bg-tertiary/10 text-tertiary font-label-sm text-label-sm font-bold">
                        Départ dans 18 jours (J-18)
                      </span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                      Nosy Be & Archipels Sauvages
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-space-sm flex-wrap mt-0.5">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span> 14 – 24 Octobre 2026 (10
                        nuits)
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-primary">group</span> 3 Voyageurs : Alexandre Fontaine
                        (Titulaire), Clara Fontaine, Enzo Fontaine
                      </span>
                    </p>
                  </div>
                </div>

                <ActionTabs />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              <ActionPanels
                cancellation={
                  <>
                    <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md">
                      <div className="flex items-center justify-between pb-space-sm">
                        <div className="flex items-center gap-space-xs">
                          <span className="material-symbols-outlined text-tertiary text-[24px]">gavel</span>
                          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            Barème Officiel des Frais d'Annulation
                          </h2>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                          Conditions Éco-Tourisme 2026
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Conformément aux directives de l'Office National du Tourisme de Madagascar (ONTM) et du protocole{" "}
                        <em>Fihavanana</em>, notre barème protège l'équité des voyageurs et le revenu des communautés insulaires
                        partenaires.
                      </p>

                      <div className="relative pt-space-md pb-space-xs">
                        <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden flex">
                          <div className="w-3/4 bg-secondary-container h-full"></div>
                          <div className="w-1/4 bg-tertiary-container/40 h-full"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-space-md text-left">
                          <div className="p-space-sm rounded bg-primary-container/15 flex flex-col relative shadow-sm">
                            <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-[10px] font-bold tracking-wide">
                              VOTRE PALIER (J-18)
                            </span>
                            <span className="font-label-sm text-label-sm text-secondary font-bold uppercase">
                              Jusqu&apos;à J-{CANCELLATION.freeDays}
                            </span>
                            <span className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1">100 % remboursé</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">Sans justificatif ni frais de dossier</span>
                          </div>

                          <div className="p-space-sm rounded bg-surface-container-low opacity-75 flex flex-col">
                            <span className="font-label-sm text-label-sm text-tertiary font-bold uppercase">Moins de 7 jours</span>
                            <span className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1">Acompte conservé</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              Ou transformé en avoir valable 18 mois
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-lg">
                      <div className="flex items-center justify-between">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[22px]">calculate</span>
                          Simulation Financière Immédiate
                        </h2>
                        <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                          <span className="material-symbols-outlined text-[16px] text-secondary">update</span>
                          <span>Calculé au 26 Septembre 2026</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                        <div className="p-space-md rounded bg-surface-container-low flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Montant total du circuit</span>
                          <span className="font-display-lg text-[28px] font-extrabold text-on-surface mt-1">1 645,00 €</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            ≈ <Ariary eur={1645} /> (taux du jour)
                          </span>
                        </div>
                        <div className="p-space-md rounded bg-surface-container-high/60 flex flex-col justify-between">
                          <div>
                            <span className="font-label-sm text-label-sm text-primary font-bold uppercase">
                              Acompte déjà encaissé (30%)
                            </span>
                            <span className="font-display-lg text-[28px] font-extrabold text-primary mt-1">493,50 €</span>
                          </div>
                          <p className="font-body-sm text-body-sm text-secondary font-semibold flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            Solde de 1 151,50 € annulé sans pénalité
                          </p>
                        </div>
                      </div>

                      <RefundOptions />

                      <div className="p-space-md rounded bg-surface-container-high/40 flex flex-col gap-space-sm">
                        <h3 className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[20px] text-primary">info</span>
                          Règles spécifiques des partenaires tiers
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-secondary text-[18px] flex-shrink-0">forest</span>
                            <span>
                              <strong>Permis MNP Lokobe & Tanikely :</strong> Non nominatifs, ils sont automatiquement reconvertis en
                              contribution environnementale sans surcoût.
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">flight</span>
                            <span>
                              <strong>Vols domestiques Madagascar Airlines :</strong> Si vos billets ont été émis via MadaVoyage, nous appliquons
                              l'avoir aérien selon la classe tarifaire Eco-Flex.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CancellationForm />
                  </>
                }
              />

              <aside className="lg:col-span-5 flex flex-col gap-space-lg lg:sticky lg:top-24">
                <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm flex flex-col">
                  <div
                    className="relative h-48 w-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCicxaEeHzZN_Dv1iG36Qhi0mahVWg65VNejSnrL1bJsPeocAV9rUgD-ShT8E91nKmBRv7U32wdHxsH1zVjpEyOqeLey3bXG_E_eckmfPg4k4mhypWPy-TUHvRJrN-_S9w-TA1n7vlZAF3dWFGb9SZc8RSaPXvrvXFB7xNp7a0l6CBqiOm5jRIYJlw3O91PLFFq4E6YBqK7vtdcmaO9sTeuxaLIZaDq1ZyM86XDaIWk4vF-6K8z43Y')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3 px-space-sm py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center gap-1 font-label-sm text-label-sm font-bold text-on-surface">
                      <span className="material-symbols-outlined text-[16px] text-tertiary-container">hotel</span>
                      <span>Manga Soa Lodge · 4★ Écolodge</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-on-primary">
                      <span className="font-label-sm text-label-sm tracking-wider uppercase opacity-90">Befefika, Baie de Befotaka</span>
                      <h3 className="font-headline-sm text-headline-sm font-extrabold text-on-primary leading-tight">
                        Suite Océan Privative & Pirogue
                      </h3>
                    </div>
                  </div>

                  <div className="p-space-lg flex flex-col gap-space-md">
                    <div className="flex items-center justify-between pb-space-sm">
                      <div className="flex flex-col">
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Dates réservées</span>
                        <span className="font-label-lg text-label-lg font-bold text-on-surface">14 Oct — 24 Oct 2026</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Statut Acompte</span>
                        <span className="font-label-sm text-label-sm font-bold text-secondary bg-secondary/15 px-2 py-0.5 rounded-full">
                          Payé (Carte)
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                      <div className="flex items-center justify-between py-1">
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-primary">kayaking</span>
                          Navigation îles Sakatia & Tanikely
                        </span>
                        <span className="font-semibold text-on-surface">Inclus</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-primary">person_pin</span>
                          Guides naturalistes certifiés (Faly & Mamy)
                        </span>
                        <span className="font-semibold text-on-surface">10 jours</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-secondary">eco</span>
                          Reboisement 3 Baobabs / Mangroves
                        </span>
                        <span className="font-semibold text-secondary">Validé</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-primary">airport_shuttle</span>
                          Transferts bateau rapide & 4x4
                        </span>
                        <span className="font-semibold text-on-surface">Privatisé</span>
                      </div>
                    </div>

                    <div className="p-space-md rounded bg-surface-container-low flex flex-col gap-2">
                      <div className="flex justify-between font-body-sm text-body-sm">
                        <span className="text-on-surface-variant">Prix global forfait :</span>
                        <span className="font-bold text-on-surface">1 645,00 €</span>
                      </div>
                      <div className="flex justify-between font-body-sm text-body-sm">
                        <span className="text-on-surface-variant">Acompte réglé (30%) :</span>
                        <span className="font-bold text-primary">493,50 €</span>
                      </div>
                      <div className="flex justify-between font-body-sm text-body-sm">
                        <span className="text-on-surface-variant">Solde prévu à J-{BALANCE_DUE_DAYS} :</span>
                        <span className="line-through text-outline">1 151,50 €</span>
                      </div>
                      <RefundSummaryRow />
                    </div>

                    <div className="p-space-sm rounded bg-primary-container/10 flex items-start gap-2 text-on-primary-container font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[18px] text-primary flex-shrink-0 mt-0.5">help</span>
                      <span>
                        <strong>Envie de partir plus tard ?</strong> Le report sans frais de vos dates est possible jusqu'à Novembre 2027
                        depuis l'onglet « Reporter ou Modifier ».
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center gap-space-md">
                    <div className="relative">
                      <div
                        className="w-14 h-14 rounded-full bg-cover bg-center"
                        aria-label="Membre souriante de l'équipe d'assistance MadaVoyage à Antananarivo"
                        role="img"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCM9BJ_WeZ3jKcpEVwYE1aWQ5tmTZJGQ2Tvo-2rWP7tqYTEZ2M90c6vA_eoTDo08t_574If0PSZIc4awtWkePwTxi578DworqqRCuvUapVKiwSY7Yi9p9EbpE6tN6_ypYcATIUpj2P0Undu2LtlHg2kgvJMzCjGO0bAEeMBp1-rxuSjWrW4thPuAKa8SQhxLFUdZQ0uHeRks5d2ISdfXoN7snF-jSbaqSnRUmIIDdGGvFEsXovYJQw')",
                        }}
                      ></div>
                      <span className="w-4 h-4 rounded-full bg-secondary absolute bottom-0 right-0 shadow-sm"></span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                        Assistance 7 j/7
                      </span>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">Équipe Nosy Be</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Archipels & Nord Madagascar</p>
                    </div>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Le calcul ci-contre s'applique automatiquement. Une question sur votre remboursement ? Notre équipe d'assistance vous
                    répond par téléphone ou e-mail.
                  </p>
                  <div className="flex flex-col gap-2">
                    <a
                      className="w-full h-11 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors font-label-md text-label-md font-bold text-on-surface flex items-center justify-center gap-2"
                      href={PHONE.href}
                    >
                      <span className="material-symbols-outlined text-primary text-[18px]">call</span>
                      <span>{PHONE.display} (ligne fixe, 8 h – 20 h)</span>
                    </a>
                    <a
                      className="w-full h-11 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors font-label-md text-label-md font-bold text-on-surface flex items-center justify-center gap-2"
                      href="mailto:concierge@madavoyage.mg?subject=Dossier%20MDV-2026-8902%20Fontaine"
                    >
                      <span className="material-symbols-outlined text-primary text-[18px]">mail</span>
                      <span>concierge@madavoyage.mg</span>
                    </a>
                  </div>
                </div>

                <div className="p-space-md rounded-lg bg-surface-container-low flex items-center gap-space-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-[28px]">verified_user</span>
                  <div className="flex flex-col font-body-sm text-body-sm">
                    <span className="font-bold text-on-surface">Protocole Sérénité Garanti</span>
                    <span>Remboursements protégés par le compte séquestre Bank of Africa Madagascar.</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </ModificationProvider>
  );
}
