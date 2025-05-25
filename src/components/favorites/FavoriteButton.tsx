// components/favorites/FavoriteButton.tsx
"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0";
import { useFavorites } from "../../hooks/useFavorites";

interface FavoriteButtonProps {
  zapatillaId: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function FavoriteButton({ 
  zapatillaId, 
  className = "", 
  size = "md",
  showText = false 
}: FavoriteButtonProps) {
  const { user } = useUser();
  const { toggleFavorite, checkIfInFavorites } = useFavorites();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Verificar estado inicial al montar
  useEffect(() => {
    if (user) {
      const checkInitialStatus = async () => {
        setIsCheckingStatus(true);
        try {
          const isInFavorites = await checkIfInFavorites(zapatillaId);
          setIsFavorite(isInFavorites);
        } catch (error) {
          // Si hay error, asumir que no está en favoritos
          setIsFavorite(false);
        } finally {
          setIsCheckingStatus(false);
        }
      };
      
      checkInitialStatus();
    }
  }, [user, zapatillaId, checkIfInFavorites]);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Redirigir a login si no está autenticado
      window.location.href = '/auth/login';
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await toggleFavorite(zapatillaId);
      setIsFavorite(result.action === 'added');
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
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

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isProcessing || isCheckingStatus}
      className={`inline-flex items-center space-x-1 transition-colors ${
        isFavorite 
          ? 'text-red-500' 
          : 'text-gray-400 hover:text-red-500'
      } ${isProcessing || isCheckingStatus ? 'animate-pulse' : ''} ${className}`}
      title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <Heart 
        className={`${sizeClasses[size]} stroke-2 ${
          isFavorite ? 'fill-current' : ''
        }`} 
      />
      {showText && (
        <span className="text-sm">
          {isProcessing ? 'Procesando...' : 
           isCheckingStatus ? 'Cargando...' :
           isFavorite ? 'En favoritos' : 'Favorito'}
        </span>
      )}
    </button>
  );
}
