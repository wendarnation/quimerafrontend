// components/contact/ContactModal.tsx
"use client";

import { useState } from "react";
import { X, Mail, Send, User } from "lucide-react";
import { useContactMutation } from "@/hooks/useContact";
import { ContactReason, CONTACT_REASONS } from "@/types/contact";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
  isLoggedIn: boolean;
}

export default function ContactModal({
  isOpen,
  onClose,
  userEmail = "",
  userName = "",
  isLoggedIn,
}: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    reason: "" as ContactReason,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const contactMutation = useContactMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.reason || !formData.message.trim() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      await contactMutation.mutateAsync({
        userName: formData.name.trim(),
        userEmail: formData.email.trim(),
        reason: formData.reason,
        message: formData.message.trim(),
        isRegisteredUser: isLoggedIn,
      });
      
      // Mostrar mensaje de éxito
      setShowSuccess(true);
      
      // Limpiar formulario si el usuario no está logueado
      if (!isLoggedIn) {
        setFormData({
          name: "",
          email: "",
          reason: "" as ContactReason,
          message: "",
        });
      } else {
        setFormData(prev => ({
          ...prev,
          reason: "" as ContactReason,
          message: "",
        }));
      }

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error al enviar mensaje de contacto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setShowSuccess(false);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  // Vista de éxito
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-lightwhite rounded-lg max-w-md w-full">
          <div className="p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-greenneon/10 mb-4">
              <Mail className="h-8 w-8 text-greenneon" />
            </div>
            <h3 className="text-xl font-semibold text-lightblack mb-2">
              ¡Mensaje Enviado!
            </h3>
            <p className="text-sm text-verylightblack">
              Hemos recibido tu mensaje. Te responderemos lo antes posible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-lightwhite rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-lightaccentwhite">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 lg:h-5 lg:w-5 text-blueneon" />
            <h2 className="text-base lg:text-lg font-semibold text-lightblack">
              Contacta con nosotros
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
          {/* Información del usuario */}
          <div className="mb-4 lg:mb-6">
            <h3 className="text-xs lg:text-sm font-medium text-lightblack mb-2 lg:mb-3">
              Información de contacto:
            </h3>
            
            <div className="space-y-3 lg:space-y-4">
              {/* Nombre */}
              <div>
                <label htmlFor="contact-name" className="block text-xs lg:text-sm font-medium text-lightblack mb-1">
                  Nombre <span className="text-redneon">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-darkaccentwhite" />
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full pl-10 pr-3 py-2 bg-lightwhite text-darkaccentwhite placeholder-darkaccentwhite border border-lightaccentwhite hover:border-darkaccentwhite rounded-lg focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent transition-colors"
                    disabled={isSubmitting || isLoggedIn}
                    required
                  />
                </div>
                {isLoggedIn && (
                  <p className="text-xs text-darkaccentwhite mt-1">
                    Como usuario registrado, estos datos se rellenan automáticamente
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="contact-email" className="block text-xs lg:text-sm font-medium text-lightblack mb-1">
                  Email <span className="text-redneon">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-darkaccentwhite" />
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-10 pr-3 py-2 bg-lightwhite text-darkaccentwhite placeholder-darkaccentwhite border border-lightaccentwhite hover:border-darkaccentwhite rounded-lg focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent transition-colors"
                    disabled={isSubmitting || isLoggedIn}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Razón de consulta */}
          <div className="mb-4 lg:mb-6">
            <label htmlFor="contact-reason" className="block text-xs lg:text-sm font-medium text-lightblack mb-1 lg:mb-2">
              Razón de la consulta <span className="text-redneon">*</span>
            </label>
            <select
              id="contact-reason"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              className="w-full px-3 py-2 bg-lightwhite text-darkaccentwhite border border-lightaccentwhite hover:border-darkaccentwhite rounded-lg focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent transition-colors"
              disabled={isSubmitting}
              required
            >
              <option value="">Selecciona una opción</option>
              {Object.entries(CONTACT_REASONS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Mensaje */}
          <div className="mb-4 lg:mb-6">
            <label htmlFor="contact-message" className="block text-xs lg:text-sm font-medium text-lightblack mb-1 lg:mb-2">
              Mensaje <span className="text-redneon">*</span>
            </label>
            <textarea
              id="contact-message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Describe tu consulta, queja, sugerencia..."
              className="w-full px-3 py-2 bg-lightwhite text-darkaccentwhite placeholder-darkaccentwhite border border-lightaccentwhite hover:border-darkaccentwhite rounded-lg focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent resize-none transition-colors"
              rows={4}
              disabled={isSubmitting}
              required
            />
            <p className="text-xs text-darkaccentwhite mt-1">
              Cuéntanos en detalle lo que necesitas. Cuanta más información proporciones, mejor podremos ayudarte.
            </p>
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
              disabled={!formData.name.trim() || !formData.email.trim() || !formData.reason || !formData.message.trim() || isSubmitting}
              className="flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 bg-blueneon text-lightwhite rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blueneon focus:ring-offset-2 focus:ring-offset-lightwhite disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer text-xs lg:text-sm"
            >
              <Send className="h-3 w-3 lg:h-4 lg:w-4" />
              <span>{isSubmitting ? "Enviando..." : "Enviar Mensaje"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
