// app/favorites/FavoritesPageZustand.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  ExternalLink,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import { useFavoritesWithZustand } from "../../hooks/useFavoritesWithZustand";
import AuthGuard from "../../components/AuthGuard";
import FavoriteButtonZustand from "../../components/favorites/FavoriteButtonZustand";

function FavoritesContent() {
  const {
    defaultList,
    isLoading,
    error,
    removeFromFavorites,
    initializeDefaultList,
    isInitialized,
  } = useFavoritesWithZustand();

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Helper function to calculate price from zapatillasTienda
  const calculatePrice = (zapatillasTienda?: any[]) => {
    if (!zapatillasTienda || zapatillasTienda.length === 0) {
      return { min: null, max: null, available: 0 };
    }

    const availablePrices = zapatillasTienda
      .filter((tienda) => tienda.disponible)
      .map((tienda) => Number(tienda.precio))
      .filter((precio) => !isNaN(precio));

    if (availablePrices.length === 0) {
      return { min: null, max: null, available: 0 };
    }

    return {
      min: Math.min(...availablePrices),
      max: Math.max(...availablePrices),
      available: availablePrices.length,
    };
  };

  // Helper function to format price
  const formatPrice = (price?: number | string | any) => {
    if (!price) return "N/A";
    const numPrice =
      typeof price === "number" ? price : parseFloat(price.toString());
    if (isNaN(numPrice)) return "N/A";
    return `${numPrice.toFixed(2)}€`;
  };

  // Helper function to get available stores
  const getAvailableStores = (zapatillasTienda?: any[]) => {
    if (!zapatillasTienda) return [];
    return zapatillasTienda.filter((tienda) => tienda.disponible);
  };

  // Inicializar al montar
  useEffect(() => {
    if (!isInitialized) {
      initializeDefaultList().catch((error) => {
        console.error("Error al cargar lista predeterminada:", error);
      });
    }
  }, [initializeDefaultList, isInitialized]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleRemoveFromFavorites = async (zapatillaId: number) => {
    try {
      await removeFromFavorites(zapatillaId);
      showNotification("success", "Zapatilla eliminada de favoritos");
    } catch (error) {
      showNotification("error", "Error al eliminar la zapatilla");
    }
  };

  return (
    <div className="min-h-screen bg-lightwhite">
      {/* Header Section */}
      <div className="bg-lightwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-lightblack">Favoritos</h1>
              <p className="text-verylightblack mt-1 text-sm sm:text-base">
                Tus zapatillas favoritas guardadas para consultar cuando quieras
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-lightwhite border border-lightaccentwhite rounded-xl p-6 transition-all duration-300 hover:border-darkaccentwhite">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-pink-100 rounded-xl">
                <Heart className="h-6 w-6 text-pinkneon" />
              </div>
              <div>
                <p className="text-2xl font-bold text-lightblack">
                  {defaultList?.zapatillas?.length || 0}
                </p>
                <p className="text-sm text-verylightblack">Favoritos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido de favoritos */}
        {defaultList ? (
          <div className="bg-lightwhite border border-lightaccentwhite rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-lightaccentwhite bg-lightwhite">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-lightblack">
                  {defaultList.nombre}
                </h2>
              </div>
            </div>

            {defaultList.zapatillas && defaultList.zapatillas.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                {defaultList.zapatillas.map((item) => {
                  const priceInfo = calculatePrice(
                    item.zapatilla.zapatillasTienda
                  );
                  const availableStores = getAvailableStores(
                    item.zapatilla.zapatillasTienda
                  );

                  return (
                    <div
                      key={item.id}
                      className="bg-lightwhite rounded-lg transition-all duration-200 cursor-pointer group overflow-hidden "
                      onClick={() =>
                        (window.location.href = `/sneaker/${item.zapatilla.id}`)
                      }
                    >
                      {/* Imagen y corazón */}
                      <div className="relative aspect-square bg-lightwhite overflow-hidden">
                        {/* Botón de corazón */}
                        <div
                          className="absolute top-2 right-2 md:top-3 md:right-3 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FavoriteButtonZustand
                            zapatillaId={item.zapatilla.id}
                            className="p-1.5 md:p-2 rounded-full cursor-pointer bg-lightwhite transition-all duration-200"
                            size="md"
                          />
                        </div>

                        {/* Imagen */}
                        <img
                          src={
                            item.zapatilla.imagen || "/placeholder-sneaker.svg"
                          }
                          alt={`${item.zapatilla.marca} ${item.zapatilla.modelo}`}
                          className="w-full h-full object-cover scale-90 md:scale-95 group-hover:scale-95 md:group-hover:scale-100 transition-transform duration-500"
                        />
                      </div>

                      {/* Información del producto */}
                      <div className="px-4 -mt-6 pt-1 pb-4 relative z-10">
                        {/* Título - Marca y Modelo en filas separadas */}
                        <div className="mb-3">
                          <h3 className="font-bold text-lightblack text-sm md:text-base leading-tight line-clamp-1 group-hover:text-verylightblack transition-colors">
                            {item.zapatilla.marca}
                          </h3>
                          <p className="font-normal text-darkaccentwhite text-xs md:text-sm leading-tight line-clamp-1 mt-0.5">
                            {item.zapatilla.modelo}
                          </p>
                        </div>

                        {/* Precio */}
                        <div className="mb-2">
                          {priceInfo.min ? (
                            <div>
                              <p className="text-xs md:text-sm text-darkaccentwhite">
                                Precio Más Bajo
                              </p>
                              <p className="text-base md:text-lg font-bold text-greenneon">
                                {formatPrice(priceInfo.min)}
                              </p>
                              {priceInfo.max &&
                                priceInfo.max !== priceInfo.min && (
                                  <p className="text-xs text-darkaccentwhite">
                                    Hasta {formatPrice(priceInfo.max)}
                                  </p>
                                )}
                            </div>
                          ) : (
                            <div>
                              <p className="text-xs md:text-sm text-darkaccentwhite mb-1">
                                Precio
                              </p>
                              <p className="text-base md:text-lg font-bold text-lightblack">
                                --
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Disponible en tiendas */}
                        {availableStores.length > 0 && (
                          <div className="mb-2 mt-4">
                            <p className="text-xs md:text-sm text-darkaccentwhite mb-1">
                              Disponible en
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {availableStores
                                .slice(0, 2)
                                .map((tienda, index) =>
                                  tienda.url_producto ? (
                                    <a
                                      key={index}
                                      href={tienda.url_producto}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs bg-lightaccentwhite text-verylightblack px-2 py-1 rounded-full hover:bg-darkaccentwhite hover:text-lightwhite transition-colors duration-500 cursor-pointer"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {tienda.tienda.nombre}
                                    </a>
                                  ) : (
                                    <span
                                      key={index}
                                      className="text-xs bg-lightaccentwhite text-verylightblack px-2 py-1 rounded-full"
                                    >
                                      {tienda.tienda.nombre}
                                    </span>
                                  )
                                )}
                              {availableStores.length > 2 && (
                                <span className="text-xs text-darkaccentwhite px-2 py-1">
                                  +{availableStores.length - 2} más
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Estadísticas adicionales */}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="inline-flex p-4 bg-lightaccentwhite/50 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-verylightblack" />
                </div>
                <h3 className="text-lg font-semibold text-lightblack mb-2">
                  No tienes favoritos
                </h3>
                <p className="text-sm text-verylightblack">
                  Agrega zapatillas a favoritos dándoles like desde cualquier
                  página
                </p>
              </div>
            )}
          </div>
        ) : isLoading ? (
          <div className="bg-lightwhite border border-lightaccentwhite rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-lightaccentwhite bg-lightwhite">
              <div className="flex items-center justify-between">
                <div className="h-5 bg-lightaccentwhite rounded animate-pulse w-32"></div>
              </div>
            </div>

            {/* Desktop Skeleton */}
            <div className="hidden lg:grid grid-cols-4 gap-6 p-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-lightwhite rounded-lg overflow-hidden border border-lightaccentwhite"
                >
                  {/* Imagen skeleton */}
                  <div className="aspect-square bg-lightaccentwhite animate-pulse"></div>

                  {/* Contenido skeleton */}
                  <div className="px-4 mt-6 pt-1 pb-4 relative z-10">
                    <div className="mb-2">
                      <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-16 mb-1"></div>
                      <div className="h-5 bg-lightaccentwhite rounded animate-pulse w-12"></div>
                    </div>

                    <div className="mb-2">
                      <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-20 mb-1"></div>
                      <div className="flex gap-1">
                        <div className="h-6 bg-lightaccentwhite rounded-full animate-pulse w-16"></div>
                        <div className="h-6 bg-lightaccentwhite rounded-full animate-pulse w-12"></div>
                      </div>
                    </div>

                    <div className="h-3 bg-lightaccentwhiteaccentwhite rounded animate-pulse w-14"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile/Tablet Skeleton */}
            <div className="lg:hidden grid grid-cols-2 gap-6 p-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-lightwhite rounded-lg overflow-hidden border border-lightaccentwhite"
                >
                  {/* Imagen skeleton */}
                  <div className="aspect-square bg-lightaccentwhite animate-pulse"></div>

                  {/* Contenido skeleton */}
                  <div className="px-4 mt-6 pt-1 pb-4 relative z-10">
                    <div className="mb-2">
                      <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-12 mb-1"></div>
                      <div className="h-4 bg-lightaccentwhite rounded animate-pulse w-10"></div>
                    </div>

                    <div className="mb-2">
                      <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-16 mb-1"></div>
                      <div className="flex gap-1">
                        <div className="h-5 bg-lightaccentwhite rounded-full animate-pulse w-12"></div>
                        <div className="h-5 bg-lightaccentwhite rounded-full animate-pulse w-8"></div>
                      </div>
                    </div>

                    <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-10"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="bg-lightwhite border border-lightaccentwhite rounded-xl shadow-sm p-12 text-center">
            <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-lightblack mb-2">
              Error al cargar favoritos
            </h3>
            <p className="text-sm text-verylightblack">{error}</p>
          </div>
        ) : (
          <div className="bg-lightwhite border border-lightaccentwhite rounded-xl shadow-sm p-12 text-center">
            <div className="inline-flex p-4 bg-lightaccentwhite/50 rounded-full mb-4">
              <Heart className="h-8 w-8 text-verylightblack" />
            </div>
            <h3 className="text-lg font-semibold text-lightblack mb-2">
              No se pudo cargar la lista
            </h3>
            <p className="text-sm text-verylightblack">
              Inténtalo de nuevo más tarde
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FavoritesPageZustand() {
  return (
    <AuthGuard>
      <FavoritesContent />
    </AuthGuard>
  );
}
