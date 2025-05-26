"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Heart, ShoppingBag } from "lucide-react";
import { useSneakerDetails, useSneakerSizes } from "@/hooks/useSneakers";
import FavoriteButtonZustand from "@/components/favorites/FavoriteButtonZustand";
import StarRating from "@/components/ratings/StarRating";
import CommentSection from "@/components/comments/CommentSection";
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
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="aspect-square bg-gray-700 rounded-lg"></div>
                <div className="h-32 bg-gray-700 rounded"></div>
                <div className="h-48 bg-gray-700 rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-700 rounded w-3/4"></div>
                <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                <div className="h-32 bg-gray-700 rounded"></div>
                <div className="h-48 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sneakerError || (!sneakerLoading && !sneaker)) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver</span>
          </button>
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">
              {sneakerError 
                ? `Error al cargar detalles de la zapatilla: ${sneakerError.message}` 
                : 'Zapatilla no encontrada'
              }
            </p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!sneaker) {
    return null;
  }

  const formatPrice = (price?: number | string | any) => {
    if (!price) return "N/A";
    
    const numPrice = typeof price === 'number' ? price : parseFloat(price.toString());
    
    if (isNaN(numPrice)) return "N/A";
    
    return `€${numPrice.toFixed(2)}`;
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
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Volver</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda - Imagen, Valoraciones y Comentarios */}
          <div className="space-y-6">
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

            {/* Sistema de valoraciones */}
            <StarRating zapatillaId={sneaker.id} />

            {/* Sección de comentarios */}
            <CommentSection zapatillaId={sneaker.id} />
          </div>

          {/* Columna derecha - Detalles y Tallas */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {sneaker.marca} {sneaker.modelo}
                </h1>
                <p className="text-gray-400 mt-1">SKU: {sneaker.sku}</p>
              </div>
              <FavoriteButtonZustand 
                zapatillaId={sneaker.id} 
                className="p-3 rounded-full bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200"
                size="lg"
              />
            </div>

            {/* Precio */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Precio Más Bajo</p>
                  <p className="text-2xl font-bold text-white">
                    {formatPrice(precio_min)}
                  </p>
                </div>
                {precio_max && precio_max !== precio_min && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Precio Más Alto</p>
                    <p className="text-2xl font-bold text-white">
                      {formatPrice(precio_max)}
                    </p>
                  </div>
                )}
              </div>
              {precio_promedio && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Precio Promedio</p>
                  <p className="text-lg font-semibold text-white">
                    {formatPrice(precio_promedio)}
                  </p>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Detalles</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-400">Categoría</dt>
                  <dd className="text-sm font-medium text-white">{sneaker.categoria || "General"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">Tiendas Disponibles</dt>
                  <dd className="text-sm font-medium text-white">
                    {sneaker.zapatillasTienda?.filter(zt => zt.disponible).length || 0}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">Fecha de Lanzamiento</dt>
                  <dd className="text-sm font-medium text-white">
                    {new Date(sneaker.fecha_creacion).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">Estado</dt>
                  <dd className="text-sm font-medium text-white">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      sneaker.activa 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {sneaker.activa ? "Activo" : "Inactivo"}
                    </span>
                  </dd>
                </div>
              </dl>
              {sneaker.descripcion && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <dt className="text-sm text-gray-400 mb-2">Descripción</dt>
                  <dd className="text-sm text-gray-300">{sneaker.descripcion}</dd>
                </div>
              )}
            </div>

            {/* Tallas Disponibles */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Tallas Disponibles</h3>
              
              {Object.keys(sizesByStore).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(sizesByStore).map(([storeName, storeData]) => {
                    const storeInfo = storeUrls[storeName] || {};
                    return (
                      <div key={storeName} className="border border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {storeInfo.logo_url && (
                              <img
                                src={storeInfo.logo_url}
                                alt={storeName}
                                className="w-8 h-8 object-contain"
                              />
                            )}
                            <div>
                              <h4 className="font-semibold text-white">{storeName}</h4>
                              <p className="text-sm text-gray-400">{formatPrice(storeData.precio)}</p>
                            </div>
                          </div>
                        </div>
                        
                        {storeData.tallas.length > 0 ? (
                          <>
                            <div className="mb-4">
                              <p className="text-sm text-gray-400 mb-2">Tallas:</p>
                              <div className="flex flex-wrap gap-2">
                                {storeData.tallas.map((size) => (
                                  <span
                                    key={size.id}
                                    className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm font-medium"
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
                                className="w-full flex items-center justify-center space-x-2 bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                              >
                                <ShoppingBag className="h-4 w-4" />
                                <span>Comprar en {storeName}</span>
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-500 text-sm">Sin tallas disponibles</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">No Hay Tallas Disponibles</h4>
                  <p className="text-gray-400">
                    Esta zapatilla no está disponible actualmente en ninguna tienda.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
