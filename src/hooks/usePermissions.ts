// hooks/usePermissions.ts
"use client";

import { useCallback, useState, useEffect } from "react";
import { useAuth0Token } from "./useAuth0Token";

interface DecodedToken {
  permissions?: string[];
  [key: string]: any;
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { getAccessToken } = useAuth0Token();

  const extractPermissionsFromToken = useCallback((token: string): string[] => {
    try {
      // Decodificar el payload del JWT (sin verificar la firma, solo para leer)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const decoded: DecodedToken = JSON.parse(jsonPayload);
      return decoded.permissions || [];
    } catch (error) {
      return [];
    }
  }, []);

  const loadPermissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      const userPermissions = extractPermissionsFromToken(accessToken);
      setPermissions(userPermissions);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken, extractPermissionsFromToken]);

  const hasPermission = useCallback((permission: string) => {
    return permissions.includes(permission);
  }, [permissions]);

  const hasAdminPermission = useCallback(() => {
    return hasPermission('admin:zapatillas');
  }, [hasPermission]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  return {
    permissions,
    hasPermission,
    hasAdminPermission,
    isLoading,
    error,
    refetch: loadPermissions
  };
}
