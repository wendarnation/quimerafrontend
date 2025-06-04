// components/reports/ReportModal.tsx
"use client";

import { useState } from "react";
import { X, AlertTriangle, Send } from "lucide-react";
import { useReportMutation } from "@/hooks/useReports";
import { ReportType } from "@/types/reports";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ReportType;
  sneakerData: {
    id: number;
    name: string;
    url: string;
  };
  commentData?: {
    text: string;
    author: string;
  };
  userEmail: string;
  userName: string;
}

export default function ReportModal({
  isOpen,
  onClose,
  type,
  sneakerData,
  commentData,
  userEmail,
  userName,
}: ReportModalProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reportMutation = useReportMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const reportData = type === 'sneaker' 
        ? {
            userEmail,
            userName,
            sneakerUrl: sneakerData.url,
            sneakerName: sneakerData.name,
            message: message.trim(),
          }
        : {
            userEmail,
            userName,
            commentText: commentData?.text || '',
            commentAuthor: commentData?.author || '',
            sneakerUrl: sneakerData.url,
            sneakerName: sneakerData.name,
            message: message.trim(),
          };

      await reportMutation.mutateAsync({
        type,
        data: reportData,
      });
      
      // Limpiar formulario y cerrar modal
      setMessage("");
      onClose();
    } catch (error) {
      console.error('Error al enviar reporte:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setMessage("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-lightwhite rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-lightaccentwhite">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 lg:h-5 lg:w-5 text-redneon" />
            <h2 className="text-base lg:text-lg font-semibold text-lightblack">
              {type === 'sneaker' ? 'Reportar Zapatilla' : 'Reportar Comentario'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="h-5 w-5 text-darkaccentwhite" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 lg:p-6">
          {/* Información del reporte */}
          <div className="mb-4 lg:mb-6">
            <h3 className="text-xs lg:text-sm font-medium text-lightblack mb-2 lg:mb-3">
              {type === 'sneaker' ? 'Información de la zapatilla:' : 'Información del comentario:'}
            </h3>
            <div className="bg-darkwhite p-3 lg:p-4 rounded-lg space-y-1 lg:space-y-2">
              <p className="text-xs lg:text-sm">
                <span className="font-medium text-lightblack">Zapatilla:</span>{' '}
                <span className="text-darkaccentwhite">{sneakerData.name}</span>
              </p>
              {type === 'comment' && commentData && (
                <>
                  <p className="text-xs lg:text-sm">
                    <span className="font-medium text-lightblack">Autor:</span>{' '}
                    <span className="text-darkaccentwhite">{commentData.author}</span>
                  </p>
                  <p className="text-xs lg:text-sm">
                    <span className="font-medium text-lightblack">Comentario:</span>{' '}
                    <span className="text-darkaccentwhite italic">"{commentData.text}"</span>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Formulario de mensaje */}
          <div className="mb-4 lg:mb-6">
            <label htmlFor="report-message" className="block text-xs lg:text-sm font-medium text-lightblack mb-1 lg:mb-2">
              {type === 'sneaker' 
                ? '¿Qué problema has encontrado con los datos de esta zapatilla?' 
                : '¿Por qué consideras que este comentario es inapropiado?'
              }
            </label>
            <textarea
              id="report-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={type === 'sneaker' 
                ? "Ejemplo: Los precios están desactualizados, la imagen no corresponde al modelo, etc."
                : "Ejemplo: Contenido ofensivo, spam, información falsa, etc."
              }
              className="w-full px-2 lg:px-3 py-2 lg:py-3 bg-lightwhite text-lightblack placeholder-darkaccentwhite border border-lightaccentwhite hover:border-darkaccentwhite rounded-lg focus:outline-none focus:ring-2 focus:ring-blueneon focus:border-transparent resize-none transition-colors text-xs lg:text-sm"
              rows={3}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Información del usuario */}
          <div className="mb-4 lg:mb-6">
            <h3 className="text-xs lg:text-sm font-medium text-lightblack mb-2 lg:mb-3">Tu información de contacto:</h3>
            <div className="bg-darkwhite p-3 lg:p-4 rounded-lg space-y-1 lg:space-y-2">
              <p className="text-xs lg:text-sm">
                <span className="font-medium text-lightblack">Nombre:</span>{' '}
                <span className="text-darkaccentwhite">{userName}</span>
              </p>
              <p className="text-xs lg:text-sm">
                <span className="font-medium text-lightblack">Email:</span>{' '}
                <span className="text-darkaccentwhite">{userEmail}</span>
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-2 lg:space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-3 lg:px-4 py-2 text-xs lg:text-sm text-darkaccentwhite hover:text-lightblack border border-lightaccentwhite hover:border-darkaccentwhite rounded-md transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!message.trim() || isSubmitting}
              className="flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 bg-redneon text-lightwhite rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-redneon focus:ring-offset-2 focus:ring-offset-lightwhite disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer text-xs lg:text-sm"
            >
              <Send className="h-3 w-3 lg:h-4 lg:w-4" />
              <span>{isSubmitting ? "Enviando..." : "Enviar Reporte"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
