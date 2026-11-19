import { AccessoryCategory, CartItem, FirestoreTimestamp } from './types';
import { products } from './data';

export type Currency = 'BDT' | 'USD';

export const formatPrice = (priceInUSD: number, currency: Currency): string => {
  if (currency === 'BDT') {
    return `৳${Math.round(priceInUSD * 110).toLocaleString('en-IN')}`;
  }
  return `$${priceInUSD.toFixed(2)}`;
};

export const getShippingFee = (zone: 'inside' | 'outside', currency: Currency): number => {
  const feeInBDT = zone === 'inside' ? 70 : 130;
  if (currency === 'BDT') return feeInBDT;
  return feeInBDT / 110;
};

export const toMillis = (ts?: FirestoreTimestamp): number => {
  if (!ts) return 0;
  if (typeof ts === 'number') return ts;
  if (typeof ts.toMillis === 'function') return ts.toMillis();
  if (typeof ts.seconds === 'number') return ts.seconds * 1000;
  return 0;
};

export const sanitizeText = (value: string, maxLength: number): string => {
  return value.replace(/[<>]/g, '').trim().slice(0, maxLength);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.trim();
  return /^[+\d\s\-()]{6,25}$/.test(cleaned);
};

export const validatePasswordStrength = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must include at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must include at least one lowercase letter.' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must include at least one number.' };
  }
  return { valid: true, message: '' };
};

export const calculateAuthoritativeOrderTotal = (
  cartItems: CartItem[],
  shippingZone: 'inside' | 'outside'
): { valid: boolean; total: number; verifiedItems: Array<{ id: string; name: string; price: number; quantity: number; category: AccessoryCategory; imageUrl: string }> } => {
  if (!Array.isArray(cartItems) || cartItems.length === 0 || cartItems.length > 50) {
    return { valid: false, total: 0, verifiedItems: [] };
  }

  let subtotal = 0;
  const verifiedItems: Array<{ id: string; name: string; price: number; quantity: number; category: AccessoryCategory; imageUrl: string }> = [];

  for (const cartItem of cartItems) {
    const catalogProduct = products.find((p) => p.id === cartItem.id);
    if (!catalogProduct) {
      return { valid: false, total: 0, verifiedItems: [] };
    }
    const qty = Math.floor(Number(cartItem.quantity));
    if (!Number.isFinite(qty) || qty < 1 || qty > 50) {
      return { valid: false, total: 0, verifiedItems: [] };
    }
    subtotal += catalogProduct.price * qty;
    verifiedItems.push({
      id: catalogProduct.id,
      name: catalogProduct.name,
      price: catalogProduct.price,
      quantity: qty,
      category: catalogProduct.category,
      imageUrl: catalogProduct.imageUrl,
    });
  }

  const shippingUSD = shippingZone === 'inside' ? 70 / 110 : 130 / 110;
  const total = Number((subtotal + shippingUSD).toFixed(4));
  return { valid: total > 0, total, verifiedItems };
};
