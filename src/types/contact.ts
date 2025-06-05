// types/contact.ts
export interface ContactDto {
  userName: string;
  userEmail: string;
  reason: ContactReason;
  message: string;
  isRegisteredUser: boolean;
}

export type ContactReason = 
  | 'queja' 
  | 'sugerencia' 
  | 'consulta_general' 
  | 'problema_tecnico' 
  | 'colaboracion' 
  | 'otro';

export const CONTACT_REASONS: Record<ContactReason, string> = {
  queja: 'Queja',
  sugerencia: 'Sugerencia',
  consulta_general: 'Consulta General',
  problema_tecnico: 'Problema Técnico',
  colaboracion: 'Colaboración',
  otro: 'Otro'
};
