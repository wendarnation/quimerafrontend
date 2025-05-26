"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Heart, ShoppingBag } from "lucide-react";
import { useSneakerDetails, useSneakerSizes } from "@/hooks/useSneakers";
import FavoriteButtonZustand from "@/components/favorites/FavoriteButtonZustand";
import { Talla } from "@/types/zapatilla";

export default function SneakerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const [imageError, setImageError] = useState(false);

  const { data: sneaker, isLoading: sneakerLoading, error: sneakerError } = useSneakerDetails(id);
  const { data: sizes, isLoading: sizesLoading, error: sizesError } = useSneakerSizes(id);

  if (sneakerLoading || sizesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-300 rounded-lg"></div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sneakerError || (!sneakerLoading && !sneaker)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              {sneakerError 
                ? `Error loading sneaker details: ${sneakerError.message}` 
                : 'Sneaker not found'
              }
            </p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!sneaker) {
    return null; // This shouldn't happen with the loading state, but just in case
  }

  const formatPrice = (price?: number | string | any) => {
    if (!price) return "N/A";
    
    // Convertir a número si es string o Decimal de Prisma
    const numPrice = typeof price === 'number' ? price : parseFloat(price.toString());
    
    if (isNaN(numPrice)) return "N/A";
    
    return `€${numPrice.toFixed(2)}`; // Mostrar siempre 2 decimales
  };

  // Calcular precios desde zapatillasTienda
  const calculatePrices = () => {
    if (!sneaker.zapatillasTienda || sneaker.zapatillasTienda.length === 0) {
      return { precio_min: undefined, precio_max: undefined, precio_promedio: undefined };
    }

    const precios = sneaker.zapatillasTienda
      .filter(zt => zt.disponible)
      .map(zt => {
        const numPrice = typeof zt.precio === 'number' ? zt.precio : parseFloat(zt.precio.toString());
        return isNaN(numPrice) ? 0 : numPrice;
      })
      .filter(price => price > 0);

    if (precios.length === 0) {
      return { precio_min: undefined, precio_max: undefined, precio_promedio: undefined };
    }

    const precio_min = Math.min(...precios);
    const precio_max = Math.max(...precios);
    const precio_promedio = precios.reduce((a, b) => a + b, 0) / precios.length;

    return { precio_min, precio_max, precio_promedio };
  };

  const { precio_min, precio_max, precio_promedio } = calculatePrices();
  
  // Agrupar tallas por tienda
  const sizesByStore = sizes?.reduce((acc, size) => {
    if (!size.tienda_nombre) return acc;
    
    const storeName = size.tienda_nombre;
    if (!acc[storeName]) {
      // Convertir el precio a número para evitar problemas de tipo
      const numPrice = typeof size.precio === 'number' ? size.precio : parseFloat(size.precio.toString());
      
      acc[storeName] = {
        tienda_id: size.tienda_id,
        tienda_nombre: size.tienda_nombre,
        precio: numPrice,
        tallas: []
      };
    }
    
    if (size.disponible) {
      acc[storeName].tallas.push(size);
    }
    
    return acc;
  }, {} as Record<string, { 
    tienda_id: number,
    tienda_nombre: string,
    precio: number, 
    tallas: Talla[] 
  }>) || {};

  // Obtener URLs de productos desde las zapatillasTienda
  const storeUrls = sneaker.zapatillasTienda?.reduce((acc, zt) => {
    acc[zt.tienda.nombre] = {
      url_producto: zt.url_producto,
      logo_url: zt.tienda.logo_url
    };
    return acc;
  }, {} as Record<string, { url_producto: string, logo_url?: string }>) || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagen */}
          <div className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
            {sneaker.imagen && !imageError ? (
              <img
                src={sneaker.imagen}
                alt={`${sneaker.marca} ${sneaker.modelo}`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <img
                  src="/placeholder-sneaker.svg"
                  alt={`${sneaker.marca} ${sneaker.modelo}`}
                  className="w-2/3 h-2/3 object-cover opacity-60"
                />
              </div>
            )}
          </div>

          {/* Detalles */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {sneaker.marca} {sneaker.modelo}
                </h1>
                <p className="text-gray-600 mt-1">SKU: {sneaker.sku}</p>
              </div>
              <FavoriteButtonZustand 
                zapatillaId={sneaker.id} 
                className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
                size="lg"
              />
            </div>

            {/* Precio */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Lowest Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(precio_min)}
                  </p>
                </div>
                {precio_max && precio_max !== precio_min && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Highest Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(precio_max)}
                    </p>
                  </div>
                )}
              </div>
              {precio_promedio && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Average Price</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPrice(precio_promedio)}
                  </p>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-600">Category</dt>
                  <dd className="text-sm font-medium text-gray-900">{sneaker.categoria || "General"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Available Stores</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {sneaker.zapatillasTienda?.filter(zt => zt.disponible).length || 0}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Release Date</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {new Date(sneaker.fecha_creacion).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Status</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      sneaker.activa 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {sneaker.activa ? "Active" : "Inactive"}
                    </span>
                  </dd>
                </div>
              </dl>
              {sneaker.descripcion && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <dt className="text-sm text-gray-600 mb-2">Description</dt>
                  <dd className="text-sm text-gray-900">{sneaker.descripcion}</dd>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tallas y Tiendas */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Sizes & Stores</h2>
          
          {Object.keys(sizesByStore).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.entries(sizesByStore).map(([storeName, storeData]) => {
                const storeInfo = storeUrls[storeName] || {};
                return (
                  <div key={storeName} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {storeInfo.logo_url && (
                          <img
                            src={storeInfo.logo_url}
                            alt={storeName}
                            className="w-8 h-8 object-contain"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{storeName}</h3>
                          <p className="text-sm text-gray-600">{formatPrice(storeData.precio)}</p>
                        </div>
                      </div>
                    </div>
                    
                    {storeData.tallas.length > 0 ? (
                      <>
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Available Sizes:</p>
                          <div className="flex flex-wrap gap-2">
                            {storeData.tallas.map((size) => (
                              <span
                                key={size.id}
                                className="px-3 py-1 bg-gray-100 text-gray-900 rounded-md text-sm font-medium"
                              >
                                {size.talla}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {storeInfo.url_producto && (
                          <a
                            href={storeInfo.url_producto}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                          >
                            <ShoppingBag className="h-4 w-4" />
                            <span>Buy at {storeName}</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">No sizes available</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-400 mb-4">
                <ShoppingBag className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sizes Available</h3>
              <p className="text-gray-600">
                This sneaker is currently not available in any stores or sizes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
