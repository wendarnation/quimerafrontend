"use client";

import { useState } from "react";
import { Search, User, ChevronDown } from "lucide-react";

// Define la interfaz para el usuario de Auth0
interface Auth0User {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
}

interface NavbarProps {
  user?: Auth0User;
  onSearch?: (query: string) => void;
  onCategorySelect?: (category: string) => void;
}

interface Category {
  name: string;
  label: string;
}

const categories: Category[] = [
  { name: "basketball", label: "Basketball" },
  { name: "running", label: "Running" },
  { name: "lifestyle", label: "Lifestyle" },
  { name: "skateboarding", label: "Skateboarding" },
  { name: "football", label: "Football" },
  { name: "unisex", label: "Unisex" },
];

// Componente Navbar
export default function Navbar({ user, onSearch, onCategorySelect }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleCategoryClick = (category: string) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
    setShowCategories(false);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo/Nombre (Izquierda) */}
          <div className="flex-shrink-0">
            <a href="/" className="text-xl font-bold text-white hover:text-gray-300 transition-colors">
              Quimera
            </a>
          </div>

          {/* Barra de búsqueda (Centro) */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for brand, color, etc."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Categorías y Usuario (Derecha) */}
          <div className="flex items-center space-x-6">
            {/* Dropdown de Categorías */}
            <div className="relative">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <span className="text-sm font-medium">Categories</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showCategories && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => handleCategoryClick(category.name)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Enlaces adicionales */}
            <a href="#" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              News
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              About
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              Help
            </a>

            {/* Usuario / Login */}
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Avatar del usuario */}
                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-600">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name || "Avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-300" />
                    </div>
                  )}
                </div>
                
                {/* Menú de usuario (simple por ahora) */}
                <div className="relative">
                  <button className="text-gray-300 hover:text-white transition-colors">
                    <span className="text-sm hidden md:inline">{user.name}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a
                  href="/auth/login"
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Login
                </a>
                <a
                  href="/auth/login"
                  className="bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay para cerrar dropdown en mobile */}
      {showCategories && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowCategories(false)}
        />
      )}
    </nav>
  );
}
