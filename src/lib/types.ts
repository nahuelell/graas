export type MediaAsset = {
  public_id: string;
  url: string;
  width?: number;
  height?: number;
  resource_type?: "image" | "video";
  alt?: string;
};

export type Spec = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string | null;
  description: string | null;
  specs: Spec[];
  images: MediaAsset[];
  featured: boolean;
  published: boolean;
  sort: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

export type UsadoStatus = "disponible" | "reservado" | "vendido";

export type Usado = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: UsadoStatus;
  year: number | null;
  price: number | null;
  show_price: boolean;
  summary: string | null;
  description: string | null;
  specs: Spec[];
  images: MediaAsset[];
  featured: boolean;
  published: boolean;
  sort: number;
  created_at: string;
  updated_at: string;
};

export type Trabajo = {
  id: string;
  title: string;
  client: string | null;
  category: string;
  description: string | null;
  images: MediaAsset[];
  delivered_at: string | null;
  published: boolean;
  sort: number;
  created_at: string;
  updated_at: string;
};

export type Settings = {
  id: number;
  company_name: string;
  legal_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  hours: string | null;
  instagram: string | null;
  facebook: string | null;
  maps_query: string | null;
  hero_kicker: string | null;
  hero_subtitle: string | null;
  hero_video: MediaAsset | null;
  hero_image: MediaAsset | null;
  about: string | null;
  updated_at: string;
};

export type Lead = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  interest: string | null;
  message: string | null;
  source: string | null;
  is_read: boolean;
  created_at: string;
};
