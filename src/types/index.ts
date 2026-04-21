export interface Product {
  _id: string;
  name: string;
  series: string;
  slug: string;
  description: string;
  grade: string;
  category: string;
  categoryLabel?: string;
  thickness: number[];
  material: string;
  bonding: string;
  dimensions: string[];
  image: string;
  galleryImages: string[];
  certifications: string[];
  availability: string;
  specifications: ProductSpec[];
  applications: ProductApplication[];
  featured: boolean;
  isVisible?: boolean;
  priority?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductMenuItem {
  _id: string;
  image: string;
  name: string;
  slug: string;
}

export interface ProductMenuCategory {
  image: string;
  name: string;
  productCount: number;
  products: ProductMenuItem[];
  slug: string;
}

export interface ProductSpec {
  attribute: string;
  specification: string;
  tolerance: string;
  standard: string;
}

export interface ProductApplication {
  order: number;
  title: string;
  subtitle: string;
  image: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  title: string;
  region: string;
  image: string;
  email: string;
  phone: string;
  whatsapp: string;
  zalo: string;
  order: number;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  location: string;
  year: number;
  featured: boolean;
  createdAt: string;
}

export interface NewsArticle {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  publishDate: string;
  slug: string;
  category?: string;
  categoryLabel?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  isVisible?: boolean;
  priority?: number;
}

export interface Category {
  _id: string;
  image: string;
  isVisible: boolean;
  name: string;
  priority: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
}

export type Locale = "en" | "vi";
