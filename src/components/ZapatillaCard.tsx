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
    const numPrice =
      typeof price === "number" ? price : parseFloat(price.toString());

    if (isNaN(numPrice)) return "N/A";

    return `${numPrice.toFixed(2)}€`; // Mostrar siempre 2 decimales
  };

  return (
    <div
      className="bg-lightwhite rounded-lg transition-all duration-200 cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      {/* Imagen y corazón */}
      <div className="relative aspect-square bg-lightwhite overflow-hidden">
        {/* Botón de corazón */}
        <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
          <FavoriteButtonZustand
            zapatillaId={zapatilla.id}
            className="p-1.5 md:p-2 rounded-full cursor-pointer bg-lightwhite transition-all duration-200"
            size="md"
          />
        </div>

        {/* Imagen */}
        {zapatilla.imagen && !imageError ? (
          <img
            src={zapatilla.imagen}
            alt={`${zapatilla.marca} ${zapatilla.modelo}`}
            className="w-full h-full object-cover scale-90 md:scale-95 group-hover:scale-95 md:group-hover:scale-100 transition-transform duration-500"
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
      <div className="px-4 -mt-6 pt-1 pb-4 relative z-10">
        {/* Título - Marca y Modelo en filas separadas */}
        <div className="mb-3">
          <h3 className="font-bold text-lightblack text-xs md:text-base leading-tight line-clamp-1 group-hover:text-verylightblack transition-colors">
            {zapatilla.marca}
          </h3>
          <p className="font-normal text-darkaccentwhite text-xs md:text-sm leading-tight line-clamp-1 mt-0.5">
            {zapatilla.modelo}
          </p>
        </div>

        {/* Precio */}
        <div className="mb-2">
          {zapatilla.precio_min ? (
            <div>
              <p className="text-xs md:text-sm text-darkaccentwhite">
                Precio Más Bajo
              </p>
              <p className="text-base md:text-lg font-bold text-greenneon">
                {formatPrice(zapatilla.precio_min)}
              </p>
              {zapatilla.precio_max &&
                zapatilla.precio_max !== zapatilla.precio_min && (
                  <p className="text-xs text-darkaccentwhite">
                    Hasta {formatPrice(zapatilla.precio_max)}
                  </p>
                )}
            </div>
          ) : (
            <div>
              <p className="text-xs md:text-sm text-darkaccentwhite mb-1">
                Precio
              </p>
              <p className="text-base md:text-lg font-bold text-lightblack">
                --
              </p>
            </div>
          )}
        </div>

        {/* Estadísticas adicionales */}
        <div className="flex items-center justify-between text-xs text-darkaccentwhite">
          <span>{zapatilla.tiendas_disponibles || 0} tiendas</span>
        </div>
      </div>
    </div>
  );
}
