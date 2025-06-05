// components/reports/ReportSneakerButton.tsx
"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { useIsAuthenticated } from "@/hooks/useCurrentUser";
import { USER_ROLES } from "@/types/auth";
import ReportModal from "./ReportModal";

interface ReportSneakerButtonProps {
  sneakerId: number;
  sneakerName: string;
  className?: string;
}

export default function ReportSneakerButton({ 
  sneakerId, 
  sneakerName, 
  className = "" 
}: ReportSneakerButtonProps) {
  const { isAuthenticated, user } = useIsAuthenticated();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Solo mostrar el botón si el usuario está autenticado Y tiene rol de 'usuario' (no admin)
  if (!isAuthenticated || !user || user.rol !== USER_ROLES.USUARIO) {
    return null;
  }

  const sneakerData = {
    id: sneakerId,
    name: sneakerName,
    url: typeof window !== 'undefined' ? window.location.href : '',
  };

  const userName = user.nickname || user.nombre_completo || user.email.split('@')[0];

  return (
    <>
      {/* Desktop - Botón con texto */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`hidden lg:flex items-center space-x-2 px-3 py-2 text-sm text-darkaccentwhite hover:text-redneon border border-lightaccentwhite hover:border-redneon rounded-md transition-colors cursor-pointer ${className}`}
        title="Reportar información incorrecta"
      >
        <Flag className="h-4 w-4" />
        <span>Reportar datos</span>
      </button>

      {/* Mobile - Solo bandera */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`lg:hidden p-2 text-darkaccentwhite hover:text-redneon transition-colors cursor-pointer ${className}`}
        title="Reportar información incorrecta"
      >
        <Flag className="h-4 w-4" />
      </button>

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="sneaker"
        sneakerData={sneakerData}
        userEmail={user.email}
        userName={userName}
      />
    </>
  );
}
