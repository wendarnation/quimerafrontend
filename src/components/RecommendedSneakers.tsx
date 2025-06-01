"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRecommendations } from "@/hooks/useRecommendations";
import ZapatillaCard from "./ZapatillaCard";
import { Zapatilla } from "@/types/zapatilla";

interface RecommendedSneakersProps {
  onViewAll?: () => void;
  onSneakerClick?: (sneaker: Zapatilla) => void;
}

const ITEMS_PER_PAGE_DESKTOP = 5; // Mostrar 5 zapatillas en desktop

export default function RecommendedSneakers({
  onViewAll,
  onSneakerClick,
}: RecommendedSneakersProps) {
  const { data, isLoading, error } = useRecommendations();
  const [currentPage, setCurrentPage] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | undefined>(undefined);

  // Manejar el scroll en móvil - actualizar en tiempo real
  const handleScroll = () => {
    setIsScrolling(true);

    // Actualizar posición del scroll en tiempo real
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      const clientWidth = scrollContainerRef.current.clientWidth;
      const maxScroll = scrollWidth - clientWidth;

      if (maxScroll > 0) {
        setScrollPosition(scrollLeft / maxScroll);
      }
    }

    // Limpiar timeout anterior
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    // Ocultar scrollbar después de 1 segundo
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Obtener datos de sneakers con verificación segura
  const sneakers: Zapatilla[] = data?.data || [];

  // No mostrar si no hay recomendaciones o está cargando/error
  if (isLoading || error || sneakers.length === 0) {
    return null;
  }

  const totalPages = Math.ceil(sneakers.length / ITEMS_PER_PAGE_DESKTOP);
  const startIndex = currentPage * ITEMS_PER_PAGE_DESKTOP;
  const currentSneakers = sneakers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE_DESKTOP
  );

  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-lightwhite text-lightblack py-1">
      {/* Header con contenedor normal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg md:text-2xl text-lightblack font-bold">
              Creemos que te gustarán
            </h2>
          </div>
        </div>
      </div>

      {/* Desktop Grid con contenedor normal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:block relative">
          {/* Navigation Arrows - Solo mostrar si hay páginas disponibles */}
          {canGoPrevious && (
            <button
              onClick={handlePrevious}
              className="absolute cursor-pointer -left-15 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all bg-lightblack text-darkwhite hover:bg-verylightblack overflow-visible"
            >
              <ChevronLeft className="h-8 w-8 -ml-1" />
            </button>
          )}

          {canGoNext && (
            <button
              onClick={handleNext}
              className="absolute cursor-pointer -right-15 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all bg-lightblack text-darkwhite hover:bg-verylightblack overflow-visible"
            >
              <ChevronRight className="h-8 w-8 -mr-1" />
            </button>
          )}

          {/* Grid - 5 columnas con transición de carousel */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentPage * 100}%)`,
              }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => {
                const pageStartIndex = pageIndex * ITEMS_PER_PAGE_DESKTOP;
                const pageSneakers = sneakers.slice(
                  pageStartIndex,
                  pageStartIndex + ITEMS_PER_PAGE_DESKTOP
                );

                return (
                  <div
                    key={pageIndex}
                    className="grid grid-cols-5 gap-4 w-full flex-shrink-0"
                  >
                    {pageSneakers.map((sneaker) => (
                      <ZapatillaCard
                        key={sneaker.id}
                        zapatilla={sneaker}
                        onClick={() => onSneakerClick?.(sneaker)}
                      />
                    ))}
                    {/* Rellenar con espacios vacíos si es necesario */}
                    {Array.from({
                      length: ITEMS_PER_PAGE_DESKTOP - pageSneakers.length,
                    }).map((_, emptyIndex) => (
                      <div key={`empty-${emptyIndex}`} className="invisible" />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Scroll - sin contenedor, pegado a los lados */}
      <div className="md:hidden relative">
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide pl-4"
          onScroll={handleScroll}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {sneakers.map((sneaker) => (
            <div key={sneaker.id} className="w-36 flex-shrink-0">
              <ZapatillaCard
                zapatilla={sneaker}
                onClick={() => onSneakerClick?.(sneaker)}
              />
            </div>
          ))}
        </div>

        {/* Scroll indicator - Solo el thumb, sin barra de fondo */}
        <div className="mt-2 mx-4 h-3">
          {isScrolling && (
            <div className="relative h-1">
              <div
                className="absolute h-1 bg-darkaccentwhite rounded-full transition-opacity duration-300"
                style={{
                  width: `${Math.max(20, (2.3 / sneakers.length) * 100)}%`,
                  left: `${
                    scrollPosition *
                    (100 - Math.max(20, (2.3 / sneakers.length) * 100))
                  }%`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
