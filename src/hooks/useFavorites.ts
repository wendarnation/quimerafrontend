// hooks/useFavorites.ts
"use client";

import { useCallback, useState, useEffect } from "react";
import { useAuth0Token } from "./useAuth0Token";
import { useQueryClient } from "@tanstack/react-query";

export interface FavoriteList {
  id: number;
  nombre: string;
  predeterminada: boolean;
  usuario_id: number;
  fecha_creacion: string;
  zapatillas?: FavoriteListItem[];
}

export interface FavoriteListItem {
  id: number;
  lista_id: number;
  zapatilla_id: number;
  fecha_agregado: string;
  zapatilla: {
    id: number;
    marca: string;
    modelo: string;
    sku: string;
    imagen: string | null;
    descripcion: string | null;
    categoria: string;
    activa: boolean;
    fecha_creacion: string;
    zapatillasTienda?: {
      id: number;
      precio: number;
      disponible: boolean;
      url_producto: string;
      modelo_tienda?: string;
      tienda: {
        id: number;
        nombre: string;
        url: string;
        activa: boolean;
        logo_url?: string;
      };
    }[];
  };
}

export function useFavorites() {
  const [favoriteLists, setFavoriteLists] = useState<FavoriteList[]>([]);
  const [currentList, setCurrentList] = useState<FavoriteList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { getAccessToken } = useAuth0Token();
  const queryClient = useQueryClient();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Obtener todas las listas del usuario
  const fetchFavoriteLists = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/listas-favoritos`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener listas: ${response.status}`);
      }

      const data = await response.json();
      setFavoriteLists(data);
      return data;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken, API_BASE_URL]);

  // Obtener una lista específica con zapatillas
  const fetchFavoriteList = useCallback(async (listId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/listas-favoritos/${listId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener lista: ${response.status}`);
      }

      const data = await response.json();
      setCurrentList(data);
      return data;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken, API_BASE_URL]);

  // Crear nueva lista
  const createFavoriteList = useCallback(async (nombre: string, predeterminada: boolean = false) => {
    setError(null);

    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/listas-favoritos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, predeterminada }),
      });

      if (!response.ok) {
        throw new Error(`Error al crear lista: ${response.status}`);
      }

      const newList = await response.json();
      setFavoriteLists(prev => [...prev, newList]);
      return newList;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      throw errorObj;
    }
  }, [getAccessToken, API_BASE_URL]);

  // Actualizar lista
  const updateFavoriteList = useCallback(async (listId: number, updates: { nombre?: string; predeterminada?: boolean }) => {
    setError(null);

    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/listas-favoritos/${listId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar lista: ${response.status}`);
      }

      const updatedList = await response.json();
      
      // Actualizar en el estado local
      setFavoriteLists(prev => 
        prev.map((list: FavoriteList) => list.id === listId ? { ...list, ...updates } : list)
      );
      
      if (currentList?.id === listId) {
        setCurrentList(prev => prev ? { ...prev, ...updates } : null);
      }

      return updatedList;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      throw errorObj;
    }
  }, [getAccessToken, API_BASE_URL, currentList?.id]);

  // Eliminar lista
  const deleteFavoriteList = useCallback(async (listId: number) => {
    setError(null);

    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/listas-favoritos/${listId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar lista: ${response.status}`);
      }

      // Actualizar estado local
      setFavoriteLists(prev => prev.filter((list: FavoriteList) => list.id !== listId));
      
      if (currentList?.id === listId) {
        setCurrentList(null);
      }

      return true;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      throw errorObj;
    }
  }, [getAccessToken, API_BASE_URL, currentList?.id]);

  // Agregar zapatilla a lista
  const addToFavoriteList = useCallback(async (listId: number, zapatillaId: number) => {
    setError(null);

    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/listas-favoritos/${listId}/zapatillas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ zapatilla_id: zapatillaId }),
      });

      if (!response.ok) {
        throw new Error(`Error al agregar zapatilla: ${response.status}`);
      }

      const newItem = await response.json();
      
      // Actualizar lista actual si está cargada
      if (currentList?.id === listId) {
        setCurrentList(prev => prev ? {
          ...prev,
          zapatillas: [...(prev.zapatillas || []), newItem]
        } : null);
      }

      return newItem;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      throw errorObj;
    }
  }, [getAccessToken, API_BASE_URL, currentList?.id]);

  // Eliminar zapatilla de lista
  const removeFromFavoriteList = useCallback(async (listId: number, zapatillaId: number) => {
    setError(null);

    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/listas-favoritos/${listId}/zapatillas/${zapatillaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar zapatilla: ${response.status}`);
      }

      // Actualizar lista actual si está cargada
      if (currentList?.id === listId) {
        setCurrentList(prev => prev ? {
          ...prev,
          zapatillas: (prev.zapatillas || []).filter((item: FavoriteListItem) => item.zapatilla_id !== zapatillaId)
        } : null);
      }

      return true;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      throw errorObj;
    }
  }, [getAccessToken, API_BASE_URL, currentList?.id]);

  // Función para obtener o crear lista predeterminada
  const getOrCreateDefaultList = useCallback(async () => {
    try {
      const lists = await fetchFavoriteLists();
      let defaultList = lists.find((list: FavoriteList) => list.predeterminada);
      
      if (!defaultList) {
        // Crear lista predeterminada si no existe
        defaultList = await createFavoriteList("Mis Favoritos", true);
      }
      
      setIsInitialized(true);
      return defaultList;
    } catch (error) {
      throw error;
    }
  }, [fetchFavoriteLists, createFavoriteList]);

  // Verificar si una zapatilla está en la lista predeterminada
  const checkIfInFavorites = useCallback(async (zapatillaId: number): Promise<boolean> => {
    try {
      const defaultList = await getOrCreateDefaultList();
      const listDetails = await fetchFavoriteList(defaultList.id);
      return listDetails.zapatillas?.some((item: FavoriteListItem) => item.zapatilla_id === zapatillaId) || false;
    } catch (error) {
      console.error('Error checking if in favorites:', error);
      return false;
    }
  }, [getOrCreateDefaultList, fetchFavoriteList]);
  const toggleFavorite = useCallback(async (zapatillaId: number) => {
    try {
      const defaultList = await getOrCreateDefaultList();
      
      // Cargar detalles de la lista para verificar si la zapatilla ya está
      const listDetails = await fetchFavoriteList(defaultList.id);
      
      const existingItem = listDetails.zapatillas?.find((item: FavoriteListItem) => item.zapatilla_id === zapatillaId);
      
      let result;
      if (existingItem) {
        // Quitar de favoritos
        await removeFromFavoriteList(defaultList.id, zapatillaId);
        result = { action: 'removed', list: defaultList };
      } else {
        // Agregar a favoritos
        await addToFavoriteList(defaultList.id, zapatillaId);
        result = { action: 'added', list: defaultList };
      }
      
      // Invalidar consultas relacionadas para forzar refetch
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['sneakers'] });
      
      return result;
    } catch (error) {
      throw error;
    }
  }, [getOrCreateDefaultList, fetchFavoriteList, addToFavoriteList, removeFromFavoriteList, queryClient]);

  return {
    favoriteLists,
    currentList,
    isLoading,
    error,
    isInitialized,
    fetchFavoriteList,
    addToFavoriteList,
    removeFromFavoriteList,
    toggleFavorite,
    getOrCreateDefaultList,
    checkIfInFavorites,
  };
}
