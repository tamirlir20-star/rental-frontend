import { create } from 'zustand';
import type { RoomType } from '../data/rentals';

export type SortBy = 'price_asc' | 'price_desc' | 'size' | 'value';

interface FilterState {
  city: string;
  neighborhoods: string[];
  rooms: RoomType | null;
  priceMin: number;
  priceMax: number;
  sizeMin: number;
  sizeMax: number;
  parking: boolean;
  balcony: boolean;
  elevator: boolean;
  pets: boolean;
  furnished: boolean;
  sortBy: SortBy;
  comparisonList: string[];
  activeTab: 'results' | 'compare' | 'charts' | 'map';
}

interface FilterActions {
  setCity: (city: string) => void;
  toggleNeighborhood: (n: string) => void;
  setNeighborhoods: (ns: string[]) => void;
  setRooms: (r: RoomType | null) => void;
  setPriceMin: (v: number) => void;
  setPriceMax: (v: number) => void;
  setSizeMin: (v: number) => void;
  setSizeMax: (v: number) => void;
  toggleFilter: (key: 'parking' | 'balcony' | 'elevator' | 'pets' | 'furnished') => void;
  setSortBy: (s: SortBy) => void;
  toggleComparison: (neighborhood: string) => void;
  clearComparison: () => void;
  setActiveTab: (tab: FilterState['activeTab']) => void;
  reset: () => void;
}

const defaults: FilterState = {
  city: 'תל אביב',
  neighborhoods: [],
  rooms: '2',
  priceMin: 1500,
  priceMax: 30000,
  sizeMin: 20,
  sizeMax: 250,
  parking: false,
  balcony: false,
  elevator: false,
  pets: false,
  furnished: false,
  sortBy: 'price_asc',
  comparisonList: [],
  activeTab: 'results',
};

export const useFilterStore = create<FilterState & FilterActions>((set, get) => ({
  ...defaults,

  setCity: (city) => set({ city, neighborhoods: [], comparisonList: [] }),

  toggleNeighborhood: (n) => {
    const { neighborhoods } = get();
    set({
      neighborhoods: neighborhoods.includes(n)
        ? neighborhoods.filter(x => x !== n)
        : [...neighborhoods, n],
    });
  },

  setNeighborhoods: (ns) => set({ neighborhoods: ns }),

  setRooms: (r) => set({ rooms: r }),

  setPriceMin: (v) => set({ priceMin: v }),
  setPriceMax: (v) => set({ priceMax: v }),
  setSizeMin: (v) => set({ sizeMin: v }),
  setSizeMax: (v) => set({ sizeMax: v }),

  toggleFilter: (key) => set((s) => ({ [key]: !s[key] })),

  setSortBy: (s) => set({ sortBy: s }),

  toggleComparison: (neighborhood) => {
    const { comparisonList } = get();
    if (comparisonList.includes(neighborhood)) {
      set({ comparisonList: comparisonList.filter(x => x !== neighborhood) });
    } else if (comparisonList.length < 4) {
      set({ comparisonList: [...comparisonList, neighborhood] });
    }
  },

  clearComparison: () => set({ comparisonList: [] }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  reset: () => set({ ...defaults }),
}));
