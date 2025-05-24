"use client";

import { useEffect, useRef } from 'react';

interface User {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
  nickname?: string;
}

interface UserSyncProps {
  user?: User;
}

export default function UserSync({ user }: UserSyncProps) {
  const syncedRef = useRef(false);

  useEffect(() => {
    async function syncUser() {
      // Solo sincronizar si hay usuario y no se ha sincronizado ya
      if (!user || syncedRef.current) return;

      try {
        console.log('🔄 Sincronizando usuario después del login...', user.sub || user.email);
        
        // Intentar obtener el access token de la ruta automática de Auth0 v4
        let accessToken: string | null = null;
        
        try {
          const tokenResponse = await fetch('/auth/access-token');
          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            accessToken = tokenData.accessToken;
          }
        } catch (tokenError) {
          console.warn('⚠️ No se pudo obtener access token:', tokenError);
        }

        // Intentar sincronizar con token si está disponible
        if (accessToken) {
          const syncResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sync-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              email: user.email,
              nombre_completo: user.name || null,
              nickname: user.nickname || null
            })
          });

          if (syncResponse.ok) {
            const result = await syncResponse.json();
            console.log('✅ Usuario sincronizado exitosamente (con token):', result);
            syncedRef.current = true;
            return;
          }
        }

        // Fallback: intentar con el endpoint de test sin autenticación
        console.log('🔄 Intentando sincronización sin token...');
        const syncTestResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sync-user-test`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            auth0Id: user.sub,
            email: user.email,
            nombre_completo: user.name || null,
            nickname: user.nickname || null
          })
        });

        if (syncTestResponse.ok) {
          const result = await syncTestResponse.json();
          console.log('✅ Usuario sincronizado exitosamente (sin token):', result);
          syncedRef.current = true;
        } else {
          console.warn('⚠️ Error al sincronizar usuario:', syncTestResponse.status);
        }
        
      } catch (error) {
        console.error('❌ Error sincronizando usuario:', error);
      }
    }

    // Delay para asegurar que el usuario esté completamente cargado
    const timeoutId = setTimeout(syncUser, 1500);
    
    return () => clearTimeout(timeoutId);
  }, [user]);

  // Este componente no renderiza nada visible
  return null;
}
