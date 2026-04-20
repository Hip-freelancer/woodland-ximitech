export interface Product {
  _id: string;
  name: string;
  series: string;
  slug: string;
  description: string;
  grade: string;
  category: string;
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
  createdAt: string;
  updatedAt: string;
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
  tags: string[];
  createdAt: string;
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
