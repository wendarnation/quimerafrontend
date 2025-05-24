"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useLatestSneakers } from "@/hooks/useSneakers";
import ZapatillaCard from "./ZapatillaCard";
import { Zapatilla } from "@/types/zapatilla";

interface TrendingSneakersProps {
  onViewAll?: () => void;
  onSneakerClick?: (sneaker: Zapatilla) => void;
}

const ITEMS_PER_PAGE = 6; // Mostrar 6 zapatillas a la vez

export default function TrendingSneakers({ onViewAll, onSneakerClick }: TrendingSneakersProps) {
  const { data, isLoading, error } = useLatestSneakers();
  const [currentPage, setCurrentPage] = useState(0);

  if (isLoading) {
    return (
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold">Trending Sneakers</h2>
              <div className="w-5 h-5 bg-white/20 rounded-full animate-pulse" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white/10 rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-400 mb-4">Error loading trending sneakers</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sneakers = data?.data || [];
  const totalPages = Math.ceil(sneakers.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentSneakers = sneakers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Trending Sneakers</h2>
            <p className="text-gray-400">No sneakers available at the moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold">Trending Sneakers</h2>
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <span className="text-gray-900 text-xs font-bold">?</span>
            </div>
          </div>
          
          <button
            onClick={onViewAll}
            className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors group"
          >
            <span className="text-sm font-medium">See All</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Sneakers Grid */}
        <div className="relative">
          {/* Navigation Arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={handlePrevious}
                disabled={!canGoPrevious}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  canGoPrevious
                    ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  canGoNext
                    ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {currentSneakers.map((sneaker) => (
              <ZapatillaCard 
                key={sneaker.id} 
                zapatilla={sneaker} 
                onClick={() => onSneakerClick?.(sneaker)}
              />
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentPage
                    ? 'bg-white'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
