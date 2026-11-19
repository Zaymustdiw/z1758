import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  MessageCircle,
  ArrowDownUp,
  Heart,
  ShieldAlert,
  ArrowUp,
  ArrowUpRight,
  SlidersHorizontal,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailPage } from './components/ProductDetailPage';
import { Cart, CheckoutPayload } from './components/Cart';
import { SettingsModal } from './components/SettingsModal';
import { UserProfile } from './components/UserProfile';
import { AuthModal } from './components/AuthModal';
import { AdminRoute } from './components/AdminRoute';
import { AdminDashboard } from './components/AdminDashboard';
import { FooterFAQ } from './components/FooterFAQ';
import { ConfettiBurst } from './components/ConfettiBurst';
import { products } from './data';
import { AccessoryCategory, Product, CartItem, Currency, Theme } from './types';
import { useAuth } from './context/AuthContext';
import { addDoc, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { calculateAuthoritativeOrderTotal, formatPrice } from './utils';

type CategoryFilter = 'all' | AccessoryCategory;

export default function App() {
  const { user, isEmailVerified, openAuthModal } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [wishlistPulseKey, setWishlistPulseKey] = useState(0);
  const [showWishlist, setShowWishlist] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>('BDT');
  const [theme, setTheme] = useState<Theme>('light');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const productGridRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin/');
  const productMatch = currentPath.match(/^\/product\/([^/]+)$/);
  const activeProduct = useMemo(() => {
    if (!productMatch) return null;
    return products.find((p) => p.id === productMatch[1]) || null;
  }, [productMatch]);

  useEffect(() => {
    const updateBackToTop = () => {
      const scrollY = window.scrollY;
      if (scrollY <= 150) {
        setShowBackToTop(false);
        return;
      }

      if (productGridRef.current && !activeProduct) {
        const rect = productGridRef.current.getBoundingClientRect();
        const scrolledPastGrid = rect.bottom <= window.innerHeight * 0.72;
        setShowBackToTop(scrolledPastGrid);
      } else {
        setShowBackToTop(scrollY > 360);
      }
    };

    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    window.addEventListener('resize', updateBackToTop, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateBackToTop);
      window.removeEventListener('resize', updateBackToTop);
    };
  }, [currentPath, activeCategory, searchQuery, showWishlist, activeProduct]);

  const scrollToTop = React.useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateTo = React.useCallback((path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenProductPage = React.useCallback(
    (product: Product) => {
      navigateTo(`/product/${product.id}`);
    },
    [navigateTo]
  );

  const featuredBelt = products[0];

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesWishlist = !showWishlist || wishlistItems.includes(product.id);
      return matchesCategory && matchesSearch && matchesWishlist;
    });

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating-asc') result.sort((a, b) => a.rating - b.rating);
    if (sortBy === 'rating-desc') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [activeCategory, searchQuery, sortBy, showWishlist, wishlistItems]);

  const toastTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = React.useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const toggleWishlist = React.useCallback(
    (id: string) => {
      setWishlistItems((prev) => {
        if (prev.includes(id)) {
          return prev.filter((itemId) => itemId !== id);
        } else {
          setWishlistPulseKey((k) => k + 1);
          showToast('Saved to wishlist');
          return [...prev, id];
        }
      });
    },
    [showToast]
  );

  const handleAddToCart = React.useCallback(
    (product: Product, selectedSize?: string) => {
      const resolvedSize = selectedSize || product.sizes[0];
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1, selectedSize: resolvedSize }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1, selectedSize: resolvedSize }];
      });
      showToast(`Added ${product.name} to bag`);
    },
    [showToast]
  );

  const handleRemoveFromCart = React.useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleUpdateQuantity = React.useCallback(
    (id: string, quantity: number) => {
      if (quantity < 1) {
        handleRemoveFromCart(id);
        return;
      }
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    },
    [handleRemoveFromCart]
  );

  const handleCheckout = React.useCallback(
    async (payload: CheckoutPayload) => {
      if (!user) {
        showToast('Please sign in to place an order.');
        openAuthModal();
        return;
      }
      if (!isEmailVerified) {
        showToast('Please verify your email address before placing an order.');
        openAuthModal();
        return;
      }

      const authoritative = calculateAuthoritativeOrderTotal(cartItems, payload.shippingZone);
      if (!authoritative.valid) {
        showToast('Cart validation failed. Please review your items.');
        return;
      }

      try {
        await addDoc(collection(db, 'orders'), {
          userId: user.uid,
          userEmail: user.email || '',
          items: authoritative.verifiedItems,
          total: authoritative.total,
          currency,
          shippingZone: payload.shippingZone,
          deliveryAddress: payload.deliveryAddress,
          phoneNumber: payload.phoneNumber,
          paymentMethod: payload.paymentMethod,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          status: 'wait_sending',
        });

        // Persist delivery info in PII-isolated private document
        await setDoc(doc(db, 'users', user.uid, 'private', 'info'), {
          email: user.email || '',
          emailVerified: true,
          phoneNumber: payload.phoneNumber,
          deliveryAddress: payload.deliveryAddress,
          updatedAt: serverTimestamp(),
        });

        setCartItems([]);
        setIsCartOpen(false);
        setConfettiTrigger((prev) => prev + 1);
        showToast('Order confirmed. Thank you for shopping with Z1758.');
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'orders');
        showToast('Failed to place order. Try again.');
      }
    },
    [user, isEmailVerified, cartItems, currency, showToast, openAuthModal]
  );

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All Archive' },
    { id: 'outerwear', label: 'Outerwear' },
    { id: 'denim', label: 'Denim' },
    { id: 'top', label: 'Tops' },
    { id: 'footwear', label: 'Footwear' },
    { id: 'bag', label: 'Bags' },
    { id: 'belt', label: 'Belts' },
    { id: 'grillz', label: 'Grillz' },
    { id: 'ring', label: 'Gothic Rings' },
    { id: 'chain', label: 'Chains' },
    { id: 'bracelet', label: 'Bracelets' },
  ];

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen font-sans flex flex-col transition-colors duration-500 ease-in-out relative overflow-x-clip ${
        isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-[#F7F7F5] text-zinc-950'
      }`}
    >
      <Navbar
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (activeProduct && q.trim()) {
            navigateTo('/');
          }
        }}
        currency={currency}
        setCurrency={setCurrency}
        onOpenSettings={() => setIsSettingsOpen(true)}
        theme={theme}
        setTheme={setTheme}
        isAdminView={isAdminRoute}
        onNavigateAdmin={() => navigateTo('/admin')}
        onNavigateHome={() => navigateTo('/')}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        wishlistCount={wishlistItems.length}
        wishlistPulseKey={wishlistPulseKey}
        showWishlist={showWishlist}
        onToggleWishlistView={() => setShowWishlist((prev) => !prev)}
        products={products}
        onSelectProduct={handleOpenProductPage}
      />

      {/* Email Verification Security Banner */}
      {user && !isEmailVerified && (
        <div className="bg-amber-500 text-zinc-950 px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-center gap-2.5 z-30 shadow-md">
          <div className="flex items-center gap-1.5 text-center">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Verify {user.email} to unlock checkout, reviews, and profile access.</span>
          </div>
          <button
            type="button"
            onClick={openAuthModal}
            className="min-h-[36px] px-3 py-1 rounded-full bg-zinc-950 text-amber-400 hover:bg-zinc-900 text-xs font-bold cursor-pointer"
          >
            Verify Email
          </button>
        </div>
      )}

      <AuthModal theme={theme} onSuccessToast={showToast} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currency={currency}
        setCurrency={setCurrency}
        theme={theme}
        setTheme={setTheme}
      />

      <UserProfile
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        currency={currency}
        theme={theme}
        onNavigateAdmin={() => navigateTo('/admin')}
      />

      {/* Blended Background Typography */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 pointer-events-none overflow-hidden z-0 select-none flex flex-col items-center justify-center ${
          isDark ? 'z-bg-blend-dark' : 'z-bg-blend-light'
        }`}
      >
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.05),transparent_65%)]'
              : 'bg-[radial-gradient(circle_at_50%_35%,rgba(9,9,11,0.045),transparent_65%)]'
          }`}
        />
        <span
          className={`font-display font-black uppercase leading-[0.82] tracking-[-0.07em] whitespace-nowrap text-[25vw] sm:text-[21vw] lg:text-[19vw] ${
            isDark
              ? 'text-white/[0.045] mix-blend-screen'
              : 'text-zinc-950/[0.055] mix-blend-multiply'
          }`}
        >
          Z1758
        </span>
        <span
          className={`font-display font-black uppercase leading-[0.85] tracking-[0.22em] whitespace-nowrap text-[7.5vw] sm:text-[5vw] mt-2 ${
            isDark
              ? 'text-white/[0.025] mix-blend-screen'
              : 'text-zinc-950/[0.03] mix-blend-multiply'
          }`}
        >
          Z1758 · Z1758
        </span>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-9 pb-20 sm:pb-24 relative z-10">
        {isAdminRoute ? (
          <AdminRoute theme={theme} onExit={() => navigateTo('/')}>
            <AdminDashboard
              currency={currency}
              theme={theme}
              onExit={() => navigateTo('/')}
              onToast={showToast}
            />
          </AdminRoute>
        ) : activeProduct ? (
          <AnimatePresence mode="wait">
            <ProductDetailPage
              key={activeProduct.id}
              product={activeProduct}
              onBack={() => navigateTo('/')}
              onAddToCart={handleAddToCart}
              currency={currency}
              theme={theme}
              isWishlisted={wishlistItems.includes(activeProduct.id)}
              wishlistPulseKey={wishlistPulseKey}
              onToggleWishlist={toggleWishlist}
              onSelectProduct={handleOpenProductPage}
              relatedProducts={[
                ...products.filter(
                  (p) => p.id !== activeProduct.id && p.category === activeProduct.category
                ),
                ...products.filter(
                  (p) => p.id !== activeProduct.id && p.category !== activeProduct.category
                ),
              ].slice(0, 3)}
            />
          </AnimatePresence>
        ) : (
          <>
            {/* Editorial Split Hero */}
            <section
              className={`rounded-3xl border p-5 sm:p-8 lg:p-10 mb-8 sm:mb-12 shadow-sm transition-colors ${
                isDark
                  ? 'bg-zinc-900/80 border-zinc-800'
                  : 'bg-white/85 border-zinc-200 backdrop-blur-md'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                <div className="lg:col-span-6 space-y-4 sm:space-y-5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`text-[11px] font-mono font-bold uppercase tracking-[0.22em] ${
                        isDark ? 'text-zinc-400' : 'text-zinc-500'
                      }`}
                    >
                      Archive Drop 02 · Chrome &amp; Bridle Leather
                    </span>
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`font-display text-3xl sm:text-5xl lg:text-[3.35rem] font-black tracking-tight leading-[1.03] ${
                      isDark ? 'text-zinc-50' : 'text-zinc-950'
                    }`}
                  >
                    Heavy hardware forged for{' '}
                    <span className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Z1758</span>.
                  </motion.h1>

                  <p
                    className={`text-sm sm:text-base max-w-lg leading-relaxed ${
                      isDark ? 'text-zinc-400' : 'text-zinc-600'
                    }`}
                  >
                    Archival outerwear, flared cargo &amp; corset denim, harness boots, cracked-leather bags, chrome cross belts, fang grillz, and gothic silver hardware. Tap any piece to open its interactive detail spread.
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenProductPage(featuredBelt)}
                      className={`min-h-[44px] px-5 sm:px-6 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
                        isDark
                          ? 'bg-zinc-100 text-zinc-950 hover:bg-white'
                          : 'bg-zinc-950 text-white hover:bg-zinc-800'
                      }`}
                    >
                      <span>Inspect Belt Spread</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowWishlist((prev) => !prev)}
                      className={`relative min-h-[44px] px-4 sm:px-5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 border transition-colors cursor-pointer whitespace-nowrap ${
                        showWishlist
                          ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                          : isDark
                          ? 'bg-zinc-950 text-zinc-200 border-zinc-700 hover:border-zinc-500'
                          : 'bg-[#F7F7F5] text-zinc-900 border-zinc-300 hover:border-zinc-900'
                      }`}
                    >
                      <AnimatePresence>
                        {wishlistPulseKey > 0 && (
                          <motion.span
                            key={`hero-saved-ring-${wishlistPulseKey}`}
                            initial={{ scale: 0.92, opacity: 0.6 }}
                            animate={{ scale: 1.32, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.72, ease: 'easeOut' }}
                            className="absolute inset-0 rounded-full border-2 border-rose-400 pointer-events-none"
                          />
                        )}
                      </AnimatePresence>
                      <motion.span
                        key={`hero-saved-heart-${wishlistPulseKey}`}
                        animate={
                          wishlistPulseKey > 0
                            ? { scale: [1, 1.38, 0.92, 1.22, 1] }
                            : { scale: 1 }
                        }
                        transition={{ duration: 0.65, ease: 'easeOut' }}
                        className="flex items-center justify-center"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            showWishlist || wishlistItems.length > 0 ? 'fill-current text-rose-500' : ''
                          } ${showWishlist ? '!text-white' : ''}`}
                        />
                      </motion.span>
                      <span>
                        {showWishlist ? 'Show All Pieces' : `Saved (${wishlistItems.length})`}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Hero Featured 4:3 Belt Visual */}
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.08 }}
                  onClick={() => handleOpenProductPage(featuredBelt)}
                  className={`lg:col-span-6 w-full text-left rounded-2xl overflow-hidden border relative group cursor-pointer ${
                    isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-[#F2F2EE]'
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={featuredBelt.imageUrl}
                      alt={featuredBelt.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div
                    className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 border-t ${
                      isDark
                        ? 'bg-zinc-950/90 border-zinc-800 text-zinc-100'
                        : 'bg-white/95 border-zinc-200 text-zinc-950'
                    }`}
                  >
                    <div className="min-w-0">
                      <span
                        className={`text-[10px] font-mono uppercase tracking-[0.18em] block ${
                          isDark ? 'text-zinc-400' : 'text-zinc-500'
                        }`}
                      >
                        Featured · Click to Unfurl Belt
                      </span>
                      <span className="font-display font-bold text-sm sm:text-base truncate block">
                        {featuredBelt.name}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-sm sm:text-base tabular-nums shrink-0">
                      {formatPrice(featuredBelt.price, currency)}
                    </span>
                  </div>
                </motion.button>
              </div>
            </section>

            {/* Category Tabs & Sort Bar */}
            {products.length > 0 && (
              <div
                className={`flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 sm:gap-4 mb-7 sm:mb-9 border-b pb-4 sm:pb-5 ${
                  isDark ? 'border-zinc-800' : 'border-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                  {categories.map((category) => {
                    const isActive = activeCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setActiveCategory(category.id)}
                        className={`relative min-h-[44px] px-4 sm:px-5 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 border ${
                          isActive
                            ? isDark
                              ? 'text-zinc-950 border-transparent'
                              : 'text-white border-transparent'
                            : isDark
                            ? 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-100 hover:border-zinc-600'
                            : 'bg-white text-zinc-600 border-zinc-200 hover:text-zinc-950 hover:border-zinc-900'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeCategory"
                            className={`absolute inset-0 rounded-full ${
                              isDark ? 'bg-zinc-100' : 'bg-zinc-950'
                            }`}
                            initial={false}
                            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                          />
                        )}
                        <span className="relative z-10">{category.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3">
                  <span className={`text-xs font-mono md:hidden flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{filteredProducts.length} pieces</span>
                  </span>
                  <div className="relative">
                    <ArrowDownUp
                      className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none ${
                        isDark ? 'text-zinc-400' : 'text-zinc-500'
                      }`}
                    />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      aria-label="Sort products"
                      className={`min-h-[44px] appearance-none py-2 pl-10 pr-8 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer outline-none transition-colors ${
                        isDark
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-500'
                          : 'bg-white border-zinc-200 text-zinc-900 focus:border-zinc-900'
                      }`}
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating-desc">Rating: High to Low</option>
                      <option value="rating-asc">Rating: Low to High</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div ref={productGridRef}>
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={idx}
                      onAddToCart={(p) => handleAddToCart(p)}
                      onViewDetails={handleOpenProductPage}
                      currency={currency}
                      theme={theme}
                      isWishlisted={wishlistItems.includes(product.id)}
                      onToggleWishlist={toggleWishlist}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex flex-col items-center justify-center min-h-[36vh] text-center py-16 px-4 rounded-3xl mt-6 border shadow-sm ${
                    isDark
                      ? 'bg-zinc-900/75 border-zinc-800 text-zinc-100'
                      : 'bg-white/80 border-zinc-200 text-zinc-950 backdrop-blur-md'
                  }`}
                >
                  <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tighter mb-3">
                    No Matching Pieces
                  </h2>
                  <p className={`text-sm sm:text-base font-medium mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Reset your filters or search query to inspect the full Z1758 archive.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchQuery('');
                      setShowWishlist(false);
                    }}
                    className={`min-h-[44px] px-6 rounded-full text-xs font-bold cursor-pointer ${
                      isDark ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-950 text-white'
                    }`}
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </div>
          </>
        )}
      </main>

      <FooterFAQ theme={theme} />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
        currency={currency}
        theme={theme}
      />

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
            className={`fixed bottom-24 right-4 sm:right-6 z-40 w-12 h-12 rounded-full shadow-lg border transition-all hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center group ${
              isDark
                ? 'bg-zinc-900 text-zinc-100 border-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                : 'bg-white text-zinc-950 border-zinc-300 hover:bg-zinc-950 hover:text-white'
            }`}
          >
            <ArrowUp className="w-5 h-5" />
            <span className="hidden sm:block absolute right-14 bg-zinc-950 text-white text-xs px-3 py-1.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold border border-zinc-800">
              Back to Top
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Support Floating Button */}
      <a
        href="https://wa.me/8801705128340"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Z1758 Support"
        className={`fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg border hover:scale-110 transition-transform flex items-center justify-center group ${
          isDark
            ? 'bg-zinc-100 text-zinc-950 border-zinc-200'
            : 'bg-zinc-950 text-white border-zinc-800'
        }`}
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
        <span className="hidden sm:flex absolute right-16 bg-zinc-950 text-white border border-zinc-800 text-xs px-3 py-2 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold flex-col items-end">
          <span className="text-zinc-400 text-[10px] uppercase">Customer Service</span>
          <span className="font-mono">01705128340</span>
        </span>
      </a>

      <ConfettiBurst triggerKey={confettiTrigger} />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full shadow-2xl border max-w-[90vw] ${
              isDark
                ? 'bg-zinc-100 text-zinc-950 border-zinc-200'
                : 'bg-zinc-950 text-white border-zinc-800'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                isDark ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-950'
              }`}
            >
              <Check className="w-4 h-4" />
            </div>
            <p className="font-medium text-xs sm:text-sm truncate">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
