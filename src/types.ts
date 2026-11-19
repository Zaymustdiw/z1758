export type AccessoryCategory =
  | 'belt'
  | 'grillz'
  | 'ring'
  | 'chain'
  | 'outerwear'
  | 'top'
  | 'denim'
  | 'footwear'
  | 'bag'
  | 'bracelet';

export interface HardwareSpec {
  label: string;
  value: string;
  detail: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: AccessoryCategory;
  imageUrl: string;
  description: string;
  themeColor: string;
  galleryImages: string[];
  longDescription: string;
  rating: number;
  material: string;
  finish: string;
  weightGrams: number;
  sizes: string[];
  hardwareSpecs: HardwareSpec[];
  tier?: 'signature' | 'reserve';
  edition?: string;
}

export type FirestoreTimestamp =
  | number
  | { seconds: number; nanoseconds?: number; toMillis?: () => number };

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: FirestoreTimestamp;
}

export type OrderStatus =
  | 'completed'
  | 'wait_sending'
  | 'partial_sending'
  | 'refunded'
  | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: AccessoryCategory;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail?: string;
  items: OrderItem[];
  total: number;
  currency: 'BDT' | 'USD' | string;
  shippingZone?: 'inside' | 'outside';
  deliveryAddress?: string;
  phoneNumber?: string;
  paymentMethod?: 'card' | 'bkash';
  createdAt: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
  status?: OrderStatus;
}

export interface UserPrivateInfo {
  email: string;
  emailVerified: boolean;
  phoneNumber?: string;
  deliveryAddress?: string;
  updatedAt?: FirestoreTimestamp;
}

export interface AdminRecord {
  uid: string;
  email: string;
  addedBy: string;
  createdAt: FirestoreTimestamp;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export type Currency = 'BDT' | 'USD';
export type Theme = 'light' | 'dark';
