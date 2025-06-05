// types/auth.ts
export interface AuthUser {
  sub?: string;
  name?: string;
  email?: string;
  picture?: string;
  email_verified?: boolean;
  [key: string]: any;
}

export type UserProfile = AuthUser | undefined;

// Roles del sistema
export const USER_ROLES = {
  USUARIO: 'usuario',
  ADMIN: 'admin'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
