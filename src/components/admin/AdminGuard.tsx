// components/admin/AdminGuard.tsx
"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Loader2, Shield } from "lucide-react";
import { usePermissions } from "../../hooks/usePermissions";

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { user, isLoading: userLoading } = useUser();
  const { hasAdminPermission, isLoading: permissionsLoading } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    // Si aún está cargando, no hacer nada
    if (userLoading || permissionsLoading) return;

    // Si no hay usuario, redirigir al login
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Si el usuario no tiene permisos de admin, redirigir al home
    if (!hasAdminPermission()) {
      router.push('/');
      return;
    }
  }, [user, userLoading, hasAdminPermission, permissionsLoading, router]);

  // Mostrar loading mientras se verifica
  if (userLoading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario o no tiene permisos, mostrar fallback o null
  if (!user || !hasAdminPermission()) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">No tienes permisos para acceder a esta página.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>;
}
