// app/favorites/FavoritesPageZustand.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useFavoritesWithZustand } from "../../hooks/useFavoritesWithZustand";
import AuthGuard from "../../components/AuthGuard";

function FavoritesContent() {
  const {
    defaultList,
    isLoading,
    error,
    removeFromFavorites,
    initializeDefaultList,
    isInitialized
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
      .filter(tienda => tienda.disponible)
      .map(tienda => Number(tienda.precio))
      .filter(precio => !isNaN(precio));

    if (availablePrices.length === 0) {
      return { min: null, max: null, available: 0 };
    }

    return {
      min: Math.min(...availablePrices),
      max: Math.max(...availablePrices),
      available: availablePrices.length
    };
  };

  // Inicializar al montar
  useEffect(() => {
    if (!isInitialized) {
      initializeDefaultList().catch((error) => {
        console.error('Error al cargar lista predeterminada:', error);
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
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div
            className={`rounded-md p-4 ${
              notification.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                {notification.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    notification.type === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Mis Favoritos
              </h1>
              <p className="text-gray-600">
                Tus zapatillas favoritas
              </p>
            </div>
          </div>
        </div>

        {/* Contenido de favoritos */}
        {defaultList ? (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  {defaultList.nombre}
                </h2>
                <p className="text-sm text-gray-500">
                  {defaultList.zapatillas?.length || 0} zapatillas
                </p>
              </div>
            </div>

            {defaultList.zapatillas && defaultList.zapatillas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                {defaultList.zapatillas.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={
                          item.zapatilla.imagen ||
                          "/placeholder-sneaker.svg"
                        }
                        alt={`${item.zapatilla.marca} ${item.zapatilla.modelo}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() =>
                          handleRemoveFromFavorites(item.zapatilla_id)
                        }
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                      >
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {item.zapatilla.marca} {item.zapatilla.modelo}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.zapatilla.categoria}
                      </p>

                      {/* Precio y detalles */}
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">
                          {(() => {
                            const priceInfo = calculatePrice(item.zapatilla.zapatillasTienda);
                            return priceInfo.min ? `€${priceInfo.min.toFixed(0)}` : 'N/A';
                          })()
                          }
                        </div>
                        <a
                          href={`/sneakers/${item.zapatilla.id}`}
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm"
                        >
                          <span>Ver detalles</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>

                      {/* Estadísticas adicionales */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <span>{(() => {
                          const priceInfo = calculatePrice(item.zapatilla.zapatillasTienda);
                          return `${priceInfo.available} tiendas`;
                        })()}</span>
                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                          {item.zapatilla.categoria || "General"}
                        </span>
                      </div>

                      {/* SKU (oculto por defecto, visible en hover) */}
                      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="text-xs text-gray-400 truncate">SKU: {item.zapatilla.sku}</p>
                      </div>

                      {item.zapatilla.zapatillasTienda &&
                        item.zapatilla.zapatillasTienda.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-2">
                              Disponible en:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {item.zapatilla.zapatillasTienda
                                .slice(0, 2)
                                .map((tienda, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-1 text-xs bg-gray-100 px-2 py-1 rounded"
                                  >
                                    <span>{tienda.tienda.nombre}</span>
                                    <span className="font-medium">
                                      €{tienda.precio}
                                    </span>
                                  </div>
                                ))}
                              {item.zapatilla.zapatillasTienda.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{item.zapatilla.zapatillasTienda.length - 2} más
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  No tienes favoritos
                </h3>
                <p className="text-sm text-gray-500">
                  Agrega zapatillas a favoritos dándoles like desde cualquier página
                </p>
              </div>
            )}
          </div>
        ) : isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Cargando favoritos...
            </h3>
            <p className="text-sm text-gray-500">
              Un momento por favor
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Error al cargar favoritos
            </h3>
            <p className="text-sm text-gray-500">
              {error}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              No se pudo cargar la lista
            </h3>
            <p className="text-sm text-gray-500">
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
