"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Filter, SortAsc, Search } from "lucide-react";
import { useAllSneakers, useSearchSneakers } from "@/hooks/useSneakers";
import { SearchFilters, Zapatilla } from "@/types/zapatilla";
import ZapatillaCard from "@/components/ZapatillaCard";
import { useUser } from "@auth0/nextjs-auth0";

export default function BrowsePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [tempFilters, setTempFilters] = useState<SearchFilters>({}); // Filtros temporales antes de aplicar
  const [showFilters, setShowFilters] = useState(false);

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
    if (precio_min) initialFilters.precio_min = parseFloat(precio_min);
    if (precio_max) initialFilters.precio_max = parseFloat(precio_max);
    if (sortBy) initialFilters.sortBy = sortBy;
    if (sortOrder) initialFilters.sortOrder = sortOrder as 'asc' | 'desc';

    setFilters(initialFilters);
    setTempFilters(initialFilters); // Sincronizar filtros temporales
    setCurrentPage(initialFilters.page || 1);
  }, [searchParams]);

  // Determinar qué hook usar
  const hasSearchFilters = filters.search || filters.marca || filters.precio_min || filters.precio_max;
  
  const { data: allData, isLoading: allLoading, error: allError } = useAllSneakers(
    currentPage, 
    hasSearchFilters ? undefined : filters
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
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });
    
    router.push(`/browse?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    updateUrlAndFilters(newFilters);
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    // Solo actualizar los filtros temporales, no aplicar inmediatamente
    setTempFilters(prev => ({ ...prev, ...newFilters }));
  };

  const removeActiveFilter = (filterKey: keyof SearchFilters) => {
    // Crear nuevos filtros sin el filtro especificado
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    
    // Si se está eliminando precio_min o precio_max, eliminar ambos si el otro también está vacío
    if (filterKey === 'precio_min' || filterKey === 'precio_max') {
      if (filterKey === 'precio_min' && !newFilters.precio_max) {
        delete newFilters.precio_max;
      } else if (filterKey === 'precio_max' && !newFilters.precio_min) {
        delete newFilters.precio_min;
      }
    }
    
    // Aplicar los cambios inmediatamente
    const updatedFilters = { ...newFilters, page: 1 };
    updateUrlAndFilters(updatedFilters);
    setTempFilters(updatedFilters); // Sincronizar filtros temporales
  };

  const applyFilters = () => {
    // Aplicar los filtros temporales
    const updatedFilters = { ...tempFilters, page: 1 };
    updateUrlAndFilters(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setTempFilters({});
    setCurrentPage(1);
    router.push('/browse');
  };

  const handleSneakerClick = (sneaker: Zapatilla) => {
    router.push(`/sneaker/${sneaker.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 40 }).map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Error al cargar zapatillas</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
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
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con filtros */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {filters.search ? `Resultados para "${filters.search}"` : 'Explorar Zapatillas'}
            </h1>
            {pagination && (
              <p className="text-gray-300 mt-1">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} resultados
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Botón de filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors text-white"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </button>
            
            {/* Ordenamiento rápido */}
            <select
              value={`${filters.sortBy || 'fecha_creacion'}-${filters.sortOrder || 'desc'}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                const updatedFilters = { ...filters, sortBy, sortOrder: sortOrder as 'asc' | 'desc' };
                updateUrlAndFilters(updatedFilters);
                setTempFilters(updatedFilters);
              }}
              className="px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-gray-800 text-white"
            >
              <option value="fecha_creacion-desc">Más Nuevos</option>
              <option value="fecha_creacion-asc">Más Antiguos</option>
              <option value="precio_min-asc">Precio: Menor a Mayor</option>
              <option value="precio_min-desc">Precio: Mayor a Menor</option>
              <option value="marca-asc">Marca A-Z</option>
              <option value="marca-desc">Marca Z-A</option>
            </select>
          </div>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-sm mb-6 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Búsqueda general</label>
                <input
                  type="text"
                  placeholder="ej: jordan aj1, nike dunk"
                  value={tempFilters.search || ''}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-gray-700 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Marca</label>
                <input
                  type="text"
                  placeholder="ej: Nike, Adidas"
                  value={tempFilters.marca || ''}
                  onChange={(e) => handleFilterChange({ marca: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-gray-700 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Precio Mínimo (€)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={tempFilters.precio_min || ''}
                  onChange={(e) => handleFilterChange({ precio_min: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Precio Máximo (€)</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={tempFilters.precio_max || ''}
                  onChange={(e) => handleFilterChange({ precio_max: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <div className="md:col-span-2"></div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Limpiar Todo
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={applyFilters}
                  className="px-6 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Aplicar Filtros</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filtros activos */}
        {(filters.search || filters.marca || filters.precio_min || filters.precio_max) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.search && (
              <span className="px-3 py-1 bg-white text-gray-900 rounded-full text-sm flex items-center space-x-1">
                <span>Búsqueda: {filters.search}</span>
                <button
                  onClick={() => removeActiveFilter('search')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.marca && (
              <span className="px-3 py-1 bg-white text-gray-900 rounded-full text-sm flex items-center space-x-1">
                <span>Marca: {filters.marca}</span>
                <button
                  onClick={() => removeActiveFilter('marca')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.precio_min || filters.precio_max) && (
              <span className="px-3 py-1 bg-white text-gray-900 rounded-full text-sm flex items-center space-x-1">
                <span>
                  Precio: €{filters.precio_min || 0} - €{filters.precio_max || '∞'}
                </span>
                <button
                  onClick={() => {
                    // Crear filtros sin precio_min y precio_max
                    const newFilters = { ...filters };
                    delete newFilters.precio_min;
                    delete newFilters.precio_max;
                    const updatedFilters = { ...newFilters, page: 1 };
                    updateUrlAndFilters(updatedFilters);
                    setTempFilters(updatedFilters);
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Grid de zapatillas */}
        {sneakers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
            <p className="text-gray-300 mb-4">No se encontraron zapatillas que coincidan con tus criterios</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
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
                  ? 'bg-gray-800 border border-gray-600 text-white hover:bg-gray-700'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
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
                        ? 'bg-white text-gray-900'
                        : 'bg-gray-800 border border-gray-600 text-white hover:bg-gray-700'
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
                  ? 'bg-gray-800 border border-gray-600 text-white hover:bg-gray-700'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
