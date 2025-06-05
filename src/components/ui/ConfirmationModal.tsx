// components/ui/ConfirmationModal.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
  confirmButtonClass?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  icon,
  confirmButtonClass = "bg-redneon hover:bg-redneon/90"
}: ConfirmationModalProps) {
  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  // Manejar clic fuera del modal
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-lightblack/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-lightwhite border border-lightaccentwhite rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-redneon/10 mb-4">
              {icon || <AlertTriangle className="h-8 w-8 text-redneon" />}
            </div>
            <h3 className="text-xl font-semibold text-lightblack mb-2">
              {title}
            </h3>
            <p className="text-sm text-verylightblack mb-6">
              {message}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-3 bg-lightwhite border border-lightaccentwhite text-lightblack rounded-lg hover:bg-lightaccentwhite/30 transition-all duration-300 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-6 py-3 text-lightwhite rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-300 font-medium cursor-pointer ${confirmButtonClass}`}
              >
                {isLoading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span>{confirmText}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
