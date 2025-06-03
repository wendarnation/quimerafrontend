// components/admin/AdminGuard.tsx
"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Shield } from "lucide-react";
import { usePermissions } from "../../hooks/usePermissions";
import UserManagementSkeleton from "./UserManagementSkeleton";

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  showSkeleton?: boolean;
}

export default function AdminGuard({ children, fallback, showSkeleton = false }: AdminGuardProps) {
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

  // Mostrar skeleton mientras se verifica (solo si showSkeleton es true)
  if (userLoading || permissionsLoading) {
    if (showSkeleton) {
      return <UserManagementSkeleton />;
    }
    return null;
  }

  // Si no hay usuario o no tiene permisos, mostrar fallback o null
  if (!user || !hasAdminPermission()) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="min-h-screen bg-lightwhite flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-redneon mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-lightblack mb-2">Acceso Denegado</h2>
          <p className="text-verylightblack mb-6">No tienes permisos para acceder a esta página.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blueneon hover:bg-blueneon/90 text-lightwhite px-6 py-2 rounded-md font-medium transition-colors"
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
