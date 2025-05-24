// Servicio para sincronizar usuario con el backend
export async function syncUserWithBackend(user: any, accessToken: string) {
  try {
    console.log('🔄 Sincronizando usuario con backend:', user.sub);
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    const response = await fetch(`${apiUrl}/auth/sync-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        email: user.email,
        nombre_completo: user.name || null,
        nickname: user.nickname || user.preferred_username || null
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error al sincronizar usuario:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Usuario sincronizado exitosamente:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error en syncUserWithBackend:', error);
    throw error;
  }
}

// Función helper para obtener datos del usuario de Auth0
export function extractUserData(user: any) {
  return {
    auth0Id: user.sub,
    email: user.email,
    nombre_completo: user.name || null,
    nickname: user.nickname || user.preferred_username || null,
    picture: user.picture || null
  };
}
