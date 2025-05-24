"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Filter, SortAsc } from "lucide-react";
import { useAllSneakers, useSearchSneakers } from "@/hooks/useSneakers";
import { SearchFilters } from "@/types/zapatilla";
import ZapatillaCard from "@/components/ZapatillaCard";
import Navbar from "@/components/Navbar";

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Inicializar filtros desde URL
  useEffect(() => {
    const initialFilters: SearchFilters = {};
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    const marca = searchParams.get('marca');
    const categoria = searchParams.get('categoria');
    const precio_min = searchParams.get('precio_min');
    const precio_max = searchParams.get('precio_max');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');

    if (page) initialFilters.page = parseInt(page);
    if (search) initialFilters.search = search;
    if (marca) initialFilters.marca = marca;
    if (categoria) initialFilters.categoria = categoria;
    if (precio_min) initialFilters.precio_min = parseFloat(precio_min);
    if (precio_max) initialFilters.precio_max = parseFloat(precio_max);
    if (sortBy) initialFilters.sortBy = sortBy;
    if (sortOrder) initialFilters.sortOrder = sortOrder as 'asc' | 'desc';

    setFilters(initialFilters);
    setCurrentPage(initialFilters.page || 1);
  }, [searchParams]);

  // Determinar qué hook usar
  const hasSearchFilters = filters.search || filters.marca || filters.categoria || filters.precio_min || filters.precio_max;
  
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

  const handleSearch = (query: string) => {
    const newFilters = { ...filters, search: query, page: 1 };
    updateUrlAndFilters(newFilters);
  };

  const handleCategorySelect = (category: string) => {
    const newFilters = { ...filters, categoria: category, page: 1 };
    updateUrlAndFilters(newFilters);
  };

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
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    updateUrlAndFilters(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
    router.push('/browse');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={handleSearch} onCategorySelect={handleCategorySelect} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 40 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={handleSearch} onCategorySelect={handleCategorySelect} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error loading sneakers</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sneakers = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} onCategorySelect={handleCategorySelect} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con filtros */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {filters.search ? `Results for "${filters.search}"` : 'Browse Sneakers'}
            </h1>
            {pagination && (
              <p className="text-gray-600 mt-1">
                Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Botón de filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            
            {/* Ordenamiento rápido */}
            <select
              value={`${filters.sortBy || 'fecha_creacion'}-${filters.sortOrder || 'desc'}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="fecha_creacion-desc">Newest</option>
              <option value="fecha_creacion-asc">Oldest</option>
              <option value="precio_min-asc">Price: Low to High</option>
              <option value="precio_min-desc">Price: High to Low</option>
              <option value="marca-asc">Brand A-Z</option>
              <option value="marca-desc">Brand Z-A</option>
            </select>
          </div>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <input
                  type="text"
                  placeholder="e.g., Nike, Adidas"
                  value={filters.marca || ''}
                  onChange={(e) => handleFilterChange({ marca: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.categoria || ''}
                  onChange={(e) => handleFilterChange({ categoria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">All Categories</option>
                  <option value="basketball">Basketball</option>
                  <option value="running">Running</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="skateboarding">Skateboarding</option>
                  <option value="football">Football</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (€)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.precio_min || ''}
                  onChange={(e) => handleFilterChange({ precio_min: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (€)</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={filters.precio_max || ''}
                  onChange={(e) => handleFilterChange({ precio_max: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Filtros activos */}
        {(filters.search || filters.marca || filters.categoria || filters.precio_min || filters.precio_max) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.search && (
              <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm flex items-center space-x-1">
                <span>Search: {filters.search}</span>
                <button
                  onClick={() => handleFilterChange({ search: undefined })}
                  className="text-gray-300 hover:text-white"
                >
                  ×
                </button>
              </span>
            )}
            {filters.marca && (
              <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm flex items-center space-x-1">
                <span>Brand: {filters.marca}</span>
                <button
                  onClick={() => handleFilterChange({ marca: undefined })}
                  className="text-gray-300 hover:text-white"
                >
                  ×
                </button>
              </span>
            )}
            {filters.categoria && (
              <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm flex items-center space-x-1">
                <span>Category: {filters.categoria}</span>
                <button
                  onClick={() => handleFilterChange({ categoria: undefined })}
                  className="text-gray-300 hover:text-white"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.precio_min || filters.precio_max) && (
              <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm flex items-center space-x-1">
                <span>
                  Price: €{filters.precio_min || 0} - €{filters.precio_max || '∞'}
                </span>
                <button
                  onClick={() => handleFilterChange({ precio_min: undefined, precio_max: undefined })}
                  className="text-gray-300 hover:text-white"
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
              <ZapatillaCard key={sneaker.id} zapatilla={sneaker} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No sneakers found matching your criteria</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Clear Filters
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
                  ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
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
                        ? 'bg-gray-900 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
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
                  ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
