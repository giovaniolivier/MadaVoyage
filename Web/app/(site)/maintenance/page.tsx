import type { Metadata } from "next";
import { PHONE, WHATSAPP } from "@/lib/site";
import {
  BulletinProvider,
  BulletinRefreshButton,
  BulletinTimestamp,
  MaintenanceProgress,
  NotifyForm,
} from "@/components/maintenance/Maintenance";

export const metadata: Metadata = {
  title: "Maintenance en cours | MadaVoyage",
  description:
    "La plateforme MadaVoyage est en maintenance planifiée. Vos réservations sont préservées et notre conciergerie terrain reste joignable 24h/24.",
};

export default function Page() {
  return (
    <>
      <main className="w-full pt-20 bg-background min-h-screen">
        <div className="flex flex-col w-full">
          <div className="w-full bg-surface-container-high py-2.5 px-margin-desktop shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-space-md text-on-surface">
              <div className="flex items-center gap-space-sm min-w-0">
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-container opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary-container"></span>
                </span>
                <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-surface-variant font-bold truncate">
                  Infrastructure en cours de synchronisation · Plateforme opérationnelle sous 45 minutes
                </span>
              </div>
              <div className="flex items-center gap-space-sm flex-shrink-0">
                <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary bg-surface px-2.5 py-0.5 rounded-full shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">satellite_alt</span>
                  Liaison Starlink Tana Active
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">UTC+3 (Heure Mascareignes)</span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto w-full px-margin-desktop py-space-xl flex flex-col gap-space-xl">
            <div className="relative bg-surface-container-lowest rounded-xl p-space-xl shadow-md overflow-hidden">
              <div className="absolute -right-24 -top-24 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute right-1/3 -bottom-24 w-80 h-80 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
                <div className="lg:col-span-7 flex flex-col gap-space-md">
                  <div className="flex flex-wrap items-center gap-space-xs">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">build_circle</span>
                      MAINTENANCE SYSTÈME PLANIFIÉE
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/30 text-secondary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      SAISON ÉCO-EXPÉDITIONS 2026
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight leading-tight">
                    Nos équipes préparent la piste pour vos prochaines traversées.
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">
                    La plateforme MadaVoyage est temporairement en maintenance pour synchroniser les nouveaux allotements hôteliers, les
                    créneaux de vols intérieurs Madagascar Airlines et les permis parcs MNP pour la saison 2026.
                  </p>

                  <MaintenanceProgress />

                  <NotifyForm />
                </div>

                <div className="lg:col-span-5 flex flex-col gap-space-md">
                  <div className="relative rounded-lg overflow-hidden bg-surface-container-high shadow-lg aspect-[4/3]">
                    <img
                      className="w-full h-full object-cover"
                      alt="Mécaniciens révisant un 4x4 Land Cruiser d'expédition devant l'atelier solaire de Tana"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPWM_A3t3I1Hn3qhKsH9RguHn0y9tlwC3L5ut8zq2s2X3RSHLx8ctqzuq4t4vhNJFQCXKNsR0NszQWzGLi_cRhkkY1DCOtMrwTJWcz9fI-f8YDC9j6GuZ-mG3TinlmKn2F7SJr-KHCqLyuSe_iKdiSib4r2PN8LurTiDjurVnwETD-BG-K2iMUGU7zh-j6zDVauBYSl-qDpGXMJ-SnsGql2S7RKQjI-OKiS3ikWDTybDDJpryBqBc"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-black/20"></div>

                    <div className="absolute top-4 left-4 backdrop-blur-md bg-surface/85 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                      <span className="material-symbols-outlined text-tertiary-container text-[18px]">solar_power</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                        Atelier Éco-Solaire Tana : 100% Autonome
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-on-tertiary">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px] text-primary-fixed">commute</span>
                        <span className="font-label-md text-label-md font-semibold tracking-wide">
                          Flotte 4x4 Expédition : Révision N°41
                        </span>
                      </div>
                      <span className="bg-primary-container/90 backdrop-blur text-on-primary font-label-sm text-label-sm px-2.5 py-0.5 rounded-full">
                        Prêt Saison
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-space-xs text-center">
                    <div className="bg-surface-container-low rounded p-2 flex flex-col items-center">
                      <span className="material-symbols-outlined text-primary text-[18px]">satellite</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold mt-0.5">Satellites</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant text-[10px]">Sync GPS &amp; Pistes</span>
                    </div>
                    <div className="bg-surface-container-low rounded p-2 flex flex-col items-center">
                      <span className="material-symbols-outlined text-secondary text-[18px]">radar</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold mt-0.5">Radar Météo</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant text-[10px]">Canal Mozambique</span>
                    </div>
                    <div className="bg-surface-container-low rounded p-2 flex flex-col items-center">
                      <span className="material-symbols-outlined text-tertiary-container text-[18px]">shield</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold mt-0.5">Permis MNP</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant text-[10px]">Quotas Préservés</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
              <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex items-start gap-space-md">
                <div className="w-12 h-12 rounded-full bg-secondary-container/40 text-secondary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">database</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">
                      Vérifié &amp; Intègre
                    </span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">Base de données réservations</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Sécurisée et sauvegardée en triple réplication chiffrée. Vos dossiers de voyages sont totalement préservés.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex items-start gap-space-md">
                <div className="w-12 h-12 rounded-full bg-primary-container/20 text-primary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px] animate-spin">autorenew</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                      Test Protocole TLS 1.3
                    </span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">Passerelles de paiement</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Tests bancaires CB et validation d'API mobile money (MVola &amp; Orange Money) en phase d'homologation finale.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex items-start gap-space-md">
                <div className="w-12 h-12 rounded-full bg-secondary-container/40 text-secondary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">offline_pin</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">Opérationnel</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">Carnets Hors-ligne</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Accès aux vouchers PDF, fiches d'itinéraires et cartographies téléchargées actif sur vos applications mobiles.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
              <div className="lg:col-span-5 bg-surface-container-lowest rounded-lg p-space-xl shadow-sm flex flex-col justify-between">
                <div className="flex flex-col gap-space-md">
                  <div className="flex items-center gap-space-sm text-tertiary">
                    <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center">
                      <span className="material-symbols-outlined text-tertiary text-[22px]">emergency_home</span>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider text-tertiary">
                        Conciergerie Terrain H24
                      </span>
                      <h3 className="font-headline-md text-headline-md text-on-surface">Assistance Voyageurs Prioritaire</h3>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded p-space-md">
                    <p className="font-body-md text-body-md text-on-surface font-semibold">
                      Vous êtes actuellement sur le terrain à Madagascar ou votre départ est prévu sous 48h ?
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Nos régulateurs de piste et guides-chauffeurs basés à Antananarivo, Diégo et Tuléar prennent immédiatement le relais
                      téléphonique.
                    </p>
                  </div>

                  <a
                    className="flex items-center justify-between p-space-md rounded bg-secondary/10 hover:bg-secondary/15 text-on-surface transition-all group"
                    href={WHATSAPP.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[20px]">chat</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-lg text-label-lg text-secondary font-bold">WhatsApp Direct Conciergerie</span>
                        <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">{WHATSAPP.display}</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-[24px]">chevron_right</span>
                  </a>

                  <div className="flex items-center justify-between p-space-md rounded bg-surface-container hover:bg-surface-container-high transition-colors">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">call</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface-variant">Permanence d'urgence Antananarivo</span>
                        <a className="font-headline-sm text-headline-sm text-primary tracking-tight hover:underline" href={PHONE.href}>
                          {PHONE.display}
                        </a>
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary bg-surface px-2.5 py-1 rounded-full font-semibold">
                      Ligne Fixe 24/7
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-space-md rounded bg-surface-container-low">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-full bg-surface-variant text-on-surface flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">support_agent</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Email d'astreinte logistique</span>
                        <a
                          className="font-label-lg text-label-lg text-primary hover:underline font-semibold"
                          href="mailto:urgence@madavoyage.mg"
                        >
                          urgence@madavoyage.mg
                        </a>
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Rép. &lt; 15 min</span>
                  </div>
                </div>
                <div className="mt-space-lg pt-space-md flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
                  <span className="font-body-sm text-body-sm">
                    Chaque équipage en circuit dispose d'un téléphone satellite Iridium de secours.
                  </span>
                </div>
              </div>

              <BulletinProvider>
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-lg p-space-xl shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between flex-wrap gap-space-sm">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">traffic</span>
                      </div>
                      <div>
                        <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider text-primary">
                          Postes de Contrôle Régionaux
                        </span>
                        <h3 className="font-headline-md text-headline-md text-on-surface">Bulletin des Pistes &amp; Climat en Direct</h3>
                      </div>
                    </div>
                    <BulletinTimestamp />
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Informations consolidées par nos éclaireurs de piste, les chefs de convois 4x4 et les capitaineries côtières.
                  </p>

                  <div className="flex flex-col gap-space-sm mt-space-xs">
                    <div className="p-space-md rounded bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                      <div className="flex items-start gap-space-sm">
                        <span className="material-symbols-outlined text-secondary text-[24px] mt-0.5">check_circle</span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-headline-sm text-headline-sm text-on-surface">RN7 Antananarivo → Tuléar</span>
                            <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full font-bold">
                              100% Fluide
                            </span>
                          </div>
                          <span className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                            Piste sèche, praticable sans encombre. Traversée d'Ambalavao et plateau de l'Horombe dégagés.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-right flex-shrink-0 md:pl-space-md">
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Météo Sud</span>
                          <span className="font-label-lg text-label-lg font-bold text-on-surface">28°C · Ensoleillé</span>
                        </div>
                        <span className="material-symbols-outlined text-tertiary-container text-[26px]">wb_sunny</span>
                      </div>
                    </div>

                    <div className="p-space-md rounded bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                      <div className="flex items-start gap-space-sm">
                        <span className="material-symbols-outlined text-secondary text-[24px] mt-0.5">sailing</span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-headline-sm text-headline-sm text-on-surface">
                              Liaison Nosy Be → Nosy Komba &amp; Tanikely
                            </span>
                            <span className="font-label-sm text-label-sm text-primary bg-primary-container/20 px-2 py-0.5 rounded-full font-bold">
                              Mer Calme
                            </span>
                          </div>
                          <span className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                            Mer belle, coefficient de marée normal. Embarquements réguliers au port d'Hell-Ville. Visibilité sous-marine
                            25m.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-right flex-shrink-0 md:pl-space-md">
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Lagon Nord</span>
                          <span className="font-label-lg text-label-lg font-bold text-on-surface">30°C · Houle 0.4m</span>
                        </div>
                        <span className="material-symbols-outlined text-primary text-[26px]">waves</span>
                      </div>
                    </div>

                    <div className="p-space-md rounded bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                      <div className="flex items-start gap-space-sm">
                        <span className="material-symbols-outlined text-secondary text-[24px] mt-0.5">landscape</span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-headline-sm text-headline-sm text-on-surface">
                              Tsingy de Bemaraha &amp; Vallée de la Tsiribihina
                            </span>
                            <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full font-bold">
                              Accès Ouvert
                            </span>
                          </div>
                          <span className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                            Bacs de Belo-sur-Tsiribihina navigables, guides MNP en poste. Ponts de singe vérifiés ce matin.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-right flex-shrink-0 md:pl-space-md">
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Parc National</span>
                          <span className="font-label-lg text-label-lg font-bold text-on-surface">26°C · Brise douce</span>
                        </div>
                        <span className="material-symbols-outlined text-secondary text-[26px]">air</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-space-xs rounded bg-surface-container p-space-md flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">satellite_alt</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                          Surveillance Météo-Madagascar (DGM)
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Aucune perturbation cyclonique signalée dans le bassin Sud-Ouest de l'Océan Indien.
                        </span>
                      </div>
                    </div>
                    <BulletinRefreshButton />
                  </div>
                </div>
              </BulletinProvider>
            </div>

            <div className="w-full bg-surface-container-low rounded-xl p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant shadow-sm">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[24px]">lock</span>
                <span className="font-body-sm text-body-sm">
                  <strong>Engagement Continuité de Service :</strong> Vos réservations confirmées disposent de numéros d'enregistrement
                  officiels chez nos lodges partenaires et Madagascar National Parks.
                </span>
              </div>
              <div className="flex items-center gap-space-md flex-shrink-0">
                <span className="font-label-sm text-label-sm text-on-surface">
                  Statut serveur : <strong>Cluster S-102 Antananarivo</strong>
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
