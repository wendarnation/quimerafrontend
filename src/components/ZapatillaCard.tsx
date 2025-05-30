"use client";

import { Zapatilla } from "@/types/zapatilla";
import { useState } from "react";
import FavoriteButtonZustand from "./favorites/FavoriteButtonZustand";

interface ZapatillaCardProps {
  zapatilla: Zapatilla;
  onClick?: () => void;
}

export default function ZapatillaCard({
  zapatilla,
  onClick,
}: ZapatillaCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price?: number | string | any) => {
    if (!price) return "N/A";
    
    // Convertir a número si es string o Decimal de Prisma
    const numPrice = typeof price === 'number' ? price : parseFloat(price.toString());
    
    if (isNaN(numPrice)) return "N/A";
    
    return `€${numPrice.toFixed(2)}`; // Mostrar siempre 2 decimales
  };



  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden border border-gray-100"
      onClick={onClick}
    >
      {/* Imagen y corazón */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {/* Botón de corazón */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButtonZustand 
            zapatillaId={zapatilla.id} 
            className="p-2 rounded-full bg-white/90 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
            size="sm"
          />
        </div>

        {/* Imagen */}
        {zapatilla.imagen && !imageError ? (
          <img
            src={zapatilla.imagen}
            alt={`${zapatilla.marca} ${zapatilla.modelo}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <img
            src="/placeholder-sneaker.svg"
            alt={`${zapatilla.marca} ${zapatilla.modelo}`}
            className="w-full h-full object-cover opacity-60"
          />
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
              <p className="text-sm text-gray-600 mb-1">Precio Más Bajo</p>
              <p className="text-lg font-bold text-gray-900">
                {formatPrice(zapatilla.precio_min)}
              </p>
              {zapatilla.precio_max &&
                zapatilla.precio_max !== zapatilla.precio_min && (
                  <p className="text-xs text-gray-500">
                    Hasta {formatPrice(zapatilla.precio_max)}
                  </p>
                )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-1">Precio</p>
              <p className="text-lg font-bold text-gray-900">--</p>
            </div>
          )}
        </div>

        {/* Estadísticas adicionales */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{zapatilla.tiendas_disponibles || 0} tiendas</span>
          <span className="px-2 py-1 bg-gray-100 rounded-full">
            {zapatilla.categoria || "General"}
          </span>
        </div>

        {/* SKU (oculto por defecto, visible en hover) */}
        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-xs text-gray-400 truncate">SKU: {zapatilla.sku}</p>
        </div>
      </div>
    </div>
  );
}
