import type { Metadata } from "next";
import Link from "next/link";
import { CarnetPanels, CarnetProvider, CarnetTabList, VoucherButton } from "@/components/carnet/Carnet";
import CarnetConverter from "@/components/carnet/CarnetConverter";
import RateLabel from "@/components/currency/RateLabel";
import TripActions from "@/components/carnet/TripActions";
import { EMERGENCY, WHATSAPP } from "@/lib/site";

export const metadata: Metadata = {
  title: "Carnet de Route Numérique — MadaVoyage",
  description:
    "Vos vouchers, billets, contacts sur place et outils pratiques (convertisseur, lexique, carte hors-ligne) pour votre voyage à Madagascar.",
};

export default function Page() {
  return (
    <main className="w-full pt-20 bg-surface min-h-[calc(100vh-20rem)]">
      <CarnetProvider>
        <div className="flex flex-col w-full">
          <section className="w-full bg-surface-container-low pb-space-lg pt-space-md">
            <div className="max-w-[80rem] mx-auto px-margin-desktop">
              <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
                <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                  <Link className="hover:text-primary transition-colors" href="/compte">
                    Espace Membre
                  </Link>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-primary font-bold">Carnet de Route Numérique</span>
                </div>
                <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-surface-container-lowest shadow-sm">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                  <span className="font-label-sm text-label-sm text-on-surface">Synchronisé hors-ligne • Mode Valise activé</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">cloud_done</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
                <div className="lg:col-span-7 flex items-center gap-space-lg">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-primary-container p-1 shadow-md">
                      <img
                        className="w-full h-full object-cover rounded-full"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7zS7Zi6zS8C4f2T2knErA5Bk4rbLAzimib-lI5A0z719bZvzS9arjRVP5ucPAGcpKoKhVvObSWADyvKisixD7BpCVfhqUEjbeU7CvgP6QIE_85H1QXc2uRAa-VawtQYv_2cBMqiyRuKVTRV5nRUSEkmkg2zNKCJTyBUKykVwyD2lEd4-ltbJ9_Q-_tPiEebb0Hz8qwWzURPj_lDNp0e3S8616SzlDO02JXZuFvfdeSyQLEHeu-K8"
                        alt="Portrait de Thomas Rakoto"
                      />
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm"
                      title="Éco-Voyageur Certifié"
                    >
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                        Membres Ambassadeurs • Niveau Baobab
                      </span>
                      <span className="px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                        Passeport Vert
                      </span>
                    </div>
                    <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight truncate">Tongasoa, Thomas Rakoto</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Votre aventure débute dans <span className="font-bold text-tertiary">3 jours</span> • Dossier de réservation :{" "}
                      <span className="font-semibold text-on-surface font-label-md text-label-md">MDV-2024-8841</span>
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-5 grid grid-cols-2 gap-space-md">
                  <div className="p-space-md rounded-lg bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider">Impact Fihavanana</span>
                      <span className="material-symbols-outlined text-secondary text-[20px]">spa</span>
                    </div>
                    <div className="mt-space-xs">
                      <div className="font-headline-lg text-headline-lg text-secondary font-bold leading-tight">2 450 pts</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">14 palétuviers plantés à Nosy Faly</div>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full mt-space-sm overflow-hidden">
                      <div className="bg-secondary h-full rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider">Vouchers Validés</span>
                      <span className="material-symbols-outlined text-primary text-[20px]">assignment_turned_in</span>
                    </div>
                    <div className="mt-space-xs">
                      <div className="font-headline-lg text-headline-lg text-primary font-bold leading-tight">4 / 4 prêts</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Accessibles hors connexion</div>
                    </div>
                    <div className="inline-flex items-center gap-space-xs text-secondary font-label-sm text-label-sm mt-space-sm">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span> Tout est vérifié
                    </div>
                  </div>
                </div>
              </div>

              <CarnetTabList />
            </div>
          </section>

          <div className="max-w-[80rem] mx-auto px-margin-desktop py-space-lg flex flex-col gap-space-xl">
            <CarnetPanels>
              <div className="relative rounded-lg overflow-hidden bg-surface-container shadow-md">
                <div
                  className="absolute inset-0 z-0 bg-cover bg-center"
                  role="img"
                  aria-label="Vue aérienne du littoral de Nosy Be, lagons turquoise et pirogues à balancier"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGCnv3O5Gwv2HknxkJzck0tiSjuSkj-0Xn-asJAqy3D1idYt9_dEGl_hlJ35H9tp3MQJL-S8iPRFLD1Z_7u-tX4nXRFdYhvV6LKAOUAA775a608c07A-1mvyiXk_Cw6gUeTZINO-jphC4CMF15mzgRAr83SJPvoPgYQvlYbnNerStbO3RaGv28gz8d-ZItACfbwGhy_0AfVxKxeah2qZ5_fFa79FOwTD8fA5iLSy2SApUIyUeh7Wo')",
                  }}
                ></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-on-surface/90 via-on-surface/75 to-on-surface/30"></div>

                <div className="relative z-10 p-space-lg lg:p-space-xl text-on-tertiary flex flex-col lg:flex-row justify-between gap-space-xl items-start lg:items-end">
                  <div className="max-w-2xl flex flex-col gap-space-md">
                    <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-secondary/90 backdrop-blur-md text-on-secondary font-label-sm text-label-sm uppercase tracking-widest shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
                      <span className="">Départ Imminent • Circuit Privatisé</span>
                    </div>
                    <h2 className="font-headline-lg text-headline-lg lg:text-[34px] lg:leading-[42px] font-bold text-on-tertiary">
                      Escapade Tropicale &amp; Forêts Marines de Nosy Be
                    </h2>
                    <div className="flex flex-wrap items-center gap-space-md text-surface-container-lowest font-body-md text-body-md">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary-fixed text-[20px]">calendar_month</span>
                        <span className="">14 – 24 Octobre 2024</span>
                      </div>
                      <span className="">•</span>
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary-fixed text-[20px]">night_shelter</span>
                        <span className="">10 nuits en Suite Océan</span>
                      </div>
                      <span className="">•</span>
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary-fixed text-[20px]">group</span>
                        <span className="">3 Voyageurs (Thomas, Clara &amp; Sarah)</span>
                      </div>
                    </div>

                    <TripActions />
                  </div>

                  <div className="w-full lg:w-80 flex flex-col gap-space-sm">
                    <div className="p-space-md rounded-lg bg-surface-container-lowest/90 backdrop-blur-md text-on-surface shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-xs">
                          <span className="material-symbols-outlined text-tertiary-container text-[24px]">sunny</span>
                          <div>
                            <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                              Météo Nosy Be (Hell-Ville)
                            </div>
                            <div className="font-headline-sm text-headline-sm font-bold text-on-surface">29°C • Mer d'huile</div>
                          </div>
                        </div>
                        <span className="text-secondary font-label-sm text-label-sm font-bold bg-secondary-container/40 px-2 py-0.5 rounded-full">
                          Idéal plongée
                        </span>
                      </div>
                      <div className="mt-space-xs pt-space-xs flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                        <span className="">Marée basse : 11h24</span>
                        <span className="">Vent : 8 nœuds E-SE</span>
                      </div>
                    </div>

                    <div className="p-space-md rounded-lg bg-surface-container-lowest/90 backdrop-blur-md text-on-surface shadow-sm">
                      <div className="flex items-center gap-space-md">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
                          <img
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAexsAypIHiGqFyUNSvGx2KcZkGYA2tq8o-p317KYJkCs7Enky6Uilr8yNCZNItVI1KuZR5j5b7WfzLr5ks7KFXwMfwy0UbgQvG5vGoJiioIWKqgVaX4xU4w3WFpP3zR-LJX5NJVqg1StvJ_k2Zb5xQA5GhYdGJlyYAzspYHP6q4JHCK59vA65Zr9_G23z9S1oyhnsRNWXlrovRIb3aHr-r9vQDXuSqz9I2Vv1GIr_45zV4JpLxRJ0"
                            alt="Portrait de Faly, guide national certifié"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-space-xs">
                            <span className="font-label-md text-label-md text-on-surface font-bold truncate">Faly • Guide National</span>
                            <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">MNP #419 • Francophone</span>
                        </div>
                      </div>
                      <div className="mt-space-sm pt-space-xs flex items-center gap-space-xs">
                        <a
                          className="flex-1 h-9 rounded-full bg-secondary hover:bg-secondary/90 text-on-secondary font-label-sm text-label-sm flex items-center justify-center gap-space-xs transition-colors"
                          href={`${WHATSAPP.href}?text=Bonjour%20Faly%2C%20dossier%20MDV-2024-8841`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="material-symbols-outlined text-[16px]">chat</span> WhatsApp Guide
                        </a>
                        <a
                          aria-label="Appeler l'assistance d'urgence 24/7"
                          className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface"
                          href={EMERGENCY.call}
                          title="Numéro d'urgence 24/7"
                        >
                          <span className="material-symbols-outlined text-[18px]">call</span>
                        </a>
                      </div>
                      <a
                        className="mt-space-xs text-center font-label-sm text-label-sm text-error font-bold flex items-center justify-center gap-1 hover:underline"
                        href={EMERGENCY.call}
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                          emergency
                        </span>
                        Urgence 24 h/24 : {EMERGENCY.display}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <section className="flex flex-col gap-space-md">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-xs">
                  <div>
                    <div className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                      Titres de transport &amp; Hébergements sécurisés
                    </div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Vouchers Dématérialisés • Accès Direct</h2>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                    Chaque document intègre son certificat cryptographique. Cliquez sur le QR Code pour le plein écran avec luminosité
                    maximale pour le contrôle d'embarquement.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-desktop">
                  <div className="rounded-lg bg-surface-container-lowest p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-space-md">
                        <div className="flex items-center gap-space-xs">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[18px]">airlines</span>
                          </div>
                          <div>
                            <span className="font-label-md text-label-md font-bold text-on-surface">Madagascar Airlines</span>
                            <span className="block font-body-sm text-body-sm text-on-surface-variant">Vol intérieur MD 324</span>
                          </div>
                        </div>
                        <span className="px-space-sm py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">offline_pin</span> Billet Émis
                        </span>
                      </div>

                      <div className="bg-surface-container-low p-space-md rounded-md flex items-center justify-between mb-space-md">
                        <div className="text-left">
                          <div className="font-display-lg text-headline-lg font-extrabold text-primary">TNR</div>
                          <div className="font-label-sm text-label-sm text-on-surface font-semibold">Antananarivo</div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant">Ivato Intl. • 09:25</div>
                        </div>
                        <div className="flex flex-col items-center flex-1 px-space-md">
                          <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">1 h 45 direct</span>
                          <div className="w-full flex items-center gap-1 my-1">
                            <div className="h-[2px] bg-outline-variant flex-1"></div>
                            <span className="material-symbols-outlined text-primary text-[18px] rotate-90">flight</span>
                            <div className="h-[2px] bg-outline-variant flex-1"></div>
                          </div>
                          <span className="font-label-sm text-label-sm text-secondary">ATR 72-600</span>
                        </div>
                        <div className="text-right">
                          <div className="font-display-lg text-headline-lg font-extrabold text-primary">NOS</div>
                          <div className="font-label-sm text-label-sm text-on-surface font-semibold">Nosy Be</div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant">Fascene • 11:10</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-space-sm text-center mb-space-md font-body-sm text-body-sm">
                        <div className="p-2 rounded bg-surface-container">
                          <span className="text-on-surface-variant block font-label-sm text-label-sm">Sièges</span>
                          <span className="font-bold text-on-surface">12A, 12B, 12C</span>
                        </div>
                        <div className="p-2 rounded bg-surface-container">
                          <span className="text-on-surface-variant block font-label-sm text-label-sm">Bagages</span>
                          <span className="font-bold text-on-surface">20 kg / pers</span>
                        </div>
                        <div className="p-2 rounded bg-surface-container">
                          <span className="text-on-surface-variant block font-label-sm text-label-sm">Classe</span>
                          <span className="font-bold text-on-surface">Premium Éco</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-space-md flex items-center justify-between gap-space-md">
                      <div className="flex items-center gap-space-md">
                        <VoucherButton
                          className="w-16 h-16 bg-surface-container-highest p-1 rounded-md flex items-center justify-center hover:ring-2 hover:ring-primary transition"
                          id="flight"
                          label="Agrandir le QR code du billet"
                        >
                          <svg className="w-14 h-14 text-on-surface" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm0-4h2v2h-2v-2zm-4-6h2v2h-2V8zm4 0h2v2h-2V8zm-2 2h2v2h-2v-2z"></path>
                          </svg>
                        </VoucherButton>
                        <div>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Code PNR</span>
                          <div className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-wider">TZ-893-XLA</div>
                          <span className="font-body-sm text-body-sm text-secondary">Enregistrement ouvert</span>
                        </div>
                      </div>
                      <VoucherButton
                        className="h-10 px-space-md rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-space-xs transition-colors"
                        id="flight"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span> Billet PDF
                      </VoucherButton>
                    </div>
                  </div>

                  <div className="rounded-lg bg-surface-container-lowest p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-space-md">
                        <div className="flex items-center gap-space-xs">
                          <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container">
                            <span className="material-symbols-outlined text-[18px]">hotel</span>
                          </div>
                          <div>
                            <span className="font-label-md text-label-md font-bold text-on-surface">Vanila Hotel &amp; Spa 4★</span>
                            <span className="block font-body-sm text-body-sm text-on-surface-variant">Nosy Be • Plage d'Ambaro</span>
                          </div>
                        </div>
                        <span className="px-space-sm py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">verified</span> Garanti &amp; Payé
                        </span>
                      </div>

                      <div className="h-28 rounded-md overflow-hidden relative mb-space-md bg-surface-container">
                        <img
                          className="w-full h-full object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjvRAsKW6YoVFhYfIJVfQnjYVvLXkCzz61PE0kcWu1c9cAhAwt9syCgGMmTso6qgflm3f8wpAkOTSauP0qEBUbRoSDMffIiAYG5Xy6YCYRBbgQ37wv75kr6_Ny_OZiWMJXdmnwyuPwo2F2rlRfS7c4M_7ZSpCF9qNRrk_pAi1OUGiTz6-9EdIpPtlTnzoQxWm9bmXqWl57CPSJMZE8sAmOZvuU6hKdabCEwjajhcBTntnkNgwZpy8"
                          alt="Bungalow en bord de mer du Vanila Hotel & Spa au coucher du soleil"
                        />
                        <div className="absolute bottom-2 left-2 px-space-sm py-0.5 rounded-full bg-on-surface/80 text-surface-container-lowest backdrop-blur-sm font-label-sm text-label-sm">
                          Suite Océan • 10 nuits • Demi-pension
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-space-sm text-body-sm mb-space-md">
                        <div className="p-2 rounded bg-surface-container">
                          <span className="text-on-surface-variant block font-label-sm text-label-sm">Réf. Hôtelière</span>
                          <span className="font-bold text-on-surface">VN-88412-MG</span>
                        </div>
                        <div className="p-2 rounded bg-surface-container">
                          <span className="text-on-surface-variant block font-label-sm text-label-sm">Check-in</span>
                          <span className="font-bold text-on-surface">14 Oct. dès 14:00</span>
                        </div>
                        <div className="col-span-2 p-2 rounded bg-surface-container flex items-center justify-between">
                          <div className="flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                            <span className="text-on-surface font-body-sm text-body-sm">GPS: 13°19'48"S 48°13'02"E</span>
                          </div>
                          <a
                            className="text-primary font-label-sm text-label-sm font-bold hover:underline"
                            href="https://www.google.com/maps/dir/?api=1&destination=-13.33,48.2172"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Itinéraire Maps
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="pt-space-md flex items-center justify-between gap-space-md">
                      <div className="flex items-center gap-space-sm">
                        <VoucherButton
                          className="w-12 h-12 bg-surface-container-highest p-1 rounded-md flex items-center justify-center hover:ring-2 hover:ring-primary transition"
                          id="hotel"
                          label="Agrandir le QR code du bon d'échange"
                        >
                          <svg className="w-10 h-10 text-on-surface" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm0-4h2v2h-2v-2zm-4-6h2v2h-2V8zm4 0h2v2h-2V8zm-2 2h2v2h-2v-2z"></path>
                          </svg>
                        </VoucherButton>
                        <div className="text-on-surface-variant font-body-sm text-body-sm">
                          <span className="">Contact Réception :</span>
                          <span className="block font-bold text-on-surface">+261 32 07 200 45</span>
                        </div>
                      </div>
                      <VoucherButton
                        className="h-10 px-space-md rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-space-xs transition-colors"
                        id="hotel"
                      >
                        <span className="material-symbols-outlined text-[16px]">receipt</span> Bon d'Échange
                      </VoucherButton>
                    </div>
                  </div>

                  <div className="rounded-lg bg-surface-container-lowest p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-space-md">
                        <div className="flex items-center gap-space-xs">
                          <div className="w-8 h-8 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                            <span className="material-symbols-outlined text-[18px]">directions_car</span>
                          </div>
                          <div>
                            <span className="font-label-md text-label-md font-bold text-on-surface">Transfert Privé 4x4 • A/R</span>
                            <span className="block font-body-sm text-body-sm text-on-surface-variant">Aéroport Fascene ➔ Vanila Hotel</span>
                          </div>
                        </div>
                        <span className="px-space-sm py-1 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold">
                          Chauffeur Dédié
                        </span>
                      </div>
                      <div className="bg-surface-container-low p-space-md rounded-md flex flex-col gap-space-sm mb-space-md">
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Véhicule assigné :</span>
                          <span className="font-label-md text-label-md font-bold text-on-surface">Toyota Prado TX Climatisé</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Accueil à l'arrivée :</span>
                          <span className="font-label-sm text-label-sm font-bold text-primary">Pancarte 'MadaVoyage – RAKOTO'</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Chauffeur local :</span>
                          <span className="font-label-sm text-label-sm text-on-surface">Mamisoa (+261 34 56 789 01)</span>
                        </div>
                      </div>
                      <div className="p-space-sm rounded bg-secondary/10 flex items-center gap-space-xs text-secondary font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[18px]">local_gas_station</span>
                        <span className="">Carburant &amp; taxes de voirie incluses. Sièges auto installés pour enfants sur demande.</span>
                      </div>
                    </div>
                    <div className="pt-space-md flex items-center justify-between">
                      <div className="font-label-sm text-label-sm text-on-surface-variant">
                        Code Transfert : <span className="font-bold text-on-surface font-label-md text-label-md">TRF-NOS-1410</span>
                      </div>
                      <VoucherButton
                        className="h-10 px-space-md rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-space-xs transition-colors"
                        id="transfer"
                      >
                        <span className="material-symbols-outlined text-[16px]">description</span> Fiche Chauffeur
                      </VoucherButton>
                    </div>
                  </div>

                  <div className="rounded-lg bg-surface-container-lowest p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-space-md">
                        <div className="flex items-center gap-space-xs">
                          <div className="w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                            <span className="material-symbols-outlined text-[18px]">nature</span>
                          </div>
                          <div>
                            <span className="font-label-md text-label-md font-bold text-on-surface">Pass Madagascar National Parks</span>
                            <span className="block font-body-sm text-body-sm text-on-surface-variant">
                              Réserve Spéciale de Lokobe • Coupe-file
                            </span>
                          </div>
                        </div>
                        <span className="px-space-sm py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check</span> Droits MNP payés
                        </span>
                      </div>
                      <div className="bg-surface-container-low p-space-md rounded-md flex flex-col gap-space-xs mb-space-md">
                        <div className="flex justify-between font-body-sm text-body-sm">
                          <span className="text-on-surface-variant">Jour d'excursion :</span>
                          <span className="font-bold text-on-surface">17 Octobre 2024 (Départ 07:45)</span>
                        </div>
                        <div className="flex justify-between font-body-sm text-body-sm">
                          <span className="text-on-surface-variant">Programme inclus :</span>
                          <span className="font-bold text-on-surface text-right">
                            Traversée Pirogue • Circuit Forêt Noire • Déjeuner Tsara
                          </span>
                        </div>
                        <div className="flex justify-between font-body-sm text-body-sm">
                          <span className="text-on-surface-variant">Équipement fourni :</span>
                          <span className="font-bold text-on-surface">Gilets, jumelles ornitho, sacs étanches</span>
                        </div>
                      </div>
                      <div className="p-space-sm rounded bg-tertiary-fixed-dim/30 flex items-center gap-space-xs text-tertiary font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[18px]">info</span>
                        <span className="">Site sacré • Respect des coutumes Fady (vêtements longs recommandés en forêt).</span>
                      </div>
                    </div>
                    <div className="pt-space-md flex items-center justify-between">
                      <div className="font-label-sm text-label-sm text-on-surface-variant">
                        Pass Écotourisme # <span className="font-bold text-on-surface">MNP-LOK-0922</span>
                      </div>
                      <VoucherButton
                        className="h-10 px-space-md rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-space-xs transition-colors"
                        id="park"
                      >
                        <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span> Voir le Pass
                      </VoucherButton>
                    </div>
                  </div>
                </div>
              </section>

              <section className="flex flex-col gap-space-md">
                <div>
                  <div className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                    Outils Pratiques &amp; Immersion Culturelle
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">La Boîte à Outils du Voyageur Malgache</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-desktop">
                  <div className="p-space-lg rounded-lg bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-space-xs mb-space-md">
                        <span className="material-symbols-outlined text-primary text-[22px]">currency_exchange</span>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Convertisseur EUR / MGA</h3>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                        Taux indicatif :{" "}
                        <span className="font-semibold text-on-surface">
                          <RateLabel />
                        </span>
                        . Le calcul se fait sur votre téléphone, sans connexion.
                      </p>

                      <CarnetConverter />

                      <div className="p-space-sm rounded-md bg-surface-container-low flex flex-col gap-space-xs">
                        <span className="font-label-sm text-label-sm font-bold text-on-surface">Repères Pourboires d'usage :</span>
                        <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                          <span className="">Guide de Parc (journée) :</span>
                          <span className="font-semibold text-on-surface">30 000 - 50 000 Ar</span>
                        </div>
                        <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                          <span className="">Chauffeur 4x4 (journée) :</span>
                          <span className="font-semibold text-on-surface">20 000 - 40 000 Ar</span>
                        </div>
                        <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                          <span className="">Bagagiste / Piroguier :</span>
                          <span className="font-semibold text-on-surface">5 000 - 10 000 Ar</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-space-md text-center">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Distributeurs VISA disponibles à Hell-Ville</span>
                    </div>
                  </div>

                  <div className="p-space-lg rounded-lg bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-space-xs mb-space-md">
                        <span className="material-symbols-outlined text-secondary text-[22px]">diversity_3</span>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Coutumes Fady &amp; Lexique</h3>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                        Conseils de bon sens pour respecter l'esprit du <span className="font-bold text-secondary">Fihavanana</span> et les
                        traditions sacrées locales.
                      </p>

                      <div className="flex flex-col gap-space-xs mb-space-md">
                        <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase tracking-wider">
                          Quelques mots magiques :
                        </span>
                        <div className="p-space-xs rounded bg-surface-container-low flex items-center justify-between">
                          <div>
                            <span className="font-label-md text-label-md font-bold text-primary">Misaotra</span>
                            <span className="text-on-surface-variant text-body-sm"> (Mi-soo-tch')</span>
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface">Merci</span>
                        </div>
                        <div className="p-space-xs rounded bg-surface-container-low flex items-center justify-between">
                          <div>
                            <span className="font-label-md text-label-md font-bold text-primary">Akory Aby</span>
                            <span className="text-on-surface-variant text-body-sm"> (Salutation sakalava)</span>
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface">Bonjour à tous</span>
                        </div>
                        <div className="p-space-xs rounded bg-surface-container-low flex items-center justify-between">
                          <div>
                            <span className="font-label-md text-label-md font-bold text-primary">Mora Mora</span>
                            <span className="text-on-surface-variant text-body-sm"> (Art de vivre)</span>
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface">Doucement / Sans stress</span>
                        </div>
                      </div>

                      <div className="p-space-sm rounded bg-surface-container flex flex-col gap-space-xs">
                        <div className="flex items-center gap-space-xs text-tertiary font-label-sm text-label-sm font-bold">
                          <span className="material-symbols-outlined text-[16px]">warning</span>
                          <span className="">Fady (Interdits à respecter) :</span>
                        </div>
                        <ul className="font-body-sm text-body-sm text-on-surface-variant list-disc pl-4 space-y-1">
                          <li className="">Ne pas pointer du doigt les sépultures ancestrales (utiliser le poing fermé replié).</li>
                          <li className="">Demander l'autorisation avant de photographier les habitants du village.</li>
                          <li className="">Ne pas apporter de viande de porc près des arbres sacrés de l'île.</li>
                        </ul>
                      </div>
                    </div>
                    <div className="pt-space-md flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-secondary text-[16px]">health_and_safety</span>
                      <span className="">Répulsif moustiques &amp; crème solaire corallienne conseillés.</span>
                    </div>
                  </div>

                  <div className="p-space-lg rounded-lg bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-space-md">
                        <div className="flex items-center gap-space-xs">
                          <span className="material-symbols-outlined text-primary text-[22px]">map</span>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Carte Hors-Ligne</h3>
                        </div>
                        <span className="px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                          48 Mo • Prêt
                        </span>
                      </div>

                      <div
                        className="w-full h-36 rounded-md bg-cover bg-center relative overflow-hidden mb-space-md"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDkLsgxZClhaOQJ0MBH-Z0-kR3BsYVkYtDwF3jfagBuZph_PZcROimMkzEcofOsXul4Q1lyDGpAYS2QYVdKK1WS7mhW7fwHFqYhOrAhBAyZaRtnAr26koqOe5bGJ6pUtYUsdiuQpE2v0FgOugF3ujD0nE20qqyfDIK6FcnQrQj6gTHAYNUkszrZwTgEE5smHOQ5dsFqaRtAf9a3RORn56fHlX7hblk2CLI78_BwhNAoo8qwmdMU8aI')",
                        }}
                      >
                        <div className="absolute inset-0 bg-primary/10"></div>
                        <div className="absolute top-2 left-2 px-space-xs py-1 rounded bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface font-label-sm text-label-sm shadow-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[14px]">my_location</span>
                          <span className="">Nosy Be &amp; Îlots satellites</span>
                        </div>
                        <div className="absolute bottom-2 right-2 px-space-xs py-1 rounded bg-on-surface/80 text-surface-container-lowest font-label-sm text-label-sm">
                          12 POIs enregistrés
                        </div>
                      </div>

                      <div className="flex flex-col gap-space-xs">
                        <div className="flex items-center justify-between font-body-sm text-body-sm p-1.5 rounded hover:bg-surface-container-low transition-colors">
                          <div className="flex items-center gap-space-xs truncate">
                            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                            <span className="font-bold text-on-surface truncate">Mont Passot (Coucher de soleil)</span>
                          </div>
                          <span className="text-on-surface-variant text-label-sm flex-shrink-0">32 km</span>
                        </div>
                        <div className="flex items-center justify-between font-body-sm text-body-sm p-1.5 rounded hover:bg-surface-container-low transition-colors">
                          <div className="flex items-center gap-space-xs truncate">
                            <span className="w-2 h-2 rounded-full bg-secondary"></span>
                            <span className="font-bold text-on-surface truncate">Forêt Primaire de Lokobe</span>
                          </div>
                          <span className="text-on-surface-variant text-label-sm flex-shrink-0">14 km</span>
                        </div>
                        <div className="flex items-center justify-between font-body-sm text-body-sm p-1.5 rounded hover:bg-surface-container-low transition-colors">
                          <div className="flex items-center gap-space-xs truncate">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            <span className="font-bold text-on-surface truncate">Nosy Tanikely (Parc Marin)</span>
                          </div>
                          <span className="text-on-surface-variant text-label-sm flex-shrink-0">Excursion bateau</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-space-md">
                      <a
                        className="w-full h-11 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-space-xs transition-colors"
                        href="https://www.google.com/maps/search/?api=1&query=Nosy+Be+Madagascar"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span className="material-symbols-outlined text-[18px]">near_me</span> Ouvrir la Carte GPS Intégrale
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              <div className="p-space-lg rounded-lg bg-surface-container-high flex flex-col md:flex-row items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">energy_savings_leaf</span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">Engagement Zéro Papier MadaVoyage</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Inutile d'imprimer vos bons d'échange. Présentez simplement vos QR codes sur smartphone auprès de nos partenaires
                      locaux certifiés.
                    </p>
                  </div>
                </div>
                <Link
                  className="px-space-lg py-space-sm rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface transition-colors flex-shrink-0"
                  href="/engagement"
                >
                  En savoir plus sur notre charte
                </Link>
              </div>
            </CarnetPanels>
          </div>
        </div>
      </CarnetProvider>
    </main>
  );
}
