import type { Metadata } from "next";
import Link from "next/link";
import {
  AccountNav,
  CertificateButton,
  DepartureCountdown,
  ItineraryButton,
  SignOutButton,
  TravelerProfiles,
  VoucherQrButton,
} from "@/components/compte/Compte";
import PrintButton from "@/components/ui/PrintButton";
import { WHATSAPP } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mon espace voyageur | MadaVoyage",
  description: "Suivez votre voyage à Madagascar : préparation, paiements, vouchers hors-ligne, profils voyageurs et conciergerie 24/7.",
  robots: { index: false },
};

export default function Page() {
  return (
    <>
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-14rem)]">
        <div className="flex flex-col w-full">
          <section className="w-full max-w-7xl mx-auto px-margin-desktop mb-space-xl">
            <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-headline-lg shadow-md overflow-hidden">
                      <span className="material-symbols-outlined text-[52px]">person</span>
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-sm"
                      title="Profil Vérifié"
                    >
                      <span className="material-symbols-outlined text-body-md" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex flex-wrap items-center gap-space-sm">
                      <h1 className="font-headline-lg text-headline-lg text-on-surface">Alexandre Fontaine</h1>
                      <span className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-body-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                          eco
                        </span>
                        Voyageur Éco-Certifié Fihavanana · Niveau Explorateur
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-space-md text-on-surface-variant font-body-sm text-body-sm">
                      <span className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-body-sm text-primary">mail</span>
                        alexandre.fontaine@email.fr
                      </span>
                      <span className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-body-sm text-primary">phone_iphone</span>
                        +33 6 12 34 56 78 · +261 34 82 110 50
                      </span>
                      <span className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-body-sm text-outline">history</span>
                        Membre fidèle depuis 2024
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-space-sm self-start lg:self-auto">
                  <div className="px-space-md py-space-xs rounded bg-surface-container flex items-center gap-space-xs text-on-surface">
                    <span className="material-symbols-outlined text-tertiary-container">flight_takeoff</span>
                    <DepartureCountdown />
                  </div>
                  <Link
                    className="h-12 px-space-lg rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-space-xs hover:bg-on-primary-fixed-variant transition-colors shadow-sm"
                    href="/carnet?onglet=documents"
                  >
                    <span className="material-symbols-outlined text-body-md">download</span>
                    <span>Pack Voyage Complet</span>
                  </Link>
                  <SignOutButton />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mt-space-lg pt-space-lg bg-surface-container-low rounded p-space-md">
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-headline-md">luggage</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-md text-headline-md text-primary">1 À Venir</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Nosy Be (Oct. 2026)</span>
                  </div>
                </div>
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-headline-md">verified_user</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-md text-headline-md text-secondary">2 Passés</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">RN7 (2025) · Ste-Marie (2024)</span>
                  </div>
                </div>
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                    <span className="material-symbols-outlined text-headline-md">park</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-md text-headline-md text-on-surface">22 Arbres</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Forêt du Sambirano</span>
                  </div>
                </div>
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-headline-md">energy_savings_leaf</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-md text-headline-md text-primary">100% Neutre</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Bilan Carbone compensé</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full max-w-7xl mx-auto px-margin-desktop mb-space-lg">
            <AccountNav />
          </section>

          <section className="w-full max-w-7xl mx-auto px-margin-desktop mb-space-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
              <div className="lg:col-span-8 flex flex-col gap-space-xl scroll-mt-28" id="voyages">
                <div className="flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span className="w-3 h-3 rounded-full bg-tertiary-container animate-pulse"></span>
                      <span className="font-label-lg text-label-lg uppercase tracking-wider text-tertiary font-bold">
                        Voyage Actif · Dossier #MDV-2026-8902
                      </span>
                    </div>
                    <span className="px-space-md py-space-xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-body-sm">check_circle</span> Confirmé &amp; Verrouillé
                    </span>
                  </div>

                  <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-md flex flex-col">
                    <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                      <img
                        alt="Manga Soa Lodge à Nosy Be Madagascar"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCicxaEeHzZN_Dv1iG36Qhi0mahVWg65VNejSnrL1bJsPeocAV9rUgD-ShT8E91nKmBRv7U32wdHxsH1zVjpEyOqeLey3bXG_E_eckmfPg4k4mhypWPy-TUHvRJrN-_S9w-TA1n7vlZAF3dWFGb9SZc8RSaPXvrvXFB7xNp7a0l6CBqiOm5jRIYJlw3O91PLFFq4E6YBqK7vtdcmaO9sTeuxaLIZaDq1ZyM86XDaIWk4vF-6K8z43Y"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/30 to-transparent"></div>

                      <div className="absolute top-space-md left-space-md flex flex-wrap gap-space-xs">
                        <span className="px-space-md py-space-xs rounded-full bg-surface-lowest/80 backdrop-blur-md text-on-surface font-label-sm text-label-sm flex items-center gap-space-xs shadow-sm">
                          <span className="material-symbols-outlined text-secondary text-body-sm">hotel</span>
                          Manga Soa Lodge 4★ · Suite Baobab
                        </span>
                        <span className="px-space-md py-space-xs rounded-full bg-surface-lowest/80 backdrop-blur-md text-on-surface font-label-sm text-label-sm flex items-center gap-space-xs shadow-sm">
                          <span className="material-symbols-outlined text-primary text-body-sm">pin_drop</span>
                          Nosy Be &amp; Archipel des Mitsio
                        </span>
                      </div>

                      <div className="absolute bottom-space-lg left-space-lg right-space-lg text-inverse-on-surface">
                        <div className="flex flex-wrap items-baseline justify-between gap-space-xs mb-space-xs">
                          <h2 className="font-headline-lg text-headline-lg text-inverse-on-surface">Nosy Be &amp; Archipels Sauvages</h2>
                          <span className="font-label-lg text-label-lg text-secondary-fixed font-semibold">10 nuits / 11 jours</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-space-md text-inverse-on-surface/90 font-body-md text-body-md">
                          <span className="flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-body-sm text-secondary-fixed">calendar_month</span>
                            14 au 24 Octobre 2026
                          </span>
                          <span className="flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-body-sm text-secondary-fixed">group</span>3 Voyageurs :
                            Alexandre, Clara, Enzo (8 ans)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-space-lg flex flex-col gap-space-lg">
                      <div className="bg-surface-container-low p-space-md rounded flex flex-col gap-space-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-label-lg text-label-lg text-on-surface flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-primary text-body-md">fact_check</span>
                            Préparation de l'expédition
                          </span>
                          <span className="font-label-lg text-label-lg font-bold text-primary">85% Prêt</span>
                        </div>
                        <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-container rounded-full transition-all duration-500"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs text-body-sm text-body-sm pt-space-xs text-on-surface-variant">
                          <div className="flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-secondary text-[18px]">task_alt</span>
                            <span>Billets Madagascar Airlines émis</span>
                          </div>
                          <div className="flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-secondary text-[18px]">task_alt</span>
                            <span>Passeports validés</span>
                          </div>
                          <div className="flex items-center gap-space-xs text-tertiary">
                            <span className="material-symbols-outlined text-[18px]">pending</span>
                            <span>Horaire pirogue Lokobe à fixer</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter bg-surface-container p-space-md rounded">
                        <div className="flex flex-col gap-space-xs">
                          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                            Acompte Réglé (30%)
                          </span>
                          <div className="flex items-baseline gap-space-xs">
                            <span className="font-headline-md text-headline-md text-secondary font-bold">493,50 €</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">(~ 2 418 150 Ar)</span>
                          </div>
                          <span className="font-body-sm text-body-sm text-secondary flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-[16px]">done_all</span> Reçu de paiement #REC-8902-1
                          </span>
                        </div>
                        <div className="flex flex-col gap-space-xs">
                          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                            Solde restant à régler
                          </span>
                          <div className="flex items-baseline gap-space-xs">
                            <span className="font-headline-md text-headline-md text-on-surface font-bold">1 151,50 €</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">(~ 5 642 350 Ar)</span>
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-[16px]">schedule</span> Échéance : 01 Octobre 2026 (sans frais)
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                        <Link
                          className="h-12 px-space-md rounded-full bg-tertiary text-on-tertiary font-label-lg text-label-lg flex items-center justify-center gap-space-xs hover:bg-on-tertiary-fixed-variant transition-colors shadow-sm"
                          href="/carnet"
                        >
                          <span className="material-symbols-outlined text-body-md">picture_as_pdf</span>
                          <span>Carnet de Voyage Hors-ligne</span>
                        </Link>
                        <ItineraryButton className="h-12 px-space-md rounded-full bg-surface-container-high hover:bg-surface-variant text-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-colors">
                          <span className="material-symbols-outlined text-body-md">route</span>
                          <span>Itinéraire Jour par Jour</span>
                        </ItineraryButton>
                        <Link
                          className="h-12 px-space-md rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-colors"
                          href="/modification"
                        >
                          <span className="material-symbols-outlined text-body-md">tune</span>
                          <span>Gérer les options du séjour</span>
                        </Link>
                        <a
                          className="h-12 px-space-md rounded-full bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-colors"
                          href={`${WHATSAPP.href}?text=Bonjour%20Faly%2C%20question%20sur%20le%20dossier%20MDV-2026-8902`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="material-symbols-outlined text-body-md">chat</span>
                          <span>Contacter Faly (Guide MNP)</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary">auto_stories</span>
                      Carnet Passé &amp; Souvenirs (2 Expéditions)
                    </h3>
                    <span className="font-label-md text-label-md text-on-surface-variant">Archivage sécurisé à vie</span>
                  </div>

                  <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
                    <div className="flex items-start gap-space-md">
                      <div className="w-16 h-16 rounded bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                        <span className="material-symbols-outlined text-headline-lg">terrain</span>
                      </div>
                      <div className="flex flex-col gap-space-xs">
                        <div className="flex flex-wrap items-center gap-space-xs">
                          <span className="font-headline-sm text-headline-sm text-on-surface">La Mythique Route Nationale 7</span>
                          <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                            Octobre 2025
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Antananarivo · Antsirabe · Ranomafana · Isalo · Ifaty · 10 Jours · 1 290 € (6 321 000 Ar)
                        </p>
                        <div className="flex items-center gap-space-xs text-tertiary-container pt-space-xs">
                          <div className="flex items-center text-tertiary-container">
                            <span className="material-symbols-outlined text-body-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                              star
                            </span>
                            <span className="material-symbols-outlined text-body-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                              star
                            </span>
                            <span className="material-symbols-outlined text-body-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                              star
                            </span>
                            <span className="material-symbols-outlined text-body-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                              star
                            </span>
                            <span className="material-symbols-outlined text-body-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                              star
                            </span>
                          </div>
                          <span className="font-body-sm text-body-sm italic text-on-surface-variant">
                            « Expérience inoubliable avec notre guide Faly »
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs self-end md:self-center">
                      <Link
                        className="h-10 px-space-md rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-space-xs transition-colors"
                        href="/carnet?onglet=albums"
                      >
                        <span className="material-symbols-outlined text-body-sm">photo_library</span>
                        <span>Voir Album (48)</span>
                      </Link>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
                    <div className="flex items-start gap-space-md">
                      <div className="w-16 h-16 rounded bg-surface-container flex items-center justify-center text-secondary flex-shrink-0">
                        <span className="material-symbols-outlined text-headline-lg">kayaking</span>
                      </div>
                      <div className="flex flex-col gap-space-xs">
                        <div className="flex flex-wrap items-center gap-space-xs">
                          <span className="font-headline-sm text-headline-sm text-on-surface">
                            Sanctuaires de Sainte-Marie &amp; Île aux Nattes
                          </span>
                          <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                            Août 2024
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Observation des baleines à bosse · Pirogue traditionnelle · 7 Jours
                        </p>
                        <div className="flex items-center gap-space-xs pt-space-xs">
                          <span className="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-body-sm">workspace_premium</span>
                            Certificat 12 Arbres Reboisés
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs self-end md:self-center">
                      <CertificateButton className="h-10 px-space-md rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-space-xs transition-colors">
                        <span className="material-symbols-outlined text-body-sm">download</span>
                        <span>Certificat MNP</span>
                      </CertificateButton>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-space-xl">
                <div
                  className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-md scroll-mt-28"
                  id="documents"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary">qr_code_2</span>
                      Vouchers &amp; Accès
                    </h3>
                    <span className="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                      Hors-ligne OK
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Présentez ces QR codes sans connexion internet auprès des gardes et hôteliers.
                  </p>

                  <div className="p-space-md rounded bg-surface-container-low flex items-center justify-between gap-space-sm">
                    <div className="flex flex-col gap-space-xs">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-body-sm">hotel</span>
                        <span className="font-label-md text-label-md text-on-surface font-bold">Manga Soa Lodge 4★</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Suite Baobab · 10 nuits</span>
                      <span className="font-label-sm text-label-sm text-primary">Ref #MSL-8902-NOSY</span>
                    </div>
                    <VoucherQrButton id="lodge" />
                  </div>

                  <div className="p-space-md rounded bg-surface-container-low flex items-center justify-between gap-space-sm">
                    <div className="flex flex-col gap-space-xs">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-body-sm">forest</span>
                        <span className="font-label-md text-label-md text-on-surface font-bold">MNP Réserve de Lokobe</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Permis Écotourisme #MNP-9921</span>
                      <span className="font-label-sm text-label-sm text-secondary">3 Passagers · Éco-guidage inclus</span>
                    </div>
                    <VoucherQrButton id="lokobe" />
                  </div>

                  <div className="p-space-md rounded bg-surface-container-low flex items-center justify-between gap-space-sm">
                    <div className="flex flex-col gap-space-xs">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-tertiary-container text-body-sm">airlines</span>
                        <span className="font-label-md text-label-md text-on-surface font-bold">Vol Intérieur Madagascar Airlines</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">TNR ⇄ NOS (A/R)</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Billets e-Tkt #TZ-402-99</span>
                    </div>
                    <VoucherQrButton id="flight" />
                  </div>

                  <PrintButton className="w-full h-12 rounded-full bg-surface-container-high hover:bg-surface-variant text-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-colors">
                    <span className="material-symbols-outlined text-body-md">print</span>
                    <span>Imprimer tous les vouchers (PDF)</span>
                  </PrintButton>
                </div>

                <div
                  className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-md scroll-mt-28"
                  id="support"
                >
                  <div className="flex items-center gap-space-xs">
                    <span className="w-3 h-3 rounded-full bg-secondary"></span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Votre Conciergerie 24/7</h3>
                  </div>
                  <div className="p-space-md rounded bg-surface-container flex items-center gap-space-md">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary">
                      <span className="material-symbols-outlined text-headline-sm">nature_people</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">Mamy &amp; Faly</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Anges Gardiens · Antananarivo &amp; Nosy Be</span>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Un doute sur les marées, envie d'un dîner langouste privée ou besoin d'assistance médicale ? Votre contact local est
                    joignable à tout instant.
                  </p>
                  <a
                    className="h-12 rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-space-xs hover:bg-on-secondary-fixed-variant transition-colors shadow-sm"
                    href={WHATSAPP.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined text-body-md">forum</span>
                    <span>WhatsApp Direct ({WHATSAPP.display})</span>
                  </a>
                  <div className="flex items-center justify-between text-body-sm text-body-sm text-on-surface-variant px-space-xs pt-space-xs">
                    <span>Astreinte d'urgence MNP</span>
                    <a className="font-bold text-on-surface hover:underline" href="tel:+261202220144">
                      +261 20 22 201 44
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full max-w-7xl mx-auto px-margin-desktop mb-space-xl scroll-mt-28" id="preferences">
            <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-lg">
              <TravelerProfiles />

              <div className="bg-surface-container p-space-md rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
                <div className="flex items-start gap-space-md">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-body-lg">child_friendly</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-bold">Équipements d'expédition validés</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      1x Siège auto enfant 4x4 inclus dans les transferts · 2x Paires de jumelles optiques HD fournies pour Lokobe · 3x
                      Ponchos étanches forêt humide.
                    </span>
                  </div>
                </div>
                <span className="px-space-md py-space-xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold flex items-center gap-space-xs self-start md:self-auto">
                  <span className="material-symbols-outlined text-body-sm">check</span>
                  Validé par le réceptif
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
