// app/contacta/ContactClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mail,
  Send,
  User,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { useContactMutation } from "@/hooks/useContact";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ContactReason, CONTACT_REASONS } from "@/types/contact";

interface Auth0User {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
}

interface ContactClientProps {
  user?: Auth0User;
}

export default function ContactClient({ user }: ContactClientProps) {
  const { profile, loading: profileLoading } = useUserProfile();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "" as ContactReason,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const contactMutation = useContactMutation();
  const reasonDropdownRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!user;

  // Actualizar formulario cuando se carga el usuario o perfil
  useEffect(() => {
    if (user || profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile?.nombre_completo || profile?.nickname || user?.name || "",
        email: user?.email || profile?.email || "",
      }));
    }
  }, [user, profile]);

  // Click fuera para cerrar dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        reasonDropdownRef.current &&
        !reasonDropdownRef.current.contains(event.target as Node)
      ) {
        setShowReasonDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.reason ||
      !formData.message.trim() ||
      isSubmitting
    ) {
      setError("Todos los campos son obligatorios");
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

      // Limpiar solo los campos editables
      if (!isLoggedIn) {
        setFormData({
          name: "",
          email: "",
          reason: "" as ContactReason,
          message: "",
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          reason: "" as ContactReason,
          message: "",
        }));
      }
    } catch (error) {
      console.error("Error al enviar mensaje de contacto:", error);
      setError("Error al enviar el mensaje. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError(null);
    }
  };

  const handleReasonChange = (reason: ContactReason) => {
    setFormData((prev) => ({
      ...prev,
      reason,
    }));
    setShowReasonDropdown(false);
    if (error) {
      setError(null);
    }
  };

  // Mostrar skeleton loader mientras carga el perfil de usuario logueado
  if (profileLoading && isLoggedIn) {
    return (
      <div className="min-h-screen bg-lightwhite">
        {/* Header Section */}
        <div className="bg-lightwhite">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="h-8 bg-lightaccentwhite rounded animate-pulse w-64 mb-2"></div>
                  <div className="h-4 bg-lightaccentwhite rounded animate-pulse w-80"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Contact Form Skeleton */}
          <div className="bg-lightwhite border border-lightaccentwhite rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-lightaccentwhite bg-lightwhite">
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 bg-lightaccentwhite rounded animate-pulse"></div>
                <div className="h-6 bg-lightaccentwhite rounded animate-pulse w-48"></div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* User Info Fields Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-16 mb-2"></div>
                    <div className="h-10 bg-lightaccentwhite rounded animate-pulse"></div>
                    <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-72 mt-1"></div>
                  </div>
                  <div>
                    <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-12 mb-2"></div>
                    <div className="h-10 bg-lightaccentwhite rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Reason Field Skeleton */}
                <div>
                  <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-32 mb-2"></div>
                  <div className="h-10 bg-lightaccentwhite rounded animate-pulse flex items-center justify-between px-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-lightaccentwhite rounded animate-pulse"></div>
                      <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-32"></div>
                    </div>
                    <div className="h-4 w-4 bg-lightaccentwhite rounded animate-pulse"></div>
                  </div>
                  <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-56 mt-1"></div>
                </div>

                {/* Message Field Skeleton */}
                <div>
                  <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-20 mb-2"></div>
                  <div className="h-32 bg-lightaccentwhite rounded animate-pulse"></div>
                  <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-96 mt-1"></div>
                </div>

                {/* Submit Button Skeleton */}
                <div className="flex justify-end pt-4">
                  <div className="h-10 bg-lightaccentwhite rounded animate-pulse w-32"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Skeleton */}
          <div className="mt-8 bg-lightwhite border border-lightaccentwhite rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="h-6 bg-lightaccentwhite rounded animate-pulse w-40 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="h-4 bg-lightaccentwhite rounded animate-pulse w-32 mb-2"></div>
                  <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-full mb-1"></div>
                  <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-3/4"></div>
                </div>
                <div>
                  <div className="h-4 bg-lightaccentwhite rounded animate-pulse w-28 mb-2"></div>
                  <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-full mb-1"></div>
                  <div className="h-3 bg-lightaccentwhite rounded animate-pulse w-4/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightwhite">
      {/* Header Section */}
      <div className="bg-lightwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-lightblack">
                  Contacta con nosotros
                </h1>
                <p className="text-verylightblack mt-1 text-sm sm:text-base">
                  ¿Tienes alguna consulta, sugerencia o problema? Estamos aquí
                  para ayudarte
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-lightwhite border border-redneon/20 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-redneon flex-shrink-0" />
              <p className="text-redneon text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Contact Form */}
        <div className="bg-lightwhite border border-lightaccentwhite rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-lightaccentwhite bg-lightwhite">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-verylightblack" />
              <h2 className="text-lg font-semibold text-lightblack">
                Formulario de Contacto
              </h2>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información del usuario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-medium text-verylightblack uppercase tracking-wider mb-2"
                  >
                    Nombre <span className="text-redneon">*</span>
                  </label>
                  {isLoggedIn ? (
                    <input
                      type="text"
                      id="contact-name"
                      value={formData.name}
                      disabled
                      className="w-full px-4 py-2 bg-lightaccentwhite/30 border border-lightaccentwhite rounded-md text-verylightblack cursor-not-allowed text-sm focus:outline-none"
                    />
                  ) : (
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-verylightblack" />
                      <input
                        type="text"
                        id="contact-name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Tu nombre completo"
                        className="w-full pl-10 px-4 py-2 bg-lightwhite border border-lightaccentwhite rounded-md focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent text-lightblack transition-all duration-200 hover:border-darkaccentwhite text-sm"
                        required
                      />
                    </div>
                  )}
                  {isLoggedIn && (
                    <p className="text-xs text-verylightblack mt-1">
                      Como usuario registrado, este campo se rellena
                      automáticamente
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-medium text-verylightblack uppercase tracking-wider mb-2"
                  >
                    Email <span className="text-redneon">*</span>
                  </label>
                  {isLoggedIn ? (
                    <input
                      type="email"
                      id="contact-email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2 bg-lightaccentwhite/30 border border-lightaccentwhite rounded-md text-verylightblack cursor-not-allowed text-sm focus:outline-none"
                    />
                  ) : (
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-verylightblack" />
                      <input
                        type="email"
                        id="contact-email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="tu@email.com"
                        className="w-full pl-10 px-4 py-2 bg-lightwhite border border-lightaccentwhite rounded-md focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent text-lightblack transition-all duration-200 hover:border-darkaccentwhite text-sm"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Razón de consulta */}
              <div>
                <label
                  htmlFor="contact-reason"
                  className="block text-xs font-medium text-verylightblack uppercase tracking-wider mb-2"
                >
                  Razón de la consulta <span className="text-redneon">*</span>
                </label>
                <div className="relative" ref={reasonDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowReasonDropdown(!showReasonDropdown)}
                    className="w-full flex items-center justify-between px-4 py-2 bg-lightwhite border border-lightaccentwhite rounded-md focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent text-lightblack transition-all duration-200 hover:border-darkaccentwhite text-sm cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-verylightblack" />
                      <span
                        className={
                          formData.reason
                            ? "text-lightblack"
                            : "text-darkaccentwhite"
                        }
                      >
                        {formData.reason
                          ? CONTACT_REASONS[formData.reason]
                          : "Selecciona una opción"}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-verylightblack" />
                  </button>
                  {showReasonDropdown && (
                    <div className="absolute z-50 mt-2 w-full bg-lightwhite border border-darkaccentwhite rounded-md shadow-lg">
                      {Object.entries(CONTACT_REASONS).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            handleReasonChange(value as ContactReason)
                          }
                          className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                            formData.reason === value
                              ? "bg-lightblack text-lightwhite"
                              : "text-lightblack hover:bg-lightaccentwhite hover:text-lightblack"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-verylightblack mt-1">
                  Selecciona la opción que mejor describa tu consulta
                </p>
              </div>

              {/* Mensaje */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-medium text-verylightblack uppercase tracking-wider mb-2"
                >
                  Mensaje <span className="text-redneon">*</span>
                </label>
                <textarea
                  id="contact-message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Describe tu consulta, queja, sugerencia o problema en detalle..."
                  className="w-full px-4 py-3 bg-lightwhite border border-lightaccentwhite rounded-md focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent text-lightblack transition-all duration-200 hover:border-darkaccentwhite text-sm resize-none"
                  rows={6}
                  required
                />
                <p className="text-xs text-verylightblack mt-1">
                  Cuéntanos en detalle lo que necesitas. Cuanta más información
                  proporciones, mejor podremos ayudarte.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={
                    !formData.name.trim() ||
                    !formData.email.trim() ||
                    !formData.reason ||
                    !formData.message.trim() ||
                    isSubmitting
                  }
                  className="inline-flex items-center bg-lightblack cursor-pointer hover:bg-pinkneon text-lightwhite px-6 py-3 rounded-lg font-semibold transition-all duration-500 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Enviando mensaje..." : "Enviar mensaje"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-lightwhite border border-lightaccentwhite rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-lightblack mb-4">
              Información adicional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-verylightblack">
              <div>
                <h4 className="font-medium text-lightblack mb-2">
                  Tiempo de respuesta
                </h4>
                <p>
                  Normalmente respondemos en un plazo de 24-48 horas durante
                  días laborables.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-lightblack mb-2">
                  Tipos de consulta
                </h4>
                <p>
                  Aceptamos consultas generales, reportes de problemas técnicos,
                  sugerencias y propuestas de colaboración.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
