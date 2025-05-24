"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/browse');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (user) {
    return null; // Se redirigirá automáticamente
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Bienvenido a Quimera
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Inicia sesión para explorar nuestra colección de zapatillas
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <a
            href="/api/auth/login"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Iniciar Sesión
          </a>
          <div className="text-center">
            <a href="/" className="text-indigo-600 hover:text-indigo-500 text-sm">
              ← Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
