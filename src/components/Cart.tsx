import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, ShieldCheck, AlertTriangle, CreditCard } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { CartItem, Currency, Theme } from '../types';
import { formatPrice, isValidPhoneNumber, sanitizeText } from '../utils';

export interface CheckoutPayload {
  shippingZone: 'inside' | 'outside';
  deliveryAddress: string;
  phoneNumber: string;
  paymentMethod: 'card' | 'bkash';
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
  onCheckout: (payload: CheckoutPayload) => Promise<void> | void;
  currency: Currency;
  theme: Theme;
}

export const Cart = React.memo(function Cart({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  currency,
  theme,
}: CartProps) {
  const { user, isEmailVerified, openAuthModal } = useAuth();
  const [shippingZone, setShippingZone] = useState<'inside' | 'outside'>('inside');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bkash'>('card');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !user || !isEmailVerified) return;
    const loadSavedInfo = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid, 'private', 'info'));
        if (snap.exists()) {
          const data = snap.data();
          if (data.deliveryAddress && !deliveryAddress) setDeliveryAddress(data.deliveryAddress);
          if (data.phoneNumber && !phoneNumber) setPhoneNumber(data.phoneNumber);
        }
      } catch {
        // Ignore non-fatal prefill error
      }
    };
    loadSavedInfo();
  }, [isOpen, user, isEmailVerified]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (shippingZone === 'inside' ? 70 / 110 : 130 / 110);

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-950';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const footerBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200';
  const primaryBtn = isDark
    ? 'bg-zinc-100 text-zinc-950 hover:bg-white'
    : 'bg-zinc-950 text-white hover:bg-zinc-800';

  const handleSubmitOrder = async () => {
    setFormError(null);

    if (!user) {
      openAuthModal();
      return;
    }

    if (!isEmailVerified) {
      setFormError('Please verify your email address before placing an order.');
      openAuthModal();
      return;
    }

    const cleanAddress = sanitizeText(deliveryAddress, 300);
    const cleanPhone = sanitizeText(phoneNumber, 30);

    if (cleanAddress.length < 5) {
      setFormError('Please enter a valid delivery address (at least 5 characters).');
      return;
    }
    if (!isValidPhoneNumber(cleanPhone)) {
      setFormError('Please enter a valid phone number (6–25 digits).');
      return;
    }

    setSubmitting(true);
    try {
      await onCheckout({
        shippingZone,
        deliveryAddress: cleanAddress,
        phoneNumber: cleanPhone,
        paymentMethod,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-y-0 right-0 w-full sm:w-[400px] shadow-2xl z-50 flex flex-col border-l ${bgMain}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-2 border-b-0">
              <h2 className={`font-display text-xl font-bold ${textColor}`}>Your Z1758 Bag</h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto flex flex-col">
              {/* Items */}
              <div className="p-6 flex-1">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-zinc-800' : 'bg-zinc-100'
                      }`}
                    >
                      <ShoppingBag className={`w-10 h-10 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`} />
                    </div>
                    <p className={subTextColor}>Your bag is empty.</p>
                    <button
                      onClick={onClose}
                      className={`font-semibold underline underline-offset-4 cursor-pointer ${textColor}`}
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex gap-4"
                        >
                          <div
                            className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ${
                              item.imageUrl.includes('/images/catalog/')
                                ? 'bg-white border border-zinc-200'
                                : isDark
                                ? 'bg-zinc-800'
                                : 'bg-[#F7F7F5]'
                            }`}
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className={`w-full h-full ${
                                item.imageUrl.includes('/images/catalog/') ? 'object-contain p-1' : 'object-cover'
                              }`}
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="flex justify-between items-start">
                              <h4 className={`text-sm font-bold leading-tight pr-4 ${textColor}`}>{item.name}</h4>
                              <span className={`text-sm font-mono font-bold tabular-nums ${textColor}`}>
                                {formatPrice(item.price, currency)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className={`text-[10px] font-mono uppercase tracking-widest ${subTextColor}`}>
                                {item.category}{item.selectedSize ? ` · ${item.selectedSize}` : ''}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                                    isDark
                                      ? 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-400'
                                      : 'border-zinc-300 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 hover:border-zinc-950'
                                  }`}
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className={`text-xs font-mono font-bold w-3 text-center ${textColor}`}>{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                                    isDark
                                      ? 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-400'
                                      : 'border-zinc-300 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 hover:border-zinc-950'
                                  }`}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => onRemove(item.id)}
                                  className="ml-1 text-[10px] text-red-400 hover:text-red-500 cursor-pointer"
                                  title="Remove item"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className={`p-6 pt-4 border-t space-y-3 mt-auto flex-shrink-0 ${footerBg}`}>
                  <div className={`flex justify-between text-sm ${subTextColor}`}>
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums">{formatPrice(subtotal, currency)}</span>
                  </div>

                  <div className={`flex flex-col gap-2 pt-2 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                    <label className={`text-[10px] font-mono font-bold uppercase ${subTextColor}`}>Shipping Option</label>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="shipping"
                          value="inside"
                          checked={shippingZone === 'inside'}
                          onChange={() => setShippingZone('inside')}
                          className="accent-zinc-900 dark:accent-zinc-100"
                        />
                        <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Inside Dhaka</span>
                      </label>
                      <span className={`text-sm font-mono font-bold tabular-nums ${textColor}`}>{formatPrice(70 / 110, currency)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="shipping"
                          value="outside"
                          checked={shippingZone === 'outside'}
                          onChange={() => setShippingZone('outside')}
                          className="accent-zinc-900 dark:accent-zinc-100"
                        />
                        <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Outside Dhaka</span>
                      </label>
                      <span className={`text-sm font-mono font-bold tabular-nums ${textColor}`}>{formatPrice(130 / 110, currency)}</span>
                    </div>
                  </div>

                  <div
                    className={`flex justify-between text-lg font-bold pt-3 border-t mt-2 ${textColor} ${
                      isDark ? 'border-zinc-800' : 'border-zinc-200'
                    }`}
                  >
                    <span>Total</span>
                    <span className="font-mono tabular-nums">{formatPrice(total, currency)}</span>
                  </div>

                  <div className="pt-4 space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className={`text-[10px] font-mono font-bold uppercase ${subTextColor}`}>Delivery Address</label>
                        <input
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          maxLength={300}
                          placeholder="House, Street, Area..."
                          className={`w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${
                            isDark
                              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-zinc-400'
                              : 'bg-[#F7F7F5] border-zinc-200 text-zinc-900 focus:border-zinc-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`text-[10px] font-mono font-bold uppercase ${subTextColor}`}>Phone Number</label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          maxLength={30}
                          placeholder="+880 1..."
                          className={`w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${
                            isDark
                              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-zinc-400'
                              : 'bg-[#F7F7F5] border-zinc-200 text-zinc-900 focus:border-zinc-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`text-[10px] font-mono font-bold uppercase ${subTextColor}`}>Payment Method</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <label className="cursor-pointer">
                            <input
                              type="radio"
                              name="payment"
                              checked={paymentMethod === 'card'}
                              onChange={() => setPaymentMethod('card')}
                              className="peer sr-only"
                            />
                            <div
                              className={`h-10 border rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium transition-all ${
                                isDark
                                  ? 'border-zinc-700 text-zinc-400 peer-checked:bg-zinc-100 peer-checked:border-zinc-100 peer-checked:text-zinc-950'
                                  : 'border-zinc-200 text-zinc-600 peer-checked:bg-zinc-950 peer-checked:border-zinc-950 peer-checked:text-white'
                              }`}
                            >
                              <CreditCard className="w-4 h-4" />
                              <span>Card</span>
                            </div>
                          </label>
                          <label className="cursor-pointer">
                            <input
                              type="radio"
                              name="payment"
                              checked={paymentMethod === 'bkash'}
                              onChange={() => setPaymentMethod('bkash')}
                              className="peer sr-only"
                            />
                            <div
                              className={`h-10 border rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                                isDark
                                  ? 'border-zinc-700 text-zinc-400 peer-checked:bg-zinc-100 peer-checked:border-zinc-100 peer-checked:text-zinc-950'
                                  : 'border-zinc-200 text-zinc-600 peer-checked:bg-zinc-950 peer-checked:border-zinc-950 peer-checked:text-white'
                              }`}
                            >
                              bKash
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {formError && (
                      <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {!user ? (
                      <button
                        onClick={openAuthModal}
                        className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg cursor-pointer ${primaryBtn}`}
                      >
                        Sign In to Order
                      </button>
                    ) : !isEmailVerified ? (
                      <button
                        onClick={openAuthModal}
                        className="w-full bg-amber-500 text-zinc-950 py-4 rounded-2xl font-bold hover:brightness-110 transition-all active:scale-[0.98] shadow-lg cursor-pointer"
                      >
                        Verify Email to Checkout
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitOrder}
                        disabled={submitting}
                        className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg cursor-pointer disabled:opacity-50 ${primaryBtn}`}
                      >
                        {submitting ? 'Verifying & Placing Order...' : 'Place Order'}
                      </button>
                    )}

                    <p className={`text-[9px] text-center mt-2 px-2 leading-tight flex items-center justify-center gap-1 ${subTextColor}`}>
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      Verified account checkout. Delivery within 3-5 business days.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
