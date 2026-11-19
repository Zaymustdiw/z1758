import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X } from 'lucide-react';
import { Order, Currency, Theme } from '../types';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { formatPrice, toMillis } from '../utils';

interface OrdersProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  theme: Theme;
}

export function Orders({ isOpen, onClose, currency, theme }: OrdersProps) {
  const { user, isEmailVerified } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user && isEmailVerified) {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const fetchedOrders: Order[] = [];
          querySnapshot.forEach((docSnap) => {
            fetchedOrders.push({ id: docSnap.id, ...docSnap.data() } as Order);
          });

          fetchedOrders.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
          setOrders(fetchedOrders);
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, 'orders');
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    } else if (isOpen) {
      setOrders([]);
      setLoading(false);
    }
  }, [isOpen, user, isEmailVerified]);

  const isDark = theme === 'dark';
  const bgColors = isDark
    ? 'bg-zinc-900/95 border-l border-zinc-800'
    : 'bg-white/95 backdrop-blur-xl shadow-2xl';
  const textColor = isDark ? 'text-zinc-100' : 'text-gray-800';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-gray-500';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-y-0 right-0 w-full md:w-[28rem] z-50 flex flex-col ${bgColors}`}
          >
            <div
              className={`p-6 border-b flex items-center justify-between ${
                isDark ? 'border-zinc-800' : 'border-zinc-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className={`w-6 h-6 ${isDark ? 'text-zinc-100' : 'text-zinc-950'}`} />
                <h2 className={`text-xl font-bold ${textColor}`}>Purchase History</h2>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${
                  isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col p-6 space-y-6">
              {!user || !isEmailVerified ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <p className={subTextColor}>Please sign in with a verified email to view your orders.</p>
                </div>
              ) : loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <p className={subTextColor}>Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag
                    className={`w-16 h-16 ${
                      isDark ? 'text-zinc-700' : 'text-zinc-300'
                    }`}
                  />
                  <p className={`text-lg font-medium ${textColor}`}>No orders yet</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className={`p-4 rounded-xl border ${
                      isDark
                        ? 'border-zinc-800 bg-zinc-800/50'
                        : 'border-zinc-200 bg-white shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-sm font-medium ${subTextColor}`}>
                        {toMillis(order.createdAt)
                          ? new Date(toMillis(order.createdAt)).toLocaleDateString()
                          : 'Just now'}
                      </span>
                      <span className={`text-sm font-mono font-bold tabular-nums ${textColor}`}>
                        {formatPrice(order.total, currency)}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className={`w-12 h-12 rounded-md ${
                              item.imageUrl.includes('/images/catalog/')
                                ? 'bg-white object-contain p-0.5 border border-zinc-200'
                                : 'object-cover'
                            }`}
                          />
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium line-clamp-1 ${textColor}`}>{item.name}</h4>
                            <p className={`text-xs ${subTextColor}`}>Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
