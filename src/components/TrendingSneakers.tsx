"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useLatestSneakers } from "@/hooks/useSneakers";
import ZapatillaCard from "./ZapatillaCard";
import { Zapatilla } from "@/types/zapatilla";

interface TrendingSneakersProps {
  onViewAll?: () => void;
  onSneakerClick?: (sneaker: Zapatilla) => void;
}

const ITEMS_PER_PAGE_DESKTOP = 5; // Mostrar 5 zapatillas en desktop

export default function TrendingSneakers({
  onViewAll,
  onSneakerClick,
}: TrendingSneakersProps) {
  const { data, isLoading, error } = useLatestSneakers();
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

  if (isLoading) {
    return (
      <div className="bg-lightwhite text-lightblack py-12">
        {/* Header con contenedor normal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg md:text-2xl font-bold">
                Sneakers en tendencia
              </h2>
              <div className="w-5 h-5 bg-lightblack/20 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Loading skeleton - Desktop con contenedor */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="bg-lightblack/10 rounded-lg h-80 animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Loading skeleton - Mobile sin contenedor */}
        <div className="md:hidden">
          <div className="flex space-x-4 overflow-x-auto pl-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-lightblack/10 rounded-lg h-64 w-36 flex-shrink-0 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-lightwhite text-lightblack py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Error al cargar zapatillas destacadas
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-lightblack text-darkwhite rounded-md hover:bg-verylightblack transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sneakers = data?.data || [];
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

  if (sneakers.length === 0) {
    return (
      <div className="bg-lightwhite text-lightblack py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-lg md:text-2xl font-bold mb-4">
              Zapatillas Destacadas
            </h2>
            <p className="text-darkaccentwhite">
              No hay zapatillas disponibles en este momento
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-lightwhite text-lightblack py-12">
      {/* Header con contenedor normal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg md:text-2xl text-lightblack font-bold">
              Novedades
            </h2>
          </div>

          <button
            onClick={onViewAll}
            className="flex items-center space-x-1 bg-pinkneon hover:bg-lightblack cursor-pointer px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-lightwhite transition-colors duration-500 group"
          >
            <span className="text-xs md:text-sm font-medium">Ver Todas</span>
          </button>
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
                transform: `translateX(-${currentPage * 100}%)`
              }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => {
                const pageStartIndex = pageIndex * ITEMS_PER_PAGE_DESKTOP;
                const pageSneakers = sneakers.slice(
                  pageStartIndex,
                  pageStartIndex + ITEMS_PER_PAGE_DESKTOP
                );
                
                return (
                  <div key={pageIndex} className="grid grid-cols-5 gap-4 w-full flex-shrink-0">
                    {pageSneakers.map((sneaker) => (
                      <ZapatillaCard
                        key={sneaker.id}
                        zapatilla={sneaker}
                        onClick={() => onSneakerClick?.(sneaker)}
                      />
                    ))}
                    {/* Rellenar con espacios vacíos si es necesario */}
                    {Array.from({ length: ITEMS_PER_PAGE_DESKTOP - pageSneakers.length }).map((_, emptyIndex) => (
                      <div key={`empty-${emptyIndex}`} className="invisible" />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination Dots removidos */}
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
