import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { CartItem, Currency, Theme } from '../types';
import { formatPrice, getShippingFee } from '../utils';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  currency: Currency;
  theme: Theme;
}

export const Cart = React.memo(function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout, currency, theme }: CartProps) {
  const [shippingZone, setShippingZone] = useState<'inside' | 'outside'>('inside');
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = getShippingFee(shippingZone, currency);
  
  // Calculate total in USD, formatPrice will handle the display
  const total = subtotal + (shippingZone === 'inside' ? 70 / 110 : 130 / 110);

  const isDark = theme === 'dark' || theme === 'gothic';
  const bgMain = theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : theme === 'gothic' ? 'bg-black border-red-900' : 'bg-white border-pink-100';
  const textColor = theme === 'gothic' ? 'text-red-100' : isDark ? 'text-zinc-100' : 'text-gray-800';
  const subTextColor = theme === 'gothic' ? 'text-red-300' : isDark ? 'text-zinc-400' : 'text-gray-500';
  const itemBg = theme === 'gothic' ? 'bg-black border-red-900' : isDark ? 'bg-zinc-800/50 border-zinc-700/50' : 'bg-white border-pink-50';
  const footerBg = theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : theme === 'gothic' ? 'bg-black border-red-900' : 'bg-white border-pink-50';

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
              <h2 className={`text-xl font-bold ${textColor}`}>
                {theme === 'gothic' ? 'Your Cursed Bag' : 'Your Sparkle Bag'}
              </h2>
              <button 
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-gray-400 hover:text-gray-800 hover:bg-pink-50'}`}
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
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${theme === 'gothic' ? 'bg-black border border-red-900' : isDark ? 'bg-zinc-800' : 'bg-pink-50'}`}>
                    <ShoppingBag className={`w-10 h-10 ${theme === 'gothic' ? 'text-red-900' : isDark ? 'text-zinc-600' : 'text-pink-200'}`} />
                  </div>
                  <p className={subTextColor}>{theme === 'gothic' ? 'Your cursed bag is empty.' : 'Your bag is empty.'}</p>
                  <button 
                    onClick={onClose}
                    className={`${theme === 'gothic' ? 'text-red-500 hover:text-red-400' : 'text-pink-500 hover:text-pink-600'} font-medium`}
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
                        <div className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ${isDark ? 'bg-zinc-800' : 'bg-pink-50'}`}>
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex justify-between items-start">
                            <h4 className={`text-sm font-bold leading-tight pr-4 ${textColor}`}>{item.name}</h4>
                            <span className={`text-sm font-bold ${textColor}`}>{formatPrice(item.price, currency)}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className={`text-[10px] uppercase tracking-widest ${subTextColor}`}>{item.category}</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isDark ? 'border-zinc-700 text-zinc-400 hover:text-pink-500 hover:border-pink-500' : 'border-gray-200 text-gray-500 hover:bg-pink-50 hover:text-pink-500 hover:border-pink-200'}`}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className={`text-xs font-bold w-3 text-center ${textColor}`}>{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isDark ? 'border-zinc-700 text-zinc-400 hover:text-pink-500 hover:border-pink-500' : 'border-gray-200 text-gray-500 hover:bg-pink-50 hover:text-pink-500 hover:border-pink-200'}`}
                              >
                                <Plus className="w-3 h-3" />
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
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                
                <div className={`flex flex-col gap-2 pt-2 border-t ${isDark ? 'border-zinc-800' : 'border-pink-50'}`}>
                  <label className={`text-[10px] font-bold uppercase ${subTextColor}`}>Shipping Option</label>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="shipping" 
                        value="inside" 
                        checked={shippingZone === 'inside'} 
                        onChange={() => setShippingZone('inside')}
                        className="text-pink-500 focus:ring-pink-500" 
                      />
                      <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>Inside Dhaka</span>
                    </label>
                    <span className={`text-sm font-bold ${textColor}`}>{formatPrice(70 / 110, currency)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="shipping" 
                        value="outside" 
                        checked={shippingZone === 'outside'} 
                        onChange={() => setShippingZone('outside')}
                        className="text-pink-500 focus:ring-pink-500" 
                      />
                      <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>Outside Dhaka</span>
                    </label>
                    <span className={`text-sm font-bold ${textColor}`}>{formatPrice(130 / 110, currency)}</span>
                  </div>
                </div>

                <div className={`flex justify-between text-lg font-bold pt-3 border-t mt-2 ${textColor} ${isDark ? 'border-zinc-800' : 'border-pink-50/50'}`}>
                  <span>Total</span>
                  <span className={theme === 'gothic' ? 'text-red-500' : 'text-pink-600'}>{formatPrice(total, currency)}</span>
                </div>
                
                <div className="pt-4 space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className={`text-[10px] font-bold uppercase ${subTextColor}`}>Delivery Address</label>
                      <input 
                        type="text" 
                        placeholder="123 Mystic Falls Lane..." 
                        className={`w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 transition-all ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500' : 'bg-white border-gray-200 text-gray-800'}`}
                      />
                    </div>
                    <div>
                      <label className={`text-[10px] font-bold uppercase ${subTextColor}`}>Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="+880 1..." 
                        className={`w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 transition-all ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500' : 'bg-white border-gray-200 text-gray-800'}`}
                      />
                    </div>
                    <div>
                      <label className={`text-[10px] font-bold uppercase ${subTextColor}`}>Payment Method</label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <label className="cursor-pointer">
                          <input type="radio" name="payment" className="peer sr-only" defaultChecked />
                          <div className={`h-10 border rounded-lg flex items-center justify-center text-sm font-medium peer-checked:bg-pink-50 peer-checked:border-pink-400 peer-checked:text-pink-600 transition-all ${isDark ? 'border-zinc-700 text-zinc-400' : 'border-gray-200'}`}>
                            💳 Card
                          </div>
                        </label>
                        <label className="cursor-pointer">
                          <input type="radio" name="payment" className="peer sr-only" />
                          <div className={`h-10 border rounded-lg flex items-center justify-center text-sm font-medium peer-checked:bg-[#e2136e]/10 peer-checked:border-[#e2136e] peer-checked:text-[#e2136e] transition-all ${isDark ? 'border-zinc-700 text-zinc-400' : 'border-gray-200'}`}>
                            bKash
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onCheckout}
                    className={`w-full text-white py-4 rounded-2xl font-bold hover:brightness-110 transition-all active:scale-[0.98] shadow-lg shine-effect ${theme === 'gothic' ? 'bg-red-900 shadow-red-900/20' : 'bg-[#1A365D]'}`}
                  >
                    {theme === 'gothic' ? 'Seal the Pact 💀' : 'Place Order ✨'}
                  </button>
                  <p className={`text-[9px] text-center mt-2 px-2 leading-tight ${subTextColor}`}>Secured checkout. {theme === 'gothic' ? '💀' : '✨'} Delivery within 3-5 business days.</p>
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
