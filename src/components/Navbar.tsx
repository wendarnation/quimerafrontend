"use client";

import { useState } from "react";
import { Search, User, Heart, Menu, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { hasAdminPermission, isLoading: permissionsLoading } =
    usePermissions();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    if (isMobileSearchOpen) {
      setSearchQuery("");
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-lightwhite text-white shadow-md sticky top-0 z-50">
        <div className="max-w-none w-[95%] h-12 md:h-20 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-full">
            {/* Versión Desktop */}
            <div className="hidden md:contents">
              {/* Logo/Nombre (Izquierda) */}
              <div className="flex-shrink-0">
                <a
                  href="/"
                  className="block hover:opacity-80 transition-opacity"
                >
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
                      className="w-full pl-10 pr-20 py-2 bg-darkwhite text-darkaccentwhite placeholder-darkaccentwhite border border-lightaccentwhite hover:border-darkaccentwhite rounded-lg focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent"
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

            {/* Versión Mobile */}
            <div className="md:hidden flex items-center justify-between w-full">
              {/* Menú hamburguesa */}
              <button
                onClick={toggleMobileMenu}
                className="text-lightblack hover:text-verylightblack transition-colors p-1"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Logo centrado */}
              <div className="flex-1 flex justify-center">
                <a
                  href="/"
                  className="block hover:opacity-80 transition-opacity"
                >
                  <img
                    src="/quimera_imagotipo_black.svg"
                    alt="Quimera Sneakers"
                    className="h-6 w-auto"
                    title="Ir a Home"
                  />
                </a>
              </div>

              {/* Icono de búsqueda */}
              <button
                onClick={toggleMobileSearch}
                className="text-lightblack hover:text-verylightblack transition-colors p-1"
                aria-label="Buscar"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda móvil - reemplaza el navbar completo */}
        {isMobileSearchOpen && (
          <div className="md:hidden absolute top-0 left-0 w-full h-12 bg-lightwhite shadow-md z-60">
            <div className="max-w-none w-[95%] h-12 mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-full">
                {/* Icono del menú a la izquierda - misma posición exacta */}
                <button
                  onClick={toggleMobileMenu}
                  className="text-lightblack hover:text-verylightblack transition-colors p-1"
                  aria-label="Abrir menú"
                >
                  <Menu className="h-5 w-5" />
                </button>

                {/* Barra de búsqueda centrada */}
                <div className="flex-1 flex justify-center px-3">
                  <div className="w-full max-w-xs">
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <input
                        type="text"
                        placeholder="Buscar por marca, modelo, sku..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-3 pr-3 py-1.5 text-sm bg-darkwhite text-darkaccentwhite placeholder-darkaccentwhite border border-lightaccentwhite rounded-lg focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent"
                        autoFocus
                      />
                    </form>
                  </div>
                </div>

                {/* Botón X donde estaría la lupa - misma posición exacta */}
                <button
                  onClick={toggleMobileSearch}
                  className="text-lightblack hover:text-verylightblack transition-colors p-1"
                  aria-label="Cerrar búsqueda"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay para cerrar el menú móvil */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Menú móvil deslizante - pantalla completa */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-lightwhite shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header del menú móvil */}
          <div className="flex items-center justify-between h-12 px-4 border-b border-lightaccentwhite">
            {/* Botón X a la izquierda */}
            <button
              onClick={closeMobileMenu}
              className="text-lightblack hover:text-verylightblack transition-colors p-1"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Logo centrado */}
            <div className="flex-1 flex justify-center">
              <img
                src="/quimera_imagotipo_black.svg"
                alt="Quimera Sneakers"
                className="h-6 w-auto"
              />
            </div>

            {/* Espacio vacío a la derecha para equilibrar */}
            <div className="w-7"></div>
          </div>

          {/* Contenido del menú móvil */}
          <div className="flex-1 py-4">
            <div className="space-y-1">
              <a
                href="#"
                className="block px-6 py-3 text-lightblack hover:bg-darkwhite hover:text-verylightblack transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                Noticias
              </a>
              <a
                href="#"
                className="block px-6 py-3 text-lightblack hover:bg-darkwhite hover:text-verylightblack transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                Acerca de
              </a>

              {/* Enlace de administración - solo visible para administradores */}
              {user && !permissionsLoading && hasAdminPermission() && (
                <a
                  href="/admin/users"
                  className="block px-6 py-3 text-lightblack hover:bg-darkwhite hover:text-verylightblack transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  Usuarios
                </a>
              )}

              {user && (
                <a
                  href="/favorites"
                  className="block px-6 py-3 text-lightblack hover:bg-darkwhite hover:text-verylightblack transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  Favoritos
                </a>
              )}
            </div>
          </div>

          {/* Footer del menú móvil - Usuario / Login */}
          <div className="border-t border-lightaccentwhite p-4">
            {user ? (
              <div className="space-y-3">
                {/* Info del usuario */}
                <div className="flex items-center space-x-3 px-2">
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-lightaccentwhite">
                    {user.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.name || "Avatar de usuario"}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-verylightblack flex items-center justify-center">
                        <User className="h-5 w-5 text-lightwhite" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-lightblack font-medium text-sm">
                      {user.name || "Usuario"}
                    </p>
                    <p className="text-darkaccentwhite text-xs">{user.email}</p>
                  </div>
                </div>
                {/* Botón de ajustes */}
                <a
                  href="/settings"
                  className="block w-full text-center px-4 py-2 bg-lightblack text-lightwhite rounded-lg hover:bg-verylightblack transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  Ajustes
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                <a
                  href="/auth/login"
                  className="block w-full text-center px-4 py-2 border border-lightblack text-lightblack rounded-lg hover:bg-lightblack hover:text-lightwhite transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  Login
                </a>
                <a
                  href="/auth/login"
                  className="block w-full text-center px-4 py-2 bg-lightblack text-lightwhite rounded-lg hover:bg-verylightblack transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  Registrarse
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
