import type { Metadata } from "next";
import Link from "next/link";
import { PHONE, WHATSAPP } from "@/lib/site";
import { BookingText } from "@/components/reservation/BookingBits";
import RateLabel from "@/components/currency/RateLabel";
import OtpVerification from "@/components/reservation/OtpVerification";

export const metadata: Metadata = {
  title: "Étape 5 · Validation du paiement | Réservation MadaVoyage",
  description: "Saisissez le code reçu pour valider votre paiement Mobile Money.",
  robots: { index: false },
};

export default function Page() {
  return (
    <>
      <main className="w-full pt-20 bg-background">
        <h1 className="sr-only">Réservation, étape 5 : validation du paiement</h1>
        <div className="max-w-[1280px] mx-auto px-gutter-desktop min-h-[calc(100vh-80px)]">
          <div className="flex flex-col w-full">
            <div className="py-space-md flex flex-wrap items-center justify-end gap-space-sm">
              <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm shadow-sm">
                <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
                <span>Passerelle Sécurisée TLS 256-Bit · BCM Certifiée</span>
              </div>
            </div>

            <section className="mb-space-xl pt-space-xs">
              <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm">
                <div className="relative flex items-center justify-between max-w-4xl mx-auto">
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-surface-container-high rounded-full z-0"></div>

                  <div className="absolute left-6 w-[calc(100%-3rem)] top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-secondary via-primary to-primary-container rounded-full z-0"></div>

                  <div className="relative z-10 flex flex-col items-center gap-1.5 group">
                    <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </div>
                    <Link
                      className="font-label-sm text-label-sm text-on-surface font-semibold hidden md:block hover:text-primary hover:underline after:absolute after:inset-0"
                      href="/reservation/dates"
                    >
                      1. Séjour
                    </Link>
                    <span className="font-body-sm text-body-sm text-secondary font-medium hidden md:block">Validé</span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center gap-1.5 group">
                    <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </div>
                    <Link
                      className="font-label-sm text-label-sm text-on-surface font-semibold hidden md:block hover:text-primary hover:underline after:absolute after:inset-0"
                      href="/reservation/destination"
                    >
                      2. Destination
                    </Link>
                    <span className="font-body-sm text-body-sm text-secondary font-medium hidden md:block">Validé</span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center gap-1.5 group">
                    <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </div>
                    <Link
                      className="font-label-sm text-label-sm text-on-surface font-semibold hidden md:block hover:text-primary hover:underline after:absolute after:inset-0"
                      href="/reservation/budget"
                    >
                      3. Budget
                    </Link>
                    <span className="font-body-sm text-body-sm text-secondary font-medium hidden md:block">Validé</span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center gap-1.5 group">
                    <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </div>
                    <Link
                      className="font-label-sm text-label-sm text-on-surface font-semibold hidden md:block hover:text-primary hover:underline after:absolute after:inset-0"
                      href="/reservation/composition"
                    >
                      4. Offre
                    </Link>
                    <span className="font-body-sm text-body-sm text-secondary font-medium hidden md:block">Validé</span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center gap-1.5">
                    <div className="w-11 h-11 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-lg ring-4 ring-primary/20 scale-105">
                      <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm text-primary font-bold hidden md:block">5. Paiement</span>
                    <span className="font-body-sm text-body-sm text-tertiary-container font-semibold hidden md:block">
                      Validation OTP en cours
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start pb-space-xl">
              <div className="lg:col-span-8 flex flex-col gap-space-lg">
                <div className="bg-surface-container-lowest rounded-lg p-space-lg md:p-space-xl shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-lg gap-space-md bg-surface-container-low/50 -mx-space-lg md:-mx-space-xl -mt-space-lg md:-mt-space-xl p-space-lg md:p-space-xl rounded-t-lg">
                    <div className="flex items-center gap-space-md">
                      <div className="w-14 h-14 rounded-2xl bg-[#ffcc00] flex items-center justify-center font-display-lg text-headline-sm font-extrabold text-[#111111] shadow-inner shrink-0">
                        mV
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-headline-md text-headline-md font-bold text-on-surface">MVola Madagascar</span>
                          <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-bold">
                            Groupe Axian / Telma
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Règlement instantané sécurisé par monnaie électronique
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-semibold shrink-0">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        account_balance
                      </span>
                      <span>Agrément BCM N°2021-08</span>
                    </div>
                  </div>

                  <div className="mt-space-lg grid grid-cols-1 sm:grid-cols-3 gap-space-md p-space-md rounded bg-surface-container-low">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        Référence Session
                      </span>
                      <span className="font-label-md text-label-md text-on-surface font-bold tracking-tight">#TRX-MDV-8902-MVOLA</span>
                      <span className="font-body-sm text-body-sm text-secondary flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        Session active &amp; cryptée
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Compte Débité</span>
                      <span className="font-label-md text-label-md text-primary font-bold">+261 34 82 110 50</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Titulaire : ALEXANDRE FONTAINE</span>
                    </div>
                    <div className="flex flex-col sm:text-right">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        <BookingText field="payNowLabel" />
                      </span>
                      <div className="flex items-baseline sm:justify-end gap-1">
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">
                          <BookingText field="payNowMga" />
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        <BookingText field="payNow" /> · <RateLabel />
                      </span>
                    </div>
                  </div>

                  <div className="mt-space-lg">
                    <h2 className="font-label-lg text-label-lg text-on-surface font-bold flex items-center gap-space-xs mb-space-md">
                      <span className="material-symbols-outlined text-primary text-[20px]">phonelink_ring</span>
                      Protocole de Confirmation sur votre Mobile
                    </h2>
                    <div className="space-y-space-sm">
                      <div className="flex items-start gap-space-md p-space-md rounded bg-surface hover:bg-surface-container-low transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label-md text-label-md font-bold shrink-0 mt-0.5">
                          1
                        </div>
                        <div className="flex-1">
                          <p className="font-body-md text-body-md text-on-surface font-semibold">
                            Notification Push USSD automatique transmise
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                            Une invite interactive s'est affichée sur votre écran tactile pour le terminal mobile{" "}
                            <strong className="text-on-surface">+261 34 82 110 50</strong>.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-md p-space-md rounded bg-surface hover:bg-surface-container-low transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label-md text-label-md font-bold shrink-0 mt-0.5">
                          2
                        </div>
                        <div className="flex-1">
                          <p className="font-body-md text-body-md text-on-surface font-semibold">
                            Alternative en cas d'absence d'écran de validation
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                            Si le pop-up ne surgit pas, composez manuellement le code USSD{" "}
                            <kbd className="px-2 py-0.5 rounded bg-surface-container font-mono text-on-surface font-bold text-xs">
                              *899#
                            </kbd>{" "}
                            puis saisissez votre code secret MVola habituel.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-md p-space-md rounded bg-surface hover:bg-surface-container-low transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label-md text-label-md font-bold shrink-0 mt-0.5">
                          3
                        </div>
                        <div className="flex-1">
                          <p className="font-body-md text-body-md text-on-surface font-semibold">
                            Saisie du code OTP sécurisé à 6 chiffres
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                            Insérez ci-dessous le code numérique unique reçu par SMS de l'expéditeur officiel{" "}
                            <strong className="text-on-surface">MVOLA_INFO</strong> pour ordonner la séquestration légale des fonds.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <OtpVerification amountLabel={<BookingText field="payNowMga" />} />

                  <div className="mt-space-lg pt-space-md flex items-center justify-center gap-2 text-center text-on-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                    <span>Vos fonds restent cantonnés sur le compte séquestre MadaVoyage / BMOI jusqu'à la validation d'embarquement.</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div className="p-space-md rounded bg-surface-container-low flex items-start gap-space-sm">
                    <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">security_update_good</span>
                    <div>
                      <h4 className="font-label-md text-label-md font-bold text-on-surface">Plafonds Mobile Money</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        MVola permet des transactions jusqu'à 5 000 000 Ar par opération avec un compte KYC vérifié de niveau 2 ou 3.
                      </p>
                    </div>
                  </div>
                  <div className="p-space-md rounded bg-surface-container-low flex items-start gap-space-sm">
                    <span className="material-symbols-outlined text-secondary text-[24px] shrink-0 mt-0.5">receipt_long</span>
                    <div>
                      <h4 className="font-label-md text-label-md font-bold text-on-surface">Facture &amp; Quittance Électronique</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Dès validation du code, votre quittance certifiée fiscale et vos vouchers hôteliers sont transmis sur votre boîte
                        email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-space-lg lg:sticky lg:top-24">
                <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-md overflow-hidden relative">
                  <div className="flex items-center justify-between pb-space-sm mb-space-md">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                      Dossier de Voyage
                    </span>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                      #MDV-2026-8902
                    </span>
                  </div>

                  <div className="relative h-36 rounded overflow-hidden mb-space-md group">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3Vqg6XfeOeaK0ZcCMRRsZ2rP0IGl5KOmmRKcj7X8jgfjX04VyRt0L_OBfXWdsAGcAi5JRsFVBxP_vOrdd5SdNLmaKVN50eQL3pqLQdUSdIdLsVmh7cLdqIo7Unm8KCD2R61LKXbyuBp-7zSx0PzANrupZgC6bALFjFkcyn11EdpY6K0OaFNjFt_0OIvptbl1DtDs-O7senxcbSjtHhoNEMNGujDanDX2UfMYTugFCahqfXJ1Pq5A"
                      alt="Bungalow écolodge en bois sur les collines côtières de Nosy Be, face à une baie turquoise"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-space-md text-white">
                      <span className="font-label-sm text-label-sm font-semibold text-secondary-fixed">
                        <BookingText field="destination" />
                      </span>
                      <span className="font-headline-sm text-headline-sm font-bold text-white">
                        <BookingText field="longRange" />
                      </span>
                    </div>
                  </div>

                  <div className="space-y-space-sm">
                    <div className="flex items-start gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">hotel</span>
                      <div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant block">Hébergement réservé</span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          <BookingText field="hotel" />
                        </span>
                        <span className="font-body-sm text-body-sm text-secondary font-medium block">
                          <BookingText field="hotelDetail" />
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-space-xs pt-space-xs">
                      <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">group</span>
                      <div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant block">
                          Voyageurs enregistrés (<BookingText field="count" />)
                        </span>
                        <span className="font-label-md text-label-md text-on-surface font-semibold block">
                          <BookingText field="travelersLong" />
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-space-xs pt-space-xs">
                      <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">calendar_month</span>
                      <div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant block">Durée du séjour</span>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          <BookingText field="duration" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-space-md pt-space-md bg-surface-container-low -mx-space-lg px-space-lg pb-space-sm rounded-b-lg">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                        <span>Montant Total du Séjour</span>
                        <span className="font-semibold text-on-surface">
                          <BookingText field="totalCents" /> (~ <BookingText field="totalMga" />)
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-body-md text-body-md text-secondary font-bold">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          <BookingText field="payNowLabel" />
                        </span>
                        <span>
                          <BookingText field="payNow" /> (<BookingText field="payNowMga" />)
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant pt-1">
                        <span>Solde restant</span>
                        <span className="font-bold text-on-surface">
                          <BookingText field="remaining" />
                        </span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-outline mt-space-sm italic">
                      * Solde prélevé automatiquement à J-15 avant départ (<BookingText field="balanceDate" />) ou réglable sur place en
                      devises selon conditions.
                    </p>
                  </div>
                </div>

                <div className="p-space-lg rounded-lg bg-surface-container text-on-surface flex flex-col gap-space-sm shadow-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">support_agent</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-label-md font-bold text-on-surface">Assistance Telco &amp; Urgence</h4>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Équipe opérationnelle basée à Tana</span>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Un souci lors de la réception du Push ou de votre code SMS MVola ? Notre conciergerie prend en charge votre transaction
                    en direct.
                  </p>
                  <div className="flex flex-col gap-2 pt-1">
                    <a
                      className="inline-flex items-center gap-2 font-label-md text-label-md font-bold text-primary hover:text-on-primary-container transition-colors"
                      href={PHONE.href}
                    >
                      <span className="material-symbols-outlined text-[18px]">call</span>
                      {PHONE.display} (ligne directe)
                    </a>
                    <a
                      className="inline-flex items-center gap-2 font-label-md text-label-md font-bold text-secondary hover:text-on-secondary-container transition-colors"
                      href={WHATSAPP.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      WhatsApp Conciergerie : {WHATSAPP.display}
                    </a>
                  </div>
                </div>

                <div className="px-space-md py-space-sm rounded bg-surface-container-low text-on-surface-variant flex items-center gap-space-sm text-xs">
                  <span className="material-symbols-outlined text-secondary text-[22px] shrink-0">nature_people</span>
                  <p className="font-body-sm text-body-sm leading-snug">
                    <strong>Fihavanana Solidaire :</strong> 1% de cet acompte est automatiquement reversé au comité villageois de Lokobe
                    pour la protection des lémuriens endémiques.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
