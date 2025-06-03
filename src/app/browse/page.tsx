import { Suspense } from "react";
import BrowsePageContent from "@/components/BrowsePageContent";

// Componente de loading que se muestra mientras se resuelve useSearchParams
function BrowsePageLoading() {
  return (
    <div className="min-h-screen bg-lightwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="h-8 bg-darkwhite rounded w-64 mb-2"></div>
          <div className="h-4 bg-darkwhite rounded w-96 mb-8"></div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar skeleton */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="space-y-6">
                <div className="h-4 bg-darkwhite rounded w-32"></div>
                <div className="h-4 bg-darkwhite rounded w-28"></div>
                <div className="h-12 bg-darkwhite rounded"></div>
                <div className="h-12 bg-darkwhite rounded"></div>
                <div className="h-12 bg-darkwhite rounded"></div>
              </div>
            </div>
            
            {/* Main content skeleton - 2 columnas en móvil, 4 en desktop */}
            <div className="flex-1">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {Array.from({ length: 40 }).map((_, index) => (
                  <div key={index} className="bg-darkwhite rounded-lg h-80" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowsePageLoading />}>
      <BrowsePageContent />
    </Suspense>
  );
}
