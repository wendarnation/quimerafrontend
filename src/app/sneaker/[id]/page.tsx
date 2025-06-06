"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import { useSneakerDetails, useSneakerSizes } from "@/hooks/useSneakers";
import FavoriteButtonZustand from "@/components/favorites/FavoriteButtonZustand";
import StarRating from "@/components/ratings/StarRating";
import CommentSection from "@/components/comments/CommentSection";
import ReportSneakerButton from "@/components/reports/ReportSneakerButton";
import { Talla } from "@/types/zapatilla";

export default function SneakerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const [imageError, setImageError] = useState(false);

  // Estados para los desplegables
  const [showRatings, setShowRatings] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  const {
    data: sneaker,
    isLoading: sneakerLoading,
    error: sneakerError,
  } = useSneakerDetails(id);
  const {
    data: sizes,
    isLoading: sizesLoading,
    error: sizesError,
  } = useSneakerSizes(id);

  if (sneakerLoading || sizesLoading) {
    return (
      <div className="min-h-screen bg-lightwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-lightaccentwhite rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="aspect-square bg-lightaccentwhite rounded-lg"></div>
                <div className="h-32 bg-lightaccentwhite rounded"></div>
                <div className="h-48 bg-lightaccentwhite rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-lightaccentwhite rounded w-3/4"></div>
                <div className="h-6 bg-lightaccentwhite rounded w-1/2"></div>
                <div className="h-32 bg-lightaccentwhite rounded"></div>
                <div className="h-48 bg-lightaccentwhite rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sneakerError || (!sneakerLoading && !sneaker)) {
    return (
      <div className="min-h-screen bg-lightwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-darkaccentwhite hover:text-lightblack transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver</span>
          </button>
          <div className="text-center py-12">
            <p className="text-redneon mb-4">
              {sneakerError
                ? `Error al cargar detalles de la zapatilla: ${sneakerError.message}`
                : "Zapatilla no encontrada"}
            </p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-lightblack text-lightwhite rounded-md hover:bg-verylightblack transition-colors"
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

    const numPrice =
      typeof price === "number" ? price : parseFloat(price.toString());

    if (isNaN(numPrice)) return "N/A";

    return `€${numPrice.toFixed(2)}`;
  };

  // Calcular precios desde zapatillasTienda
  const calculatePrices = () => {
    if (!sneaker.zapatillasTienda || sneaker.zapatillasTienda.length === 0) {
      return {
        precio_min: undefined,
        precio_max: undefined,
        precio_promedio: undefined,
      };
    }

    const precios = sneaker.zapatillasTienda
      .filter((zt) => zt.disponible)
      .map((zt) => {
        const numPrice =
          typeof zt.precio === "number"
            ? zt.precio
            : parseFloat(zt.precio.toString());
        return isNaN(numPrice) ? 0 : numPrice;
      })
      .filter((price) => price > 0);

    if (precios.length === 0) {
      return {
        precio_min: undefined,
        precio_max: undefined,
        precio_promedio: undefined,
      };
    }

    const precio_min = Math.min(...precios);
    const precio_max = Math.max(...precios);
    const precio_promedio = precios.reduce((a, b) => a + b, 0) / precios.length;

    return { precio_min, precio_max, precio_promedio };
  };

  const { precio_min, precio_max, precio_promedio } = calculatePrices();

  // Agrupar tallas por tienda
  const sizesByStore =
    sizes?.reduce(
      (acc, size) => {
        if (!size.tienda_nombre) return acc;

        const storeName = size.tienda_nombre;
        if (!acc[storeName]) {
          const numPrice =
            typeof size.precio === "number"
              ? size.precio
              : parseFloat(size.precio.toString());

          acc[storeName] = {
            tienda_id: size.tienda_id,
            tienda_nombre: size.tienda_nombre,
            precio: numPrice,
            tallas: [],
          };
        }

        if (size.disponible) {
          acc[storeName].tallas.push(size);
        }

        return acc;
      },
      {} as Record<
        string,
        {
          tienda_id: number;
          tienda_nombre: string;
          precio: number;
          tallas: Talla[];
        }
      >
    ) || {};

  // Obtener URLs de productos desde las zapatillasTienda
  const storeUrls =
    sneaker.zapatillasTienda?.reduce((acc, zt) => {
      acc[zt.tienda.nombre] = {
        url_producto: zt.url_producto,
        logo_url: zt.tienda.logo_url,
      };
      return acc;
    }, {} as Record<string, { url_producto: string; logo_url?: string }>) || {};

  return (
    <div className="min-h-screen bg-lightwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-darkaccentwhite hover:text-lightblack transition-colors mb-4 lg:mb-8 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 lg:h-5 lg:w-5" />
          <span className="text-sm lg:text-base">Volver</span>
        </button>

        {/* Info mobile - Solo visible en mobile */}
        <div className="lg:hidden mb-6">
          {/* Header Mobile */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-lightblack">
                {sneaker.marca}
              </h1>
              <h2 className="text-base text-darkaccentwhite">
                {sneaker.modelo}
              </h2>
              <p className="text-darkaccentwhite mt-2 text-xs">
                SKU: {sneaker.sku}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ReportSneakerButton 
                sneakerId={sneaker.id}
                sneakerName={`${sneaker.marca} ${sneaker.modelo}`}
              />
              <FavoriteButtonZustand
                zapatillaId={sneaker.id}
                className="p-2 rounded-full bg-lightwhite cursor-pointer transition-all duration-200"
                size="md"
              />
            </div>
          </div>

          {/* Precio Mobile */}
          <div className="bg-lightwhite rounded-lg -mb-8 mt-8">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-darkaccentwhite">Precio más bajo</p>
                <p className="text-lg font-bold text-greenneon">
                  {formatPrice(precio_min)}
                </p>
              </div>
              {precio_max && precio_max !== precio_min && (
                <div>
                  <p className="text-xs text-darkaccentwhite mb-1">
                    Precio más alto
                  </p>
                  <p className="text-lg font-bold text-lightblack">
                    {formatPrice(precio_max)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Columna izquierda - Imagen */}
          <div className="space-y-6">
            {/* Imagen */}
            <div className="aspect-square bg-lightwhite overflow-hidden lg:aspect-square">
              <div className="w-4/5 h-4/5 mx-auto lg:w-full lg:h-full lg:mt-0">
                {sneaker.imagen && !imageError ? (
                  <img
                    src={sneaker.imagen}
                    alt={`${sneaker.marca} ${sneaker.modelo}`}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-lightaccentwhite">
                    <img
                      src="/placeholder-sneaker.svg"
                      alt={`${sneaker.marca} ${sneaker.modelo}`}
                      className="w-2/3 h-2/3 object-cover opacity-60"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tallas Disponibles - Desplegable (Solo mobile) */}
            <div className="bg-lightwhite rounded-lg lg:hidden -mt-20">
              <button
                onClick={() => setShowSizes(!showSizes)}
                className="flex items-center justify-between w-full p-4 text-left font-semibold text-lightblack cursor-pointer"
              >
                <span className="text-base">Tallas Disponibles</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    showSizes ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showSizes && (
                <div className="px-4 pb-4 border-t border-lightaccentwhite">
                  <div className="pt-4">
                    {Object.keys(sizesByStore).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(sizesByStore).map(
                          ([storeName, storeData]) => {
                            const storeInfo = storeUrls[storeName] || {};
                            return (
                              <div
                                key={storeName}
                                className="border border-lightaccentwhite rounded-lg p-3 bg-lightwhite"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    {storeInfo.logo_url && (
                                      <img
                                        src={storeInfo.logo_url}
                                        alt={storeName}
                                        className="w-6 h-6 object-contain"
                                      />
                                    )}
                                    <div>
                                      <h4 className="font-semibold text-lightblack text-sm">
                                        {storeName}
                                      </h4>
                                      <p className="text-xs text-greenneon font-semibold">
                                        {formatPrice(storeData.precio)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {storeData.tallas.length > 0 ? (
                                  <>
                                    <div className="mb-3">
                                      <p className="text-xs text-darkaccentwhite mb-1">
                                        Tallas:
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {storeData.tallas.map((size) => (
                                          <span
                                            key={size.id}
                                            className="px-2 py-1 bg-lightaccentwhite text-lightblack rounded-md text-xs font-medium"
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
                                        className="w-full flex items-center justify-center space-x-1 bg-lightblack text-lightwhite px-3 py-2 rounded-md hover:bg-verylightblack transition-colors text-xs"
                                      >
                                        <ShoppingBag className="h-3 w-3" />
                                        <span>Comprar</span>
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}
                                  </>
                                ) : (
                                  <div className="text-center py-2">
                                    <p className="text-darkaccentwhite text-xs">
                                      Sin tallas disponibles
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <ShoppingBag className="h-8 w-8 text-darkaccentwhite mx-auto mb-2" />
                        <h4 className="text-sm font-semibold text-lightblack mb-1">
                          No Hay Tallas Disponibles
                        </h4>
                        <p className="text-darkaccentwhite text-xs">
                          Esta zapatilla no está disponible actualmente.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Valoraciones - Desplegable */}
            <div className="bg-lightwhite rounded-lg">
              <button
                onClick={() => setShowRatings(!showRatings)}
                className="flex items-center justify-between w-full p-4 lg:p-6 text-left font-semibold text-lightblack cursor-pointer"
              >
                <span className="text-base lg:text-lg">Valoraciones</span>
                <ChevronDown
                  className={`w-4 h-4 lg:w-5 lg:h-5 transform transition-transform ${
                    showRatings ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showRatings && (
                <div className="px-4 lg:px-6 pb-4 lg:pb-6 border-t border-lightaccentwhite">
                  <div className="pt-4 lg:pt-6">
                    <StarRating zapatillaId={sneaker.id} hideTitle={true} />
                  </div>
                </div>
              )}
            </div>

            {/* Comentarios - Desplegable */}
            <div className="bg-lightwhite rounded-lg">
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center justify-between w-full p-4 lg:p-6 text-left font-semibold text-lightblack cursor-pointer"
              >
                <span className="text-base lg:text-lg">Comentarios</span>
                <ChevronDown
                  className={`w-4 h-4 lg:w-5 lg:h-5 transform transition-transform ${
                    showComments ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showComments && (
                <div className="border-t border-lightaccentwhite">
                  <CommentSection 
                    zapatillaId={sneaker.id} 
                    hideTitle={true} 
                    sneakerName={`${sneaker.marca} ${sneaker.modelo}`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha - Detalles y Tallas (Solo Desktop) */}
          <div className="space-y-6 hidden lg:block">
            {/* Header Desktop */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-lightblack">
                  {sneaker.marca}
                </h1>
                <h2 className="text-xl text-darkaccentwhite">
                  {sneaker.modelo}
                </h2>
                <p className="text-darkaccentwhite mt-4 text-sm">
                  SKU: {sneaker.sku}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <ReportSneakerButton 
                  sneakerId={sneaker.id}
                  sneakerName={`${sneaker.marca} ${sneaker.modelo}`}
                />
                <FavoriteButtonZustand
                  zapatillaId={sneaker.id}
                  className="p-3 rounded-full bg-lightwhite cursor-pointer transition-all duration-200"
                  size="lg"
                />
              </div>
            </div>

            {/* Precio Desktop */}
            <div className="bg-lightwhite p-6 rounded-lg border border-lightaccentwhite">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-darkaccentwhite mb-1">
                    Precio más bajo
                  </p>
                  <p className="text-2xl font-bold text-greenneon">
                    {formatPrice(precio_min)}
                  </p>
                </div>
                {precio_max && precio_max !== precio_min && (
                  <div>
                    <p className="text-sm text-darkaccentwhite mb-1">
                      Precio más alto
                    </p>
                    <p className="text-2xl font-bold text-lightblack">
                      {formatPrice(precio_max)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tallas Disponibles Desktop */}
            <div className="bg-lightwhite p-6 rounded-lg border border-lightaccentwhite">
              <h3 className="text-lg font-semibold text-lightblack mb-4">
                Tallas Disponibles
              </h3>

              {Object.keys(sizesByStore).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(sizesByStore).map(
                    ([storeName, storeData]) => {
                      const storeInfo = storeUrls[storeName] || {};
                      return (
                        <div
                          key={storeName}
                          className="border border-lightaccentwhite rounded-lg p-4 bg-lightwhite"
                        >
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
                                <h4 className="font-semibold text-lightblack">
                                  {storeName}
                                </h4>
                                <p className="text-sm text-greenneon font-semibold">
                                  {formatPrice(storeData.precio)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {storeData.tallas.length > 0 ? (
                            <>
                              <div className="mb-4">
                                <p className="text-sm text-darkaccentwhite mb-2">
                                  Tallas:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {storeData.tallas.map((size) => (
                                    <span
                                      key={size.id}
                                      className="px-3 py-1 bg-lightaccentwhite text-lightblack rounded-md text-sm font-medium"
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
                                  className="w-full flex items-center justify-center space-x-2 bg-lightblack text-lightwhite px-4 py-2 rounded-md hover:bg-verylightblack transition-colors"
                                >
                                  <ShoppingBag className="h-4 w-4" />
                                  <span>Comprar en {storeName}</span>
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            </>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-darkaccentwhite text-sm">
                                Sin tallas disponibles
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-darkaccentwhite mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-lightblack mb-2">
                    No Hay Tallas Disponibles
                  </h4>
                  <p className="text-darkaccentwhite">
                    Esta zapatilla no está disponible actualmente en ninguna
                    tienda.
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
