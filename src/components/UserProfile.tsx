import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User as UserIcon,
  X,
  Mail,
  Phone,
  CheckCircle,
  Package,
  CheckCircle2,
  Clock,
  Loader,
  RefreshCcw,
  XCircle,
  ShoppingBag,
  Search,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Truck,
  PackageCheck,
} from 'lucide-react';
import { Order, Currency, Theme, OrderStatus } from '../types';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { formatPrice, isValidPhoneNumber, sanitizeText, toMillis } from '../utils';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  theme: Theme;
  onNavigateAdmin?: () => void;
}

type Tab = 'dashboard' | 'orders' | 'tracking';
type OrderFilter = 'all' | 'wait_sending' | 'partial_sending' | 'completed' | 'refunded' | 'cancelled';
type TrackingFilter = 'all' | 'active' | 'delivered' | 'closed';

export function UserProfile({ isOpen, onClose, currency, theme, onNavigateAdmin }: UserProfileProps) {
  const { user, isEmailVerified, isAdmin, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('all');
  const [trackingFilter, setTrackingFilter] = useState<TrackingFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedOrderId, setFocusedOrderId] = useState<string | null>(null);
  const [listenerError, setListenerError] = useState<Error | null>(null);

  // Private PII fields stored strictly in /users/{uid}/private/info
  const [phoneInput, setPhoneInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [savingPrivate, setSavingPrivate] = useState(false);
  const [privateMessage, setPrivateMessage] = useState<string | null>(null);

  if (listenerError) {
    throw listenerError;
  }

  useEffect(() => {
    if (!isOpen || !user) return;
    if (!isEmailVerified) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let isMounted = true;

    const fetchPrivateInfo = async () => {
      try {
        const privateSnap = await getDoc(doc(db, 'users', user.uid, 'private', 'info'));
        if (isMounted && privateSnap.exists()) {
          const pData = privateSnap.data();
          setPhoneInput(pData.phoneNumber || '');
          setAddressInput(pData.deliveryAddress || '');
        }
      } catch (error) {
        if (isMounted) {
          try {
            handleFirestoreError(error, OperationType.GET, `users/${user.uid}/private/info`);
          } catch (err) {
            setListenerError(err as Error);
          }
        }
      }
    };
    fetchPrivateInfo();

    const ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(
      ordersQuery,
      (ordersSnapshot) => {
        if (!isMounted) return;
        const fetchedOrders: Order[] = [];
        ordersSnapshot.forEach((d) => {
          fetchedOrders.push({ id: d.id, ...d.data() } as Order);
        });
        fetchedOrders.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
        setOrders(fetchedOrders);
        setLoading(false);
      },
      (error) => {
        if (!isMounted) return;
        setLoading(false);
        try {
          handleFirestoreError(error, OperationType.LIST, 'orders');
        } catch (err) {
          setListenerError(err as Error);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [isOpen, user, isEmailVerified]);

  const handleSavePrivateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isEmailVerified) {
      openAuthModal();
      return;
    }
    setPrivateMessage(null);

    const cleanPhone = sanitizeText(phoneInput, 30);
    const cleanAddress = sanitizeText(addressInput, 300);

    if (cleanPhone && !isValidPhoneNumber(cleanPhone)) {
      setPrivateMessage('Please enter a valid phone number.');
      return;
    }

    setSavingPrivate(true);
    try {
      await setDoc(doc(db, 'users', user.uid, 'private', 'info'), {
        email: user.email || '',
        emailVerified: true,
        phoneNumber: cleanPhone,
        deliveryAddress: cleanAddress,
        updatedAt: serverTimestamp(),
      });
      setPrivateMessage('Private contact details saved securely.');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/private/info`);
    } finally {
      setSavingPrivate(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!user || !isEmailVerified) {
      openAuthModal();
      return;
    }
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'cancelled',
        updatedAt: serverTimestamp(),
      });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o)));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const isDark = theme === 'dark';
  const bgColors = isDark
    ? 'bg-slate-950 border-l border-slate-800'
    : 'bg-slate-50 shadow-2xl border-l border-slate-200';
  const cardBg = isDark
    ? 'bg-slate-900/95 border border-slate-800'
    : 'bg-white border border-slate-200 shadow-sm';
  const activeTabBg =
    'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25';
  const inactiveTabBg = isDark
    ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-indigo-300 hover:border-indigo-500/40'
    : 'bg-white text-slate-600 border border-slate-200 hover:text-indigo-600 hover:border-indigo-300';
  const textColor = isDark ? 'text-slate-100' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-400' : 'text-slate-500';

  // Stats
  const totalOrders = orders.length;
  const completed = orders.filter((o) => o.status === 'completed').length;
  const waitSending = orders.filter((o) => o.status === 'wait_sending' || !o.status).length;
  const partialSending = orders.filter((o) => o.status === 'partial_sending').length;
  const refunded = orders.filter((o) => o.status === 'refunded').length;
  const cancelled = orders.filter((o) => o.status === 'cancelled').length;

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === 'all' || (o.status || 'wait_sending') === orderFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusText = (status?: OrderStatus | string) => {
    switch (status || 'wait_sending') {
      case 'completed':
        return 'Delivered';
      case 'wait_sending':
        return 'Processing';
      case 'partial_sending':
        return 'Shipped';
      case 'refunded':
        return 'Refunded';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getStatusDescription = (status?: OrderStatus | string) => {
    switch (status || 'wait_sending') {
      case 'wait_sending':
        return 'Order confirmed and being prepared for dispatch.';
      case 'partial_sending':
        return 'Your package has been shipped and is in transit.';
      case 'completed':
        return 'Package delivered to your destination.';
      case 'refunded':
        return 'Payment has been refunded for this order.';
      case 'cancelled':
        return 'This order was cancelled prior to dispatch.';
      default:
        return 'Status update pending.';
    }
  };

  const getStatusBadgeClasses = (status?: OrderStatus | string) => {
    switch (status || 'wait_sending') {
      case 'completed':
        return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
      case 'wait_sending':
        return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
      case 'partial_sending':
        return 'bg-blue-500/15 text-blue-500 border-blue-500/30';
      case 'refunded':
        return 'bg-teal-500/15 text-teal-500 border-teal-500/30';
      case 'cancelled':
        return 'bg-red-500/15 text-red-500 border-red-500/30';
      default:
        return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
    }
  };

  const getTrackingStepIndex = (status?: OrderStatus | string) => {
    switch (status || 'wait_sending') {
      case 'wait_sending':
        return 1;
      case 'partial_sending':
        return 2;
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const trackedOrders = orders.filter((o) => {
    const status = o.status || 'wait_sending';
    const matchesFocus = !focusedOrderId || o.id === focusedOrderId;
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTrackingFilter =
      trackingFilter === 'all' ||
      (trackingFilter === 'active' && (status === 'wait_sending' || status === 'partial_sending')) ||
      (trackingFilter === 'delivered' && status === 'completed') ||
      (trackingFilter === 'closed' && (status === 'cancelled' || status === 'refunded'));
    return matchesFocus && matchesSearch && matchesTrackingFilter;
  });

  const activeCount = waitSending + partialSending;

  const getStatusColor = (status?: string) => {
    switch (status || 'wait_sending') {
      case 'completed':
        return 'text-green-500';
      case 'wait_sending':
        return 'text-yellow-500';
      case 'partial_sending':
        return 'text-orange-500';
      case 'refunded':
        return 'text-teal-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return subTextColor;
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-y-0 right-0 w-full md:w-[32rem] z-50 flex flex-col ${bgColors} overflow-hidden`}
          >
            <div
              className={`p-4 md:p-6 border-b z-10 flex flex-col gap-4 ${
                isDark ? 'border-slate-800 bg-slate-950/95' : 'border-slate-200 bg-white/95'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-sm shadow-indigo-500/25">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`font-display text-xl font-bold leading-none ${textColor}`}>Profile</h2>
                    <span className="text-[11px] font-medium text-indigo-500">Account &amp; Live Tracking</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              {user && (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setFocusedOrderId(null);
                      setActiveTab('dashboard');
                    }}
                    className={`py-2 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      activeTab === 'dashboard' ? activeTabBg : inactiveTabBg
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setFocusedOrderId(null);
                      setActiveTab('orders');
                    }}
                    className={`py-2 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      activeTab === 'orders' ? activeTabBg : inactiveTabBg
                    }`}
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => setActiveTab('tracking')}
                    className={`py-2 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === 'tracking' ? activeTabBg : inactiveTabBg
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Order Tracking</span>
                    {activeCount > 0 && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-mono rounded-full font-extrabold ${
                          activeTab === 'tracking'
                            ? 'bg-white/25 text-white'
                            : 'bg-indigo-500/15 text-indigo-500'
                        }`}
                      >
                        {activeCount}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {!user ? (
                <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
                  <p className={subTextColor}>Please sign in to view your profile.</p>
                  <button
                    onClick={() => {
                      onClose();
                      openAuthModal();
                    }}
                    className={`px-6 py-2.5 rounded-xl font-bold cursor-pointer ${activeTabBg}`}
                  >
                    Sign In
                  </button>
                </div>
              ) : activeTab === 'dashboard' ? (
                <div className="space-y-6">
                  {/* Email Verification Warning */}
                  {!isEmailVerified && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-bold text-amber-400">Email Verification Required</p>
                        <p className={`text-xs ${subTextColor}`}>
                          Verify your email address to unlock orders, checkout, reviews, and private contact storage.
                        </p>
                        <button
                          onClick={openAuthModal}
                          className="px-4 py-1.5 rounded-lg bg-amber-500 text-zinc-950 font-bold text-xs cursor-pointer"
                        >
                          Verify Email Now
                        </button>
                      </div>
                    </div>
                  )}

                  {/* User Header Info */}
                  <div
                    className={`p-6 rounded-2xl border flex items-center gap-5 ${
                      isDark
                        ? 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-violet-950/50 border-indigo-500/25'
                        : 'bg-gradient-to-br from-indigo-50 via-white to-violet-50 border-indigo-200 shadow-sm'
                    }`}
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 ring-3 ring-indigo-500/40 bg-indigo-100">
                      <img
                        src={user.photoURL || 'https://api.dicebear.com/7.x/shapes/svg?seed=Z1758'}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-xl font-bold truncate ${textColor} flex items-center gap-2`}>
                        {user.displayName || 'User'}
                      </h3>
                      <div className={`mt-2 flex items-center gap-2 text-sm ${subTextColor}`}>
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="truncate">{user.email}</span>
                        {isEmailVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" title="Email Verified" />
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold shrink-0">
                            Unverified
                          </span>
                        )}
                      </div>
                      <div className={`mt-1 flex items-center gap-2 text-sm ${subTextColor}`}>
                        <Phone className="w-4 h-4 shrink-0" />
                        <span className="truncate">{phoneInput || user.phoneNumber || 'Add phone number below'}</span>
                      </div>
                      {isAdmin && isEmailVerified && onNavigateAdmin && (
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateAdmin();
                          }}
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold cursor-pointer hover:bg-emerald-500/25"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Open Admin Console
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl ${cardBg} flex items-center gap-4`}>
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`text-xs font-medium ${subTextColor}`}>Total Orders</div>
                        <div className={`text-xl font-bold ${textColor}`}>{totalOrders}</div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl ${cardBg} flex items-center gap-4`}>
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`text-xs font-medium ${subTextColor}`}>Delivered</div>
                        <div className={`text-xl font-bold ${textColor}`}>{completed}</div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl ${cardBg} flex items-center gap-4`}>
                      <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`text-xs font-medium ${subTextColor}`}>Processing</div>
                        <div className={`text-xl font-bold ${textColor}`}>{waitSending}</div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl ${cardBg} flex items-center gap-4`}>
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                        <Loader className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`text-xs font-medium ${subTextColor}`}>Shipped</div>
                        <div className={`text-xl font-bold ${textColor}`}>{partialSending}</div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl ${cardBg} flex items-center gap-4`}>
                      <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-500 shrink-0">
                        <RefreshCcw className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`text-xs font-medium ${subTextColor}`}>Refunded</div>
                        <div className={`text-xl font-bold ${textColor}`}>{refunded}</div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl ${cardBg} flex items-center gap-4`}>
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`text-xs font-medium ${subTextColor}`}>Cancelled</div>
                        <div className={`text-xl font-bold ${textColor}`}>{cancelled}</div>
                      </div>
                    </div>
                  </div>

                  {/* Private Contact Details (PII Isolated) */}
                  {isEmailVerified && (
                    <form onSubmit={handleSavePrivateInfo} className={`p-5 rounded-2xl ${cardBg} space-y-3`}>
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold ${textColor}`}>Private Delivery Details</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">
                          RLS Protected
                        </span>
                      </div>
                      <div className="relative">
                        <Phone className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${subTextColor}`} />
                        <input
                          type="tel"
                          maxLength={30}
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="Phone number (+880 1...)"
                          className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none ${cardBg} ${textColor}`}
                        />
                      </div>
                      <div className="relative">
                        <MapPin className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${subTextColor}`} />
                        <input
                          type="text"
                          maxLength={300}
                          value={addressInput}
                          onChange={(e) => setAddressInput(e.target.value)}
                          placeholder="Default delivery address"
                          className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none ${cardBg} ${textColor}`}
                        />
                      </div>
                      {privateMessage && <p className="text-xs text-emerald-400">{privateMessage}</p>}
                      <button
                        type="submit"
                        disabled={savingPrivate}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer disabled:opacity-50 ${activeTabBg}`}
                      >
                        {savingPrivate ? 'Saving...' : 'Save Private Details'}
                      </button>
                    </form>
                  )}
                </div>
              ) : activeTab === 'orders' ? (
                <div className="space-y-6 flex flex-col h-full">
                  {/* Search and Filters */}
                  <div className="space-y-4 shrink-0">
                    <div className="relative">
                      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${subTextColor}`} />
                      <input
                        type="text"
                        placeholder="Search by order id or item..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${cardBg} ${textColor} ${
                          isDark ? 'focus:ring-zinc-700 focus:border-zinc-500' : 'focus:ring-zinc-300 focus:border-zinc-900'
                        }`}
                      />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {(
                        ['all', 'wait_sending', 'partial_sending', 'completed', 'refunded', 'cancelled'] as OrderFilter[]
                      ).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setOrderFilter(filter)}
                          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border cursor-pointer ${
                            orderFilter === filter ? activeTabBg : inactiveTabBg
                          }`}
                        >
                          {filter === 'all' ? 'All' : getStatusText(filter)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orders List */}
                  <div className="flex-1 space-y-4">
                    {!isEmailVerified ? (
                      <div className={`text-center py-12 rounded-xl ${cardBg} space-y-3`}>
                        <ShieldAlert className="w-10 h-10 mx-auto text-amber-500" />
                        <p className={`text-sm ${subTextColor}`}>Verify your email address to access order history.</p>
                        <button onClick={openAuthModal} className="px-4 py-2 rounded-lg bg-amber-500 text-zinc-950 text-xs font-bold cursor-pointer">
                          Verify Email
                        </button>
                      </div>
                    ) : loading ? (
                      <div className="text-center py-8">
                        <p className={subTextColor}>Loading orders...</p>
                      </div>
                    ) : filteredOrders.length === 0 ? (
                      <div className={`text-center py-12 rounded-xl ${cardBg}`}>
                        <ShoppingBag
                          className={`w-12 h-12 mx-auto mb-3 ${
                            isDark ? 'text-zinc-700' : 'text-zinc-300'
                          }`}
                        />
                        <p className={`text-sm ${subTextColor}`}>No orders found</p>
                      </div>
                    ) : (
                      filteredOrders.map((order) => {
                        const status = order.status || 'wait_sending';
                        const ts = toMillis(order.createdAt);
                        return (
                          <div key={order.id} className={`p-5 rounded-2xl ${cardBg} space-y-4`}>
                            {/* Order Header */}
                            <div className="flex justify-between items-start flex-wrap gap-2">
                              <div>
                                <div
                                  className={`text-xs font-mono font-medium px-2 py-1 rounded-md inline-block mb-2 ${
                                    isDark
                                      ? 'bg-zinc-800 text-zinc-300'
                                      : 'bg-zinc-100 text-zinc-700'
                                  }`}
                                >
                                  Order #{order.id.slice(0, 8).toUpperCase()}
                                </div>
                                <div className={`text-lg font-bold ${textColor}`}>
                                  {formatPrice(order.total, currency)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-sm font-bold ${getStatusColor(status)}`}>
                                  {getStatusText(status)}
                                </div>
                                <div className={`text-xs mt-1 ${subTextColor}`}>
                                  {ts ? new Date(ts).toLocaleString() : 'Just now'}
                                </div>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div
                              className={`rounded-xl p-4 space-y-4 border ${
                                isDark
                                  ? 'border-zinc-800/80 bg-zinc-950/60'
                                  : 'border-zinc-200/80 bg-[#F7F7F5]/60'
                              }`}
                            >
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className={`w-16 h-16 rounded-lg border border-indigo-500/20 shadow-sm ${
                                      item.imageUrl.includes('/images/catalog/')
                                        ? 'bg-white object-contain p-1'
                                        : 'object-cover'
                                    }`}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className={`text-sm font-bold truncate ${textColor}`}>{item.name}</h4>
                                    <div className={`text-sm mt-1 flex justify-between items-center ${subTextColor}`}>
                                      <span>
                                        QTY: {item.quantity} × {formatPrice(item.price, currency)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Actions / Notes */}
                            <div className="flex flex-wrap justify-between items-center gap-2 pt-2">
                              <div className={`text-xs sm:text-sm flex items-center gap-2 ${subTextColor}`}>
                                <Clock className="w-4 h-4 shrink-0" />
                                <span>{getStatusDescription(status)}</span>
                              </div>

                              <div className="flex items-center gap-2 ml-auto">
                                <button
                                  onClick={() => {
                                    setFocusedOrderId(order.id);
                                    setTrackingFilter('all');
                                    setActiveTab('tracking');
                                  }}
                                  className={`px-3.5 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 border transition-colors cursor-pointer ${
                                    isDark
                                      ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                                      : 'border-zinc-300 text-zinc-900 hover:bg-zinc-100'
                                  }`}
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  Track Order
                                </button>
                                {status === 'wait_sending' && (
                                  <button
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors active:scale-95 cursor-pointer"
                                  >
                                    Cancel Order
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-5 flex flex-col h-full">
                  {/* Order Tracking Summary */}
                  <div className={`p-4 rounded-2xl ${cardBg} flex items-center justify-between gap-3`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/25">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`text-sm font-bold ${textColor}`}>Order Tracking</h3>
                        <p className={`text-xs ${subTextColor}`}>
                          {activeCount} active {activeCount === 1 ? 'shipment' : 'shipments'} · {completed} delivered
                        </p>
                      </div>
                    </div>
                    {focusedOrderId && (
                      <button
                        onClick={() => setFocusedOrderId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer bg-indigo-600 text-white hover:bg-indigo-500"
                      >
                        Show All Orders
                      </button>
                    )}
                  </div>

                  {/* Search and Tracking Filters */}
                  {!focusedOrderId && (
                    <div className="space-y-3 shrink-0">
                      <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${subTextColor}`} />
                        <input
                          type="text"
                          placeholder="Search order ID or product name..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${cardBg} ${textColor} ${
                            isDark ? 'focus:ring-zinc-700 focus:border-zinc-500' : 'focus:ring-zinc-300 focus:border-zinc-900'
                          }`}
                        />
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {(
                          [
                            { id: 'all', label: 'All Orders' },
                            { id: 'active', label: 'In Progress' },
                            { id: 'delivered', label: 'Delivered' },
                            { id: 'closed', label: 'Cancelled / Refunded' },
                          ] as { id: TrackingFilter; label: string }[]
                        ).map((f) => (
                          <button
                            key={f.id}
                            onClick={() => setTrackingFilter(f.id)}
                            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors border cursor-pointer ${
                              trackingFilter === f.id ? activeTabBg : inactiveTabBg
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tracking Cards */}
                  <div className="flex-1 space-y-4">
                    {!isEmailVerified ? (
                      <div className={`text-center py-12 rounded-xl ${cardBg} space-y-3`}>
                        <ShieldAlert className="w-10 h-10 mx-auto text-amber-500" />
                        <p className={`text-sm ${subTextColor}`}>Verify your email address to track your orders.</p>
                        <button
                          onClick={openAuthModal}
                          className="px-4 py-2 rounded-lg bg-amber-500 text-zinc-950 text-xs font-bold cursor-pointer"
                        >
                          Verify Email
                        </button>
                      </div>
                    ) : loading ? (
                      <div className="text-center py-8">
                        <p className={subTextColor}>Loading shipment status...</p>
                      </div>
                    ) : trackedOrders.length === 0 ? (
                      <div className={`text-center py-12 rounded-xl ${cardBg}`}>
                        <Package className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`} />
                        <p className={`text-sm font-medium ${textColor}`}>No tracked orders found</p>
                        <p className={`text-xs mt-1 ${subTextColor}`}>
                          Previous orders will appear here with live status progress.
                        </p>
                      </div>
                    ) : (
                      trackedOrders.map((order) => {
                        const status = order.status || 'wait_sending';
                        const isTerminal = status === 'cancelled' || status === 'refunded';
                        const currentStep = getTrackingStepIndex(status);
                        const createdMs = toMillis(order.createdAt);
                        const updatedMs = toMillis(order.updatedAt) || createdMs;
                        const steps = [
                          { label: 'Placed', icon: CheckCircle2 },
                          { label: 'Processing', icon: Clock },
                          { label: 'Shipped', icon: Truck },
                          { label: 'Delivered', icon: PackageCheck },
                        ];

                        return (
                          <div
                            key={order.id}
                            className={`p-5 rounded-2xl ${cardBg} space-y-4 ${
                              focusedOrderId === order.id ? 'ring-2 ring-indigo-500/60' : ''
                            }`}
                          >
                            {/* Header */}
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                                      isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                                    }`}
                                  >
                                    #{order.id.slice(0, 8).toUpperCase()}
                                  </span>
                                  <span
                                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusBadgeClasses(
                                      status
                                    )}`}
                                  >
                                    {getStatusText(status)}
                                  </span>
                                </div>
                                <p className={`text-xs mt-2 ${subTextColor}`}>
                                  Placed {createdMs ? new Date(createdMs).toLocaleDateString() : 'Just now'} ·{' '}
                                  {order.items.reduce((sum, i) => sum + i.quantity, 0)}{' '}
                                  {order.items.reduce((sum, i) => sum + i.quantity, 0) === 1 ? 'item' : 'items'}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <div className={`text-base font-bold ${textColor}`}>
                                  {formatPrice(order.total, currency)}
                                </div>
                                {order.shippingZone && (
                                  <div className={`text-[11px] mt-0.5 ${subTextColor}`}>
                                    {order.shippingZone === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Status Progress Timeline */}
                            {!isTerminal ? (
                              <div className="pt-2 pb-1">
                                <div className="relative flex items-center justify-between">
                                  {/* Background & filled progress track */}
                                  <div
                                    className={`absolute left-4 right-4 top-4 h-1 rounded-full overflow-hidden ${
                                      isDark ? 'bg-slate-800' : 'bg-slate-200'
                                    }`}
                                  >
                                    <div
                                      className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 ${
                                        currentStep >= 3
                                          ? 'w-full'
                                          : currentStep === 2
                                          ? 'w-2/3'
                                          : currentStep === 1
                                          ? 'w-1/3'
                                          : 'w-0'
                                      }`}
                                    />
                                  </div>

                                  {steps.map((step, idx) => {
                                    const StepIcon = step.icon;
                                    const isCompleted = idx <= currentStep;
                                    const isCurrent = idx === currentStep;
                                    return (
                                      <div key={step.label} className="relative z-10 flex flex-col items-center gap-1.5">
                                        <div
                                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                            isCompleted
                                              ? currentStep >= 3
                                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                                                : 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                                              : isDark
                                              ? 'bg-slate-900 border-slate-700 text-slate-500'
                                              : 'bg-white border-slate-300 text-slate-400'
                                          } ${
                                            isCurrent ? 'ring-4 ring-indigo-500/20' : ''
                                          }`}
                                        >
                                          <StepIcon className="w-4 h-4" />
                                        </div>
                                        <span
                                          className={`text-[11px] font-bold ${
                                            isCompleted ? textColor : subTextColor
                                          }`}
                                        >
                                          {step.label}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`p-3 rounded-xl border flex items-center gap-3 ${
                                  status === 'cancelled'
                                    ? 'bg-red-500/10 border-red-500/25 text-red-400'
                                    : 'bg-teal-500/10 border-teal-500/25 text-teal-400'
                                }`}
                              >
                                {status === 'cancelled' ? (
                                  <XCircle className="w-5 h-5 shrink-0" />
                                ) : (
                                  <RefreshCcw className="w-5 h-5 shrink-0" />
                                )}
                                <div className="text-xs">
                                  <span className="font-bold">{getStatusText(status)}</span>
                                  <span className={`block mt-0.5 ${subTextColor}`}>
                                    {getStatusDescription(status)}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Current Status Note & Destination */}
                            <div
                              className={`rounded-xl p-3.5 text-xs space-y-2 border ${
                                isDark
                                  ? 'border-zinc-800/80 bg-zinc-950/60'
                                  : 'border-zinc-200/80 bg-[#F7F7F5]/80'
                              }`}
                            >
                              {!isTerminal && (
                                <p className={`font-medium ${textColor}`}>{getStatusDescription(status)}</p>
                              )}
                              {order.deliveryAddress && (
                                <div className={`flex items-start gap-2 ${subTextColor}`}>
                                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                  <span>{order.deliveryAddress}</span>
                                </div>
                              )}
                              <div className={`flex items-center justify-between text-[11px] pt-1 ${subTextColor}`}>
                                <span>
                                  Last updated: {updatedMs ? new Date(updatedMs).toLocaleString() : 'Just now'}
                                </span>
                                {status === 'wait_sending' && (
                                  <button
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="text-red-500 hover:text-red-400 font-bold cursor-pointer"
                                  >
                                    Cancel Order
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Compact Items Summary */}
                            <div className="flex flex-wrap gap-2">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs ${
                                    isDark
                                      ? 'border-zinc-800 bg-zinc-950/50'
                                      : 'border-zinc-200 bg-white'
                                  }`}
                                >
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className={`w-7 h-7 rounded-md shrink-0 ${
                                      item.imageUrl.includes('/images/catalog/')
                                        ? 'bg-white object-contain p-0.5'
                                        : 'object-cover'
                                    }`}
                                  />
                                  <span className={`font-medium truncate max-w-[140px] ${textColor}`}>
                                    {item.name}
                                  </span>
                                  <span className={subTextColor}>×{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
