import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, MessageCircle, ArrowDownUp, Heart, Skull } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { ProductModal } from './components/ProductModal';
import { SettingsModal } from './components/SettingsModal';
import { products } from './data';
import { Product, CartItem, Currency, Theme } from './types';

type Category = 'all' | 'ring' | 'necklace';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>('BDT');
  const [theme, setTheme] = useState<Theme>('light');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesWishlist = !showWishlist || wishlistItems.includes(product.id);
      return matchesCategory && matchesSearch && matchesWishlist;
    });

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating-asc') result.sort((a, b) => a.rating - b.rating);
    if (sortBy === 'rating-desc') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [activeCategory, searchQuery, sortBy, showWishlist, wishlistItems]);

  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const showToast = React.useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const toggleWishlist = React.useCallback((id: string) => {
    setWishlistItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        showToast('Added to wishlist');
        return [...prev, id];
      }
    });
  }, [showToast]);

  const handleAddToCart = React.useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to bag`);
  }, [showToast]);

  const handleRemoveFromCart = React.useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleUpdateQuantity = React.useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, [handleRemoveFromCart]);

  const handleCheckout = React.useCallback(() => {
    setCartItems([]);
    setIsCartOpen(false);
    showToast('Payment successful! Thank you for your purchase.');
  }, [showToast]);

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All Sparkles' },
    { id: 'ring', label: 'Rings' },
    { id: 'necklace', label: 'Necklaces' },
  ];

  // Dynamic theme background based on selected product and theme
  const getThemeBackground = () => {
    if (selectedProduct) {
      if (theme === 'dark') return '#18181B'; // zinc-900
      if (theme === 'gothic') return '#150616'; // deep dark purple
      return `${selectedProduct.themeColor}10`; // light theme tint
    }
    if (theme === 'dark') return '#09090B'; // zinc-950
    if (theme === 'gothic') return '#0A000A'; // pitch dark purple
    return '#FFF5F7'; // Default pinkish white
  };

  const isDark = theme === 'dark' || theme === 'gothic';

  return (
    <div 
      className={`min-h-screen font-sans flex flex-col transition-colors duration-700 ease-in-out ${isDark ? 'text-zinc-100' : 'text-gray-800'}`}
      style={{ backgroundColor: getThemeBackground() }}
    >
      <Navbar 
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currency={currency}
        onOpenSettings={() => setIsSettingsOpen(true)}
        theme={theme}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currency={currency}
        setCurrency={setCurrency}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Background Decorative Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob ${theme === 'gothic' ? 'bg-red-900' : 'bg-pink-300'}`}></div>
        <div className={`absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000 ${theme === 'gothic' ? 'bg-black' : 'bg-purple-300'}`}></div>
        <div className={`absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000 ${theme === 'gothic' ? 'bg-purple-900' : 'bg-blue-300'}`}></div>
        
        <div className={`absolute top-[15%] left-[5%] animate-float drop-shadow-md ${theme === 'gothic' ? 'text-red-900/40' : 'text-pink-400/60'}`}>
          {theme === 'gothic' ? <Skull className="w-10 h-10" /> : <Sparkles className="w-8 h-8" />}
        </div>
        <div className={`absolute top-[25%] right-[8%] animate-float-delayed drop-shadow-md ${theme === 'gothic' ? 'text-zinc-600/40' : 'text-purple-400/50'}`}>
          <div className="text-4xl filter drop-shadow-lg">{theme === 'gothic' ? '✝️' : '✨'}</div>
        </div>
        <div className={`absolute bottom-[20%] left-[10%] animate-float-reverse drop-shadow-md ${theme === 'gothic' ? 'text-purple-900/40' : 'text-[#4A90E2]/40'}`}>
          <div className="text-3xl">{theme === 'gothic' ? '💀' : '✦'}</div>
        </div>
        <div className={`absolute top-[60%] right-[5%] animate-float drop-shadow-md ${theme === 'gothic' ? 'text-red-900/40' : 'text-pink-400/50'}`}>
          {theme === 'gothic' ? <div className="text-4xl">✝️</div> : <Sparkles className="w-6 h-6" />}
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 relative z-0">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12 relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${theme === 'gothic' ? 'from-purple-900 to-red-900' : 'from-pink-100 to-purple-100'} blur-3xl opacity-40 animate-pulse -z-10 rounded-full`} />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowWishlist(!showWishlist)}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md font-bold text-sm mb-6 shadow-lg hover:scale-105 transition-all cursor-pointer select-none border ${
              showWishlist 
                ? (theme === 'gothic' ? 'bg-red-900 text-red-100 border-red-700' : 'bg-pink-500 text-white border-pink-400') 
                : (theme === 'gothic' ? 'bg-black/80 text-red-600 border-red-900/50 hover:bg-black' : 'bg-white/80 text-pink-500 border-white/50 hover:bg-white/90')
            }`}
          >
            <Heart className={`w-4 h-4 ${showWishlist ? 'fill-current' : ''}`} />
            <span>{showWishlist ? (theme === 'gothic' ? 'Show All Curses' : 'Show All Sparkles') : `My Wishlist (${wishlistItems.length})`}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-2xl ${isDark ? 'text-zinc-100' : 'text-gray-800'}`}
          >
            Find the perfect piece of <span className={`italic animate-text-shimmer bg-clip-text text-transparent ${theme === 'gothic' ? 'bg-[linear-gradient(to_right,#DC2626,#7F1D1D,#DC2626)]' : 'bg-[linear-gradient(to_right,#FF1493,#800080,#FF1493)]'}`}>{theme === 'gothic' ? 'gothic' : 'supernatural'}</span> {theme === 'gothic' ? 'curse' : 'sparkle'}.
          </motion.h1>
        </div>

        {/* Category Tabs & Filters */}
        {products.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 border-b border-pink-100 pb-4">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'text-white border border-transparent shadow-[0_8px_20px_rgba(255,20,147,0.3)] scale-105 pulse-glow'
                      : 'bg-white/70 backdrop-blur-md text-pink-400 border border-pink-200 hover:bg-white hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  {activeCategory === category.id && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-pink-400 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 relative group hover-3d">
              <ArrowDownUp className="w-4 h-4 text-pink-500 absolute left-3 z-10 pointer-events-none group-hover:animate-bounce" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none glass-panel text-gray-700 py-2.5 pl-10 pr-10 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300 text-sm font-bold cursor-pointer shadow-lg transition-all hover:bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: High to Low</option>
                <option value="rating-asc">Rating: Low to High</option>
              </select>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={setSelectedProduct}
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex flex-col items-center justify-center min-h-[40vh] text-center py-24 rounded-3xl mt-8 shadow-xl ${theme === 'gothic' ? 'bg-black/80 text-red-500 border border-red-900/50' : isDark ? 'bg-zinc-800/50 text-zinc-100' : 'text-gray-800 glass-panel'}`}
          >
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mb-4 animate-pulse">
              Coming Soon
            </h2>
            <p className={`text-xl md:text-2xl font-medium ${theme === 'gothic' ? 'text-red-700' : isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              {theme === 'gothic' ? 'The dark forces are gathering new items...' : 'We are preparing new sparkles for you...'}
            </p>
          </motion.div>
        )}
      </main>

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

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        currency={currency}
        theme={theme}
        isWishlisted={selectedProduct ? wishlistItems.includes(selectedProduct.id) : false}
        onToggleWishlist={toggleWishlist}
      />

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/8801705128340"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center group"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75"></span>
        <MessageCircle className="w-6 h-6 relative z-10" />
        <span className="absolute right-16 bg-white text-gray-800 text-xs px-3 py-2 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold flex flex-col items-end">
          <span className="text-gray-500 text-[10px] uppercase">Customer Service</span>
          <span>01705128340</span>
        </span>
      </a>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-6 py-4 text-white rounded-full shadow-2xl ${theme === 'gothic' ? 'bg-black border border-red-900' : 'bg-zinc-900'}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${theme === 'gothic' ? 'bg-red-900' : 'bg-pink-500'}`}>
              <Check className="w-4 h-4 text-white" />
            </div>
            <p className={`font-medium text-sm ${theme === 'gothic' ? 'text-red-100' : 'text-white'}`}>{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
