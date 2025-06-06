// components/comments/CommentSection.tsx
"use client";

import { useState } from "react";
import { MessageCircle, Trash2, Send, User } from "lucide-react";
import { useCurrentUser, useIsAuthenticated } from "@/hooks/useCurrentUser";
import { useComentarios, useCreateComentario, useDeleteComentario } from "@/hooks/useComentarios";
import ReportCommentButton from "@/components/reports/ReportCommentButton";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { USER_ROLES } from "@/types/auth";
import { Comentario } from "@/types/comentarios";

interface CommentSectionProps {
  zapatillaId: number;
  hideTitle?: boolean;
  sneakerName?: string;
}

export default function CommentSection({ zapatillaId, hideTitle = false, sneakerName = "" }: CommentSectionProps) {
  const { isAuthenticated, isLoading: authLoading, user: currentUser } = useIsAuthenticated();
  const { data: comentarios, isLoading: comentariosLoading, error } = useComentarios(zapatillaId);
  
  const createComentario = useCreateComentario();
  const deleteComentario = useDeleteComentario();
  
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !currentUser || !newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      await createComentario.mutateAsync({
        zapatilla_id: zapatillaId,
        texto: newComment.trim(),
      });

      setNewComment("");
    } catch (error) {
      console.error('Error al enviar comentario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (comentarioId: number) => {
    if (!isAuthenticated || !currentUser) return;
    setShowDeleteModal(comentarioId);
  };

  const confirmDeleteComment = async () => {
    if (!showDeleteModal) return;

    try {
      setIsDeleting(true);
      await deleteComentario.mutateAsync(showDeleteModal);
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canDeleteComment = (comentario: Comentario) => {
    if (!currentUser) return false;
    // El usuario puede eliminar su propio comentario, o si es admin puede eliminar cualquiera
    return comentario.usuario_id === currentUser.id || currentUser.rol === USER_ROLES.ADMIN;
  };

  if (comentariosLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-lightaccentwhite rounded w-32 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-lightaccentwhite pb-4">
                <div className="h-4 bg-lightaccentwhite rounded w-24 mb-2"></div>
                <div className="h-12 bg-lightaccentwhite rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        {!hideTitle && (
          <h3 className="text-lg font-semibold text-lightblack mb-4 flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Comentarios
          </h3>
        )}
        <p className="text-redneon">Error al cargar los comentarios</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {!hideTitle && (
        <h3 className="text-lg font-semibold text-lightblack mb-6 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Comentarios ({comentarios?.length || 0})
        </h3>
      )}

      {/* Formulario para nuevo comentario */}
      {isAuthenticated && currentUser ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-lightblack mb-2">
              Escribe un comentario
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Comparte tu opinión sobre esta zapatilla..."
              className="w-full px-3 py-2 bg-lightwhite text-darkaccentwhite placeholder-darkaccentwhite border border-lightaccentwhite hover:border-darkaccentwhite rounded-lg focus:outline-none focus:ring-1 focus:ring-lightblack focus:border-transparent resize-none transition-colors"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-lightblack text-lightwhite rounded-md hover:bg-verylightblack focus:outline-none focus:ring-2 focus:ring-blueneon focus:ring-offset-2 focus:ring-offset-lightwhite disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? "Enviando..." : "Comentar"}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-lightaccentwhite rounded-md border border-lightaccentwhite">
          <p className="text-lightblack text-sm">
            {authLoading ? "Cargando..." : "Inicia sesión para escribir un comentario"}
          </p>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {comentarios && comentarios.length > 0 ? (
          comentarios.map((comentario) => (
            <div key={comentario.id} className="border-b border-lightaccentwhite pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-lightaccentwhite rounded-full">
                    <User className="h-4 w-4 text-darkaccentwhite" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-lightblack">
                      {comentario.usuario.nickname || comentario.usuario.email.split('@')[0]}
                    </h4>
                    <p className="text-xs text-darkaccentwhite">
                      {formatDate(comentario.fecha)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <ReportCommentButton
                    commentText={comentario.texto}
                    commentAuthor={comentario.usuario.nickname || comentario.usuario.email.split('@')[0]}
                    sneakerId={zapatillaId}
                    sneakerName={sneakerName}
                  />
                  {canDeleteComment(comentario) && (
                    <button
                      onClick={() => handleDeleteComment(comentario.id)}
                      className="p-1 text-darkaccentwhite hover:text-redneon transition-colors cursor-pointer"
                      title="Eliminar comentario"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <p className="text-lightblack text-sm leading-relaxed ml-10">
                {comentario.texto}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-darkaccentwhite mx-auto mb-4" />
            <p className="text-darkaccentwhite">
              Aún no hay comentarios. ¡Sé el primero en comentar!
            </p>
          </div>
        )}
      </div>

      {/* Modal de confirmación para eliminar comentario */}
      <ConfirmationModal
        isOpen={showDeleteModal !== null}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={confirmDeleteComment}
        isLoading={isDeleting}
        title="Eliminar comentario"
        message="¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
