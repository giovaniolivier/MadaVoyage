import type { Metadata } from "next";
import { EMERGENCY, SUPPORT_HOURS } from "@/lib/site";
import { FaqFilterProvider } from "@/components/aide/FaqFilterContext";
import FaqSearch from "@/components/aide/FaqSearch";
import FaqBrowser from "@/components/aide/FaqBrowser";
import CurrencyConverter from "@/components/aide/CurrencyConverter";
import ContactCards from "@/components/aide/ContactCards";
import ConciergeChat from "@/components/aide/ConciergeChat";
import TravelStatus from "@/components/aide/TravelStatus";
import EmergencySteps from "@/components/aide/EmergencySteps";
import { SupportHours } from "@/components/aide/SupportStatus";

export const metadata: Metadata = {
  title: "Centre d'aide et assistance voyageurs — MadaVoyage",
  description: `FAQ voyageurs (visa, santé, Ariary, Mobile Money, météo marine), assistance par WhatsApp et téléphone ${SUPPORT_HOURS.long.toLowerCase()}, urgence 24 h/24 sur place.`,
};

export default function Page() {
  return (
    <FaqFilterProvider>
      <main className="flex-1 w-full pt-20 bg-surface">
        <div className="flex flex-col w-full">
          <section
            aria-labelledby="urgence-titre"
            className="w-full bg-error-container text-on-error-container py-space-sm px-margin-desktop"
          >
            <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span aria-hidden="true" className="material-symbols-outlined text-[24px] text-error shrink-0">
                  emergency
                </span>
                <h2 id="urgence-titre" className="font-label-lg text-label-lg font-bold">
                  Urgence sur place ? 24 h/24 : <span className="whitespace-nowrap">{EMERGENCY.display}</span>
                </h2>
                <a className="font-label-md text-label-md font-bold underline underline-offset-2" href="#urgence">
                  Que faire ?
                </a>
              </div>
              <div className="flex gap-space-xs shrink-0">
                <a
                  className="h-10 px-space-md rounded-full bg-error text-on-error font-label-md text-label-md font-bold flex items-center gap-1.5 hover:opacity-90"
                  href={EMERGENCY.call}
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                    call
                  </span>
                  Appeler
                </a>
                <a
                  className="h-10 px-space-md rounded-full border-2 border-error text-error font-label-md text-label-md font-bold flex items-center gap-1.5 hover:bg-error hover:text-on-error"
                  href={EMERGENCY.whatsapp}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                    chat
                  </span>
                  WhatsApp
                </a>
              </div>
            </div>
          </section>

          <section className="relative w-full overflow-hidden bg-surface-container-low pt-space-lg pb-space-xl">
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="bg-cover bg-center w-full h-full"
                aria-label="Coucher de soleil doré sur l'allée des baobabs de Morondava"
                role="img"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAm-y-WNZalp6e9vkOt9r-d_5Y7iLtCeehtnH70FNBAq7Nj2srChaI2fmmFrHDKlMVGla2Umz3_mBy2a1iLmTkywfgoSFIeT8JJLlz771k6piQgFPPOH32fIO3wRwHm-wpDnflLDzKS5QBZXIb7V2T9PEmQOQqhorN_bwl-ixLMvL1WzgeRh43chpVT-AtXlEzvFoh6_bRvo63KAXFZ7PbtyQLwbJKOFPiHfbsimKwdDkv_ADx5vZM')",
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-b from-surface/80 to-surface/60" />
            </div>
            <div className="relative max-w-[1280px] mx-auto px-margin-desktop flex flex-col items-center text-center">
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                Comment pouvons-nous vous aider ?
              </h1>
              <p className="font-body-md text-body-md text-on-surface mt-1 mb-space-md">
                Cherchez dans la FAQ ou écrivez à notre équipe, en français, anglais ou malgache.
              </p>

              <FaqSearch />
            </div>
          </section>

          <section className="max-w-[1280px] mx-auto px-margin-desktop -mt-8 w-full z-10 flex flex-col gap-space-lg">
            <ContactCards />

            <SupportHours />
          </section>

          <section className="max-w-[1280px] mx-auto px-margin-desktop py-space-xl w-full">
            <FaqBrowser
              sidebar={
                <>
                  <EmergencySteps />

                  <TravelStatus />

                  <div className="bg-surface-container-lowest rounded p-space-lg shadow-sm flex flex-col gap-space-md">
                    <div className="flex items-center justify-between gap-space-sm">
                      <div>
                        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Calculateur de change</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant">Euro, Ariary et dollar, dans les deux sens.</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center shrink-0">
                        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                          currency_exchange
                        </span>
                      </div>
                    </div>
                    <CurrencyConverter />
                    <span className="font-body-md text-body-md text-on-surface-variant">
                      Taux indicatif : les bureaux de change et les banques appliquent leur propre taux et leurs frais.
                    </span>
                  </div>
                </>
              }
            />
          </section>

          <ConciergeChat />
        </div>
      </main>
    </FaqFilterProvider>
  );
}
