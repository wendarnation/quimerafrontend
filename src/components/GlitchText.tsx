"use client";

import { useState, useEffect } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [currentFontIndex, setCurrentFontIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  // Array de tipografías
  const fonts = [
    { name: "Poppins", style: "font-family: 'Poppins', sans-serif;" },
    { name: "Serif", style: "font-family: 'Playfair Display', serif; font-weight: 700;" },
    { name: "Handwritten", style: "font-family: 'Caveat', cursive; font-weight: 700;" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Activar glitch
      setIsGlitching(true);
      
      // Después de 400ms, cambiar la fuente y desactivar glitch
      setTimeout(() => {
        setCurrentFontIndex((prev) => (prev + 1) % fonts.length);
        setIsGlitching(false);
      }, 400);
    }, 5000); // Cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Cargar las fuentes de Google */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Caveat:wght@400;500;600;700&display=swap" 
        rel="stylesheet" 
      />
      
      <h1 
        className={`${className} transition-all duration-200 ${
          isGlitching ? 'animate-glitch' : ''
        }`}
        data-text={text}
        style={{ 
          ...fonts[currentFontIndex].style.split(';').reduce((acc: any, style) => {
            const [property, value] = style.split(':');
            if (property && value) {
              acc[property.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase())] = value.trim();
            }
            return acc;
          }, {})
        }}
      >
        {text}
      </h1>

      <style jsx>{`
        @keyframes glitch {
          0% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          10% {
            transform: translate(-3px, 2px) scale(1.01);
            filter: hue-rotate(90deg);
          }
          20% {
            transform: translate(-2px, -2px) scale(0.99);
            filter: hue-rotate(180deg);
          }
          30% {
            transform: translate(3px, 3px) scale(1.01);
            filter: hue-rotate(270deg);
          }
          40% {
            transform: translate(2px, -3px) scale(0.99);
            filter: hue-rotate(180deg);
          }
          50% {
            transform: translate(-2px, 3px) scale(1.01);
            filter: hue-rotate(90deg);
          }
          60% {
            transform: translate(-3px, 1px) scale(0.99);
            filter: hue-rotate(0deg);
          }
          70% {
            transform: translate(3px, 2px) scale(1.01);
            filter: hue-rotate(270deg);
          }
          80% {
            transform: translate(-3px, -2px) scale(0.99);
            filter: hue-rotate(180deg);
          }
          90% {
            transform: translate(2px, 3px) scale(1.01);
            filter: hue-rotate(90deg);
          }
          100% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
        }

        .animate-glitch {
          animation: glitch 0.4s ease-in-out;
          text-shadow: 
            2px 0 #ff00ff,
            -2px 0 #00ffff,
            0 0 15px rgba(255, 0, 255, 0.6),
            1px 1px 0 #ff0000,
            -1px -1px 0 #00ff00;
          position: relative;
        }

        .animate-glitch::before {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          animation: glitch-before 0.4s ease-in-out;
          color: #ff00ff;
          z-index: -1;
        }

        @keyframes glitch-before {
          0%, 100% { transform: translate(0); }
          25% { transform: translate(-1px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(-1px, -1px); }
        }
      `}</style>
    </>
  );
}
