"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, isLoading } = useUser();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            {/* Header */}
            <div className="px-6 py-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
              <p className="text-gray-600">Información de tu cuenta en Quimera</p>
            </div>

            {/* Profile Content */}
            <div className="px-6 py-6">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                </div>
              ) : user ? (
                <div className="space-y-6">
                  {/* User Info */}
                  <div className="flex items-center space-x-6">
                    {user.picture && (
                      <Image
                        src={user.picture}
                        alt={user.name || 'Usuario'}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {user.name}
                      </h2>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        Miembro desde: {new Date(user.updated_at || '').toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Información Personal</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                          <dd className="text-sm text-gray-900">{user.name || 'No especificado'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="text-sm text-gray-900">{user.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Nickname</dt>
                          <dd className="text-sm text-gray-900">{user.nickname || 'No especificado'}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Configuración de Cuenta</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">ID de Usuario</dt>
                          <dd className="text-sm text-gray-900 font-mono">{user.sub}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email Verificado</dt>
                          <dd className="text-sm text-gray-900">
                            {user.email_verified ? (
                              <span className="text-green-600">✓ Verificado</span>
                            ) : (
                              <span className="text-red-600">✗ No verificado</span>
                            )}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex space-x-4">
                      <a
                        href="/browse"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Explorar Zapatillas
                      </a>
                      <a
                        href="/api/auth/logout"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Cerrar Sesión
                      </a>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
