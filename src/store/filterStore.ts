import { create } from "zustand";

export interface FilterState {
  city: string | null;
  neighborhood: string | null;
  roomsMin: number | null;
  roomsMax: number | null;
  priceMin: number | null;
  priceMax: number | null;
  sizeMin: number | null;
  sizeMax: number | null;
  hasParking: boolean | null;
  hasBalcony: boolean | null;
  petsAllowed: boolean | null;
  furnished: boolean | null;
  sources: string[];
  sortBy: "first_seen" | "price" | "rooms" | "size_sqm";
  sortDir: "asc" | "desc";
  page: number;
}

interface FilterActions {
  setCity: (city: string | null) => void;
  setNeighborhood: (n: string | null) => void;
  setRoomsMin: (v: number | null) => void;
  setRoomsMax: (v: number | null) => void;
  setPriceMin: (v: number | null) => void;
  setPriceMax: (v: number | null) => void;
  setSizeMin: (v: number | null) => void;
  setSizeMax: (v: number | null) => void;
  toggleBool: (key: "hasParking" | "hasBalcony" | "petsAllowed" | "furnished") => void;
  toggleSource: (s: string) => void;
  setSortBy: (s: FilterState["sortBy"]) => void;
  setSortDir: (d: FilterState["sortDir"]) => void;
  setPage: (p: number) => void;
  reset: () => void;
  loadFromUrl: () => void;
  syncToUrl: () => void;
}

const DEFAULTS: FilterState = {
  city: null,
  neighborhood: null,
  roomsMin: null,
  roomsMax: null,
  priceMin: null,
  priceMax: null,
  sizeMin: null,
  sizeMax: null,
  hasParking: null,
  hasBalcony: null,
  petsAllowed: null,
  furnished: null,
  sources: [],
  sortBy: "first_seen",
  sortDir: "desc",
  page: 1,
};

function readUrl(): Partial<FilterState> {
  const p = new URLSearchParams(window.location.search);
  const out: Partial<FilterState> = {};
  if (p.has("city")) out.city = p.get("city");
  if (p.has("neighborhood")) out.neighborhood = p.get("neighborhood");
  if (p.has("roomsMin")) out.roomsMin = parseFloat(p.get("roomsMin")!);
  if (p.has("roomsMax")) out.roomsMax = parseFloat(p.get("roomsMax")!);
  if (p.has("priceMin")) out.priceMin = parseInt(p.get("priceMin")!);
  if (p.has("priceMax")) out.priceMax = parseInt(p.get("priceMax")!);
  if (p.has("sizeMin")) out.sizeMin = parseInt(p.get("sizeMin")!);
  if (p.has("sizeMax")) out.sizeMax = parseInt(p.get("sizeMax")!);
  if (p.has("hasParking")) out.hasParking = p.get("hasParking") === "1";
  if (p.has("hasBalcony")) out.hasBalcony = p.get("hasBalcony") === "1";
  if (p.has("petsAllowed")) out.petsAllowed = p.get("petsAllowed") === "1";
  if (p.has("furnished")) out.furnished = p.get("furnished") === "1";
  if (p.has("sources")) out.sources = p.getAll("sources");
  if (p.has("sortBy")) out.sortBy = p.get("sortBy") as FilterState["sortBy"];
  if (p.has("sortDir")) out.sortDir = p.get("sortDir") as FilterState["sortDir"];
  if (p.has("page")) out.page = parseInt(p.get("page")!);
  return out;
}

function writeUrl(state: FilterState) {
  const p = new URLSearchParams();
  if (state.city) p.set("city", state.city);
  if (state.neighborhood) p.set("neighborhood", state.neighborhood);
  if (state.roomsMin != null) p.set("roomsMin", String(state.roomsMin));
  if (state.roomsMax != null) p.set("roomsMax", String(state.roomsMax));
  if (state.priceMin != null) p.set("priceMin", String(state.priceMin));
  if (state.priceMax != null) p.set("priceMax", String(state.priceMax));
  if (state.sizeMin != null) p.set("sizeMin", String(state.sizeMin));
  if (state.sizeMax != null) p.set("sizeMax", String(state.sizeMax));
  if (state.hasParking != null) p.set("hasParking", state.hasParking ? "1" : "0");
  if (state.hasBalcony != null) p.set("hasBalcony", state.hasBalcony ? "1" : "0");
  if (state.petsAllowed != null) p.set("petsAllowed", state.petsAllowed ? "1" : "0");
  if (state.furnished != null) p.set("furnished", state.furnished ? "1" : "0");
  state.sources.forEach(s => p.append("sources", s));
  if (state.sortBy !== "first_seen") p.set("sortBy", state.sortBy);
  if (state.sortDir !== "desc") p.set("sortDir", state.sortDir);
  if (state.page > 1) p.set("page", String(state.page));
  const qs = p.toString();
  const newUrl = qs ? `?${qs}` : window.location.pathname;
  window.history.replaceState(null, "", newUrl);
}

export const useFilterStore = create<FilterState & FilterActions>((set, get) => ({
  ...DEFAULTS,

  setCity: (city) => {
    set({ city, neighborhood: null, page: 1 });
    get().syncToUrl();
  },
  setNeighborhood: (neighborhood) => {
    set({ neighborhood, page: 1 });
    get().syncToUrl();
  },
  setRoomsMin: (roomsMin) => {
    set({ roomsMin, page: 1 });
    get().syncToUrl();
  },
  setRoomsMax: (roomsMax) => {
    set({ roomsMax, page: 1 });
    get().syncToUrl();
  },
  setPriceMin: (priceMin) => {
    set({ priceMin, page: 1 });
    get().syncToUrl();
  },
  setPriceMax: (priceMax) => {
    set({ priceMax, page: 1 });
    get().syncToUrl();
  },
  setSizeMin: (sizeMin) => {
    set({ sizeMin, page: 1 });
    get().syncToUrl();
  },
  setSizeMax: (sizeMax) => {
    set({ sizeMax, page: 1 });
    get().syncToUrl();
  },
  toggleBool: (key) => {
    const cur = (get() as FilterState)[key];
    set({ [key]: cur === true ? null : true, page: 1 });
    get().syncToUrl();
  },
  toggleSource: (s) => {
    const { sources } = get();
    set({ sources: sources.includes(s) ? sources.filter(x => x !== s) : [...sources, s], page: 1 });
    get().syncToUrl();
  },
  setSortBy: (sortBy) => {
    set({ sortBy, page: 1 });
    get().syncToUrl();
  },
  setSortDir: (sortDir) => {
    set({ sortDir, page: 1 });
    get().syncToUrl();
  },
  setPage: (page) => {
    set({ page });
    get().syncToUrl();
  },
  reset: () => {
    set(DEFAULTS);
    writeUrl(DEFAULTS);
  },
  loadFromUrl: () => {
    set({ ...DEFAULTS, ...readUrl() });
  },
  syncToUrl: () => {
    writeUrl(get());
  },
}));
