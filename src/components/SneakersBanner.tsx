"use client";

import { useLatestSneakers } from "@/hooks/useSneakers";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SneakersBanner() {
  const { data, isLoading } = useLatestSneakers();
  const [sneakers, setSneakers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      setSneakers(data.data);
    }
  }, [data]);

  const formatPrice = (price: number | string | undefined) => {
    if (!price) return "Consultar precio";
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(numPrice)) return "Consultar precio";
    return `${numPrice.toFixed(2)}€`;
  };

  const handleSneakerClick = (sneakerId: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // Solo navegar si es una zapatilla real (no placeholder)
    if (sneakers.length > 0) {
      router.push(`/sneaker/${sneakerId}`);
    }
  };

  // Datos placeholder que se muestran inmediatamente
  const placeholderData = [
    { id: 1, marca: "NIKE", modelo: "Air Jordan 1", precio_min: 179.95 },
    { id: 2, marca: "ADIDAS", modelo: "Stan Smith", precio_min: 89.95 },
    { id: 3, marca: "NEW BALANCE", modelo: "990v5", precio_min: 199.95 },
    { id: 4, marca: "CONVERSE", modelo: "Chuck Taylor", precio_min: 69.95 },
    { id: 5, marca: "VANS", modelo: "Old Skool", precio_min: 79.95 },
    { id: 6, marca: "NIKE", modelo: "Air Max 90", precio_min: 149.95 },
    { id: 7, marca: "ADIDAS", modelo: "Ultraboost", precio_min: 189.95 },
    { id: 8, marca: "PUMA", modelo: "Suede Classic", precio_min: 79.95 },
  ];

  const displayContent = sneakers.length > 0 ? sneakers : placeholderData;
  const isRealData = sneakers.length > 0;

  // Crear exactamente el doble del contenido para el efecto infinito
  const bannerItems = [...displayContent, ...displayContent];

  return (
    <div className="bg-lightblack py-2 md:py-3 overflow-hidden relative border-b border-gray-800">
      {/* Contenedor que siempre está visible */}
      <div className="sneakers-banner">
        {bannerItems.map((item, index) => (
          <button
            key={`${item.id}-${index}`}
            onClick={(e) => handleSneakerClick(item.id, e)}
            disabled={!isRealData}
            className={`inline-flex items-center mx-8 md:mx-12 text-sm md:text-base ${
              isRealData ? "cursor-pointer" : "cursor-default"
            }`}
          >
            <span className="font-bold text-darkwhite text-sm uppercase tracking-wider">
              {item.marca}
            </span>
            <span className="mx-3 text-lightaccentwhite text-sm">•</span>
            <span className="font-medium text-lightaccentwhite">
              {item.modelo}
            </span>
            <span className="mx-3 text-lightaccentwhite">—</span>
            <span className="text-greenneon text-base font-semibold">
              {formatPrice(item.precio_min)}
            </span>
          </button>
        ))}
      </div>

      {/* Gradientes suaves en los bordes */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-black via-black/90 to-transparent pointer-events-none z-10"></div>
      <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-black via-black/90 to-transparent pointer-events-none z-10"></div>
    </div>
  );
}
