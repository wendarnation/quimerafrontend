// components/ZapatillasList.tsx
"use client";

import { useApi } from "@/hooks/useApi";
import ZapatillaCard from "./ZapatillaCard";

export default function ZapatillasList() {
  const { data: zapatillas, isLoading, error } = useApi();

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow-sm text-center">
        <p className="text-red-600">
          Error al cargar zapatillas: {error.message}
        </p>
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white cursor-pointer rounded-md hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!zapatillas || zapatillas.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-600">
          No hay zapatillas disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {zapatillas.map((zapatilla) => (
        <ZapatillaCard key={zapatilla.id} zapatilla={zapatilla} />
      ))}
    </div>
  );
}
