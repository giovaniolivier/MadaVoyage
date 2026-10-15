import { LoadingStatus } from "@/components/reservation/zone-states";

export default function Loading() {
  return (
    <main className="w-full pt-20 bg-background">
      <div className="max-w-[1280px] mx-auto px-gutter-desktop min-h-[calc(100vh-80px)] flex flex-col gap-space-lg pb-space-xl">
        <LoadingStatus />
        <div aria-hidden="true" className="mt-space-md h-24 rounded-lg bg-surface-container-low shadow-sm motion-safe:animate-pulse"></div>
        <div aria-hidden="true" className="h-36 rounded-lg bg-surface-container-lowest shadow-sm motion-safe:animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          <div className="lg:col-span-6 flex flex-col gap-space-lg">
            <div aria-hidden="true" className="h-8 w-2/3 rounded-full bg-surface-container-high motion-safe:animate-pulse"></div>
            {[0, 1].map((i) => (
              <div aria-hidden="true" className="rounded-lg overflow-hidden bg-surface-container-lowest shadow-sm" key={i}>
                <div className="h-56 bg-surface-container-high motion-safe:animate-pulse"></div>
                <div className="p-space-md flex flex-col gap-space-sm">
                  <div className="h-5 w-1/3 rounded-full bg-surface-container-high motion-safe:animate-pulse"></div>
                  <div className="h-4 w-full rounded-full bg-surface-container motion-safe:animate-pulse"></div>
                  <div className="h-4 w-5/6 rounded-full bg-surface-container motion-safe:animate-pulse"></div>
                  <div className="h-10 w-48 self-end rounded-full bg-surface-container-high motion-safe:animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
          <div
            aria-hidden="true"
            className="hidden lg:block lg:col-span-6 h-[600px] rounded-lg bg-surface-container-lowest shadow-sm motion-safe:animate-pulse"
          ></div>
        </div>
      </div>
    </main>
  );
}
