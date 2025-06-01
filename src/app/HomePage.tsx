"use client";

import { useRouter } from "next/navigation";
import TrendingSneakers from "@/components/TrendingSneakers";
import RecommendedSneakers from "@/components/RecommendedSneakers";
import UserSync from "@/components/auth/UserSync";
import GlitchText from "@/components/GlitchText";
import { Zapatilla } from "@/types/zapatilla";

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
                    <button
                      onClick={handleViewAll}
                      className="inline-block bg-darkwhite cursor-pointer hover:bg-lightblack text-lightblack hover:text-darkwhite px-5 py-2 md:px-8 md:py-3 rounded-lg font-semibold transition-all duration-500 ease-in-out text-sm md:text-lg"
                    >
                      VER TODAS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <TrendingSneakers
          onViewAll={handleViewAll}
          onSneakerClick={handleSneakerClick}
        />

        <RecommendedSneakers
          onViewAll={handleViewAll}
          onSneakerClick={handleSneakerClick}
        />

        {/* Featured Images Section */}
        <div className="bg-lightwhite py-2">
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

        <div className="bg-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Mejores Precios
                </h3>
                <p className="text-gray-300">
                  Compara precios en múltiples tiendas para encontrar las
                  mejores ofertas
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Actualizaciones en Tiempo Real
                </h3>
                <p className="text-gray-300">
                  Obtén información actualizada de precios y disponibilidad
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Guardar Favoritos
                </h3>
                <p className="text-gray-300">
                  {user
                    ? "Crea listas de deseos y sigue tus zapatillas favoritas"
                    : "Regístrate para guardar tus zapatillas favoritas"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para encontrar tu próximo par?
            </h2>
            <p className="text-xl text-darkwhite mb-8">
              Explora miles de zapatillas de las mejores marcas
            </p>
            <button
              onClick={handleViewAll}
              className="bg-white text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Ver Todas las Zapatillas
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
