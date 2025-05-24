// import type { NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   // Middleware deshabilitado temporalmente
//   // Solo aplicar middleware de Auth0 a rutas específicas que requieren autenticación
//   const protectedPaths = ["/profile", "/dashboard", "/admin"];
//   const pathname = request.nextUrl.pathname;

//   // Para ahora, permitir todo el acceso
//   if (protectedPaths.some((path) => pathname.startsWith(path))) {
//     // Aquí iría la autenticación cuando esté configurada
//     return Response.redirect(new URL("/auth/login", request.url));
//   }

//   // Para el resto de rutas, permitir acceso sin autenticación
//   return;
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico, sitemap.xml, robots.txt (metadata files)
//      * - auth (Auth0 routes)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|auth).*)",
//   ],
// };

import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
