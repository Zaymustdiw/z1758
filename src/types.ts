export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'ring' | 'necklace';
  imageUrl: string;
  description: string;
  themeColor: string;
  galleryImages: string[];
  longDescription: string;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type Currency = 'BDT' | 'USD';
export type Theme = 'light' | 'dark' | 'gothic';
