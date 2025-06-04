"use client";

import React from "react";
import { X } from "lucide-react";

interface SortOption {
  key: string;
  label: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface MobileFiltersOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;

  // Sort options
  sortOptions: SortOption[];
  tempSort: SortOption;
  setTempSort: (option: SortOption) => void;

  // Price options
  priceOptions: { label: string; min: number; max: number | null }[];
  tempPriceRange: string | null;
  setTempPriceRange: (range: string | null) => void;

  // Size options
  availableSizes: string[];
  tempSize: string | null;
  setTempSize: (size: string | null) => void;
}

export default function MobileFiltersOverlay({
  isOpen,
  onClose,
  onApply,
  onClear,
  sortOptions,
  tempSort,
  setTempSort,
  priceOptions,
  tempPriceRange,
  setTempPriceRange,
  availableSizes,
  tempSize,
  setTempSize,
}: MobileFiltersOverlayProps) {
  // Bloquear scroll del body cuando el overlay está abierto
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Limpiar al desmontar el componente
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getTempFiltersCount = () => {
    let count = 0;
    if (tempPriceRange) count++;
    if (tempSize) count++;
    return count;
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Overlay - Pantalla completa con animación desde abajo */}
      <div
        className={`fixed inset-0 z-50 bg-lightwhite transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header - Fijo */}
        <div className="flex items-center justify-between p-4 border-b border-lightaccentwhite flex-shrink-0">
          <h2 className="text-base font-bold text-lightblack">Filtro</h2>
          <button
            onClick={onClose}
            className="text-lightblack hover:text-verylightblack transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del filtro - Scrolleable */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-6">
          {/* Ordenar por */}
          <div>
            <h3 className="text-sm font-semibold text-lightblack mb-3">
              Ordenar por
            </h3>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <label key={option.key} className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                    type="radio"
                    name="sort"
                    checked={tempSort.key === option.key}
                    onChange={() => setTempSort(option)}
                    className="w-4 h-4 text-lightblack focus:ring-lightblack border-gray-300 accent-lightblack"
                    />
                    {tempSort.key === option.key && (
                      <div className="absolute inset-0 w-4 h-4 bg-lightblack rounded-full flex items-center justify-center pointer-events-none">
                        <div className="w-1.5 h-1.5 bg-lightwhite rounded-full" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-lightblack">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Filtrar por precio */}
          <div>
            <h3 className="text-sm font-semibold text-lightblack mb-3">
              Filtrar por precio
            </h3>
            <div className="space-y-2">
              {priceOptions.map((option) => (
                <label
                  key={option.label}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    checked={tempPriceRange === option.label}
                    onChange={() =>
                      setTempPriceRange(
                        tempPriceRange === option.label ? null : option.label
                      )
                    }
                    className="w-4 h-4 text-lightblack focus:ring-lightblack border-gray-300 rounded accent-lightblack"
                  />
                  <span className="text-sm text-lightblack">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tallas */}
          {availableSizes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-lightblack mb-3">
                Talla
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setTempSize(tempSize === size ? null : size)}
                    className={`px-2 py-1.5 text-xs border rounded transition-colors ${
                      tempSize === size
                        ? "bg-lightblack text-lightwhite border-lightblack"
                        : "bg-lightwhite text-lightblack border-lightaccentwhite hover:border-darkaccentwhite"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer con botones - Fijo en la parte inferior */}
        <div className="flex space-x-3 p-4 border-t border-lightaccentwhite bg-lightwhite flex-shrink-0">
          <button
            onClick={onClear}
            className="flex-1 px-4 py-2.5 border border-lightblack text-lightblack rounded-lg hover:bg-darkwhite transition-colors text-sm font-medium"
          >
            Borrar {getTempFiltersCount() > 0 && `(${getTempFiltersCount()})`}
          </button>
          <button
            onClick={onApply}
            className="flex-1 px-4 py-2.5 bg-lightblack text-lightwhite rounded-lg hover:bg-verylightblack transition-colors text-sm font-medium"
          >
            Aplicar
          </button>
        </div>
      </div>
    </>
  );
}
