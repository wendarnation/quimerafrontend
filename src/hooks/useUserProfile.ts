"use client";

import { useState, useEffect } from "react";

interface UserProfile {
  id: number;
  auth0Id: string;
  email: string;
  nickname: string | null;
  nombre_completo: string | null;
  rol: string;
  first_login: boolean;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          // Si no está autenticado o hay error, no es necesariamente un error crítico
          if (response.status === 401) {
            setProfile(null);
            return;
          }
          throw new Error("Error al obtener el perfil del usuario");
        }

        const profileData = await response.json();
        setProfile(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
}
