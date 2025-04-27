// components/ZapatillaCard.tsx
import Image from "next/image";
import { Zapatilla } from "@/types/zapatilla";

export default function ZapatillaCard({ zapatilla }: { zapatilla: Zapatilla }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer">
      <div className="relative h-48 w-full bg-gray-200 mb-9">
        {zapatilla.imagen ? (
          <img
            src={zapatilla.imagen}
            alt={`${zapatilla.marca} ${zapatilla.modelo}`}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No imagen
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-lg text-gray-800 font-semibold">
          {zapatilla.modelo}
        </p>
        <p className="text-md text-gray-700 font-medium mb-5">
          {zapatilla.marca}
        </p>
        <p className="text-xs text-gray-600 mt-1">SKU: {zapatilla.sku}</p>
        {zapatilla.descripcion && (
          <p className="text-sm mt-2 text-gray-600 line-clamp-2">
            {zapatilla.descripcion}
          </p>
        )}
        <div className="mt-3 flex justify-between items-center">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {zapatilla.categoria}
          </span>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
}
