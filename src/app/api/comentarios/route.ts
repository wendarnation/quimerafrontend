import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const tokenResponse = await auth0.getAccessToken();
    const accessToken = tokenResponse.token || tokenResponse;
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/comentarios`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Error al crear comentario" }, 
        { status: response.status }
      );
    }

    const comentario = await response.json();
    return NextResponse.json(comentario);
    
  } catch (error) {
    console.error('Error creating comentario:', error);
    return NextResponse.json(
      { error: "Error al crear el comentario" }, 
      { status: 500 }
    );
  }
}
