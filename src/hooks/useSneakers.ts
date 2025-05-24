"use client";

import { useQuery } from "@tanstack/react-query";
import { Zapatilla, PaginatedResult, SearchFilters } from "@/types/zapatilla";

// Función para obtener la URL base de la API
const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

// Hook para obtener zapatillas sin autenticación (últimas 15)
export function useLatestSneakers() {
  return useQuery<PaginatedResult<Zapatilla>>({
    queryKey: ["sneakers", "latest"],
    queryFn: async () => {
      const apiUrl = `${getApiBaseUrl()}/zapatillas/paginated/15?page=1&sortBy=fecha_creacion&sortOrder=desc`;
      
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching latest sneakers: ${response.status}`);
      }

      return await response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para búsqueda con filtros y paginación
export function useSearchSneakers(filters: SearchFilters) {
  const queryParams = new URLSearchParams();
  
  // Construir parámetros de consulta
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  return useQuery<PaginatedResult<Zapatilla>>({
    queryKey: ["sneakers", "search", filters],
    queryFn: async () => {
      const apiUrl = `${getApiBaseUrl()}/zapatillas/search?${queryParams.toString()}`;
      
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error searching sneakers: ${response.status}`);
      }

      return await response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutos para búsquedas
    enabled: Object.keys(filters).length > 0, // Solo ejecutar si hay filtros
  });
}

// Hook para obtener todas las zapatillas con paginación (40 por página)
export function useAllSneakers(page: number = 1, filters?: Partial<SearchFilters>) {
  const searchFilters: SearchFilters = {
    page,
    limit: 40,
    sortBy: 'fecha_creacion',
    sortOrder: 'desc',
    ...filters
  };

  return useQuery<PaginatedResult<Zapatilla>>({
    queryKey: ["sneakers", "all", page, filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const apiUrl = `${getApiBaseUrl()}/zapatillas/search/paginated/40?${queryParams.toString()}`;
      
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching all sneakers: ${response.status}`);
      }

      return await response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook genérico para cualquier endpoint público
export function usePublicQuery<T>(
  endpoint: string,
  queryKey: string[],
  options = {}
) {
  const apiUrl = `${getApiBaseUrl()}${endpoint}`;

  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      return await response.json();
    },
    ...options,
  });
}
