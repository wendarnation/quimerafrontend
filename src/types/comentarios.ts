// types/comentarios.ts
export interface Comentario {
  id: number;
  zapatilla_id: number;
  usuario_id: number;
  texto: string;
  fecha: string;
  usuario: {
    id: number;
    email: string;
    nickname?: string;
  };
}

export interface CreateComentarioDto {
  zapatilla_id: number;
  texto: string;
}
