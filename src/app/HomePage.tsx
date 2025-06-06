"use client";

import { useRouter } from "next/navigation";
import TrendingSneakers from "@/components/TrendingSneakers";
import RecommendedSneakers from "@/components/RecommendedSneakers";
import UserSync from "@/components/auth/UserSync";
import GlitchText from "@/components/GlitchText";
import { Zapatilla } from "@/types/zapatilla";
import { useHomepageTourV2 } from "@/hooks/useHomepageTourV2";
import { HelpCircle } from "lucide-react";

interface Auth0User {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
  nickname?: string;
  permissions?: string[];
  [key: string]: any;
}

interface HomeProps {
  user?: Auth0User;
}

export default function HomePage({ user }: HomeProps) {
  const router = useRouter();
  const { startTour } = useHomepageTourV2();

  const handleViewAll = () => {
    router.push("/browse");
  };

  const handleSneakerClick = (sneaker: Zapatilla) => {
    // Navigate to sneaker details page
    router.push(`/sneaker/${sneaker.id}`);
  };

  return (
    <div className="min-h-screen bg-lightwhite">
      <UserSync user={user} />

      <main>
        {/* Video Section with overlay content */}
        <div className="relative w-full">
          <video
            className="w-full h-96 md:h-96 lg:h-screen object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/videoinicio.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>

          {/* Overlay content - show different content based on authentication */}
          {!user ? (
            <div className="absolute inset-0 flex items-end">
              <div className="w-full px-4 sm:px-6 lg:px-8 pb-4 md:pb-32 lg:pb-52">
                <div className="max-w-none w-[95%] mx-auto">
                  <div className="text-darkwhite max-w-[70%] md:max-w-[30%]">
                    <GlitchText
                      text="REGÍSTRATE PARA VER TODAS LAS VENTAJAS"
                      className="text-xl text-darkwhite md:text-4xl lg:text-4xl font-extrabold mb-2 md:mb-4"
                    />
                    <p className="text-sm text-darkwhite md:text-xl font-light lg:text-xl mb-6 text-gray-200">
                      Guardar en favoritos, novedades... Y mucho más
                    </p>
                    <a
                      href="/auth/login"
                      className="inline-block bg-darkwhite cursor-pointer hover:bg-lightblack text-lightblack hover:text-darkwhite px-5 py-2 md:px-8 md:py-3 rounded-lg font-semibold transition-all duration-500 ease-in-out text-sm md:text-lg"
                    >
                      EMPIEZA
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-end">
              <div className="w-full px-4 sm:px-6 lg:px-8 pb-4 md:pb-32 lg:pb-52">
                <div className="max-w-none w-[95%] mx-auto">
                  <div className="text-darkwhite max-w-[70%] md:max-w-[30%]">
                    <GlitchText
                      text="LA DEMOCRATIZACIÓN DE LAS SNEAKERS ESTÁ AQUÍ"
                      className="text-xl text-darkwhite md:text-4xl lg:text-4xl font-extrabold mb-2 md:mb-4"
                    />
                    <p className="text-sm text-darkwhite md:text-xl font-light lg:text-xl mb-6 text-gray-200">
                      Busca precios. Filtra. Encuentra tus favoritas.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleViewAll}
                        className="inline-block bg-darkwhite cursor-pointer hover:bg-lightblack text-lightblack hover:text-darkwhite px-5 py-2 md:px-8 md:py-3 rounded-lg font-semibold transition-all duration-500 ease-in-out text-sm md:text-lg"
                      >
                        VER TODAS
                      </button>
                      <button
                        onClick={startTour}
                        className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-darkwhite cursor-pointer hover:bg-darkwhite text-darkwhite hover:text-lightblack px-5 py-2 md:px-8 md:py-3 rounded-lg font-semibold transition-all duration-500 ease-in-out text-sm md:text-lg"
                      >
                        <HelpCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                        <span className="text-center">TOUR GUIADO</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div data-tour="trending-section">
          <TrendingSneakers
            onViewAll={handleViewAll}
            onSneakerClick={handleSneakerClick}
          />
        </div>

        <div data-tour="recommended-section">
          <RecommendedSneakers
            onViewAll={handleViewAll}
            onSneakerClick={handleSneakerClick}
          />
        </div>

        {/* Featured Images Section */}
        <div className="bg-lightwhite py-2" data-tour="featured-images">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 sm:px-6 lg:px-8">
            {/* Jordan Image with Overlay */}
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="/jordanbw.webp"
                alt="Jordan 1"
                className="w-full h-96 md:h-[32rem] object-cover"
              />
              {/* Overlay content */}
              <div className="absolute inset-0 flex items-end">
                <div className="w-full p-4 md:p-6 pb-6 md:pb-8">
                  <div className="text-darkwhite max-w-[30%]">
                    <p className="text-sm md:text-lg font-light mb-4 text-darkwhite">
                      ...Pero sigue siendo el rey.
                    </p>
                    <button
                      onClick={() => router.push("/browse?search=jordan")}
                      className="inline-block bg-darkwhite cursor-pointer hover:bg-yellowneon text-lightblack hover:text-lightblack px-4 py-2 md:px-6 md:py-2 rounded-lg font-semibold transition-all duration-500 ease-in-out text-sm md:text-base"
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* New Balance Image */}
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="/newbalancebw.webp"
                alt="New Balance"
                className="w-full h-96 md:h-[32rem] object-cover"
              />
              {/* Overlay content */}
              <div className="absolute inset-0 flex items-end">
                <div className="w-full p-4 md:p-6 pb-6 md:pb-8">
                  <div className="text-darkwhite max-w-[30%]">
                    <p className="text-sm md:text-lg font-light mb-4 text-darkwhite">
                      Si buscas tu primera sneaker dad, estás de suerte.
                    </p>
                    <button
                      onClick={() => router.push("/browse?search=new balance")}
                      className="inline-block bg-darkwhite cursor-pointer hover:bg-yellowneon text-lightblack hover:text-lightblack px-4 py-2 md:px-6 md:py-2 rounded-lg font-semibold transition-all duration-500 ease-in-out text-sm md:text-base"
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Header */}
        <div className="bg-lightwhite py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-700 text-xs sm:text-sm">
              Quimera Sneakers © - All Rights Reserved
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
