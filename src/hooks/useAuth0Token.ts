// hooks/useAuth0Token.ts
"use client";

import { useCallback, useState } from "react";

export function useAuth0Token() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAccessToken = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // En Auth0 v4, la ruta está disponible automáticamente
      const response = await fetch("/auth/access-token");

      if (!response.ok) {
        throw new Error(`Error obteniendo token: ${response.status}`);
      }

      const { accessToken } = await response.json();
      setIsLoading(false);
      return accessToken;
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      setIsLoading(false);
      throw errorObj;
    }
  }, []);

  return { getAccessToken, isLoading, error };
}
