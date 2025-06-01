"use client";

import { useQuery } from "@tanstack/react-query";
import { Zapatilla, PaginatedResult } from "@/types/zapatilla";
import { useAuth0Token } from "./useAuth0Token";
import { useLatestSneakers } from "./useSneakers";

// Función para obtener la URL base de la API
const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

// Interfaz para elementos de favoritos
interface FavoriteItem {
  zapatilla_id: number;
  zapatilla: {
    marca: string;
    [key: string]: any;
  };
}

interface FavoriteList {
  zapatillas?: FavoriteItem[];
  [key: string]: any;
}

// Hook para obtener recomendaciones basadas en favoritos
export function useRecommendations() {
  const { getAccessToken } = useAuth0Token();
  const { data: latestData } = useLatestSneakers(); // Como fallback temporal

  return useQuery<PaginatedResult<Zapatilla>>({
    queryKey: ["recommendations", "favorites"],
    queryFn: async () => {
      try {
        const accessToken = await getAccessToken();
        
        // Obtener listas de favoritos del usuario
        const listsResponse = await fetch(`${getApiBaseUrl()}/listas-favoritos`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!listsResponse.ok) {
          // Si no hay favoritos, usar las últimas zapatillas como prueba temporal
          if (latestData?.data) {
            return {
              data: latestData.data.slice(0, 10), // Usar las primeras 10
              pagination: {
                page: 1,
                limit: 10,
                total: 10,
                totalPages: 1,
                hasNext: false,
                hasPrev: false
              }
            };
          }
          return { 
            data: [], 
            pagination: {
              page: 1,
              limit: 0,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false
            }
          };
        }

        const lists: FavoriteList[] = await listsResponse.json();
        
        // Obtener todas las zapatillas de favoritos
        const allFavoriteItems: FavoriteItem[] = lists.flatMap((list: FavoriteList) => list.zapatillas || []);
        
        if (allFavoriteItems.length === 0) {
          // Si no hay favoritos, usar las últimas zapatillas como prueba temporal
          if (latestData?.data) {
            return {
              data: latestData.data.slice(0, 10), // Usar las primeras 10
              pagination: {
                page: 1,
                limit: 10,
                total: 10,
                totalPages: 1,
                hasNext: false,
                hasPrev: false
              }
            };
          }
          return { 
            data: [], 
            pagination: {
              page: 1,
              limit: 0,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false
            }
          };
        }

        // Extraer marcas únicas de favoritos
        const favoriteBrands = [...new Set(allFavoriteItems.map((item: FavoriteItem) => item.zapatilla.marca))];
        
        // Obtener IDs de zapatillas favoritas para excluirlas
        const favoriteIds = allFavoriteItems.map((item: FavoriteItem) => item.zapatilla_id);

        // Buscar zapatillas de esas marcas (excluyendo las que ya están en favoritos)
        const brandQueries = favoriteBrands.map(async (brand: string) => {
          const response = await fetch(`${getApiBaseUrl()}/zapatillas/search?marca=${encodeURIComponent(brand)}&limit=10&sortBy=fecha_creacion&sortOrder=desc`, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            return [];
          }

          const result = await response.json() as PaginatedResult<Zapatilla>;
          
          // Filtrar zapatillas que no estén en favoritos
          return result.data.filter((sneaker: Zapatilla) => !favoriteIds.includes(sneaker.id));
        });

        const brandResults = await Promise.all(brandQueries);
        
        // Combinar resultados y mezclar
        const allRecommendations: Zapatilla[] = brandResults.flat();
        
        // Mezclar array para variedad
        const shuffled = allRecommendations.sort(() => 0.5 - Math.random());
        
        // Tomar máximo 15 recomendaciones
        const recommendations = shuffled.slice(0, 15);

        return {
          data: recommendations,
          pagination: {
            page: 1,
            limit: recommendations.length,
            total: recommendations.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        };

      } catch (error) {
        console.error('Error fetching recommendations:', error);
        // Como fallback, usar las últimas zapatillas
        if (latestData?.data) {
          return {
            data: latestData.data.slice(0, 10),
            pagination: {
              page: 1,
              limit: 10,
              total: 10,
              totalPages: 1,
              hasNext: false,
              hasPrev: false
            }
          };
        }
        return { 
          data: [], 
          pagination: {
            page: 1,
            limit: 0,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          }
        };
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    enabled: true, // Siempre habilitado
  });
}
