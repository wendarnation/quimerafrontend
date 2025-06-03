"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, ChevronDown, ChevronUp, X } from "lucide-react";
import { useAllSneakers, useSearchSneakers } from "@/hooks/useSneakers";
import { SearchFilters, Zapatilla } from "@/types/zapatilla";
import ZapatillaCard from "@/components/ZapatillaCard";
import { useUser } from "@auth0/nextjs-auth0";

interface SortOption {
  key: string;
  label: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const sortOptions: SortOption[] = [
  { key: 'featured', label: 'Destacados', sortBy: 'fecha_creacion', sortOrder: 'desc' },
  { key: 'newest', label: 'Más Nuevos', sortBy: 'fecha_creacion', sortOrder: 'desc' },
  { key: 'oldest', label: 'Más Antiguos', sortBy: 'fecha_creacion', sortOrder: 'asc' },
  { key: 'price-low', label: 'Precio: Menor a Mayor', sortBy: 'precio_min', sortOrder: 'asc' },
  { key: 'price-high', label: 'Precio: Mayor a Menor', sortBy: 'precio_min', sortOrder: 'desc' },
  { key: 'brand-az', label: 'Marca A-Z', sortBy: 'marca', sortOrder: 'asc' },
  { key: 'brand-za', label: 'Marca Z-A', sortBy: 'marca', sortOrder: 'desc' },
];

export default function BrowsePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [tempFilters, setTempFilters] = useState<SearchFilters>({});
  
  // Estados para los desplegables de filtros
  const [showSearchFilter, setShowSearchFilter] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  
  // Estados para el ordenamiento
  const [activeSortKey, setActiveSortKey] = useState('featured');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Estados para el slider de precio
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 1000]);

  // Estados para evitar actualizaciones innecesarias
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

  // Debounce para el slider de precio
  const debouncedPriceUpdate = useCallback(
    (newRange: [number, number]) => {
      if (isUpdatingPrice) return;
      
      setIsUpdatingPrice(true);
      setTimeout(() => {
        const newFilters = {
          ...filters,
          precio_min: newRange[0] > 0 ? newRange[0] : undefined,
          precio_max: newRange[1] < 1000 ? newRange[1] : undefined,
          page: 1,
          limit: 40
        };
        setFilters(newFilters);
        setTempFilters(newFilters);
        
        // Actualizar URL sin navegar
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '' && key !== 'limit') {
            params.set(key, value.toString());
          }
        });
        
        const newUrl = `/browse?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
        setIsUpdatingPrice(false);
      }, 300); // Debounce de 300ms
    },
    [filters, isUpdatingPrice]
  );

  // Inicializar filtros desde URL
  useEffect(() => {
    const initialFilters: SearchFilters = {};
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    const marca = searchParams.get('marca');
    const precio_min = searchParams.get('precio_min');
    const precio_max = searchParams.get('precio_max');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');

    if (page) initialFilters.page = parseInt(page);
    if (search) initialFilters.search = search;
    if (marca) initialFilters.marca = marca;
    if (precio_min) {
      initialFilters.precio_min = parseFloat(precio_min);
      setPriceRange([parseFloat(precio_min), priceRange[1]]);
      setTempPriceRange([parseFloat(precio_min), priceRange[1]]);
    }
    if (precio_max) {
      initialFilters.precio_max = parseFloat(precio_max);
      setPriceRange([priceRange[0], parseFloat(precio_max)]);
      setTempPriceRange([priceRange[0], parseFloat(precio_max)]);
    }
    if (sortBy && sortOrder) {
      initialFilters.sortBy = sortBy;
      initialFilters.sortOrder = sortOrder as 'asc' | 'desc';
      const matchingSortOption = sortOptions.find(
        option => option.sortBy === sortBy && option.sortOrder === sortOrder
      );
      if (matchingSortOption) {
        setActiveSortKey(matchingSortOption.key);
        setSortDirection(sortOrder as 'asc' | 'desc');
      }
    }

    initialFilters.limit = 40;

    setFilters(initialFilters);
    setTempFilters(initialFilters);
    setCurrentPage(initialFilters.page || 1);
  }, [searchParams]);

  // Determinar qué hook usar
  const hasSearchFilters = filters.search || filters.marca || filters.precio_min || filters.precio_max;
  
  const { data: allData, isLoading: allLoading, error: allError } = useAllSneakers(
    currentPage, 
    hasSearchFilters ? undefined : { ...filters, limit: 40 }
  );
  
  const { data: searchData, isLoading: searchLoading, error: searchError } = useSearchSneakers(
    hasSearchFilters ? { ...filters, page: currentPage, limit: 40 } : {}
  );

  const data = hasSearchFilters ? searchData : allData;
  const isLoading = hasSearchFilters ? searchLoading : allLoading;
  const error = hasSearchFilters ? searchError : allError;

  const updateUrlAndFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(newFilters.page || 1);
    
    // Actualizar URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && key !== 'limit') {
        params.set(key, value.toString());
      }
    });
    
    router.push(`/browse?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page, limit: 40 };
    updateUrlAndFilters(newFilters);
  };

  const handleSortClick = (option: SortOption) => {
    let newDirection: 'asc' | 'desc' = option.sortOrder;
    
    if (activeSortKey === option.key) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    setActiveSortKey(option.key);
    setSortDirection(newDirection);
    
    const newFilters = { 
      ...filters, 
      sortBy: option.sortBy, 
      sortOrder: newDirection,
      page: 1,
      limit: 40
    };
    updateUrlAndFilters(newFilters);
    setTempFilters(newFilters);
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setTempFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handlePriceRangeChange = (newRange: [number, number]) => {
    setTempPriceRange(newRange);
    setPriceRange(newRange);
    debouncedPriceUpdate(newRange);
  };

  const removeActiveFilter = (filterKey: keyof SearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    
    if (filterKey === 'precio_min' || filterKey === 'precio_max') {
      delete newFilters.precio_min;
      delete newFilters.precio_max;
      setPriceRange([0, 1000]);
      setTempPriceRange([0, 1000]);
    }
    
    const updatedFilters = { ...newFilters, page: 1, limit: 40 };
    updateUrlAndFilters(updatedFilters);
    setTempFilters(updatedFilters);
  };

  const applySearchFilter = () => {
    const updatedFilters = { ...tempFilters, page: 1, limit: 40 };
    updateUrlAndFilters(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({ limit: 40 });
    setTempFilters({ limit: 40 });
    setPriceRange([0, 1000]);
    setTempPriceRange([0, 1000]);
    setCurrentPage(1);
    router.push('/browse');
  };

  const handleSneakerClick = (sneaker: Zapatilla) => {
    router.push(`/sneaker/${sneaker.id}`);
  };

  if (isLoading) {
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

  const sneakers = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-lightwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-lightblack mb-2">
            {filters.search ? `Resultados para "${filters.search}"` : 'Hombres'}
          </h1>
          <p className="text-darkaccentwhite">
            {filters.search ? 'Compra y vende artículos para hombres en Quimera.' : 'Moda y productos para hombres al alcance de todos, ya que las marcas atléticas, streetwear y de lujo compiten para mantenerse al día con las últimas tendencias.'}
          </p>
          {pagination && (
            <p className="text-darkaccentwhite mt-2">
              Mostrando {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} resultados
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar con filtros */}
          <div className="w-full lg:w-64 flex-shrink-0">
            {/* Toggle para móvil */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-lightblack rounded"
                />
                <span className="ml-2 text-sm text-lightblack">Disponible Ahora</span>
              </span>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <span className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-lightblack rounded"
                />
                <span className="ml-2 text-sm text-lightblack">Envío Express</span>
              </span>
            </div>

            {/* Filtro de Búsqueda General */}
            <div className="mb-6">
              <button
                onClick={() => setShowSearchFilter(!showSearchFilter)}
                className="flex items-center justify-between w-full py-3 text-left font-medium text-lightblack border-b border-lightaccentwhite"
              >
                <span>BÚSQUEDA GENERAL</span>
                <ChevronDown className={`w-4 h-4 transform transition-transform ${showSearchFilter ? 'rotate-180' : ''}`} />
              </button>
              {showSearchFilter && (
                <div className="pt-4 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-verylightblack" />
                    <input
                      type="text"
                      placeholder="Marca, modelo o ambos..."
                      value={tempFilters.search || ''}
                      onChange={(e) => handleFilterChange({ search: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-lightwhite border border-lightaccentwhite rounded-lg focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent text-lightblack transition-all duration-200 hover:border-darkaccentwhite text-sm"
                    />
                    {tempFilters.search && (
                      <button
                        onClick={() => handleFilterChange({ search: '' })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-verylightblack hover:text-lightblack transition-colors cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={applySearchFilter}
                    className="w-full px-4 py-2 bg-lightblack text-lightwhite rounded-lg hover:bg-verylightblack transition-colors text-sm font-medium"
                  >
                    Aplicar Búsqueda
                  </button>
                </div>
              )}
            </div>

            {/* Filtro de Precio */}
            <div className="mb-6">
              <button
                onClick={() => setShowPriceFilter(!showPriceFilter)}
                className="flex items-center justify-between w-full py-3 text-left font-medium text-lightblack border-b border-lightaccentwhite"
              >
                <span>PRECIO</span>
                <ChevronDown className={`w-4 h-4 transform transition-transform ${showPriceFilter ? 'rotate-180' : ''}`} />
              </button>
              {showPriceFilter && (
                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between text-sm text-lightblack mb-2">
                    <span>€{tempPriceRange[0]}</span>
                    <span>€{tempPriceRange[1] >= 1000 ? '1000+' : tempPriceRange[1]}</span>
                  </div>
                  
                  {/* Slider de precio personalizado */}
                  <div className="relative">
                    <div className="h-2 bg-lightaccentwhite rounded-full">
                      <div 
                        className="h-2 bg-lightblack rounded-full"
                        style={{
                          marginLeft: `${(tempPriceRange[0] / 1000) * 100}%`,
                          width: `${((tempPriceRange[1] - tempPriceRange[0]) / 1000) * 100}%`
                        }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={tempPriceRange[0]}
                      onChange={(e) => {
                        const newMin = parseInt(e.target.value);
                        if (newMin <= tempPriceRange[1]) {
                          const newRange: [number, number] = [newMin, tempPriceRange[1]];
                          handlePriceRangeChange(newRange);
                        }
                      }}
                      className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={tempPriceRange[1]}
                      onChange={(e) => {
                        const newMax = parseInt(e.target.value);
                        if (newMax >= tempPriceRange[0]) {
                          const newRange: [number, number] = [tempPriceRange[0], newMax];
                          handlePriceRangeChange(newRange);
                        }
                      }}
                      className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            {/* Breadcrumb y controles de ordenamiento */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-darkaccentwhite">
                <span>Género / Hombres</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span className="text-sm text-lightblack mr-3">Ordenar:</span>
                {sortOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleSortClick(option)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm transition-colors ${
                      activeSortKey === option.key
                        ? 'bg-lightblack text-lightwhite'
                        : 'text-lightblack hover:bg-darkwhite'
                    }`}
                  >
                    <span>{option.label}</span>
                    {activeSortKey === option.key && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="w-3 h-3" /> : 
                        <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros activos */}
            {(filters.search || filters.marca || filters.precio_min || filters.precio_max) && (
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm text-lightblack mr-2">Filtros activos:</span>
                {filters.search && (
                  <span className="px-3 py-1 bg-lightblack text-lightwhite rounded-full text-sm flex items-center space-x-1">
                    <span>"{filters.search}"</span>
                    <button
                      onClick={() => removeActiveFilter('search')}
                      className="text-lightwhite hover:text-lightaccentwhite"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.marca && (
                  <span className="px-3 py-1 bg-lightblack text-lightwhite rounded-full text-sm flex items-center space-x-1">
                    <span>{filters.marca}</span>
                    <button
                      onClick={() => removeActiveFilter('marca')}
                      className="text-lightwhite hover:text-lightaccentwhite"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(filters.precio_min || filters.precio_max) && (
                  <span className="px-3 py-1 bg-lightblack text-lightwhite rounded-full text-sm flex items-center space-x-1">
                    <span>
                      €{filters.precio_min || 0} - €{filters.precio_max || '1000+'}
                    </span>
                    <button
                      onClick={() => removeActiveFilter('precio_min')}
                      className="text-lightwhite hover:text-lightaccentwhite"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-darkaccentwhite hover:text-lightblack underline"
                >
                  Limpiar Todo
                </button>
              </div>
            )}

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
                <p className="text-darkaccentwhite mb-4">No se encontraron zapatillas que coincidan con tus criterios</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-lightblack text-lightwhite rounded-md hover:bg-verylightblack transition-colors"
                >
                  Limpiar Filtros
                </button>
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
                      ? 'bg-darkwhite border border-lightaccentwhite text-lightblack hover:bg-lightaccentwhite'
                      : 'bg-lightaccentwhite text-darkaccentwhite cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Anterior</span>
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
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
                            ? 'bg-lightblack text-lightwhite'
                            : 'bg-darkwhite border border-lightaccentwhite text-lightblack hover:bg-lightaccentwhite'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-colors ${
                    pagination.hasNext
                      ? 'bg-darkwhite border border-lightaccentwhite text-lightblack hover:bg-lightaccentwhite'
                      : 'bg-lightaccentwhite text-darkaccentwhite cursor-not-allowed'
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

      {/* Estilos para el slider de precio */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #191717;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider-thumb::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #191717;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}