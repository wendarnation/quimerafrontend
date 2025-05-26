// types/zapatilla.ts
export interface Zapatilla {
  id: number;
  marca: string;
  modelo: string;
  imagen: string | null;
  sku: string;
  descripcion: string | null;
  categoria: string;
  fecha_creacion: string;
  activa: boolean;
  precio_min?: number;
  precio_max?: number;
  precio_promedio?: number;
  tiendas_disponibles?: number;
  zapatillasTienda?: ZapatillaTienda[];
}

export interface ZapatillaTienda {
  id: number;
  precio: number;
  disponible: boolean;
  url_producto: string;
  modelo_tienda?: string;
  tienda: Tienda;
}

export interface Tienda {
  id: number;
  nombre: string;
  url: string;
  activa: boolean;
  logo_url?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchFilters {
  search?: string;
  marca?: string;
  modelo?: string;
  sku?: string;
  categoria?: string;
  precio_min?: number;
  precio_max?: number;
  activa?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
