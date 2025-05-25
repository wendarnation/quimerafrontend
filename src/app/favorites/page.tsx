"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  ExternalLink,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useFavorites } from "../../hooks/useFavorites";
import AuthGuard from "../../components/AuthGuard";

function FavoritesContent() {
  const {
    currentList,
    isLoading,
    error,
    fetchFavoriteList,
    removeFromFavoriteList,
    getOrCreateDefaultList,
  } = useFavorites();

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Cargar lista predeterminada al montar
  useEffect(() => {
    const loadDefaultList = async () => {
      try {
        const defaultList = await getOrCreateDefaultList();
        await fetchFavoriteList(defaultList.id);
      } catch (error) {
        console.error('Error al cargar lista predeterminada:', error);
      }
    };
    
    loadDefaultList();
  }, [getOrCreateDefaultList, fetchFavoriteList]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleRemoveFromFavorites = async (zapatillaId: number) => {
    if (!currentList) return;

    try {
      await removeFromFavoriteList(currentList.id, zapatillaId);
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
        {currentList ? (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  {currentList.nombre}
                </h2>
                <p className="text-sm text-gray-500">
                  {currentList.zapatillas?.length || 0} zapatillas
                </p>
              </div>
            </div>

            {currentList.zapatillas && currentList.zapatillas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                {currentList.zapatillas.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
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
                        {item.zapatilla.color}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">
                          €{item.zapatilla.precio_original || 0}
                        </div>
                        <a
                          href={`/sneakers/${item.zapatilla.id}`}
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm"
                        >
                          <span>Ver detalles</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
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
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Cargando favoritos...
            </h3>
            <p className="text-sm text-gray-500">
              Un momento por favor
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <AuthGuard>
      <FavoritesContent />
    </AuthGuard>
  );
}
