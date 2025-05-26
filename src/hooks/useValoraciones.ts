// hooks/useValoraciones.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Valoracion, PromedioValoracion, CreateValoracionDto } from "@/types/valoraciones";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

// Hook para obtener valoraciones de una zapatilla
export function useValoraciones(zapatillaId: number) {
  return useQuery<Valoracion[]>({
    queryKey: ["valoraciones", zapatillaId],
    queryFn: async () => {
      const response = await fetch(`${getApiBaseUrl()}/valoraciones/zapatilla/${zapatillaId}`);
      if (!response.ok) {
        throw new Error(`Error fetching valoraciones: ${response.status}`);
      }
      return await response.json();
    },
    enabled: !!zapatillaId,
  });
}

// Hook para obtener el promedio de valoraciones
export function usePromedioValoraciones(zapatillaId: number) {
  return useQuery<PromedioValoracion>({
    queryKey: ["valoraciones", "promedio", zapatillaId],
    queryFn: async () => {
      const response = await fetch(`${getApiBaseUrl()}/valoraciones/zapatilla/${zapatillaId}/average`);
      if (!response.ok) {
        throw new Error(`Error fetching promedio: ${response.status}`);
      }
      return await response.json();
    },
    enabled: !!zapatillaId,
  });
}

// Hook para crear una valoración
export function useCreateValoracion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (valoracionData: CreateValoracionDto) => {
      const response = await fetch("/api/valoraciones", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(valoracionData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error creating valoracion: ${response.status}`);
      }

      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["valoraciones", data.zapatilla_id] });
      queryClient.invalidateQueries({ queryKey: ["valoraciones", "promedio", data.zapatilla_id] });
    },
  });
}

// Hook para actualizar una valoración
export function useUpdateValoracion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ valoracionId, puntuacion }: { valoracionId: number, puntuacion: number }) => {
      const response = await fetch(`/api/valoraciones/${valoracionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ puntuacion }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error updating valoracion: ${response.status}`);
      }

      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["valoraciones", data.zapatilla_id] });
      queryClient.invalidateQueries({ queryKey: ["valoraciones", "promedio", data.zapatilla_id] });
    },
  });
}

// Hook para eliminar una valoración
export function useDeleteValoracion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (valoracionId: number) => {
      const response = await fetch(`/api/valoraciones/${valoracionId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error deleting valoracion: ${response.status}`);
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["valoraciones"] });
    },
  });
}
