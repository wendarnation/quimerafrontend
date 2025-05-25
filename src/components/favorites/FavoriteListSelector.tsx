// components/favorites/FavoriteListSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Heart, Star } from "lucide-react";
import { useFavorites } from "../../hooks/useFavorites";

interface FavoriteListSelectorProps {
  zapatillaId: number;
  onAddToList?: (listId: number, listName: string) => void;
  className?: string;
}

export default function FavoriteListSelector({ 
  zapatillaId, 
  onAddToList,
  className = "" 
}: FavoriteListSelectorProps) {
  const { favoriteLists, fetchFavoriteLists, addToFavoriteList } = useFavorites();
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchFavoriteLists();
  }, [fetchFavoriteLists]);

  const handleAddToList = async (listId: number, listName: string) => {
    setIsProcessing(true);
    try {
      await addToFavoriteList(listId, zapatillaId);
      setIsOpen(false);
      onAddToList?.(listId, listName);
    } catch (error) {
      console.error('Error al agregar a la lista:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
        disabled={isProcessing}
      >
        <Heart className="h-4 w-4" />
        <span className="text-sm">Agregar a lista</span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <>
          {/* Overlay para cerrar al hacer click afuera */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                Seleccionar Lista
              </div>
              
              {favoriteLists.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No tienes listas creadas
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto">
                  {favoriteLists.map((list) => (
                    <button
                      key={list.id}
                      onClick={() => handleAddToList(list.id, list.nombre)}
                      disabled={isProcessing}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{list.nombre}</span>
                        {list.predeterminada && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {list.zapatillas?.length || 0} items
                      </span>
                    </button>
                  ))}
                </div>
              )}
              
              <div className="border-t border-gray-100 mt-2 pt-2">
                <a
                  href="/favorites"
                  className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                >
                  Gestionar listas →
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
