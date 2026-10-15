import type { Metadata } from "next";
import { BookingFromUrl } from "@/components/reservation/BookingBits";
import {
  AdviceCard,
  ArrivalCard,
  BackLink,
  DatesAside,
  DatesCard,
  DatesContinue,
  DatesMain,
  DatesMobileBar,
  DatesStepper,
  DraftStatus,
  DatesSummary,
  SummaryHero,
  TravelersCard,
  TripTypeCard,
} from "@/components/reservation/DatesStep";

export const metadata: Metadata = {
  title: "Étape 1 · Séjour | Réservation MadaVoyage",
  description: "Choisissez vos dates, les voyageurs et le type de votre séjour à Madagascar.",
  robots: { index: false },
};

export default function Page() {
  return (
    <>
      <BookingFromUrl />
      <DatesMain className="w-full pt-20 bg-background">
        <div className="max-w-[1280px] mx-auto px-gutter-desktop min-h-[calc(100vh-80px)]">
          <div className="flex flex-col w-full">
            <section className="py-space-md">
              <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-sm">
                <BackLink />
                <DraftStatus />
              </div>
              <div className="bg-surface-container-lowest rounded p-space-md shadow-sm mb-space-lg">
                <DatesStepper />
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start pb-space-xl">
              <div className="lg:col-span-8 flex flex-col gap-space-lg">
                <DatesCard />
                <TravelersCard />
                <TripTypeCard />
                <ArrivalCard />
              </div>

              <DatesAside className="lg:col-span-4 lg:sticky lg:top-20 flex flex-col gap-space-md">
                <div className="hidden lg:flex bg-surface-container-lowest rounded overflow-hidden shadow-md flex-col">
                  <SummaryHero />
                  <div className="p-space-md flex flex-col gap-space-sm">
                    <DatesSummary action={<DatesContinue />} />
                  </div>
                </div>
                <AdviceCard />
              </DatesAside>
            </div>
          </div>
        </div>
      </DatesMain>
      <DatesMobileBar />
    </>
  );
}
