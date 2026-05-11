export type Source =
  | "yad2"
  | "madlan"
  | "homeless"
  | "onmap"
  | "winwin"
  | "facebook_marketplace"
  | "facebook_groups";

export interface Listing {
  id: number;
  source: Source;
  external_id: string;
  url: string | null;
  title: string | null;
  city: string | null;
  neighborhood: string | null;
  street: string | null;
  rooms: number | null;
  floor: number | null;
  total_floors: number | null;
  size_sqm: number | null;
  price: number | null;
  price_per_sqm: number | null;
  description: string | null;
  has_parking: boolean | null;
  has_balcony: boolean | null;
  has_elevator: boolean | null;
  pets_allowed: boolean | null;
  furnished: boolean | null;
  contact_name: string | null;
  contact_phone: string | null;
  image_url: string | null;
  images: string[];
  first_seen: string;
  last_seen: string;
  is_active: boolean;
  // API convenience aliases
  price_includes_bills?: boolean | null;
  available_from?: string | null;
  summary?: string | null;
}

export interface ListingsResponse {
  listings: Listing[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface CityOption {
  city: string;
  count: number;
}

export interface NeighborhoodOption {
  neighborhood: string;
  count: number;
}
