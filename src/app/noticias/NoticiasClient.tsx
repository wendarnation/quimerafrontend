// app/noticias/NoticiasClient.tsx
"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { Lock, Calendar, User, Eye } from "lucide-react";

interface Auth0User {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
}

interface NoticiasClientProps {
  user?: Auth0User;
}

export default function NoticiasClient({ user }: NoticiasClientProps) {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { user: auth0User } = useUser();
  const isAuthenticated = !!auth0User;

  const handleContinueReading = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    }
  };

  return (
    <div className="min-h-screen bg-lightwhite">
      {/* Header Section */}
      <div className="bg-lightwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="border-b border-lightaccentwhite pb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-lightblack">
                  Noticias
                </h1>
                <p className="text-verylightblack mt-1 text-sm sm:text-base">
                  Las últimas noticias del mundo sneaker
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <article className="bg-lightwhite">
          <header className="mb-8">
            <div className="mb-6">
              <span className="inline-block bg-redneon text-lightwhite px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
                Editorial
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-lightblack leading-tight mb-4">
                El ¿retorno? del rey
              </h1>
              <p className="text-lg text-verylightblack leading-relaxed">
                Un análisis profundo sobre el legado y la influencia continua de
                Air Jordan 1 en la cultura sneaker mundial
              </p>
            </div>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-darkaccentwhite border-y border-lightaccentwhite py-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>7 de Junio, 2025</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Redacción Quimera</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>5 min de lectura</span>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {/* Párrafo de apertura con imagen destacada */}
            <div className="text-lg leading-relaxed mb-8">
              <p className="text-verylightblack mb-6">
                Air Jordan 1 tiene muchas identidades. Es la primera zapatilla
                de firma de Michael Jordan, la zapatilla que inició el
                coleccionismo y la reventa de sneakers, y el terreno común entre
                comunidades de todo el mundo. Jordan 1 también es una de las
                zapatillas más populares, gracias a que su diseño es aceptado
                globalmente como un elemento básico de la calle.
              </p>

              <div className="my-8">
                <img
                  src="/jordannew1.avif"
                  alt="Air Jordan 1 clásico"
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
              </div>

              <p className="text-verylightblack mb-6">
                Con casi 40 años de historia, hay mucho que saber sobre Jordan
                1. Es una zapatilla importante en subculturas de deportes,
                música, arte, baile y moda, y tiene suficiente historia y
                significado para llenar libros. Pero no necesitas ser un
                historiador de Jordan 1 para entender lo básico antes de comprar
                un par. Esta es una guía de compra intensiva sobre la zapatilla
                que lo comenzó todo.
              </p>

              <p className="text-verylightblack mb-8">
                Desde sus orígenes hasta las combinaciones de colores originales
                y el valor de reventa, aquí está toda la información que
                necesitas antes de comprar un par de 1s.
              </p>
            </div>

            {/* Sección de Historia */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-lightblack mb-6 border-l-4 border-redneon pl-4">
                Una Breve Historia de las Zapatillas Jordan 1
              </h2>

              <div className="bg-darkwhite p-6 rounded-lg mb-6">
                <p className="text-verylightblack leading-relaxed mb-4">
                  En 1984, Michael Jordan no quería firmar con Nike. Prefería
                  las zapatillas de otras marcas como Adidas y Converse. La
                  única razón por la que MJ siquiera aceptó una reunión con Nike
                  fue porque su madre lo obligó a escuchar lo que Nike estaba
                  ofreciendo. Para persuadir a Jordan de firmar con el Swoosh,
                  al diseñador Peter Moore se le encomendó hacer una zapatilla
                  diferente a todo lo que habían hecho antes.
                </p>
              </div>

              <div className="my-8">
                <img
                  src="/jordannew2.avif"
                  alt="Proceso de diseño del Air Jordan 1"
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
              </div>

              <p className="text-verylightblack leading-relaxed mb-6">
                Moore explicó en una entrevista con SLAM Magazine que el diseño
                del Air Jordan 1 fue adaptado para ajustarse al estilo de juego
                de Jordan después de aprender sobre sus preferencias de
                zapatillas, lo que en sí mismo era un riesgo. MJ ni siquiera era
                profesional aún. Diseñar una zapatilla específicamente adaptada
                a un prospecto de draft no probado en 1984 era algo inaudito.
                Sin embargo, Moore siguió adelante con ello.
              </p>

              <p className="text-verylightblack leading-relaxed mb-8">
                Descubrió que a Jordan le gustaban las zapatillas que estaban
                cerca del suelo (para que pudiera sentir la cancha) y que
                tuvieran comodidad desgastada tan pronto como las sacara de la
                caja. Así que con eso en mente, Moore quitó amortiguación extra
                de la suela para mejorar la sensación de la cancha y construyó
                la parte superior en cuero premium para proporcionar la mayor
                comodidad posible.
              </p>
            </div>

            {/* Punto de corte para usuarios no autenticados */}
            {!isAuthenticated && (
              <div className="relative">
                {/* Gradiente de desvanecimiento */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-lightwhite/70 to-lightwhite z-10"></div>

                {/* Contenido difuminado */}
                <div className="filter blur-sm opacity-50">
                  <p className="text-verylightblack leading-relaxed mb-6">
                    Air Jordan 1 también rompió barreras para las combinaciones
                    de colores de zapatillas. Su parte superior con paneles
                    proporcionó un lienzo para grandes secciones de bloqueo de
                    color, diferenciándose de las zapatillas mayormente blancas
                    que dominaban el mercado de zapatillas de baloncesto en los
                    años 1980...
                  </p>

                  <div className="my-8">
                    <img
                      src="/jordannew3.avif"
                      alt="Diferentes colorways del Jordan 1"
                      className="w-full h-auto object-cover rounded-lg shadow-lg"
                    />
                  </div>

                  <p className="text-verylightblack leading-relaxed mb-6">
                    Después de muchas reuniones y ver la marca que Nike
                    visionaba para él, Jordan eventualmente firmó con la marca.
                    Y en ese entonces, la zapatilla simplemente se llamaba Nike
                    Air Jordan...
                  </p>
                </div>

                {/* Modal de registro superpuesto */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-lightwhite rounded-xl p-8 shadow-2xl max-w-md mx-4 text-center">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-lightblack rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-lightwhite" />
                      </div>
                      <h3 className="text-xl font-bold text-lightblack mb-2">
                        Contenido Exclusivo
                      </h3>
                      <p className="text-verylightblack text-sm">
                        Regístrate en Quimera Sneakers para continuar leyendo
                        este artículo completo y acceder a todo nuestro
                        contenido exclusivo.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <a
                        href="/auth/login"
                        className="block w-full bg-lightblack text-lightwhite py-3 px-6 rounded-lg font-semibold hover:text-lightblack hover:bg-yellowneon transition-colors duration-500"
                      >
                        Iniciar Sesión
                      </a>
                      <a
                        href="/auth/login"
                        className="block w-full border-2 border-lightaccentwhite hover:border-pinkneon text-lightblack py-3 px-6 rounded-lg font-semibold hover:text-darkwhite hover:bg-pinkneon duration-500 transition-colors"
                      >
                        Registrarse Gratis
                      </a>
                    </div>

                    <p className="text-xs text-darkaccentwhite mt-4">
                      Solo para usuarios registrados de Quimera Sneakers
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Contenido completo para usuarios autenticados */}
            {isAuthenticated && (
              <div>
                <p className="text-verylightblack leading-relaxed mb-6">
                  Air Jordan 1 también rompió barreras para las combinaciones de
                  colores de zapatillas. Su parte superior con paneles
                  proporcionó un lienzo para grandes secciones de bloqueo de
                  color, diferenciándose de las zapatillas mayormente blancas
                  que dominaban el mercado de zapatillas de baloncesto en los
                  años 1980. Después de muchas reuniones y ver la marca que Nike
                  visionaba para él, Jordan eventualmente firmó con la marca. Y
                  en ese entonces, la zapatilla simplemente se llamaba Nike Air
                  Jordan. El nombre que conocemos hoy no llegó hasta el primer
                  retro del modelo en 1994.
                </p>

                <div className="my-8">
                  <img
                    src="/jordannew3.avif"
                    alt="Diferentes colorways del Jordan 1"
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                  />
                </div>

                <p className="text-verylightblack leading-relaxed mb-6">
                  Aunque Michael Jordan debutó con Nike Air Jordan por primera
                  vez en la cancha hacia finales de 1984, no fue hasta la
                  primavera de 1985 que el modelo de firma estuvo disponible
                  para el público. Con la ayuda de sus icónicos comerciales de
                  televisión "Banned" y la temporada de rookie monumental de
                  Michael Jordan, Nike Air Jordan se convirtió en la zapatilla
                  de baloncesto más popular del mercado, llevando a Nike a
                  nuevas alturas en el mundo del baloncesto.
                </p>

                <div className="my-8">
                  <img
                    src="/jordannew4.avif"
                    alt="Michael Jordan usando las primeras Jordan 1"
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                  />
                </div>

                <div className="bg-darkwhite p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold text-lightblack mb-4">
                    Los Colorways Originales
                  </h3>
                  <p className="text-verylightblack leading-relaxed mb-4">
                    Entre la primavera de 1985 y el otoño de 1986, se lanzaron
                    20 combinaciones de colores del Air Jordan 1 en siluetas de
                    caña alta, caña baja y AJKO. Las primeras Jordan 1 en llegar
                    a las tiendas fueron los colorways Bred, Chicago y Black
                    Toe. El colorway Bred fue el primero en ganar la atención de
                    las masas debido a su prohibición ficticia de la NBA (la
                    prohibición fue poco más que una táctica de marketing de
                    Nike).
                  </p>
                  <p className="text-verylightblack leading-relaxed">
                    Pero en la cancha, Michael Jordan principalmente usó las
                    Jordan 1 Chicago y Black Toe durante sus dos primeras
                    temporadas con los Chicago Bulls. La única vez que usó el
                    colorway Bred fue durante el Concurso de mates de la NBA de
                    1985.
                  </p>
                </div>

                <p className="text-verylightblack leading-relaxed mb-6">
                  Otros colorways OG de Jordan 1 que se lanzaron fueron los UNC,
                  Storm Blue, Royal, Shadow, White/Black, Neutral Grey y los
                  colorways del "Metallic Pack". Cada uno de estos colorways ha
                  sido relanzado en forma Retro desde su debut inicial, pero
                  algunos no hasta hace poco. Colorways que son bien conocidos
                  por su estatus OG como el Shadow y Royal han sido utilizados
                  múltiples veces en los últimos 20 años.
                </p>

                <div className="my-8">
                  <img
                    src="/jordannew5.avif"
                    alt="Colección de diferentes modelos Jordan 1"
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                  />
                </div>

                <p className="text-verylightblack leading-relaxed mb-6">
                  En 1986, Nike lanzó el Nike Air Jordan AJKO, que era una
                  iteración de lona del clásico Air Jordan 1 y venía con la
                  suela del Nike Vandal en lugar de la suela tradicional de
                  Jordan 1. No está claro qué significa "AJKO". Muchos asumen
                  que significa "Air Jordan Knock Out", pero eso significa que
                  nunca ha sido confirmado por Nike.
                </p>

                <div className="bg-redneon/10 border-l-4 border-redneon p-6 rounded-r-lg mb-8">
                  <h3 className="text-xl font-bold text-lightblack mb-4">
                    El Legado Continúa
                  </h3>
                  <p className="text-verylightblack leading-relaxed mb-4">
                    Air Jordan 1 se originó como una zapatilla de baloncesto de
                    rendimiento, pero ahora es más popular por su atractivo
                    callejero. Con una abundancia de combinaciones de colores,
                    pueden usarse en el trabajo, en la calle y, en algunos
                    casos, en la Inauguración Presidencial de los Estados
                    Unidos.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-lightblack mb-6 border-l-4 border-redneon pl-4">
                    Qué Tener en Cuenta al Comprar Zapatillas Jordan 1
                  </h2>

                  <p className="text-verylightblack leading-relaxed mb-6">
                    Jordan 1 es por mucho el modelo de zapatilla más popular,
                    con miles de pares comercializándose cada día. Su
                    popularidad solo es superada por la magnitud de su
                    significado: en términos de importancia histórica, cultural
                    y fiscal, Jordan 1 no tiene rival. Es la zapatilla que lo
                    comenzó todo y, sin embargo, aunque tiene casi 40 años,
                    continúa estando a la vanguardia de la moda de zapatillas.
                  </p>

                  <p className="text-verylightblack leading-relaxed mb-6">
                    Afortunadamente para los compradores, hay una amplia gama de
                    AJ1s para elegir, atendiendo a una variedad de estilos
                    personales y presupuestos. Más de 1500 Jordan 1 diferentes
                    se comercializan regularmente en el mercado, representando
                    innumerables variedades de combinaciones de colores, tallas
                    y puntos de precio.
                  </p>

                  <p className="text-verylightblack leading-relaxed mb-6">
                    Para el coleccionista exigente o inversor, las Jordan 1 High
                    en colorways OG son una parte esencial de cualquier
                    portafolio. Para compradores conscientes del presupuesto que
                    buscan precios más baratos de Jordan 1, la silueta AJ1 Mid
                    ofrece una alternativa atractiva. Y para conocedores de la
                    cultura actual, hay colaboraciones en abundancia: desde
                    Travis Scott hasta Aleali May hasta J. Balvin, innumerables
                    artistas y marcas han usado el Jordan 1 como su lienzo,
                    transformando zapatillas en obras de arte.
                  </p>

                  <div className="bg-lightblack text-lightwhite p-6 rounded-lg">
                    <p className="leading-relaxed text-left font-medium">
                      Air Jordan 1 es para todos, y ahora que estás armado con
                      la historia y los datos, puedes sentirte confiado al
                      entrar al mercado y elegir la Jordan 1 correcta para tu
                      rotación. Feliz compra.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer del artículo */}
        </article>
      </div>
    </div>
  );
}
