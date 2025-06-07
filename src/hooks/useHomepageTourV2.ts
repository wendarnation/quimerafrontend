import { useEffect, useRef, useState } from 'react';
import { driver } from 'driver.js';

export const useHomepageTourV2 = () => {
const driverRef = useRef<any>(null);
const [isMobile, setIsMobile] = useState(false);

  // Función para mantener el menú abierto
  const keepMenuOpen = () => {
    const menuContainer = document.querySelector('div.fixed.top-0.left-0.h-full.w-full.bg-lightwhite.shadow-xl.z-50');
    
    if (menuContainer && !menuContainer.classList.contains('translate-x-0')) {
      openMobileMenu();
    }
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
const desktopSteps = [
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
},
{
element: '[data-tour="recommended-section"]',
popover: {
title: '⭐ Recomendaciones',
description: 'Sneakers seleccionadas especialmente para ti basadas en tendencias y popularidad. ¡Encuentra tu próximo par favorito!',
side: 'top',
align: 'center'
}
},
{
element: '[data-tour="featured-images"]',
popover: {
title: '🎨 Colecciones Destacadas',
description: 'Explora nuestras colecciones especiales por marca. Cada imagen te llevará a una selección curada de esa marca específica.',
side: 'top',
align: 'center'
}
}
];

    // Configuración para Móvil
    const mobileSteps = [
    {
    element: 'button[aria-label="Buscar"]',
    popover: {
    title: '🔍 Búsqueda',
    description: 'Toca aquí para desplegar la barra de búsqueda y buscar sneakers por marca, modelo o SKU.',
    side: 'bottom',
    align: 'center'
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
    setTimeout(openMobileMenu, 300);
    }
    }
    },
    {
    element: '.fixed .space-y-1 a[href="#"]',
    popover: {
    title: '📰 Noticias',
    description: 'Mantente al día con las últimas noticias del mundo de las sneakers.',
    side: 'right',
      align: 'start'
    },
    onHighlighted: () => {
    if (isMobile) {
    setTimeout(openMobileMenu, 100);
    // Verificar cada 500ms que el menú siga abierto
    const interval = setInterval(keepMenuOpen, 500);
    setTimeout(() => clearInterval(interval), 3000);
    }
    }
    },
    {
    element: '.fixed .space-y-1 a[href="/mision"]',
    popover: {
    title: '🎯 Acerca de',
    description: 'Conoce nuestra misión de democratizar el acceso a las sneakers.',
      side: 'right',
      align: 'start'
    },
    onHighlighted: () => {
    if (isMobile) {
    setTimeout(openMobileMenu, 100);
    }
    }
    },
    {
    element: '.fixed .space-y-1 a[href="/contacta"]',
    popover: {
    title: '📧 Contacta',
      description: '¿Tienes preguntas? Contáctanos a través de esta sección.',
      side: 'right',
    align: 'start'
    },
    onHighlighted: () => {
    if (isMobile) {
    setTimeout(openMobileMenu, 100);
    }
    }
    },
    {
    element: '.fixed .space-y-1 a[href="/favorites"]',
    popover: {
      title: '❤️ Favoritos',
      description: 'Aquí puedes acceder a todas las sneakers que has guardado como favoritas.',
    side: 'right',
    align: 'start'
    },
    onHighlighted: () => {
    if (isMobile) {
    setTimeout(openMobileMenu, 100);
    }
    }
    },
    {
    element: '.fixed .border-t',
    popover: {
      title: '👤 Perfil de Usuario',
    description: 'Gestiona tu perfil, configuración y accede a los ajustes de tu cuenta.',
    side: 'top',
    align: 'center'
    },
    onHighlighted: () => {
    if (isMobile) {
    setTimeout(openMobileMenu, 100);
    }
    },
    onDeselected: () => {
      if (isMobile) {
      setTimeout(closeMobileMenu, 300);
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
    }
    },
    {
      element: '[data-tour="recommended-section"]',
      popover: {
      title: '⭐ Recomendaciones',
      description: 'Sneakers seleccionadas especialmente para ti. ¡Encuentra tu próximo par favorito!',
    side: 'bottom',
    align: 'center'
    }
    },
    {
      element: '[data-tour="featured-images"]',
        popover: {
          title: '🎨 Colecciones Destacadas',
          description: 'Explora nuestras colecciones especiales por marca.',
          side: 'top',
          align: 'center'
        }
      }
    ];

    // Inicializar driver.js con configuración responsive
    driverRef.current = driver({
      showProgress: true,
      stagePadding: 4,
      stageRadius: 10,
      allowClose: true,
      overlayColor: 'black',
      overlayOpacity: 0.7,
      smoothScroll: true,
      showButtons: ['next', 'previous', 'close'],
      nextBtnText: 'Siguiente →',
      prevBtnText: '← Anterior',
      doneBtnText: '✕ Cerrar',
      popoverClass: 'driverjs-theme',
      steps: isMobile ? mobileSteps : desktopSteps
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
