// app/api/reports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ReportSneakerDto, ReportCommentDto } from "@/types/reports";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (!type || (type !== "sneaker" && type !== "comment")) {
      return NextResponse.json(
        { error: "Tipo de reporte inválido" },
        { status: 400 }
      );
    }

    let emailContent = "";
    let subject = "";

    if (type === "sneaker") {
      const reportData = data as ReportSneakerDto;
      subject = `🚨 Reporte de Zapatilla - ${reportData.sneakerName}`;
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #f8f9fa; padding-bottom: 10px;">
            🚨 Reporte de Zapatilla
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1a1a1a; margin-top: 0;">Información del Reporte</h3>
            <p><strong>Zapatilla:</strong> ${reportData.sneakerName}</p>
            <p><strong>URL:</strong> <a href="${reportData.sneakerUrl}" style="color: #0066cc;">${reportData.sneakerUrl}</a></p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1a1a1a; margin-top: 0;">Usuario que Reporta</h3>
            <p><strong>Nombre:</strong> ${reportData.userName}</p>
            <p><strong>Email:</strong> ${reportData.userEmail}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1a1a1a; margin-top: 0;">Mensaje del Usuario</h3>
            <p style="line-height: 1.6;">${reportData.message.replace(/\n/g, "<br>")}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
            <p style="color: #6c757d; font-size: 14px;">
              Este reporte fue enviado desde Quimera Sneakers
            </p>
          </div>
        </div>
      `;
    } else {
      const reportData = data as ReportCommentDto;
      subject = `🚨 Reporte de Comentario - ${reportData.sneakerName}`;
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #f8f9fa; padding-bottom: 10px;">
            🚨 Reporte de Comentario
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1a1a1a; margin-top: 0;">Información del Comentario</h3>
            <p><strong>Zapatilla:</strong> ${reportData.sneakerName}</p>
            <p><strong>URL:</strong> <a href="${reportData.sneakerUrl}" style="color: #0066cc;">${reportData.sneakerUrl}</a></p>
            <p><strong>Autor del comentario:</strong> ${reportData.commentAuthor}</p>
          </div>
          
          <div style="background-color: #ffe6e6; padding: 20px; border: 1px solid #ff9999; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1a1a1a; margin-top: 0;">Comentario Reportado</h3>
            <p style="line-height: 1.6; font-style: italic;">"${reportData.commentText}"</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1a1a1a; margin-top: 0;">Usuario que Reporta</h3>
            <p><strong>Nombre:</strong> ${reportData.userName}</p>
            <p><strong>Email:</strong> ${reportData.userEmail}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1a1a1a; margin-top: 0;">Motivo del Reporte</h3>
            <p style="line-height: 1.6;">${reportData.message.replace(/\n/g, "<br>")}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
            <p style="color: #6c757d; font-size: 14px;">
              Este reporte fue enviado desde Quimera Sneakers
            </p>
          </div>
        </div>
      `;
    }

    const { data: emailData, error } = await resend.emails.send({
      from: "Quimera Reports <onboarding@resend.dev>",
      to: ["c.cortescandela@gmail.com"],
      subject,
      html: emailContent,
    });

    if (error) {
      console.error("Error enviando email:", error);
      return NextResponse.json(
        { error: "Error al enviar el reporte" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Reporte enviado correctamente", id: emailData?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en la API de reportes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
