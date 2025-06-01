// components/favorites/FavoriteButtonZustand.tsx
"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0";
import { useFavoritesWithZustand } from "../../hooks/useFavoritesWithZustand";

interface FavoriteButtonProps {
  zapatillaId: number;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  showText?: boolean;
}

export default function FavoriteButtonZustand({
  zapatillaId,
  className = "",
  size = "md",
  showText = false,
}: FavoriteButtonProps) {
  const { user } = useUser();
  const {
    toggleFavorite,
    isFavorite,
    isLoading,
    initializeDefaultList,
    isInitialized,
  } = useFavoritesWithZustand();

  const [isProcessing, setIsProcessing] = useState(false);
  const [initError, setInitError] = useState(false);

  // Inicializar cuando el usuario esté disponible
  useEffect(() => {
    if (user && !isInitialized && !isLoading && !initError) {
      initializeDefaultList().catch((error) => {
        console.error("Error initializing favorites:", error);
        setInitError(true);
      });
    }
  }, [user, isInitialized, isLoading, initializeDefaultList, initError]);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6 md:h-7 md:w-7", // Mobile: h-6, Desktop: h-7
    xl: "h-7 w-7",
    "2xl": "h-8 w-8",
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Redirigir a login si no está autenticado
      window.location.href = "/auth/login";
      return;
    }

    if (isProcessing || isLoading) return;

    setIsProcessing(true);

    try {
      const result = await toggleFavorite(zapatillaId);
      console.log(`Favorite ${result.action}:`, zapatillaId);
    } catch (error) {
      console.error("Error al cambiar favorito:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <button
        onClick={handleToggleFavorite}
        className={`inline-flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors ${className}`}
        title="Inicia sesión para agregar a favoritos"
      >
        <Heart className={`${sizeClasses[size]} stroke-2`} />
        {showText && <span className="text-sm">Favorito</span>}
      </button>
    );
  }

  // Obtener estado actual del favorito desde Zustand
  const isCurrentlyFavorite = isFavorite(zapatillaId);

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isProcessing || isLoading}
      className={`inline-flex items-center space-x-1 transition-colors ${
        isCurrentlyFavorite
          ? "text-redneon"
          : "text-darkaccentwhite hover:text-redneon"
      } ${isProcessing || isLoading ? "animate-pulse" : ""} ${className}`}
      title={
        isCurrentlyFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
      }
    >
      <Heart
        className={`${sizeClasses[size]} stroke-2 ${
          isCurrentlyFavorite ? "fill-current" : ""
        }`}
      />
      {showText && (
        <span className="text-sm">
          {isProcessing
            ? "Procesando..."
            : isLoading
            ? "Cargando..."
            : isCurrentlyFavorite
            ? "En favoritos"
            : "Favorito"}
        </span>
      )}
    </button>
  );
}
