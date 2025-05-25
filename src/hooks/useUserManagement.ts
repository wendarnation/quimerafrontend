// hooks/useUserManagement.ts
"use client";

import { useCallback, useState } from "react";
import { useAuth0Token } from "./useAuth0Token";

export interface User {
  id: number;
  email: string;
  rol: string;
  nombre_completo: string | null;
  nickname: string | null;
  fecha_registro: string;
  first_login: boolean;
}

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getAccessToken } = useAuth0Token();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener usuarios: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken, API_BASE_URL]);

  const updateUserRole = useCallback(async (userId: number, newRole: string) => {
    setError(null);

    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/usuarios/change-role/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rol: newRole }),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar rol: ${response.status}`);
      }

      const updatedUser = await response.json();
      
      // Actualizar la lista local de usuarios
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, rol: newRole } : user
        )
      );

      return updatedUser;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      throw errorObj;
    }
  }, [getAccessToken, API_BASE_URL]);

  const deleteUser = useCallback(async (userId: number) => {
    setError(null);

    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar usuario: ${response.status}`);
      }

      // Actualizar la lista local de usuarios
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

      return true;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      throw errorObj;
    }
  }, [getAccessToken, API_BASE_URL]);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    updateUserRole,
    deleteUser,
  };
}
