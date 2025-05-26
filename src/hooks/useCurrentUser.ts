// hooks/useCurrentUser.ts
"use client";

import { useQuery } from "@tanstack/react-query";

export interface CurrentUser {
  id: number;
  email: string;
  rol: string;
  nombre_completo: string | null;
  nickname: string | null;
  fecha_registro: string;
  first_login: boolean;
}

export function useCurrentUser() {
  return useQuery<CurrentUser>({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await fetch("/api/users/profile", {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No autenticado");
        }
        throw new Error(`Error fetching current user: ${response.status}`);
      }

      return await response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error) => {
      // No reintentar si no está autenticado
      if (error.message === "No autenticado") {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useIsAuthenticated() {
  const { data: user, isLoading, error } = useCurrentUser();
  
  return {
    isAuthenticated: !!user && !error,
    isLoading,
    user,
    error
  };
}
