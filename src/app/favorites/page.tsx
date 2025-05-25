"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  Plus,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useFavorites, FavoriteList } from "../../hooks/useFavorites";
import AuthGuard from "../../components/AuthGuard";

function FavoritesContent() {
  const {
    favoriteLists,
    currentList,
    isLoading,
    error,
    fetchFavoriteLists,
    fetchFavoriteList,
    createFavoriteList,
    updateFavoriteList,
    deleteFavoriteList,
    removeFromFavoriteList,
  } = useFavorites();

  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<FavoriteList | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<FavoriteList | null>(
    null
  );
  const [newListName, setNewListName] = useState("");
  const [editListName, setEditListName] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Cargar listas al montar
  useEffect(() => {
    fetchFavoriteLists();
  }, [fetchFavoriteLists]);

  // Seleccionar primera lista por defecto
  useEffect(() => {
    if (favoriteLists.length > 0 && !selectedListId) {
      const defaultList =
        favoriteLists.find((list) => list.predeterminada) || favoriteLists[0];
      setSelectedListId(defaultList.id);
    }
  }, [favoriteLists, selectedListId]);

  // Cargar lista seleccionada
  useEffect(() => {
    if (selectedListId) {
      fetchFavoriteList(selectedListId);
    }
  }, [selectedListId, fetchFavoriteList]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;

    try {
      await createFavoriteList(newListName, false);
      setShowCreateModal(false);
      setNewListName("");
      showNotification("success", "Lista creada correctamente");
    } catch (error) {
      showNotification("error", "Error al crear la lista");
    }
  };

  const handleEditList = async () => {
    if (!showEditModal || !editListName.trim()) return;

    try {
      await updateFavoriteList(showEditModal.id, { nombre: editListName });
      setShowEditModal(null);
      setEditListName("");
      showNotification("success", "Lista actualizada correctamente");
    } catch (error) {
      showNotification("error", "Error al actualizar la lista");
    }
  };

  const handleDeleteList = async () => {
    if (!showDeleteModal) return;

    try {
      await deleteFavoriteList(showDeleteModal.id);
      setShowDeleteModal(null);
      if (selectedListId === showDeleteModal.id) {
        setSelectedListId(null);
      }
      showNotification("success", "Lista eliminada correctamente");
    } catch (error) {
      showNotification("error", "Error al eliminar la lista");
    }
  };

  const handleRemoveFromFavorites = async (zapatillaId: number) => {
    if (!selectedListId) return;

    try {
      await removeFromFavoriteList(selectedListId, zapatillaId);
      showNotification("success", "Zapatilla eliminada de la lista");
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
                Mis Listas de Favoritos
              </h1>
              <p className="text-gray-600">
                Gestiona tus zapatillas favoritas
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Lista</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de listas favoritas */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Mis Listas
                </h2>
              </div>

              {isLoading && favoriteLists.length === 0 ? (
                <div className="p-6 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-500">Cargando listas...</p>
                </div>
              ) : favoriteLists.length === 0 ? (
                <div className="p-6 text-center">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    No tienes listas
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Crea tu primera lista de favoritos
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Crear Lista
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {favoriteLists.map((list) => (
                    <div
                      key={list.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedListId === list.id
                          ? "bg-blue-50 border-r-4 border-blue-500"
                          : ""
                      }`}
                      onClick={() => setSelectedListId(list.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900">
                              {list.nombre}
                            </h3>
                            {list.predeterminada && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {list.zapatillas?.length || 0} zapatillas
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowEditModal(list);
                              setEditListName(list.nombre);
                            }}
                            className="text-gray-400 hover:text-blue-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          {!list.predeterminada && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteModal(list);
                              }}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contenido de la lista seleccionada */}
          <div className="lg:w-2/3">
            {selectedListId && currentList ? (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-lg font-medium text-gray-900">
                        {currentList.nombre}
                      </h2>
                      {currentList.predeterminada && (
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      )}
                    </div>
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
                              €{item.zapatilla.precio_original}
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
                                  {item.zapatilla.zapatillasTienda.length >
                                    2 && (
                                    <span className="text-xs text-gray-500">
                                      +
                                      {item.zapatilla.zapatillasTienda.length -
                                        2}{" "}
                                      más
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
                      Lista vacía
                    </h3>
                    <p className="text-sm text-gray-500">
                      Agrega zapatillas a esta lista dándoles like desde la
                      página principal
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Selecciona una lista
                </h3>
                <p className="text-sm text-gray-500">
                  Elige una lista de la izquierda para ver sus zapatillas
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Nueva Lista de Favoritos
              </h3>
              <input
                type="text"
                placeholder="Nombre de la lista"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === "Enter" && handleCreateList()}
              />
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewListName("");
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateList}
                  disabled={!newListName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Editar Lista
              </h3>
              <input
                type="text"
                placeholder="Nombre de la lista"
                value={editListName}
                onChange={(e) => setEditListName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === "Enter" && handleEditList()}
              />
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(null);
                    setEditListName("");
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditList}
                  disabled={!editListName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Confirmar eliminación
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  ¿Estás seguro de que quieres eliminar la lista "
                  {showDeleteModal.nombre}"? Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteList}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
