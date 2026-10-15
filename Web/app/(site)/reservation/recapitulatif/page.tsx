"use client";

import Link from "next/link";
import { useState } from "react";
import { balanceDateLabel, useQuote } from "@/components/reservation/BookingBits";
import { travelersLongLabel } from "@/components/reservation/booking-store";
import { confirmWithServer } from "@/components/reservation/quote-api";
import { CheckedLink, FieldError, FormCheck, FormErrorSummary } from "@/components/reservation/FormCheck";
import { useMoney } from "@/components/currency/useCurrency";
import { DESTINATIONS, DOSSIER, HOTELS } from "@/components/reservation/pricing";
import { QuoteSummaryCard } from "@/components/reservation/QuoteSummary";
import { CANCELLATION, PAYMENT_FEES } from "@/lib/site";

export default function Page() {
  const [method, setMethod] = useState<"card" | "mobilemoney" | "installment" | "transfer">("card");
  const { booking, q } = useQuote();
  const { eur, mga } = useMoney();
  const destination = DESTINATIONS[booking.destination];
  const payDeposit = method === "installment";
  const payAmount = payDeposit ? q.deposit : q.total;
  return (
    <>
      <FormCheck>
        <main className="w-full pt-20 bg-surface min-h-[calc(100vh-20rem)]">
          <h1 className="sr-only">Récapitulatif et paiement de votre réservation</h1>
          <div className="flex flex-col w-full">
            <div className="max-w-[80rem] mx-auto px-margin-desktop py-space-lg w-full">
              <div className="w-full bg-surface-container-low rounded-lg p-space-md mb-space-xl shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-end gap-space-md">
                  <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm self-start md:self-auto">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    Chiffrement bancaire TLS 256-bit vérifié
                  </div>
                </div>

                <div className="mt-space-md pt-space-md">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-surface-container-high rounded-full -z-0">
                      <div className="h-full bg-primary rounded-full transition-all duration-500 w-[92%]"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <Link
                        className="mt-2 font-label-sm text-label-sm text-on-surface text-center hidden sm:block hover:text-primary hover:underline after:absolute after:inset-0"
                        href="/reservation/dates"
                      >
                        1. Séjour
                      </Link>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <Link
                        className="mt-2 font-label-sm text-label-sm text-on-surface text-center hidden sm:block hover:text-primary hover:underline after:absolute after:inset-0"
                        href="/reservation/destination"
                      >
                        2. Destination
                      </Link>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <Link
                        className="mt-2 font-label-sm text-label-sm text-on-surface text-center hidden sm:block hover:text-primary hover:underline after:absolute after:inset-0"
                        href="/reservation/budget"
                      >
                        3. Budget
                      </Link>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <Link
                        className="mt-2 font-label-sm text-label-sm text-on-surface text-center hidden sm:block hover:text-primary hover:underline after:absolute after:inset-0"
                        href="/reservation/composition"
                      >
                        4. Offre
                      </Link>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-surface-container-lowest text-primary ring-4 ring-primary/20 flex items-center justify-center font-bold shadow-md">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                      </div>
                      <span className="mt-2 font-label-sm text-label-sm text-primary font-bold text-center">5. Paiement</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
                <div className="lg:col-span-7 flex flex-col gap-space-xl">
                  <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm">
                    <div className="flex items-center justify-between pb-space-md">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">badge</span>
                        </div>
                        <div>
                          <h2 className="font-headline-sm text-headline-sm text-on-surface">Coordonnées du voyageur principal</h2>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Pour l'émission des billets d'avion Madagascar Airlines et vouchers hôteliers
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
                        <span className="material-symbols-outlined text-[14px]">format_image_left</span> Vérifié
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      Vol intérieur ou plusieurs voyageurs ?{" "}
                      <Link className="font-bold text-primary hover:underline" href="/reservation/paiement">
                        Renseigner les passeports de chaque voyageur
                      </Link>
                    </p>

                    <div className="bg-surface-container-low p-1 rounded-full inline-flex items-center mb-space-md">
                      <button
                        className="px-space-md py-1.5 rounded-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm transition-all"
                        type="button"
                      >
                        Invité express
                      </button>
                      <button
                        className="px-space-md py-1.5 rounded-full text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-all"
                        type="button"
                      >
                        Connexion compte MadaVoyage
                      </button>
                    </div>
                    <form className="space-y-space-md">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                        <div>
                          <label htmlFor="civility" className="block font-label-sm text-label-sm text-on-surface mb-1">
                            Civilité
                          </label>
                          <div className="relative">
                            <select
                              id="civility"
                              name="civility"
                              className="w-full h-[52px] bg-surface-container-low rounded px-space-md font-body-md text-on-surface appearance-none focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
                            >
                              <option>M.</option>
                              <option>Mme</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[20px]">
                              expand_more
                            </span>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="firstName" className="block font-label-sm text-label-sm text-on-surface mb-1">
                            Prénom
                          </label>
                          <input
                            id="firstName"
                            name="firstName"
                            data-rule="name"
                            aria-describedby="firstName-error"
                            autoComplete="given-name"
                            className="w-full h-[52px] bg-surface-container-low rounded px-space-md font-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
                            type="text"
                            defaultValue="Alexandre"
                          />
                          <FieldError name="firstName" />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block font-label-sm text-label-sm text-on-surface mb-1">
                            Nom de famille
                          </label>
                          <input
                            id="lastName"
                            name="lastName"
                            data-rule="name"
                            aria-describedby="lastName-error"
                            autoComplete="family-name"
                            className="w-full h-[52px] bg-surface-container-low rounded px-space-md font-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
                            type="text"
                            defaultValue="Fontaine"
                          />
                          <FieldError name="lastName" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                        <div>
                          <label htmlFor="email" className="block font-label-sm text-label-sm text-on-surface mb-1">
                            Adresse email (envoi du carnet de voyage)
                          </label>
                          <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                              mail
                            </span>
                            <input
                              id="email"
                              name="email"
                              data-rule="email"
                              aria-describedby="email-error"
                              autoComplete="email"
                              className="w-full h-[52px] pl-10 pr-space-md bg-surface-container-low rounded font-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
                              type="email"
                              defaultValue="alexandre.fontaine@voyageur.fr"
                            />
                          </div>
                          <FieldError name="email" />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block font-label-sm text-label-sm text-on-surface mb-1">
                            Téléphone mobile (alertes WhatsApp &amp; vols)
                          </label>
                          <div className="flex gap-2">
                            <div className="w-28 relative">
                              <select
                                aria-label="Indicatif téléphonique"
                                className="w-full h-[52px] bg-surface-container-low rounded px-space-sm font-body-md text-on-surface appearance-none focus:outline-none focus:bg-surface-container-lowest"
                              >
                                <option>🇫🇷 +33</option>
                                <option>🇲🇬 +261</option>
                                <option>🇧🇪 +32</option>
                                <option>🇨🇭 +41</option>
                              </select>
                              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">
                                expand_more
                              </span>
                            </div>
                            <input
                              id="phone"
                              name="phone"
                              data-rule="phone"
                              aria-describedby="phone-error"
                              autoComplete="tel-national"
                              className="flex-1 h-[52px] px-space-md bg-surface-container-low rounded font-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
                              type="tel"
                              defaultValue="06 48 92 11 05"
                            />
                          </div>
                          <FieldError name="phone" />
                        </div>
                      </div>
                      <div className="pt-2 flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
                        <span>{travelersLongLabel(booking)} inclus dans cette réservation. Passeports valides &gt; 6 mois requis.</span>
                      </div>
                    </form>
                  </div>

                  <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm">
                    <div className="flex items-center justify-between pb-space-md">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-9 h-9 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">payments</span>
                        </div>
                        <div>
                          <h2 className="font-headline-sm text-headline-sm text-on-surface">Modalités de règlement sécurisé</h2>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{PAYMENT_FEES}</p>
                        </div>
                      </div>
                      <span className="font-label-sm text-label-sm text-primary-container font-bold bg-primary/10 px-3 py-1 rounded-full">
                        Norme PCI-DSS
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm mb-space-lg" id="paymentTabContainer">
                      <button
                        className={`payment-method-btn flex flex-col items-center justify-center p-space-md rounded transition-all text-center ${method === "card" ? "bg-primary/10 text-primary" : "bg-surface-container-low hover:bg-surface-container text-on-surface"}`}
                        aria-pressed={method === "card"}
                        onClick={() => setMethod("card")}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[26px] mb-1">credit_card</span>
                        <span className="font-label-sm text-label-sm font-bold">Carte Bancaire</span>
                        <span className="text-[10px] text-on-surface-variant mt-0.5">Visa, MC, Amex</span>
                      </button>
                      <button
                        className={`payment-method-btn flex flex-col items-center justify-center p-space-md rounded transition-all text-center ${method === "mobilemoney" ? "bg-primary/10 text-primary" : "bg-surface-container-low hover:bg-surface-container text-on-surface"}`}
                        aria-pressed={method === "mobilemoney"}
                        onClick={() => setMethod("mobilemoney")}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[26px] mb-1 text-secondary">phone_iphone</span>
                        <span className="font-label-sm text-label-sm font-bold">Mobile Money</span>
                        <span className="text-[10px] text-secondary mt-0.5 font-bold">MVola / Orange</span>
                      </button>
                      <button
                        className={`payment-method-btn flex flex-col items-center justify-center p-space-md rounded transition-all text-center ${method === "installment" ? "bg-primary/10 text-primary" : "bg-surface-container-low hover:bg-surface-container text-on-surface"}`}
                        aria-pressed={method === "installment"}
                        onClick={() => setMethod("installment")}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[26px] mb-1 text-tertiary-container">pie_chart</span>
                        <span className="font-label-sm text-label-sm font-bold">Acompte 30%</span>
                        <span className="text-[10px] text-on-surface-variant mt-0.5">{eur(q.deposit, true)} auj.</span>
                      </button>
                      <button
                        className={`payment-method-btn flex flex-col items-center justify-center p-space-md rounded transition-all text-center ${method === "transfer" ? "bg-primary/10 text-primary" : "bg-surface-container-low hover:bg-surface-container text-on-surface"}`}
                        aria-pressed={method === "transfer"}
                        onClick={() => setMethod("transfer")}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[26px] mb-1 text-on-surface-variant">account_balance</span>
                        <span className="font-label-sm text-label-sm font-bold">Virement</span>
                        <span className="text-[10px] text-on-surface-variant mt-0.5">SEPA ou BNI/BOA</span>
                      </button>
                    </div>

                    <div className={`payment-view flex-col gap-space-md ${method === "card" ? "flex" : "hidden"}`} id="method-card">
                      <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded">
                        <div className="flex items-center gap-space-sm">
                          <span className="material-symbols-outlined text-primary text-[20px]">credit_card_heart</span>
                          <span className="font-body-sm text-body-sm text-on-surface font-medium">
                            Débit sécurisé en Euros (EUR) ou conversion dynamique
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                          <span className="px-2 py-0.5 rounded bg-surface-container-lowest font-bold shadow-xs">VISA</span>
                          <span className="px-2 py-0.5 rounded bg-surface-container-lowest font-bold shadow-xs">MC</span>
                          <span className="px-2 py-0.5 rounded bg-surface-container-lowest font-bold shadow-xs">AMEX</span>
                        </div>
                      </div>
                      <div className="space-y-space-md">
                        <div>
                          <label htmlFor="cardName" className="block font-label-sm text-label-sm text-on-surface mb-1">
                            Nom figurant sur la carte
                          </label>
                          <input
                            id="cardName"
                            name="cardName"
                            data-rule="name"
                            aria-describedby="cardName-error"
                            autoComplete="cc-name"
                            className="w-full h-[52px] bg-surface-container-low rounded px-space-md font-body-md text-on-surface uppercase focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
                            placeholder="ALEXANDRE FONTAINE"
                            type="text"
                          />
                          <FieldError name="cardName" />
                        </div>
                        <div>
                          <label htmlFor="cardNumber" className="block font-label-sm text-label-sm text-on-surface mb-1">
                            Numéro de carte bancaire
                          </label>
                          <div className="relative">
                            <input
                              id="cardNumber"
                              name="cardNumber"
                              data-rule="card"
                              aria-describedby="cardNumber-error"
                              autoComplete="cc-number"
                              inputMode="numeric"
                              className="w-full h-[52px] bg-surface-container-low rounded px-space-md font-body-md text-on-surface tracking-wider focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
                              placeholder="4532 •••• •••• 8841"
                              type="text"
                            />
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary text-[22px]">
                              lock
                            </span>
                          </div>
                          <FieldError name="cardNumber" />
                        </div>
                        <div className="grid grid-cols-2 gap-space-md">
                          <div>
                            <label htmlFor="cardExpiry" className="block font-label-sm text-label-sm text-on-surface mb-1">
                              Date d'expiration
                            </label>
                            <input
                              id="cardExpiry"
                              name="cardExpiry"
                              data-rule="cardExpiry"
                              aria-describedby="cardExpiry-error"
                              autoComplete="cc-exp"
                              inputMode="numeric"
                              className="w-full h-[52px] bg-surface-container-low rounded px-space-md font-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
                              placeholder="MM / AA"
                              type="text"
                            />
                            <FieldError name="cardExpiry" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label htmlFor="cvv" className="font-label-sm text-label-sm text-on-surface">
                                Cryptogramme (CVV)
                              </label>
                              <span
                                className="text-xs text-primary cursor-pointer flex items-center gap-0.5"
                                title="3 chiffres au dos de la carte (4 chiffres sur l'avant pour Amex)"
                              >
                                <span className="material-symbols-outlined text-[14px]">help</span> 3 chiffres
                              </span>
                            </div>
                            <input
                              id="cvv"
                              name="cvv"
                              data-rule="cvv"
                              aria-describedby="cvv-error"
                              autoComplete="cc-csc"
                              inputMode="numeric"
                              className="w-full h-[52px] bg-surface-container-low rounded px-space-md font-body-md text-on-surface tracking-widest focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
                              maxLength={4}
                              placeholder="•••"
                              type="password"
                            />
                            <FieldError name="cvv" />
                          </div>
                        </div>

                        <div className="p-space-md bg-secondary/5 rounded flex items-center justify-between">
                          <div className="flex items-center gap-space-sm">
                            <input
                              className="w-5 h-5 rounded text-secondary focus:ring-secondary accent-secondary"
                              id="splitPay"
                              type="checkbox"
                            />
                            <label className="font-label-sm text-label-sm text-on-surface cursor-pointer" htmlFor="splitPay">
                              Régler en <span className="font-bold text-secondary">3x sans frais</span> par carte (
                              {eur(Math.round((q.total / 3) * 100) / 100, true)} / mois)
                            </label>
                          </div>
                          <span className="font-label-sm text-label-sm text-secondary font-bold">0% d'intérêts</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`payment-view flex-col gap-space-md ${method === "mobilemoney" ? "flex" : "hidden"}`}
                      id="method-mobilemoney"
                    >
                      <div className="p-space-md bg-secondary/10 rounded text-on-surface">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-label-md text-label-md text-secondary font-bold">
                            Règlement local instantané en Ariary (MGA)
                          </span>
                          <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary text-on-secondary">
                            Taux du jour
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Montant converti : <strong className="text-on-surface font-headline-sm text-headline-sm">{mga(q.total)}</strong>.
                          Aucun frais de commission bancaire internationale appliqué par votre opérateur.
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-space-sm">
                        <label className="flex flex-col items-center p-3 rounded bg-surface-container-low hover:bg-surface-container cursor-pointer">
                          <input className="accent-secondary mb-1" name="mobileOp" type="radio" defaultChecked />
                          <span className="font-label-sm text-label-sm font-bold text-secondary">MVola</span>
                          <span className="text-[11px] text-on-surface-variant">Telma Madagascar</span>
                        </label>
                        <label className="flex flex-col items-center p-3 rounded bg-surface-container-low hover:bg-surface-container cursor-pointer">
                          <input className="accent-secondary mb-1" name="mobileOp" type="radio" />
                          <span className="font-label-sm text-label-sm font-bold text-[#ea580c]">Orange Money</span>
                          <span className="text-[11px] text-on-surface-variant">Orange Mada</span>
                        </label>
                        <label className="flex flex-col items-center p-3 rounded bg-surface-container-low hover:bg-surface-container cursor-pointer">
                          <input className="accent-secondary mb-1" name="mobileOp" type="radio" />
                          <span className="font-label-sm text-label-sm font-bold text-error">Airtel Money</span>
                          <span className="text-[11px] text-on-surface-variant">Airtel Mada</span>
                        </label>
                      </div>
                      <div>
                        <label htmlFor="mobileNumber" className="block font-label-sm text-label-sm text-on-surface mb-1">
                          Numéro Mobile Money (+261)
                        </label>
                        <div className="relative">
                          <input
                            id="mobileNumber"
                            name="mobileNumber"
                            data-rule="mobileMoney"
                            aria-describedby="mobileNumber-error"
                            inputMode="tel"
                            className="w-full h-[52px] bg-surface-container-low rounded px-space-md font-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20"
                            placeholder="034 XX XXX XX ou 032 XX XXX XX"
                            type="tel"
                          />
                          <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-space-md py-1.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm"
                            type="button"
                          >
                            Générer push USSD / QR
                          </button>
                        </div>
                        <FieldError name="mobileNumber" />
                        <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                          Une notification d'autorisation directe avec code secret PIN vous sera envoyée sur votre combiné.
                        </p>
                      </div>
                    </div>

                    <div
                      className={`payment-view flex-col gap-space-md ${method === "installment" ? "flex" : "hidden"}`}
                      id="method-installment"
                    >
                      <div className="p-space-md bg-surface-container-low rounded">
                        <h4 className="font-label-md text-label-md text-on-surface font-bold mb-2">Échéancier de réservation flexible</h4>
                        <div className="space-y-3 font-body-sm text-body-sm">
                          <div className="flex items-center justify-between p-2 rounded bg-surface-container-lowest">
                            <div className="">
                              <span className="font-bold text-tertiary">1er versement (aujourd'hui) :</span> Acompte de confirmation 30%
                            </div>
                            <span className="font-bold font-headline-sm text-headline-sm text-tertiary">{eur(q.deposit, true)}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded bg-surface-container-lowest">
                            <div className="">
                              <span className="font-bold text-on-surface">Solde restant (automatique à J-15) :</span> Prélèvement le{" "}
                              {balanceDateLabel(booking)}
                            </div>
                            <span className="font-bold font-headline-sm text-headline-sm text-on-surface">{eur(q.balance, true)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Sécurisez vos chambres au {HOTELS[booking.hotel].name} et vos vols intérieurs Madagascar Airlines sans immobiliser la totalité
                        de votre budget vacances.
                      </p>
                    </div>

                    <div className={`payment-view flex-col gap-space-md ${method === "transfer" ? "flex" : "hidden"}`} id="method-transfer">
                      <div className="p-space-md bg-surface-container-low rounded font-body-sm text-body-sm text-on-surface">
                        <p className="mb-2">
                          <strong>Comptes séquestres officiels MadaVoyage S.A. :</strong>
                        </p>
                        <div className="space-y-2">
                          <div className="p-2 bg-surface-container-lowest rounded font-mono text-xs">
                            <strong>Zone SEPA (EUR) :</strong> FR76 3000 4001 2300 0123 4567 890 (BIC : BNPAFRPP)
                          </div>
                          <div className="p-2 bg-surface-container-lowest rounded font-mono text-xs">
                            <strong>Madagascar (MGA) :</strong> BNI Madagascar - RIB : 00005 02001 01234567890 42
                          </div>
                        </div>
                        <p className="mt-2 text-on-surface-variant text-xs">
                          Référence de virement à indiquer impérativement : <strong>{DOSSIER}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                      <div className="flex items-start gap-space-sm p-space-sm bg-surface-container-low rounded">
                        <span className="material-symbols-outlined text-secondary text-[24px]">event_available</span>
                        <div>
                          <h4 className="font-label-sm text-label-sm text-on-surface font-bold">{CANCELLATION.short}</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5">
                            {CANCELLATION.free} {CANCELLATION.late}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-sm p-space-sm bg-surface-container-low rounded">
                        <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
                        <div>
                          <h4 className="font-label-sm text-label-sm text-on-surface font-bold">Agrément ONTM</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5">
                            Opérateur officiel certifié Office du Tourisme de Madagascar.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-sm p-space-sm bg-surface-container-low rounded">
                        <span className="material-symbols-outlined text-secondary text-[24px]">nature_people</span>
                        <div>
                          <h4 className="font-label-sm text-label-sm text-on-surface font-bold">Fonds Fihavanana (1%)</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5">
                            {eur(q.impact, true)} reversés pour le reboisement et la faune d'Andasibe.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-space-sm">
                      <CheckedLink
                        className="w-full h-14 rounded-full bg-tertiary hover:bg-on-tertiary-fixed-variant text-on-tertiary flex items-center justify-center gap-space-sm font-label-lg text-label-lg transition-transform active:scale-98 shadow-[0_4px_14px_rgba(167,57,30,0.35)] cursor-pointer"
                        href="/reservation/otp"
                        confirm={() => confirmWithServer(booking, payDeposit ? "deposit" : "total", payAmount)}
                      >
                        <span className="material-symbols-outlined text-[22px]">lock_open</span>
                        <span>
                          {payDeposit
                            ? `Confirmer et régler l'acompte de ${eur(payAmount, true)}`
                            : `Confirmer et Régler ${eur(payAmount)} en toute sécurité`}
                        </span>
                      </CheckedLink>
                      <FormErrorSummary />
                      <div className="flex flex-wrap items-center justify-center gap-x-space-md gap-y-1 text-on-surface-variant font-body-sm text-body-sm text-xs text-center">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-secondary">check_circle</span> Connexion SSL 256 bits
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-secondary">check_circle</span> Confirmation immédiate
                          par SMS &amp; email
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-secondary">check_circle</span> Vouchers
                          téléchargeables en 1 clic
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-space-lg">
                  <QuoteSummaryCard />

                  <div className="p-space-md bg-surface-container-low rounded flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[18px]">eco</span>
                      Voyage carbone compensé à 100%
                    </span>
                    <Link className="text-primary hover:underline font-bold" href="/engagement">
                      Consulter la charte
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </FormCheck>
    </>
  );
}
