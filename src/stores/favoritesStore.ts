// stores/favoritesStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface FavoriteItem {
  id: number;
  lista_id: number;
  zapatilla_id: number;
  fecha_agregado: string;
  zapatilla: {
    id: number;
    marca: string;
    modelo: string;
    sku: string;
    imagen: string | null;
    descripcion: string | null;
    categoria: string;
    activa: boolean;
    fecha_creacion: string;
    zapatillasTienda?: {
      id: number;
      precio: number;
      disponible: boolean;
      url_producto: string;
      modelo_tienda?: string;
      tienda: {
        id: number;
        nombre: string;
        url: string;
        activa: boolean;
        logo_url?: string;
      };
    }[];
  };
}

export interface FavoritesList {
  id: number;
  nombre: string;
  predeterminada: boolean;
  usuario_id: number;
  fecha_creacion: string;
  zapatillas?: FavoriteItem[];
}

interface FavoritesState {
  // Estado
  defaultList: FavoritesList | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Computed
  favoriteIds: Set<number>;
  
  // Acciones
  setDefaultList: (list: FavoritesList) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  
  // Operaciones de favoritos
  addFavorite: (zapatillaId: number, item: FavoriteItem) => void;
  removeFavorite: (zapatillaId: number) => void;
  isFavorite: (zapatillaId: number) => boolean;
  
  // Reset
  reset: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      defaultList: null,
      isLoading: false,
      isInitialized: false,
      error: null,
      favoriteIds: new Set(),
      
      // Setters
      setDefaultList: (list) => {
        const favoriteIds = new Set(
          list.zapatillas?.map(item => item.zapatilla_id) || []
        );
        set({ defaultList: list, favoriteIds });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      
      // Operaciones de favoritos
      addFavorite: (zapatillaId, item) => {
        const { defaultList, favoriteIds } = get();
        if (!defaultList) return;
        
        const newFavoriteIds = new Set(favoriteIds);
        newFavoriteIds.add(zapatillaId);
        
        const updatedList = {
          ...defaultList,
          zapatillas: [...(defaultList.zapatillas || []), item]
        };
        
        set({ 
          defaultList: updatedList, 
          favoriteIds: newFavoriteIds 
        });
      },
      
      removeFavorite: (zapatillaId) => {
        const { defaultList, favoriteIds } = get();
        if (!defaultList) return;
        
        const newFavoriteIds = new Set(favoriteIds);
        newFavoriteIds.delete(zapatillaId);
        
        const updatedList = {
          ...defaultList,
          zapatillas: (defaultList.zapatillas || []).filter(
            item => item.zapatilla_id !== zapatillaId
          )
        };
        
        set({ 
          defaultList: updatedList, 
          favoriteIds: newFavoriteIds 
        });
      },
      
      isFavorite: (zapatillaId) => {
        return get().favoriteIds.has(zapatillaId);
      },
      
      // Reset para logout
      reset: () => set({
        defaultList: null,
        isLoading: false,
        isInitialized: false,
        error: null,
        favoriteIds: new Set()
      })
    }),
    {
      name: 'favorites-store'
    }
  )
);
