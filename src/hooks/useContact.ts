// hooks/useContact.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { ContactDto } from "@/types/contact";

export function useContactMutation() {
  return useMutation({
    mutationFn: async (data: ContactDto) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar el mensaje de contacto');
      }

      return await response.json();
    },
  });
}
