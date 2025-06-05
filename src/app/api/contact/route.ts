// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ContactDto, CONTACT_REASONS } from "@/types/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const data: ContactDto = await request.json();

    // Validación básica
    if (!data.userName || !data.userEmail || !data.reason || !data.message) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Validación del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.userEmail)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    // Validación de la razón de contacto
    if (!Object.keys(CONTACT_REASONS).includes(data.reason)) {
      return NextResponse.json(
        { error: "Razón de contacto inválida" },
        { status: 400 }
      );
    }

    const subject = `📧 Contacto - ${CONTACT_REASONS[data.reason]} - ${data.userName}`;
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #f8f9fa; padding-bottom: 10px;">
          📧 Nuevo Mensaje de Contacto
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1a1a1a; margin-top: 0;">Información del Usuario</h3>
          <p><strong>Nombre:</strong> ${data.userName}</p>
          <p><strong>Email:</strong> ${data.userEmail}</p>
          <p><strong>Tipo de usuario:</strong> ${data.isRegisteredUser ? 'Usuario registrado' : 'Usuario no registrado'}</p>
          <p><strong>Razón de contacto:</strong> ${CONTACT_REASONS[data.reason]}</p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1a1a1a; margin-top: 0;">Mensaje</h3>
          <p style="line-height: 1.6;">${data.message.replace(/\n/g, "<br>")}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
          <p style="color: #6c757d; font-size: 14px;">
            Este mensaje fue enviado desde el formulario de contacto de Quimera Sneakers
          </p>
          <p style="color: #6c757d; font-size: 12px; margin-top: 10px;">
            Fecha: ${new Date().toLocaleString('es-ES', { 
              timeZone: 'Europe/Madrid',
              day: '2-digit',
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: "Quimera Contact <onboarding@resend.dev>",
      to: ["c.cortescandela@gmail.com"],
      subject,
      html: emailContent,
      // También enviamos una copia de confirmación al usuario
      replyTo: data.userEmail,
    });

    if (error) {
      console.error("Error enviando email:", error);
      return NextResponse.json(
        { error: "Error al enviar el mensaje" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Mensaje enviado correctamente", id: emailData?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en la API de contacto:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
