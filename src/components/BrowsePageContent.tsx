"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useAllSneakers, useSearchSneakers } from "@/hooks/useSneakers";
import { SearchFilters, Zapatilla } from "@/types/zapatilla";
import ZapatillaCard from "@/components/ZapatillaCard";
import { useUser } from "@auth0/nextjs-auth0";
import { useQuery } from "@tanstack/react-query";
import { useSearchStore } from "@/stores/searchStore";

interface SortOption {
  key: string;
  label: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const sortOptions: SortOption[] = [
  {
    key: "newest",
    label: "Más nuevos",
    sortBy: "fecha_creacion",
    sortOrder: "desc",
  },
  {
    key: "oldest",
    label: "Más antiguos",
    sortBy: "fecha_creacion",
    sortOrder: "asc",
  },
  {
    key: "price-low",
    label: "Precio más bajo",
    sortBy: "precio_min",
    sortOrder: "asc",
  },
  {
    key: "price-high",
    label: "Precio más alto",
    sortBy: "precio_min",
    sortOrder: "desc",
  },
];

// Opciones de precio predefinidas
const priceOptions = [
  { label: "€0 - €50", min: 0, max: 50 },
  { label: "€50 - €100", min: 50, max: 100 },
  { label: "€100 - €150", min: 100, max: 150 },
  { label: "€150+", min: 150, max: null },
];

// Función para obtener la URL base de la API
const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

// Hook para obtener todas las tallas únicas
function useAvailableSizes() {
  return useQuery<string[]>({
    queryKey: ["sizes", "available"],
    queryFn: async () => {
      const apiUrl = `${getApiBaseUrl()}/tallas`;
      
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching sizes: ${response.status}`);
      }

      const tallasData = await response.json();
      
      // Extraer tallas únicas usando Set
      const tallasUnicas = new Set<string>();
      tallasData.forEach((talla: any) => {
        if (talla.disponible && talla.talla) {
          tallasUnicas.add(talla.talla);
        }
      });

      // Convertir a array y ordenar numéricamente
      return Array.from(tallasUnicas).sort((a, b) => {
        const aNum = parseFloat(a);
        const bNum = parseFloat(b);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        return a.localeCompare(b);
      });
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

export default function BrowsePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const { clearSearch } = useSearchStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});

  // Estados para los desplegables de filtros
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showSizeFilter, setShowSizeFilter] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Estados para filtros seleccionados
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<SortOption>(sortOptions[0]);

  // Obtener tallas disponibles
  const { data: availableSizes = [], isLoading: sizesLoading } = useAvailableSizes();

  // Contador de filtros activos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedPriceRange) count++;
    return count;
  };

  const getActiveSizeFiltersCount = () => {
    let count = 0;
    if (selectedSize) count++;
    return count;
  };

  // Inicializar filtros desde URL
  useEffect(() => {
    const initialFilters: SearchFilters = {};
    const page = searchParams.get("page");
    const search = searchParams.get("search"); // Mantener búsqueda del navbar
    const precio_min = searchParams.get("precio_min");
    const precio_max = searchParams.get("precio_max");
    const talla = searchParams.get("talla");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");

    if (page) initialFilters.page = parseInt(page);
    
    // Mantener búsqueda del navbar
    if (search) initialFilters.search = search;
    
    // Restaurar rango de precio seleccionado
    if (precio_min && precio_max) {
      const priceOption = priceOptions.find(
        option => option.min === parseFloat(precio_min) && 
        (option.max === null ? parseFloat(precio_max) >= 999999 : option.max === parseFloat(precio_max))
      );
      if (priceOption) {
        setSelectedPriceRange(priceOption.label);
        initialFilters.precio_min = priceOption.min;
        initialFilters.precio_max = priceOption.max || 999999;
      }
    }

    // Restaurar talla seleccionada
    if (talla) {
      setSelectedSize(talla);
      initialFilters.talla = talla;
    }

    // Restaurar ordenamiento
    if (sortBy && sortOrder) {
      const matchingSortOption = sortOptions.find(
        (option) => option.sortBy === sortBy && option.sortOrder === sortOrder
      );
      if (matchingSortOption) {
        setSelectedSort(matchingSortOption);
        initialFilters.sortBy = sortBy;
        initialFilters.sortOrder = sortOrder as "asc" | "desc";
      }
    }

    initialFilters.limit = 40;

    setFilters(initialFilters);
    setCurrentPage(initialFilters.page || 1);
  }, [searchParams]);

  // Determinar qué hook usar (ahora incluimos talla porque se filtra en backend)
  const hasSearchFilters = filters.search || filters.precio_min || filters.precio_max || filters.talla;

  const {
    data: allData,
    isLoading: allLoading,
    error: allError,
  } = useAllSneakers(
    currentPage,
    hasSearchFilters ? undefined : { ...filters, limit: 40 }
  );

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useSearchSneakers(
    hasSearchFilters ? { ...filters, page: currentPage, limit: 40 } : {}
  );

  const data = hasSearchFilters ? searchData : allData;
  const isLoading = hasSearchFilters ? searchLoading : allLoading;
  const error = hasSearchFilters ? searchError : allError;

  // No necesitamos filtrar en frontend, se hace en backend
  const filteredSneakers = data?.data || [];

  const updateUrlAndFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(newFilters.page || 1);

    // Actualizar URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        key !== "limit"
      ) {
        params.set(key, value.toString());
      }
    });

    router.push(`/browse?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page, limit: 40 };
    updateUrlAndFilters(newFilters);
  };

  const handleSortChange = (option: SortOption) => {
    setSelectedSort(option);
    const newFilters = {
      ...filters,
      sortBy: option.sortBy,
      sortOrder: option.sortOrder,
      page: 1,
      limit: 40,
    };
    updateUrlAndFilters(newFilters);
    setShowSortDropdown(false);
  };

  const handlePriceFilterChange = (priceOption: typeof priceOptions[0]) => {
    const newSelectedRange = selectedPriceRange === priceOption.label ? null : priceOption.label;
    setSelectedPriceRange(newSelectedRange);

    const newFilters = { ...filters };
    
    if (newSelectedRange) {
      newFilters.precio_min = priceOption.min;
      newFilters.precio_max = priceOption.max || 999999;
    } else {
      delete newFilters.precio_min;
      delete newFilters.precio_max;
    }

    const updatedFilters = { ...newFilters, page: 1, limit: 40 };
    updateUrlAndFilters(updatedFilters);
  };

  const handleSizeFilterChange = (size: string) => {
    const newSelectedSize = selectedSize === size ? null : size;
    setSelectedSize(newSelectedSize);

    const newFilters = { ...filters };
    
    if (newSelectedSize) {
      newFilters.talla = newSelectedSize;
    } else {
      delete newFilters.talla;
    }

    const updatedFilters = { ...newFilters, page: 1, limit: 40 };
    updateUrlAndFilters(updatedFilters);
  };

  const handleSneakerClick = (sneaker: Zapatilla) => {
    router.push(`/sneaker/${sneaker.id}`);
  };

  const clearAllFilters = () => {
    setSelectedPriceRange(null);
    setSelectedSize(null);
    setSelectedSort(sortOptions[0]);
    
    // Limpiar la búsqueda del navbar usando Zustand
    clearSearch();
    
    const clearedFilters = {
      limit: 40,
      sortBy: sortOptions[0].sortBy,
      sortOrder: sortOptions[0].sortOrder,
      page: 1,
    };
    
    setFilters(clearedFilters);
    setCurrentPage(1);
    
    // Redireccionar a browse sin parámetros
    router.push('/browse');
  };

  if (isLoading || sizesLoading) {
    return (
      <div className="min-h-screen bg-lightwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-darkwhite rounded w-64 mb-2"></div>
            <div className="h-4 bg-darkwhite rounded w-96 mb-8"></div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-64 flex-shrink-0">
                <div className="space-y-6">
                  <div className="h-4 bg-darkwhite rounded w-32"></div>
                  <div className="h-4 bg-darkwhite rounded w-28"></div>
                  <div className="h-12 bg-darkwhite rounded"></div>
                  <div className="h-12 bg-darkwhite rounded"></div>
                </div>
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {Array.from({ length: 40 }).map((_, index) => (
                    <div key={index} className="bg-darkwhite rounded-lg h-80" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-lightwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-redneon mb-4">Error al cargar zapatillas</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-lightblack text-lightwhite rounded-md hover:bg-verylightblack transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sneakers = filteredSneakers;
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-lightwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-lightblack mb-2">
            {filters.search
              ? `Resultados para "${filters.search}"`
              : "Explora todas las sneakers"}
          </h1>
          {pagination && (
            <p className="text-darkaccentwhite mt-2">
              Mostrando {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              de {pagination.total} resultados
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar con filtros */}
          <div className="w-full lg:w-64 flex-shrink-0">
            {/* Filtro de Precio */}
            <div className="mb-6">
              <button
                onClick={() => setShowPriceFilter(!showPriceFilter)}
                className="flex items-center justify-between w-full py-3 text-left font-medium text-lightblack border-b border-lightaccentwhite"
              >
                <span>
                  Filtrar por precio {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    showPriceFilter ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showPriceFilter && (
                <div className="pt-4 space-y-2">
                  {priceOptions.map((option) => (
                    <label key={option.label} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPriceRange === option.label}
                        onChange={() => handlePriceFilterChange(option)}
                        className="w-4 h-4 text-lightblack focus:ring-lightblack border-gray-300 rounded"
                      />
                      <span className="text-sm text-lightblack">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Filtro de Talla */}
            <div className="mb-6">
              <button
                onClick={() => setShowSizeFilter(!showSizeFilter)}
                className="flex items-center justify-between w-full py-3 text-left font-medium text-lightblack border-b border-lightaccentwhite"
              >
                <span>
                  Talla {getActiveSizeFiltersCount() > 0 && `(${getActiveSizeFiltersCount()})`}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    showSizeFilter ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showSizeFilter && (
                <div className="pt-4">
                  <div className="grid grid-cols-3 gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeFilterChange(size)}
                        className={`px-2 py-1 text-sm border rounded transition-colors ${
                          selectedSize === size
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
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            {/* Controles de ordenamiento */}
            <div className="flex items-center justify-between mb-6">
              <div></div> {/* Espacio vacío a la izquierda */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-lightblack hover:text-verylightblack underline transition-colors"
                >
                  Limpiar filtros
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center space-x-2 px-4 py-2 bg-lightwhite border border-lightaccentwhite rounded-md hover:border-darkaccentwhite transition-colors"
                  >
                    <span className="text-sm text-lightblack">Ordenar</span>
                    <ChevronDown className="w-4 h-4 text-lightblack" />
                  </button>
                  {showSortDropdown && (
                    <div className="absolute z-10 mt-2 w-48 bg-lightwhite border border-lightaccentwhite rounded-md shadow-lg right-0">
                      {sortOptions.map((option) => (
                        <button
                          key={option.key}
                          onClick={() => handleSortChange(option)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-darkwhite transition-colors ${
                            selectedSort.key === option.key ? "bg-darkwhite" : ""
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Grid de zapatillas - 2 columnas en móvil, 4 en desktop */}
            {sneakers.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {sneakers.map((sneaker) => (
                  <ZapatillaCard
                    key={sneaker.id}
                    zapatilla={sneaker}
                    onClick={() => handleSneakerClick(sneaker)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-darkaccentwhite mb-4">
                  No se encontraron zapatillas que coincidan con tus criterios
                </p>
              </div>
            )}

            {/* Paginación */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-colors ${
                    pagination.hasPrev
                      ? "bg-darkwhite border border-lightaccentwhite text-lightblack hover:border-darkaccentwhite cursor-pointer"
                      : "bg-lightaccentwhite/50 text-darkaccentwhite cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Anterior</span>
                </button>

                <div className="flex space-x-1">
                  {Array.from(
                    { length: Math.min(pagination.totalPages, 7) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 4) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 3) {
                        pageNum = pagination.totalPages - 6 + i;
                      } else {
                        pageNum = pagination.page - 3 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-md transition-colors ${
                            pageNum === pagination.page
                              ? "bg-lightblack text-lightwhite"
                              : "bg-darkwhite border cursor-pointer border-lightaccentwhite text-lightblack hover:border-darkaccentwhite"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-colors ${
                    pagination.hasNext
                      ? "bg-darkwhite border border-lightaccentwhite text-lightblack hover:border-darkaccentwhite cursor-pointer"
                      : "bg-lightaccentwhite/50 text-darkaccentwhite cursor-not-allowed"
                  }`}
                >
                  <span>Siguiente</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
