
export type CardSize = 'Small' | 'Medium' | 'Large';

export interface ApiProduct {
  id: string;
  title: string;
  description: string;
  priceRange: number;
  image: string;
  features: string[];
  note: string;
  createdAt: string;
}

export interface ApiPlan {
  id: string;
  title: string; // Reflecting the typo in the provided API
  description: string;
  custom: boolean;
  startingPrice: string;
  features: string[];
  fields: string[];
  mostPopular: boolean;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  includesVideo: boolean;
  includesImage: boolean;
  canCustomizeTemplate: boolean;
  isBookCall: boolean;
}

export interface CardTemplate {
  id: string;
  name: string;
  style: string;
  thumbnail: string;
}

export interface OrderState {
  plan?: ApiPlan;
  size?: CardSize;
  templateId?: string;
  title: string;
  description: string;
  tagline: string;
  quantity: number;
  videoUrl?: string;
  imageUrl?: string;
  image?: string;
}

export interface CustomerDetails {
  doorNoAndStreet: string;
  district: string;
  city: string;
  pincode: string;
  state: string;
  phone: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}



export interface Memory {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  x: number; // percentage from left
  y: number; // percentage from top
  rotation: number; // initial random rotation
}

export interface MousePosition {
  x: number;
  y: number;
}

