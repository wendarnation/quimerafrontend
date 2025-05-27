"use client";

import { useEffect, useRef } from "react";
import { Buffer } from "buffer";

interface User {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
  nickname?: string;
  permissions?: string[];
}

interface UserSyncProps {
  user?: User;
}

export default function UserSync({ user }: UserSyncProps) {
  const syncedRef = useRef(false);

  useEffect(() => {
    async function syncUser() {
      if (!user || syncedRef.current) return;

      try {
        let accessToken: string | null = null;

        try {
          const tokenResponse = await fetch("/auth/access-token");

          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            accessToken =
              tokenData.access_token ||
              tokenData.accessToken ||
              tokenData.token;
          }
        } catch (tokenError) {
          // Token error - continue with fallback
        }

        if (accessToken) {
          let permissions = [];
          try {
            const tokenParts = accessToken.split(".");
            if (tokenParts.length === 3) {
              const tokenPayload = JSON.parse(
                Buffer.from(tokenParts[1], "base64").toString()
              );
              permissions = tokenPayload.permissions || [];
            }
          } catch (decodeError) {
            // Decode error - continue without permissions
          }

          // Verificar si el usuario ya tiene un nickname en la BD
          let finalNickname = null;
          try {
            const profileResponse = await fetch("/api/users/profile");
            if (profileResponse.ok) {
              const profile = await profileResponse.json();
              // Solo usar el nickname de Auth0 si no hay uno en la BD
              finalNickname = profile.nickname || user.nickname || null;
            } else {
              // Si no podemos obtener el perfil, usar el de Auth0
              finalNickname = user.nickname || null;
            }
          } catch (profileError) {
            // Si hay error obteniendo el perfil, usar el de Auth0
            finalNickname = user.nickname || null;
          }

          const syncResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/sync-user`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                auth0Id: user.sub,
                email: user.email,
                nombre_completo: user.name || null,
                nickname: finalNickname,
                permissions: permissions,
                first_login: true,
              }),
            }
          );

          if (syncResponse.ok) {
            syncedRef.current = true;
            return;
          }
        }

        // Fallback sync without token
        // Verificar si el usuario ya tiene un nickname en la BD
        let fallbackNickname = null;
        try {
          const profileResponse = await fetch("/api/users/profile");
          if (profileResponse.ok) {
            const profile = await profileResponse.json();
            // Solo usar el nickname de Auth0 si no hay uno en la BD
            fallbackNickname = profile.nickname || user.nickname || null;
          } else {
            // Si no podemos obtener el perfil, usar el de Auth0
            fallbackNickname = user.nickname || null;
          }
        } catch (profileError) {
          // Si hay error obteniendo el perfil, usar el de Auth0
          fallbackNickname = user.nickname || null;
        }

        const syncTestResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/sync-user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              auth0Id: user.sub,
              email: user.email,
              nombre_completo: user.name || null,
              nickname: fallbackNickname,
              permissions: user.permissions || [],
              first_login: true,
            }),
          }
        );

        if (syncTestResponse.ok) {
          syncedRef.current = true;
        }
      } catch (error) {
        // Sync error - fail silently
      }
    }

    const timeoutId = setTimeout(syncUser, 1500);

    return () => clearTimeout(timeoutId);
  }, [user]);

  return null;
}
