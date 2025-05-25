// hooks/useAuth0Token.ts
"use client";

import { useCallback, useState } from "react";
import { getAccessToken } from "@auth0/nextjs-auth0";

export function useAuth0Token() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAccessTokenWrapper = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // En Auth0 v4, usar el hook oficial
      const accessToken = await getAccessToken();
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

  return { getAccessToken: getAccessTokenWrapper, isLoading, error };
}
