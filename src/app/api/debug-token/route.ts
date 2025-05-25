// app/api/debug-token/route.ts
import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0"; // Tu instancia de Auth0Client

export async function GET() {
  try {
    // En v4 se usa auth0.getSession() directamente
    const session = await auth0.getSession();

    if (!session) {
      console.log("❌ No hay usuario autenticado");
      return NextResponse.json({ error: "No user" }, { status: 401 });
    }

    // En v4 el método devuelve { token }, no { accessToken }
    const { token } = await auth0.getAccessToken();

    // Obtener permisos desde el ID token (session.user) Y del access token
    const idTokenPermissions =
      session.user.permissions ||
      session.user["https://quimera.com/permissions"] ||
      [];
    const idTokenRoles =
      session.user.roles || session.user["https://quimera.com/roles"] || [];

    // Decodificar el access token para obtener permisos también
    let accessTokenPermissions = [];
    if (token) {
      try {
        const base64Payload = token.split(".")[1];
        const decodedPayload = Buffer.from(base64Payload, "base64").toString(
          "utf8"
        );
        const tokenPayload = JSON.parse(decodedPayload);
        accessTokenPermissions = tokenPayload.permissions || [];
      } catch (error) {
        console.error("Error decodificando access token:", error);
      }
    }

    // Log completo - esto aparecerá en tu terminal del servidor
    console.log("=== USER ACCESS TOKEN & PERMISSIONS ===");
    console.log("User:", session.user.email);
    console.log("User ID:", session.user.sub);
    console.log("Token length:", token?.length);
    console.log("--- PERMISOS DESDE ID TOKEN (session.user) ---");
    console.log("ID Token Permissions:", idTokenPermissions);
    console.log("ID Token Roles:", idTokenRoles);
    console.log("--- PERMISOS DESDE ACCESS TOKEN ---");
    console.log("Access Token Permissions:", accessTokenPermissions);
    console.log("--- COMPARACIÓN ---");
    console.log("¿Permisos en ID Token?", idTokenPermissions.length > 0);
    console.log(
      "¿Permisos en Access Token?",
      accessTokenPermissions.length > 0
    );
    console.log("--- OBJETO COMPLETO DEL USUARIO ---");
    console.log("Session user keys:", Object.keys(session.user));
    console.log("--- 🔥 TOKEN COMPLETO PARA COPIAR ---");
    console.log(token);
    console.log("========================================");

    return NextResponse.json({
      success: true,
      user: session.user.email,
      userId: session.user.sub,
      hasToken: !!token,
      tokenLength: token?.length,
      // Permisos desde ID Token (lo que debería usar tu app)
      idTokenPermissions: idTokenPermissions,
      idTokenRoles: idTokenRoles,
      // Permisos desde Access Token (lo que ves en jwt.io)
      accessTokenPermissions: accessTokenPermissions,
      // Para debugging
      userObject: session.user,
      accessToken: token,
      tokenParts: token
        ? {
            header: token.split(".")[0],
            payload: token.split(".")[1],
            signature: token.split(".")[2],
          }
        : null,
    });
  } catch (error) {
    console.error("Error obteniendo token:", error);
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
  }
}
