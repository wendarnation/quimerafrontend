"use client";

import { useState } from "react";
import { Search, User, Heart } from "lucide-react";
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
                title="Ir a Home"
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
              className="text-lightblack text-md font-medium transition-colors"
              title="Noticias"
            >
              Noticias
            </a>
            <a
              href="#"
              className="text-lightblack text-md font-medium transition-colors"
              title="Acerca de"
            >
              Acerca de
            </a>

            {/* Enlace de administración - solo visible para administradores */}
            {user && !permissionsLoading && hasAdminPermission() && (
              <a
                href="/admin/users"
                className="flex items-center space-x-1 text-lightblack text-md font-medium transition-colors"
                title="Usuarios"
              >
                <span>Usuarios</span>
              </a>
            )}

            {/* Usuario / Login */}
            {user ? (
              <div className="relative flex items-center space-x-4 ml-20">
                {/* Icón de favoritos */}
                <a
                  href="/favorites"
                  className="text-lightblack hover:text-redneon transition-colors"
                  title="Favoritos"
                >
                  <Heart className="h-5 w-5" />
                </a>

                {/* Avatar del usuario */}
                <a
                  href="/settings"
                  className="flex items-center hover:opacity-80 transition-opacity"
                  title="Ajustes"
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-transparent hover:border-verylightblack">
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
                </a>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-5">
                <a
                  href="/auth/login"
                  className="text-lightblack hover:text-white hover:bg-lightblack border border-lightblack rounded-3xl py-2 px-5 text-md font-medium transition-colors durantion-300"
                >
                  Login
                </a>
                <a
                  href="/auth/login"
                  className="bg-lightblack text-white text px-4  py-2 rounded-3xl py-2 px-5 text-md font-medium"
                >
                  Registrarse
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
