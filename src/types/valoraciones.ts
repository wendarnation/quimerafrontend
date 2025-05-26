// types/valoraciones.ts
export interface Valoracion {
  id: number;
  zapatilla_id: number;
  usuario_id: number;
  puntuacion: number;
  fecha: string;
  usuario: {
    id: number;
    email: string;
    nickname?: string;
  };
}

export interface PromedioValoracion {
  zapatilla_id: number;
  average: number;
  count: number;
}

export interface CreateValoracionDto {
  zapatilla_id: number;
  puntuacion: number;
}
