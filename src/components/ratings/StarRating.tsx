// components/ratings/StarRating.tsx
"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useCurrentUser, useIsAuthenticated } from "@/hooks/useCurrentUser";
import { usePromedioValoraciones, useValoraciones, useCreateValoracion, useUpdateValoracion } from "@/hooks/useValoraciones";

interface StarRatingProps {
  zapatillaId: number;
}

export default function StarRating({ zapatillaId }: StarRatingProps) {
  const { isAuthenticated, isLoading: authLoading, user: currentUser } = useIsAuthenticated();
  const { data: promedio, isLoading: promedioLoading } = usePromedioValoraciones(zapatillaId);
  const { data: valoraciones } = useValoraciones(zapatillaId);
  
  const createValoracion = useCreateValoracion();
  const updateValoracion = useUpdateValoracion();
  
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Encontrar la valoración del usuario actual
  const userValoracion = valoraciones?.find(v => v.usuario_id === currentUser?.id);
  const userRating = userValoracion?.puntuacion || 0;

  const handleStarClick = async (rating: number) => {
    if (!isAuthenticated || !currentUser || isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (userValoracion) {
        // Actualizar valoración existente
        await updateValoracion.mutateAsync({
          valoracionId: userValoracion.id,
          puntuacion: rating,
        });
      } else {
        // Crear nueva valoración
        await createValoracion.mutateAsync({
          zapatilla_id: zapatillaId,
          puntuacion: rating,
        });
      }
    } catch (error) {
      console.error('Error al enviar valoración:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6"
    };

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive || !isAuthenticated || isSubmitting}
            className={`${sizeClasses[size]} transition-all duration-200 ${
              interactive && isAuthenticated && !isSubmitting
                ? "cursor-pointer hover:scale-110"
                : "cursor-default"
            } ${
              !interactive || !isAuthenticated ? "opacity-80" : ""
            }`}
            onClick={() => interactive && handleStarClick(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(null)}
          >
            <Star
              className={`${sizeClasses[size]} ${
                (interactive ? (hoveredStar || userRating) : rating) >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-600 text-gray-600"
              } transition-colors duration-200`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (authLoading || promedioLoading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
          <div className="flex space-x-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-5 w-5 bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Valoraciones</h3>
      
      {/* Promedio de valoraciones */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          {renderStars(promedio?.average || 0, false, "lg")}
          <span className="text-xl font-bold text-white">
            {promedio?.average ? promedio.average.toFixed(1) : "0.0"}
          </span>
        </div>
        <p className="text-sm text-gray-400">
          {promedio?.count || 0} valoraciones
        </p>
      </div>

      {/* Sistema interactivo para usuarios autenticados */}
      {isAuthenticated && currentUser ? (
        <div className="border-t border-gray-700 pt-4">
          <h4 className="text-md font-medium text-white mb-3">
            {userValoracion ? "Tu valoración:" : "Valora esta zapatilla:"}
          </h4>
          <div className="flex items-center space-x-3">
            {renderStars(0, true, "lg")}
            {userRating > 0 && (
              <span className="text-sm text-gray-400">
                {userRating} estrella{userRating !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {isSubmitting && (
            <p className="text-sm text-blue-400 mt-2">Guardando valoración...</p>
          )}
        </div>
      ) : (
        <div className="border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-400">
            {authLoading ? "Cargando..." : "Inicia sesión para valorar esta zapatilla"}
          </p>
        </div>
      )}
    </div>
  );
}
