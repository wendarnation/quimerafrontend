// components/reports/ReportCommentButton.tsx
"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { useIsAuthenticated } from "@/hooks/useCurrentUser";
import { USER_ROLES } from "@/types/auth";
import ReportModal from "./ReportModal";

interface ReportCommentButtonProps {
  commentText: string;
  commentAuthor: string;
  sneakerId: number;
  sneakerName: string;
  className?: string;
}

export default function ReportCommentButton({ 
  commentText,
  commentAuthor,
  sneakerId, 
  sneakerName, 
  className = "" 
}: ReportCommentButtonProps) {
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

  const commentData = {
    text: commentText,
    author: commentAuthor,
  };

  const userName = user.nickname || user.nombre_completo || user.email.split('@')[0];

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`p-1 text-darkaccentwhite hover:text-redneon transition-colors cursor-pointer ${className}`}
        title="Reportar comentario inapropiado"
      >
        <Flag className="h-4 w-4" />
      </button>

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="comment"
        sneakerData={sneakerData}
        commentData={commentData}
        userEmail={user.email}
        userName={userName}
      />
    </>
  );
}
