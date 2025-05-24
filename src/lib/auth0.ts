import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Initialize the Auth0 client
export const auth0 = new Auth0Client({
  // En v4, las opciones se cargan automáticamente desde las variables de entorno
  // pero podemos especificar parámetros de autorización explícitamente
  authorizationParameters: {
    scope: process.env.AUTH0_SCOPE,
    audience: process.env.AUTH0_AUDIENCE,
  },
});
