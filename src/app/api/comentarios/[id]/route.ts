import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth0.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const tokenResponse = await auth0.getAccessToken();
    const accessToken = tokenResponse.token || tokenResponse;
    const body = await request.json();
    const { id } = params;
    
    const response = await fetch(`${API_BASE_URL}/comentarios/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Error al actualizar comentario" }, 
        { status: response.status }
      );
    }

    const comentario = await response.json();
    return NextResponse.json(comentario);
    
  } catch (error) {
    console.error('Error updating comentario:', error);
    return NextResponse.json(
      { error: "Error al actualizar el comentario" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth0.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const tokenResponse = await auth0.getAccessToken();
    const accessToken = tokenResponse.token || tokenResponse;
    const { id } = params;
    
    const response = await fetch(`${API_BASE_URL}/comentarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Error al eliminar comentario" }, 
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Comentario eliminado exitosamente" });
    
  } catch (error) {
    console.error('Error deleting comentario:', error);
    return NextResponse.json(
      { error: "Error al eliminar el comentario" }, 
      { status: 500 }
    );
  }
}
