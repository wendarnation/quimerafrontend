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
    
    const response = await fetch(`${API_BASE_URL}/valoraciones/${id}`, {
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
        { error: errorData.message || "Error al actualizar valoración" }, 
        { status: response.status }
      );
    }

    const valoracion = await response.json();
    return NextResponse.json(valoracion);
    
  } catch (error) {
    console.error('Error updating valoracion:', error);
    return NextResponse.json(
      { error: "Error al actualizar la valoración" }, 
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
    
    const response = await fetch(`${API_BASE_URL}/valoraciones/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Error al eliminar valoración" }, 
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Valoración eliminada exitosamente" });
    
  } catch (error) {
    console.error('Error deleting valoracion:', error);
    return NextResponse.json(
      { error: "Error al eliminar la valoración" }, 
      { status: 500 }
    );
  }
}
