// hooks/useZapatillasQuery.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth0Token } from "./useAuth0Token";
import { Zapatilla } from "@/types/zapatilla";

// Función para obtener la URL base de la API
const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL;
};

// Hook personalizado para obtener zapatillas
export function useApi() {
  const { getAccessToken } = useAuth0Token();

  return useQuery<Zapatilla[]>({
    queryKey: ["zapatillas"],
    queryFn: async () => {
      try {
        const token = await getAccessToken();
        const apiUrl = `${getApiBaseUrl()}/zapatillas`;

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching zapatillas: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Error fetching zapatillas:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos antes de considerar los datos obsoletos
  });
}

// Hook genérico para cualquier endpoint protegido
export function useProtectedQuery<T>(
  endpoint: string,
  queryKey: string[],
  options = {}
) {
  const { getAccessToken } = useAuth0Token();
  const apiUrl = `${getApiBaseUrl()}${endpoint}`;

  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      try {
        const token = await getAccessToken();

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error en la petición: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error(`Error en la consulta a ${endpoint}:`, error);
        throw error;
      }
    },
    ...options,
  });
}
