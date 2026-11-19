import React, { useEffect, useState, useCallback } from 'react';
import {
  ShieldCheck,
  Package,
  MessageSquare,
  UserPlus,
  Trash2,
  ArrowLeft,
  RefreshCw,
  Search,
  Lock,
  Star,
} from 'lucide-react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Order, OrderStatus, Review, AdminRecord, Currency, Theme } from '../types';
import { formatPrice, toMillis } from '../utils';

interface AdminDashboardProps {
  currency: Currency;
  theme: Theme;
  onExit: () => void;
  onToast: (msg: string) => void;
}

type AdminTab = 'orders' | 'reviews' | 'admins';

export function AdminDashboard({ currency, theme, onExit, onToast }: AdminDashboardProps) {
  const { user, isAdmin, isEmailVerified } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [newAdminUid, setNewAdminUid] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-950';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const accentBtn = isDark
    ? 'bg-zinc-100 hover:bg-white text-zinc-950'
    : 'bg-zinc-950 hover:bg-zinc-800 text-white';

  const fetchAdminData = useCallback(async () => {
    if (!user || !isEmailVerified || !isAdmin) return;
    setLoading(true);
    try {
      const [ordersSnap, reviewsSnap, adminsSnap] = await Promise.all([
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'reviews')),
        getDocs(collection(db, 'admins')),
      ]);

      const fetchedOrders: Order[] = [];
      ordersSnap.forEach((d) => fetchedOrders.push({ id: d.id, ...d.data() } as Order));
      fetchedOrders.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
      setOrders(fetchedOrders);

      const fetchedReviews: Review[] = [];
      reviewsSnap.forEach((d) => fetchedReviews.push({ id: d.id, ...d.data() } as Review));
      fetchedReviews.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
      setReviews(fetchedReviews);

      const fetchedAdmins: AdminRecord[] = [];
      adminsSnap.forEach((d) => fetchedAdmins.push(d.data() as AdminRecord));
      setAdmins(fetchedAdmins);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'admin-dashboard');
    } finally {
      setLoading(false);
    }
  }, [user, isEmailVerified, isAdmin]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      onToast(`Order #${orderId.slice(0, 6).toUpperCase()} updated to ${newStatus}.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      onToast('Review removed.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `reviews/${reviewId}`);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const uid = newAdminUid.trim();
    const email = newAdminEmail.trim();
    if (!/^[a-zA-Z0-9_\-]{1,128}$/.test(uid)) {
      onToast('Invalid Firebase UID format.');
      return;
    }
    if (!email || !email.includes('@')) {
      onToast('Please enter a valid email address.');
      return;
    }

    setAddingAdmin(true);
    try {
      await setDoc(doc(db, 'admins', uid), {
        uid,
        email,
        addedBy: user.uid,
        createdAt: serverTimestamp(),
      });
      setNewAdminUid('');
      setNewAdminEmail('');
      onToast(`Admin access granted to ${email}.`);
      await fetchAdminData();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `admins/${uid}`);
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (uid: string) => {
    if (uid === user?.uid) {
      onToast('You cannot revoke your own admin access.');
      return;
    }
    try {
      await deleteDoc(doc(db, 'admins', uid));
      setAdmins((prev) => prev.filter((a) => a.uid !== uid));
      onToast('Admin access revoked.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `admins/${uid}`);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const status = o.status || 'wait_sending';
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      o.id.toLowerCase().includes(q) ||
      (o.userEmail || '').toLowerCase().includes(q) ||
      o.items.some((item) => item.name.toLowerCase().includes(q));
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className={`rounded-3xl border p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${cardBg}`}>
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-950 text-white'
            }`}
          >
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className={`text-2xl font-black ${textColor}`}>Protected Admin Console</h1>
            <p className={`text-xs flex items-center gap-2 mt-1 ${subTextColor}`}>
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              RLS Enforced • Email Verified ({user?.email}) • Server Timestamps Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className={`px-4 py-2.5 rounded-xl border text-sm font-bold flex items-center gap-2 cursor-pointer ${isDark ? 'border-zinc-700 hover:bg-zinc-800' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={onExit}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer ${accentBtn}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Storefront
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border cursor-pointer ${
            activeTab === 'orders' ? accentBtn + ' border-transparent' : cardBg + ' ' + subTextColor
          }`}
        >
          <Package className="w-4 h-4" />
          All Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border cursor-pointer ${
            activeTab === 'reviews' ? accentBtn + ' border-transparent' : cardBg + ' ' + subTextColor
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Review Moderation ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('admins')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border cursor-pointer ${
            activeTab === 'admins' ? accentBtn + ' border-transparent' : cardBg + ' ' + subTextColor
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Admin Access ({admins.length})
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className={`rounded-3xl border p-6 shadow-lg space-y-5 ${cardBg}`}>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${subTextColor}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order ID, customer email, or item..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | OrderStatus)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-bold outline-none ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
            >
              <option value="all">All Statuses</option>
              <option value="wait_sending">Processing</option>
              <option value="partial_sending">Shipped</option>
              <option value="completed">Delivered</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <p className={`text-sm py-8 text-center ${subTextColor}`}>Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <p className={`text-sm py-8 text-center ${subTextColor}`}>No orders match your filters.</p>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-200 text-gray-700'}`}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className={`text-sm font-bold ${textColor}`}>
                        {formatPrice(order.total, currency)}
                      </span>
                      <span className={`text-xs ${subTextColor}`}>
                        {order.userEmail || order.userId}
                      </span>
                    </div>
                    <p className={`text-xs ${subTextColor}`}>
                      {order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                    </p>
                    {order.deliveryAddress && (
                      <p className={`text-xs ${subTextColor}`}>
                        Ship to: {order.deliveryAddress} • {order.phoneNumber} ({order.shippingZone || 'inside'})
                      </p>
                    )}
                    <p className={`text-[11px] ${subTextColor}`}>
                      Placed: {toMillis(order.createdAt) ? new Date(toMillis(order.createdAt)).toLocaleString() : 'Just now'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={order.status || 'wait_sending'}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`px-3 py-2 rounded-xl border text-xs font-bold outline-none cursor-pointer ${isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-white border-gray-300 text-gray-800'}`}
                    >
                      <option value="wait_sending">Processing</option>
                      <option value="partial_sending">Shipped</option>
                      <option value="completed">Delivered</option>
                      <option value="refunded">Refunded</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className={`rounded-3xl border p-6 shadow-lg space-y-4 ${cardBg}`}>
          {loading ? (
            <p className={`text-sm py-8 text-center ${subTextColor}`}>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className={`text-sm py-8 text-center ${subTextColor}`}>No customer reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className={`p-4 rounded-2xl border flex items-start justify-between gap-4 ${
                  isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${textColor}`}>{review.userName}</span>
                    <span
                      className="inline-flex items-center gap-0.5"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: review.rating }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      ))}
                    </span>
                    <span className={`text-xs ${subTextColor}`}>Product #{review.productId}</span>
                  </div>
                  <p className={`text-sm ${textColor}`}>{review.comment}</p>
                  <p className={`text-[11px] ${subTextColor}`}>
                    {toMillis(review.createdAt) ? new Date(toMillis(review.createdAt)).toLocaleString() : 'Just now'}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Admins Tab */}
      {activeTab === 'admins' && (
        <div className={`rounded-3xl border p-6 shadow-lg space-y-6 ${cardBg}`}>
          <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="User Firebase UID"
              maxLength={128}
              value={newAdminUid}
              onChange={(e) => setNewAdminUid(e.target.value)}
              className={`px-4 py-2.5 rounded-xl border text-sm outline-none ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
            />
            <input
              type="email"
              placeholder="Admin Email Address"
              maxLength={254}
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              className={`px-4 py-2.5 rounded-xl border text-sm outline-none ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
            />
            <button
              type="submit"
              disabled={addingAdmin}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer disabled:opacity-50 ${accentBtn}`}
            >
              {addingAdmin ? 'Granting...' : 'Grant Admin Role'}
            </button>
          </form>

          <div className="space-y-3">
            {admins.length === 0 ? (
              <p className={`text-sm ${subTextColor}`}>
                Only the bootstrapped verified admin is currently active. Add extra admin UIDs above if needed.
              </p>
            ) : (
              admins.map((admin) => (
                <div
                  key={admin.uid}
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div>
                    <div className={`text-sm font-bold ${textColor}`}>{admin.email}</div>
                    <div className={`text-xs font-mono ${subTextColor}`}>UID: {admin.uid}</div>
                  </div>
                  {admin.uid !== user?.uid && (
                    <button
                      onClick={() => handleRemoveAdmin(admin.uid)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Revoke Admin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
