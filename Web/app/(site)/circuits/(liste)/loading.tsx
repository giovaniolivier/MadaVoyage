import { CatalogSkeleton } from "@/components/circuits/CircuitCatalog";

export default function Loading() {
  return (
    <main className="w-full pt-20 bg-surface min-h-[calc(100vh-20rem)]">
      <div className="max-w-[1440px] mx-auto px-margin-desktop pt-space-md pb-space-xl flex flex-col gap-space-lg">
        <div aria-hidden="true" className="h-9 w-2/3 max-w-xl rounded-full bg-surface-container-high motion-safe:animate-pulse"></div>
        <div aria-hidden="true" className="h-40 rounded-lg bg-surface-container-lowest shadow-sm motion-safe:animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
          <div
            aria-hidden="true"
            className="hidden lg:block lg:col-span-4 xl:col-span-3 h-[640px] rounded-lg bg-surface-container-lowest shadow-sm motion-safe:animate-pulse"
          ></div>
          <div className="lg:col-span-8 xl:col-span-9">
            <CatalogSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}
