// app/mision/MisionClient.tsx
"use client";

import Image from "next/image";

interface Auth0User {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
}

interface MisionClientProps {
  user?: Auth0User;
}

export default function MisionClient({ user }: MisionClientProps) {
  return (
    <div className="min-h-screen bg-lightwhite">
      {/* Header Section */}
      <div className="bg-lightwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="border-b border-lightaccentwhite pb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-lightblack">
                  Nuestra Misión
                </h1>
                <p className="text-verylightblack mt-1 text-sm sm:text-base">
                  Conoce el propósito y la visión que impulsa a Quimera Sneakers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contenido Principal */}
        <div className="">
          <div className="">
            {/* Sección Principal */}
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-lightblack mb-4">
                  ¿Qué es Quimera Sneakers?
                </h2>
                <p className="text-verylightblack text-sm sm:text-base leading-relaxed mb-4">
                  Es una mezcla de muchas cosas distintas, igual que una
                  Quimera. Es lo que queríamos reflejar; que, aunque haya
                  multitud de marcas, tiendas, opciones... Puede existir un
                  lugar en el que todo eso se una y que pueda ser de utilidad
                  para las personas que aman las zapatillas.
                </p>
                <p className="text-verylightblack text-sm sm:text-base leading-relaxed">
                  Una comunidad grande, como la de los snekerheads, merece ser
                  abierta, inclusiva, y ayudar a las personas que lo desean a
                  formar parte de ella en su afán de búsqueda y colección de
                  zapatillas, sin dolores de cabeza.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-lightblack mb-4">
                  Nuestra Visión
                </h2>
                <p className="text-verylightblack text-sm sm:text-base leading-relaxed mb-4">
                  Queríamos hacer fácil lo que para personas no habituadas o sin
                  tiempo es difícil: encontrar zapatillas de calidad al mejor
                  precio posible del mercado. Para ello, comparamos con multitud
                  de tiendas precios, tallas... Para poder ofrecer opciones y
                  que al final, vosotros, seáis los que decidís.
                </p>
                <p className="text-verylightblack text-sm sm:text-base leading-relaxed">
                  Ese es el core, lo principal de la aplicación para todos los
                  usuarios. A partir de ahí ofrecemos otra serie de ventajas a
                  usuarios registrados, como la posibilidad de tener lista de
                  favoritos, reportar zapatillas, valorar, poner comentarios o
                  reportarlos...
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-lightblack mb-4">
                  ¿Por qué Quimera?
                </h2>
                <p className="text-verylightblack text-sm sm:text-base leading-relaxed mb-4">
                  Queremos ser una referencia y un punto de unión en la cultura
                  sneaker, para todos los públicos. Para ello intentamos cada
                  día traeros las novedades del mercado, noticias y raffles
                  interesantes, y más funcionalidad futuras.
                </p>
                <p className="text-verylightblack text-sm sm:text-base leading-relaxed mb-4">
                  Además, como parte de esa inclusividad, la accesibilidad es
                  una parte vital. Intentamos que Quimera Sneakers sea lo
                  bastante fácil de usar para todos y todas, poniendo un buzón
                  de sugerencias disponible también para posibles mejoras que
                  creáis significativas.
                </p>
                <p className="text-verylightblack text-sm sm:text-base leading-relaxed">
                  Nos vemos en las vitrinas, Sneakerheads.
                </p>
              </div>
            </div>

            {/* Imagen al final */}
            <div className="mt-12 pt-8 border-t border-lightaccentwhite">
              <div className="w-full">
                <Image
                  src="/jordan1-logout.webp"
                  alt="Jordan 1 - Quimera Sneakers"
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover rounded-lg"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
