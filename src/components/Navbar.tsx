"use client";

import { useState } from "react";
import { Search, User, ChevronDown, Users, Heart } from "lucide-react";
import Image from "next/image";
import { usePermissions } from "../hooks/usePermissions";
import { AuthUser } from "../types/auth";

interface NavbarProps {
  user?: AuthUser;
  onSearch?: (query: string) => void;
}

// Componente Navbar
export default function Navbar({ user, onSearch }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { hasAdminPermission, isLoading: permissionsLoading } =
    usePermissions();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <nav className="bg-lightwhite text-white shadow-md sticky top-0 z-50">
      <div className="max-w-none w-[95%] h-20 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full">
          {/* Logo/Nombre (Izquierda) */}
          <div className="flex-shrink-0">
            <a href="/" className="block hover:opacity-80 transition-opacity">
              <img
                src="/quimera_imagotipo_black.svg"
                alt="Quimera Sneakers"
                className="h-10 w-auto"
              />
            </a>
          </div>

          {/* Barra de búsqueda (Centro) */}
          <div className="flex-1 max-w-4xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-3 h-4 w-4 text-darkaccentwhite z-10" />
                <input
                  type="text"
                  placeholder="Buscar por marca, modelo, sku..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-20 py-2 bg-darkwhite text-darkaccentwhite placeholder-darkaccentwhite border border-lightaccentwhite hover:border-darkaccentwhite rounded-lg focus:outline-none focus:ring-2 focus:ring-darkaccentwhite focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Enlaces adicionales y Usuario (Derecha) */}
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-verylightblack text-md font-medium transition-colors"
            >
              Noticias
            </a>
            <a
              href="#"
              className="text-verylightblack text-md font-medium transition-colors"
            >
              Acerca de
            </a>

            {/* Enlace de favoritos - solo visible para usuarios autenticados */}
            {user && (
              <a
                href="/favorites"
                className="flex items-center space-x-1 text-verylightblack text-md font-medium transition-colors"
              >
                <span>Favoritos</span>
              </a>
            )}

            {/* Enlace de administración - solo visible para administradores */}
            {user && !permissionsLoading && hasAdminPermission() && (
              <a
                href="/admin/users"
                className="flex items-center space-x-1 text-verylightblack text-md font-medium transition-colors"
              >
                <span>Usuarios</span>
              </a>
            )}

            {/* Usuario / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="ml-20 flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                >
                  {/* Avatar del usuario */}
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-lightaccentwhite">
                    {user.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.name || "Avatar de usuario"}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-600 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* <span className="text-sm hidden md:inline">{user.name}</span> */}
                  <ChevronDown className="h-4 w-4 text-verylightblack font-semibold" />
                </button>

                {/* Dropdown del usuario */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-gray-500 text-xs">{user.email}</div>
                    </div>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Ajustes
                    </a>
                    <a
                      href="/auth/logout"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Cerrar sesión
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a
                  href="/auth/login"
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Iniciar Sesión
                </a>
                <a
                  href="/auth/login"
                  className="bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Registrarse
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay para cerrar dropdowns */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
          }}
        />
      )}
    </nav>
  );
}
