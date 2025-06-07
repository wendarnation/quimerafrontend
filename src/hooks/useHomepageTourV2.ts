import { useEffect, useRef, useState } from 'react';
import { driver } from 'driver.js';

// Interfaz para el tipo de paso del driver
interface DriverStep {
  element?: string | Element | (() => Element);
  popover: {
    title: string;
    description: string;
    side: 'top' | 'bottom' | 'left' | 'right';
    align: 'start' | 'center' | 'end';
  };
  onHighlighted?: () => void;
  onDeselected?: () => void;
}

export const useHomepageTourV2 = () => {
  const driverRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const lastStepRef = useRef<number>(0);
  const isGoingForwardRef = useRef<boolean>(true);

  // Función para obtener elemento de noticias dinámicamente
  const getNewsElement = (): Element => {
    if (isMobile) {
      // Asegurar que el menú esté abierto
      const menuContainer = document.querySelector('div.fixed.top-0.left-0.h-full.w-full.bg-lightwhite.shadow-xl.z-50');
      if (!menuContainer || !menuContainer.classList.contains('translate-x-0')) {
        openMobileMenu();
      }
    }
    
    return document.querySelector('[data-tour="mobile-news"]') || document.body;
  };

  // Función para obtener elemento "Acerca de" dinámicamente
  const getAboutElement = (): Element => {
    if (isMobile) {
      const menuContainer = document.querySelector('div.fixed.top-0.left-0.h-full.w-full.bg-lightwhite.shadow-xl.z-50');
      if (!menuContainer || !menuContainer.classList.contains('translate-x-0')) {
        openMobileMenu();
      }
    }
    
    return document.querySelector('[data-tour="mobile-about"]') || document.body;
  };

  // Función para obtener elemento "Contacta" dinámicamente
  const getContactElement = (): Element => {
    if (isMobile) {
      const menuContainer = document.querySelector('div.fixed.top-0.left-0.h-full.w-full.bg-lightwhite.shadow-xl.z-50');
      if (!menuContainer || !menuContainer.classList.contains('translate-x-0')) {
        openMobileMenu();
      }
    }
    
    return document.querySelector('[data-tour="mobile-contact"]') || document.body;
  };

  // Función para obtener elemento "Favoritos" dinámicamente
  const getFavoritesElement = (): Element => {
    if (isMobile) {
      const menuContainer = document.querySelector('div.fixed.top-0.left-0.h-full.w-full.bg-lightwhite.shadow-xl.z-50');
      if (!menuContainer || !menuContainer.classList.contains('translate-x-0')) {
        openMobileMenu();
      }
    }
    
    return document.querySelector('[data-tour="mobile-favorites"]') || document.body;
  };

  // Función para obtener elemento "Usuario" dinámicamente
  const getUserSectionElement = (): Element => {
    if (isMobile) {
      const menuContainer = document.querySelector('div.fixed.top-0.left-0.h-full.w-full.bg-lightwhite.shadow-xl.z-50');
      if (!menuContainer || !menuContainer.classList.contains('translate-x-0')) {
        openMobileMenu();
      }
    }
    
    return document.querySelector('[data-tour="mobile-user-section"]') || document.body;
  };

  // Función para mantener el menú abierto
  const keepMenuOpen = () => {
    const menuContainer = document.querySelector('div.fixed.top-0.left-0.h-full.w-full.bg-lightwhite.shadow-xl.z-50');
    
    if (menuContainer && !menuContainer.classList.contains('translate-x-0')) {
      openMobileMenu();
    }
  };

  // Función para reemplazar texto de botones
  const replaceButtonsWithIcons = () => {
    setTimeout(() => {
      const nextBtn = document.querySelector('.driver-popover-next-btn');
      const prevBtn = document.querySelector('.driver-popover-prev-btn');
      const closeBtn = document.querySelector('.driver-popover-close-btn');

      if (nextBtn) {
        // Solo texto tanto en móvil como en desktop
        nextBtn.textContent = 'Siguiente';
      }

      if (prevBtn) {
        // Solo texto tanto en móvil como en desktop
        prevBtn.textContent = 'Anterior';
      }

      if (closeBtn) {
        // Mantener el tamaño y estilo original de la X
        closeBtn.textContent = '×';
      }
    }, 100);
  };

  // Función para verificar si existe la sección de recomendaciones
  const checkRecommendedSection = () => {
    return document.querySelector('[data-tour="recommended-section"]') !== null;
  };

  useEffect(() => {
    // Detectar si es móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Función simple para abrir el menú
  const openMobileMenu = () => {
    const menuButton = document.querySelector('button[aria-label="Abrir menú"]') as HTMLButtonElement;
    const menuContainer = document.querySelector('div.fixed.top-0.left-0.h-full.w-full.bg-lightwhite.shadow-xl.z-50');
    
    // Solo abrir si no está ya abierto
    if (menuButton && (!menuContainer || menuContainer.classList.contains('-translate-x-full'))) {
      menuButton.click();
      
      // Prevenir que se cierre inmediatamente
      setTimeout(() => {
        const overlay = document.querySelector('.driver-overlay');
        if (overlay) {
          overlay.addEventListener('click', (e) => {
            e.stopPropagation();
          }, { once: true });
        }
      }, 100);
    }
  };

  // Función simple para cerrar el menú
  const closeMobileMenu = () => {
    const closeButton = document.querySelector('button[aria-label="Cerrar menú"]') as HTMLButtonElement;
    const menuContainer = document.querySelector('div.fixed.top-0.left-0.h-full.w-full.bg-lightwhite.shadow-xl.z-50');

    // Solo cerrar si está abierto
    if (closeButton && menuContainer && menuContainer.classList.contains('translate-x-0')) {
      closeButton.click();
    }
  };

  useEffect(() => {
    // Configuración para Desktop
    const baseDesktopSteps: DriverStep[] = [
      // Paso de bienvenida
      {
        popover: {
          title: '👋 ¡Bienvenido a Quimera Sneakers!',
          description: 'Te vamos a enseñar cómo funciona nuestra plataforma para que puedas encontrar las mejores sneakers al mejor precio. ¡Empecemos!',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '[data-tour="search-bar"]',
        popover: {
          title: '🔍 Barra de Búsqueda',
          description: 'Aquí puedes buscar sneakers por marca, modelo o SKU. ¡Prueba escribiendo "Jordan", "Nike" o cualquier modelo que te interese!',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '[data-tour="nav-news"]',
        popover: {
          title: '📰 Noticias',
          description: 'Mantente al día con las últimas noticias del mundo de las sneakers, lanzamientos y tendencias.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '[data-tour="nav-about"]',
        popover: {
          title: '🎯 Acerca de',
          description: 'Conoce nuestra misión de democratizar el acceso a las sneakers y descubre qué nos motiva.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '[data-tour="nav-contact"]',
        popover: {
          title: '📧 Contacta',
          description: '¿Tienes alguna pregunta o sugerencia? Contáctanos a través de esta sección.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '[data-tour="user-section"]',
        popover: {
          title: '👤 Sección de Usuario',
          description: 'Aquí puedes acceder a tus favoritos, configuración de perfil y todas las funciones personalizadas de tu cuenta.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '[data-tour="trending-section"]',
        popover: {
          title: '🔥 Novedades',
          description: 'Las sneakers más recientes y en tendencia. Desliza para ver más modelos o haz clic en "Ver todas" para explorar todo nuestro catálogo.',
          side: 'top',
          align: 'center'
        }
      }
    ];

    // Añadir recomendaciones si existe la sección
    if (checkRecommendedSection()) {
      baseDesktopSteps.push({
        element: '[data-tour="recommended-section"]',
        popover: {
          title: '⭐ Recomendaciones',
          description: 'Sneakers seleccionadas especialmente para ti basadas en tendencias y popularidad. ¡Encuentra tu próximo par favorito!',
          side: 'top',
          align: 'center'
        }
      });
    }

    // Añadir colecciones destacadas y despedida
    baseDesktopSteps.push(
      {
        element: '[data-tour="featured-images"]',
        popover: {
          title: '🎨 Colecciones Destacadas',
          description: 'Explora nuestras colecciones especiales por marca. Cada imagen te llevará a una selección curada de esa marca específica.',
          side: 'top',
          align: 'center'
        }
      },
      // Paso de despedida
      {
        popover: {
          title: '🎉 ¡Tour completado!',
          description: '¡Perfecto! Ya conoces las funciones principales de Quimera Sneakers. El tour estará siempre disponible en el botón "Tour Guiado" si necesitas repasarlo. ¡Disfruta explorando!',
          side: 'bottom',
          align: 'center'
        }
      }
    );

    const desktopSteps = baseDesktopSteps;

    // Configuración para Móvil
    const baseMobileSteps: DriverStep[] = [
      // Paso de bienvenida
      {
        popover: {
          title: '👋 ¡Bienvenido a Quimera Sneakers!',
          description: 'Te vamos a enseñar cómo funciona nuestra plataforma para que puedas encontrar las mejores sneakers al mejor precio. ¡Empecemos!',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: 'button[aria-label="Buscar"]',
        popover: {
          title: '🔍 Búsqueda',
          description: 'Toca aquí para desplegar la barra de búsqueda y buscar sneakers por marca, modelo o SKU.',
          side: 'bottom',
          align: 'center'
        },
        onHighlighted: () => {
          // Abrir el menú cuando retrocedemos desde Noticias (solo hacia atrás)
          if (isMobile && !isGoingForwardRef.current) {
            openMobileMenu();
          }
        }
      },
      {
        element: 'button[aria-label="Abrir menú"]',
        popover: {
          title: '📱 Menú de Navegación',
          description: 'Vamos a abrir el menú para explorar todas las opciones disponibles.',
          side: 'bottom',
          align: 'center'
        },
        onDeselected: () => {
          if (isMobile) {
            setTimeout(() => {
              openMobileMenu();
              // Asegurar que el menú esté completamente abierto antes del siguiente paso
              setTimeout(() => {
                const menuContainer = document.querySelector('div.fixed.top-0.left-0.h-full.w-full.bg-lightwhite.shadow-xl.z-50');
                if (menuContainer && !menuContainer.classList.contains('translate-x-0')) {
                  openMobileMenu();
                  
                  // Si el menú no se abrió, intentar una vez más
                  setTimeout(() => {
                    if (menuContainer && !menuContainer.classList.contains('translate-x-0')) {
                      openMobileMenu();
                    }
                  }, 200);
                }
              }, 300);
            }, 200);
          }
        }
      },
      {
        element: getNewsElement,
        popover: {
          title: '📰 Noticias',
          description: 'Mantente al día con las últimas noticias del mundo de las sneakers.',
          side: 'left',
          align: 'center'
        },
        onHighlighted: () => {
          if (isMobile) {
            // Cerrar el menú cuando retrocedemos hacia "Abrir menú"
            if (!isGoingForwardRef.current) {
              closeMobileMenu();
            }
            
            // Ajuste adicional del popover para el elemento de noticias
            setTimeout(() => {
              const popover = document.querySelector('.driverjs-theme.driver-popover');
              if (popover) {
                (popover as HTMLElement).style.zIndex = '10000';
                (popover as HTMLElement).style.position = 'fixed';
              }
            }, 100);
          }
        }
      },
      {
        element: getAboutElement,
        popover: {
          title: '🎯 Acerca de',
          description: 'Conoce nuestra misión de democratizar el acceso a las sneakers.',
          side: 'left',
          align: 'center'
        },
        onHighlighted: () => {
          if (isMobile) {
            setTimeout(() => {
              const popover = document.querySelector('.driverjs-theme.driver-popover');
              if (popover) {
                (popover as HTMLElement).style.zIndex = '10000';
                (popover as HTMLElement).style.position = 'fixed';
              }
            }, 100);
          }
        }
      },
      {
        element: getContactElement,
        popover: {
          title: '📧 Contacta',
          description: '¿Tienes preguntas? Contáctanos a través de esta sección.',
          side: 'left',
          align: 'center'
        },
        onHighlighted: () => {
          if (isMobile) {
            setTimeout(() => {
              const popover = document.querySelector('.driverjs-theme.driver-popover');
              if (popover) {
                (popover as HTMLElement).style.zIndex = '10000';
                (popover as HTMLElement).style.position = 'fixed';
              }
            }, 100);
          }
        }
      },
      {
        element: getFavoritesElement,
        popover: {
          title: '❤️ Favoritos',
          description: 'Aquí puedes acceder a todas las sneakers que has guardado como favoritas.',
          side: 'left',
          align: 'center'
        },
        onHighlighted: () => {
          if (isMobile) {
            setTimeout(() => {
              const popover = document.querySelector('.driverjs-theme.driver-popover');
              if (popover) {
                (popover as HTMLElement).style.zIndex = '10000';
                (popover as HTMLElement).style.position = 'fixed';
              }
            }, 100);
          }
        }
      },
      {
        element: getUserSectionElement,
        popover: {
          title: '👤 Perfil de Usuario',
          description: 'Gestiona tu perfil, configuración y accede a los ajustes de tu cuenta.',
          side: 'top',
          align: 'center'
        },
        onHighlighted: () => {
          if (isMobile) {
            // Abrir el menú cuando retrocedemos desde Novedades
            if (!isGoingForwardRef.current) {
              openMobileMenu();
            }
            
            setTimeout(() => {
              const popover = document.querySelector('.driverjs-theme.driver-popover');
              if (popover) {
                (popover as HTMLElement).style.zIndex = '10000';
                (popover as HTMLElement).style.position = 'fixed';
              }
            }, 100);
          }
        }
      },
      {
        element: '[data-tour="trending-section"]',
        popover: {
          title: '🔥 Novedades',
          description: 'Las sneakers más recientes y en tendencia. Desliza horizontalmente para ver más modelos.',
          side: 'bottom',
          align: 'center'
        },
        onHighlighted: () => {
          if (isMobile) {
            if (isGoingForwardRef.current) {
              // Cerrar el menú cuando avanzamos desde el menú hacia Novedades
              closeMobileMenu();
            } else {
              // Abrir el menú cuando retrocedemos desde pasos posteriores hacia Novedades
              // No hacemos nada aquí porque queremos que el menú se abra cuando retrocedamos al último elemento del menú
            }
          }
        }
      }
    ];

    // Añadir recomendaciones si existe la sección
    if (checkRecommendedSection()) {
      baseMobileSteps.push({
        element: '[data-tour="recommended-section"]',
        popover: {
          title: '⭐ Recomendaciones',
          description: 'Sneakers seleccionadas especialmente para ti. ¡Encuentra tu próximo par favorito!',
          side: 'bottom',
          align: 'center'
        }
      });
    }

    // Añadir colecciones destacadas y despedida
    baseMobileSteps.push(
      {
        element: '[data-tour="featured-images"]',
        popover: {
          title: '🎨 Colecciones Destacadas',
          description: 'Explora nuestras colecciones especiales por marca.',
          side: 'top',
          align: 'center'
        }
      },
      // Paso de despedida
      {
        popover: {
          title: '🎉 ¡Tour completado!',
          description: '¡Perfecto! Ya conoces las funciones principales de Quimera Sneakers. El tour estará siempre disponible en el botón "Tour Guiado" si necesitas repasarlo. ¡Disfruta explorando!',
          side: 'bottom',
          align: 'center'
        }
      }
    );

    const mobileSteps = baseMobileSteps;

    // Inicializar driver.js con configuración responsive
    driverRef.current = driver({
      showProgress: true,
      stagePadding: isMobile ? 2 : 4,
      stageRadius: 10,
      allowClose: true,
      overlayColor: 'black',
      overlayOpacity: 0.7,
      smoothScroll: true,
      showButtons: ['next', 'previous', 'close'],
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior', 
      doneBtnText: 'X',
      popoverClass: 'driverjs-theme',
      steps: isMobile ? mobileSteps : desktopSteps,
      onHighlighted: (element) => {
        replaceButtonsWithIcons();
        
        // Ajuste específico para móvil cuando estamos en el menú
        if (isMobile && element) {
          const popover = document.querySelector('.driverjs-theme.driver-popover');
          if (popover && element.closest('.fixed.top-0.left-0')) {
            // Asegurar que el popover esté visible sobre el menú móvil
            (popover as HTMLElement).style.zIndex = '9999';
            (popover as HTMLElement).style.position = 'fixed';
          }
        }
      },
      onDeselected: () => {
        replaceButtonsWithIcons();
      },
      // Configuración para manejar elementos que necesitan tiempo para cargar
      onBeforeHighlight: (element, step) => {
        // Rastrear dirección del movimiento ANTES de cada paso
        if (driverRef.current) {
          const currentStep = driverRef.current.getActiveIndex();
          const previousStep = lastStepRef.current;
          isGoingForwardRef.current = currentStep > previousStep;
          lastStepRef.current = currentStep;
        }
        
        if (isMobile && step && step.element) {
          const elementSelector = step.element;
          
          // Si es uno de los elementos del menú móvil, asegurar que el menú esté abierto
          if (typeof elementSelector === 'string' && elementSelector.includes('mobile-')) {
            return new Promise((resolve) => {
              // Forzar apertura del menú
              openMobileMenu();
              
              // Dar tiempo para que la animación del menú termine
              setTimeout(() => {
                openMobileMenu(); // Segundo intento por si acaso
                
                // Verificar que el elemento esté disponible
                const checkElement = (attempts = 0) => {
                  const targetElement = document.querySelector(elementSelector);
                  const menuContainer = document.querySelector('div.fixed.top-0.left-0.h-full.w-full.bg-lightwhite.shadow-xl.z-50');
                  
                  if (targetElement && 
                      menuContainer && 
                      menuContainer.classList.contains('translate-x-0') &&
                      targetElement.offsetParent !== null) {
                    resolve(true);
                  } else if (attempts < 20) { // Máximo 20 intentos (2 segundos)
                    if (!menuContainer?.classList.contains('translate-x-0')) {
                      openMobileMenu();
                    }
                    setTimeout(() => checkElement(attempts + 1), 100);
                  } else {
                    resolve(true);
                  }
                };
                
                checkElement();
              }, 500); // Esperar 500ms para la animación
            });
          }
          
          // Si es una función dinámica (nuestros getters), también manejarla
          if (typeof elementSelector === 'function') {
            return new Promise((resolve) => {
              openMobileMenu();
              
              setTimeout(() => {
                openMobileMenu();
                
                const checkElement = (attempts = 0) => {
                  const targetElement = elementSelector();
                  const menuContainer = document.querySelector('div.fixed.top-0.left-0.h-full.w-full.bg-lightwhite.shadow-xl.z-50');
                  
                  if (targetElement && 
                      menuContainer && 
                      menuContainer.classList.contains('translate-x-0') &&
                      targetElement.offsetParent !== null) {
                    resolve(true);
                  } else if (attempts < 20) {
                    if (!menuContainer?.classList.contains('translate-x-0')) {
                      openMobileMenu();
                    }
                    setTimeout(() => checkElement(attempts + 1), 100);
                  } else {
                    resolve(true);
                  }
                };
                
                checkElement();
              }, 500);
            });
          }
        }
        return Promise.resolve(true);
      }
    });

    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, [isMobile]);

  const startTour = () => {
    if (driverRef.current) {
      driverRef.current.drive();
    }
  };

  return { startTour };
};