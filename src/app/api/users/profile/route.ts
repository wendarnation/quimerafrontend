import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const session = await auth0.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const tokenResponse = await auth0.getAccessToken();
    const accessToken = tokenResponse.token || tokenResponse;
    
    const response = await fetch(`${API_BASE_URL}/usuarios/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener el perfil: ${response.status} - ${errorText}`);
    }

    const profileData = await response.json();
    return NextResponse.json(profileData);
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: "Error al obtener el perfil del usuario" }, 
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const tokenResponse = await auth0.getAccessToken();
    const accessToken = tokenResponse.token || tokenResponse;
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/usuarios/profile`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar el perfil: ${response.status}`);
    }

    const updatedProfile = await response.json();
    return NextResponse.json(updatedProfile);
    
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: "Error al actualizar el perfil" }, 
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await auth0.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const tokenResponse = await auth0.getAccessToken();
    const accessToken = tokenResponse.token || tokenResponse;
    
    const response = await fetch(`${API_BASE_URL}/usuarios/profile`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar la cuenta: ${response.status}`);
    }

    return NextResponse.json({ message: "Cuenta eliminada exitosamente" });
    
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: "Error al eliminar la cuenta" }, 
      { status: 500 }
    );
  }
}
