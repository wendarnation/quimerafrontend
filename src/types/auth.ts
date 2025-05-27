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
