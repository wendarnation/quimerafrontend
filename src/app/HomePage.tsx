"use client";

import { useRouter } from "next/navigation";
import TrendingSneakers from "@/components/TrendingSneakers";
import UserSync from "@/components/auth/UserSync";
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

  const handleSearch = (query: string) => {
    router.push(`/browse?search=${encodeURIComponent(query)}`);
  };

  const handleCategorySelect = (category: string) => {
    router.push(`/browse?categoria=${encodeURIComponent(category)}`);
  };

  const handleViewAll = () => {
    router.push("/browse");
  };

  const handleSneakerClick = (sneaker: Zapatilla) => {
    // Navigate to sneaker details page
    router.push(`/sneaker/${sneaker.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <UserSync user={user} />

      <main>
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">
                Bienvenido a Quimera
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Descubre las mejores ofertas de zapatillas de múltiples tiendas
              </p>

              <div className="max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar marca, modelo, etc."
                    className="w-full pl-4 pr-12 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const target = e.target as HTMLInputElement;
                        if (target.value.trim()) {
                          handleSearch(target.value.trim());
                        }
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = (e.target as HTMLElement)
                        .closest(".relative")
                        ?.querySelector("input") as HTMLInputElement;
                      if (input?.value.trim()) {
                        handleSearch(input.value.trim());
                      }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TrendingSneakers
          onViewAll={handleViewAll}
          onSneakerClick={handleSneakerClick}
        />

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
                  Compara precios en múltiples tiendas para encontrar las mejores ofertas
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
            <p className="text-xl text-gray-300 mb-8">
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
