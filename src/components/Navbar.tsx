"use client";

import Image from "next/image";

// Define la interfaz para el usuario de Auth0
interface Auth0User {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
  // Puedes añadir más propiedades según necesites
}

// Componente Navbar
export default function Navbar({ user }: { user: Auth0User }) {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Sección izquierda */}
          <div className="flex">
            {/* Logo o nombre de la app */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">MiApp</span>
            </div>

            {/* Enlaces de navegación en desktop */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a
                href="#"
                className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </a>

              <a
                href="#"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Proyectos
              </a>

              <a
                href="#"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Reportes
              </a>
            </div>
          </div>

          {/* Sección derecha - usuario y cerrar sesión */}
          <div className="flex items-center space-x-4">
            {/* Información del usuario */}
            <div className="flex items-center space-x-3">
              {/* Avatar del usuario */}
              <div className="h-8 w-8 rounded-full overflow-hidden">
                {user.picture ? (
                  <Image
                    src={user.picture}
                    alt={user.name || "Avatar de usuario"}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {(user.name || "U").charAt(0)}
                  </div>
                )}
              </div>

              {/* Email del usuario (visible en pantallas medianas y grandes) */}
              <span className="text-sm text-gray-700 hidden md:inline">
                {user.email}
              </span>
            </div>

            {/* Botón de cerrar sesión */}
            <a
              href="/auth/logout"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              Cerrar sesión
            </a>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <a
            href="#"
            className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Dashboard
          </a>

          <a
            href="#"
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Proyectos
          </a>

          <a
            href="#"
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Reportes
          </a>
        </div>
      </div>
    </nav>
  );
}
