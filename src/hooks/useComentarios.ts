// hooks/useComentarios.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Comentario, CreateComentarioDto } from "@/types/comentarios";

const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

// Hook para obtener comentarios de una zapatilla
export function useComentarios(zapatillaId: number) {
  return useQuery<Comentario[]>({
    queryKey: ["comentarios", zapatillaId],
    queryFn: async () => {
      const response = await fetch(`${getApiBaseUrl()}/comentarios/zapatilla/${zapatillaId}`);
      if (!response.ok) {
        throw new Error(`Error fetching comentarios: ${response.status}`);
      }
      return await response.json();
    },
    enabled: !!zapatillaId,
  });
}

// Hook para crear un comentario
export function useCreateComentario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comentarioData: CreateComentarioDto) => {
      const response = await fetch("/api/comentarios", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comentarioData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error creating comentario: ${response.status}`);
      }

      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comentarios", data.zapatilla_id] });
    },
  });
}

// Hook para actualizar un comentario
export function useUpdateComentario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ comentarioId, texto }: { comentarioId: number, texto: string }) => {
      const response = await fetch(`/api/comentarios/${comentarioId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texto }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error updating comentario: ${response.status}`);
      }

      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comentarios", data.zapatilla_id] });
    },
  });
}

// Hook para eliminar un comentario
export function useDeleteComentario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comentarioId: number) => {
      const response = await fetch(`/api/comentarios/${comentarioId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error deleting comentario: ${response.status}`);
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comentarios"] });
    },
  });
}
