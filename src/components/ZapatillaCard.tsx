"use client";

import { Heart } from "lucide-react";
import { Zapatilla } from "@/types/zapatilla";
import { useState } from "react";

interface ZapatillaCardProps {
  zapatilla: Zapatilla;
  onClick?: () => void;
}

export default function ZapatillaCard({ zapatilla, onClick }: ZapatillaCardProps) {
  const [isHearted, setIsHearted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price?: number) => {
    if (!price) return "N/A";
    return `€${price.toFixed(0)}`;
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHearted(!isHearted);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden border border-gray-100"
      onClick={onClick}
    >
      {/* Imagen y corazón */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {/* Botón de corazón */}
        <button
          onClick={handleHeartClick}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-sm"
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              isHearted 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-400 hover:text-red-500'
            }`} 
          />
        </button>

        {/* Imagen */}
        {zapatilla.imagen && !imageError ? (
          <img
            src={zapatilla.imagen}
            alt={`${zapatilla.marca} ${zapatilla.modelo}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
            <div className="text-center">
              <div className="text-4xl mb-2">👟</div>
              <div className="text-xs">No Image</div>
            </div>
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="p-4">
        {/* Título */}
        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {zapatilla.marca} {zapatilla.modelo}
        </h3>

        {/* Precio */}
        <div className="mb-2">
          {zapatilla.precio_min ? (
            <div>
              <p className="text-sm text-gray-600 mb-1">Lowest Ask</p>
              <p className="text-lg font-bold text-gray-900">
                {formatPrice(zapatilla.precio_min)}
              </p>
              {zapatilla.precio_max && zapatilla.precio_max !== zapatilla.precio_min && (
                <p className="text-xs text-gray-500">
                  Up to {formatPrice(zapatilla.precio_max)}
                </p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-1">Price</p>
              <p className="text-lg font-bold text-gray-900">--</p>
            </div>
          )}
        </div>

        {/* Estadísticas adicionales */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {zapatilla.tiendas_disponibles || 0} tiendas
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full">
            {zapatilla.categoria || 'General'}
          </span>
        </div>

        {/* SKU (oculto por defecto, visible en hover) */}
        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-xs text-gray-400 truncate">
            SKU: {zapatilla.sku}
          </p>
        </div>
      </div>
    </div>
  );
}
