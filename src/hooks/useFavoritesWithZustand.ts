// hooks/useFavoritesWithZustand.ts
"use client";

import { useCallback } from "react";
import { useAuth0Token } from "./useAuth0Token";
import { useQueryClient } from "@tanstack/react-query";
import { useFavoritesStore, FavoritesList, FavoriteItem } from "../stores/favoritesStore";

export function useFavoritesWithZustand() {
  const { getAccessToken } = useAuth0Token();
  const queryClient = useQueryClient();
  
  // Estado de Zustand
  const {
    defaultList,
    isLoading,
    isInitialized,
    error,
    favoriteIds,
    setDefaultList,
    setLoading,
    setError,
    setInitialized,
    addFavorite,
    removeFavorite,
    isFavorite,
    reset
  } = useFavoritesStore();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Inicializar lista predeterminada
  const initializeDefaultList = useCallback(async () => {
    if (isInitialized) return defaultList;
    
    setLoading(true);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      
      // Obtener listas existentes
      const listsResponse = await fetch(`${API_BASE_URL}/listas-favoritos`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!listsResponse.ok) {
        throw new Error(`Error al obtener listas: ${listsResponse.status}`);
      }

      const lists = await listsResponse.json();
      let defaultList = lists.find((list: FavoritesList) => list.predeterminada);
      
      // Crear lista predeterminada si no existe
      if (!defaultList) {
        const createResponse = await fetch(`${API_BASE_URL}/listas-favoritos`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre: "Mis Favoritos", predeterminada: true }),
        });

        if (!createResponse.ok) {
          throw new Error(`Error al crear lista: ${createResponse.status}`);
        }

        defaultList = await createResponse.json();
      }

      // Obtener detalles completos de la lista
      const detailsResponse = await fetch(`${API_BASE_URL}/listas-favoritos/${defaultList.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!detailsResponse.ok) {
        throw new Error(`Error al obtener detalles: ${detailsResponse.status}`);
      }

      const detailedList = await detailsResponse.json();
      
      // Actualizar store
      setDefaultList(detailedList);
      setInitialized(true);
      
      return detailedList;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, API_BASE_URL, isInitialized, defaultList, setDefaultList, setLoading, setError, setInitialized]);

  // Toggle favorito
  const toggleFavorite = useCallback(async (zapatillaId: number) => {
    try {
      const list = await initializeDefaultList();
      if (!list) throw new Error('No se pudo inicializar la lista');

      const accessToken = await getAccessToken();
      const isCurrentlyFavorite = isFavorite(zapatillaId);

      if (isCurrentlyFavorite) {
        // Remover de favoritos
        const response = await fetch(`${API_BASE_URL}/listas-favoritos/${list.id}/zapatillas/${zapatillaId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error al eliminar favorito: ${response.status}`);
        }

        // Actualizar store inmediatamente
        removeFavorite(zapatillaId);
        
        // Invalidar queries
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
        queryClient.invalidateQueries({ queryKey: ['sneakers'] });

        return { action: 'removed' as const, zapatillaId };
      } else {
        // Agregar a favoritos
        const response = await fetch(`${API_BASE_URL}/listas-favoritos/${list.id}/zapatillas`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ zapatilla_id: zapatillaId }),
        });

        if (!response.ok) {
          throw new Error(`Error al agregar favorito: ${response.status}`);
        }

        const newItem = await response.json();
        
        // Actualizar store inmediatamente
        addFavorite(zapatillaId, newItem);
        
        // Invalidar queries
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
        queryClient.invalidateQueries({ queryKey: ['sneakers'] });

        return { action: 'added' as const, zapatillaId };
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }, [initializeDefaultList, getAccessToken, API_BASE_URL, isFavorite, removeFavorite, addFavorite, queryClient]);

  // Remover favorito por ID
  const removeFromFavorites = useCallback(async (zapatillaId: number) => {
    try {
      const list = await initializeDefaultList();
      if (!list) throw new Error('No se pudo inicializar la lista');

      const accessToken = await getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/listas-favoritos/${list.id}/zapatillas/${zapatillaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar favorito: ${response.status}`);
      }

      // Actualizar store
      removeFavorite(zapatillaId);
      
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }, [initializeDefaultList, getAccessToken, API_BASE_URL, removeFavorite]);

  return {
    // Estado
    defaultList,
    isLoading,
    isInitialized,
    error,
    favoriteIds,
    
    // Operaciones
    initializeDefaultList,
    toggleFavorite,
    removeFromFavorites,
    isFavorite,
    reset,
    
    // Para compatibilidad con componentes existentes
    currentList: defaultList,
    fetchFavoriteList: initializeDefaultList,
    removeFromFavoriteList: removeFromFavorites,
  };
}
