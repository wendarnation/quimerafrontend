// types/zapatilla.ts
export interface Zapatilla {
  id: number;
  marca: string;
  modelo: string;
  imagen: string | null;
  sku: string;
  descripcion: string | null;
  categoria: string;
}
