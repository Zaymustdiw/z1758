import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  X,
  Settings,
  LogIn,
  LogOut,
  ShieldCheck,
  AlertTriangle,
  User as UserIcon,
  Heart,
  Sun,
  Moon,
  ChevronRight,
  MessageCircle,
  Truck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AccessoryCategory, Currency, Product, Theme } from '../types';
import { useAuth } from '../context/AuthContext';

type CategoryFilter = 'all' | AccessoryCategory;

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  onOpenSettings: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isAdminView?: boolean;
  onNavigateAdmin?: () => void;
  onNavigateHome?: () => void;
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  wishlistCount: number;
  wishlistPulseKey?: number;
  showWishlist: boolean;
  onToggleWishlistView: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

function GothicCrossIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Vertical beam with flared gothic terminals */}
      <path d="M16 2L19 5.5L17.6 7V12.4H23L24.5 11L28 14L24.5 17L23 15.6H17.6V24.8L19.4 26.8L16 30L12.6 26.8L14.4 24.8V15.6H9L7.5 17L4 14L7.5 11L9 12.4H14.4V7L13 5.5L16 2Z" />
      {/* Center diamond relief */}
      <path d="M16 11.4L18.6 14L16 16.6L13.4 14L16 11.4Z" className="opacity-35" />
    </svg>
  );
}

export const Navbar = React.memo(function Navbar({
  cartCount,
  onOpenCart,
  onOpenOrders,
  searchQuery,
  setSearchQuery,
  currency,
  setCurrency,
  onOpenSettings,
  theme,
  setTheme,
  isAdminView,
  onNavigateAdmin,
  onNavigateHome,
  activeCategory,
  onSelectCategory,
  wishlistCount,
  wishlistPulseKey = 0,
  showWishlist,
  onToggleWishlistView,
  products,
  onSelectProduct,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isEmailVerified, isAdmin, openAuthModal, signOut } = useAuth();
  const isDark = theme === 'dark';

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const navBg = isDark
    ? 'bg-zinc-950/90 border-zinc-800/80 text-zinc-100'
    : 'bg-[#F7F7F5]/90 border-zinc-200/80 text-zinc-950';

  const iconBtnClass = isDark
    ? 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800'
    : 'bg-white border-zinc-200 text-zinc-950 hover:bg-zinc-100';

  const menuSurface = isDark
    ? 'bg-zinc-950 border-zinc-800 text-zinc-100'
    : 'bg-white border-zinc-200 text-zinc-950';

  const subText = isDark ? 'text-zinc-400' : 'text-zinc-500';

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
    { id: 'chain', label: 'Wallet Chains' },
    { id: 'bracelet', label: 'Bracelets' },
  ];

  const closeAndRun = (fn?: () => void) => {
    setIsMenuOpen(false);
    fn?.();
  };

  return (
    <>
      <nav
        className={`h-16 sm:h-20 flex-none sticky top-0 z-50 w-full border-b transition-colors duration-300 backdrop-blur-xl ${navBg}`}
      >
        <div className="w-full max-w-7xl mx-auto h-full px-3 sm:px-6 lg:px-8 grid grid-cols-3 items-center">
          {/* Top Left: Gothic Cross Spill Trigger */}
          <div className="flex items-center justify-start relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open gothic cross menu'}
              aria-expanded={isMenuOpen}
              className={`relative z-20 w-11 h-11 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                isMenuOpen
                  ? isDark
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-lg'
                    : 'bg-zinc-950 text-white border-zinc-950 shadow-lg'
                  : iconBtnClass
              }`}
            >
              <motion.div
                animate={{
                  rotate: isMenuOpen ? 180 : 0,
                  scale: isMenuOpen ? 1.12 : 1,
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                className="flex items-center justify-center"
              >
                <GothicCrossIcon className="w-6 h-6" />
              </motion.div>
            </button>

            {/* Spill Droplet & Ink Burst below Cross when toggled */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  aria-hidden="true"
                  initial={{ scale: 0.2, opacity: 0, y: -6 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.2, opacity: 0, y: -8 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                  style={{ transformOrigin: '22px 0px' }}
                  className="absolute left-0 top-9 z-10 pointer-events-none flex items-start gap-1.5 pl-2"
                >
                  <motion.span
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: 'top center' }}
                    className={`w-1.5 h-8 rounded-full block ${
                      isDark ? 'bg-zinc-100' : 'bg-zinc-950'
                    }`}
                  />
                  <motion.span
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.42, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: 'top center' }}
                    className={`w-2.5 h-11 rounded-full block ${
                      isDark ? 'bg-zinc-100' : 'bg-zinc-950'
                    }`}
                  />
                  <motion.span
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.32, delay: 0.09, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: 'top center' }}
                    className={`w-1 h-6 rounded-full block ${
                      isDark ? 'bg-zinc-100' : 'bg-zinc-950'
                    }`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Center: Clean Z1758 Wordmark */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => closeAndRun(onNavigateHome)}
              className="min-h-[44px] px-3 flex items-center justify-center cursor-pointer group focus:outline-none"
            >
              <span
                className={`font-display font-black text-xl sm:text-2xl tracking-[0.18em] uppercase whitespace-nowrap transition-opacity group-hover:opacity-75 ${
                  isDark ? 'text-white' : 'text-zinc-950'
                }`}
              >
                Z1758
              </span>
            </button>
          </div>

          {/* Right: Clean Shopping Bag */}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => closeAndRun(onOpenCart)}
              aria-label="Open shopping bag"
              className={`relative w-11 h-11 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${iconBtnClass}`}
            >
              <ShoppingBag className="w-4 h-4" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`absolute -top-0.5 -right-0.5 text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center border ${
                      isDark
                        ? 'bg-zinc-100 text-zinc-950 border-zinc-950'
                        : 'bg-zinc-950 text-white border-white'
                    }`}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
              {user && !isEmailVerified && cartCount === 0 && (
                <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Spilled Gothic Cross Everything-Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/55 backdrop-blur-sm z-40"
            />

            <motion.aside
              initial={{ opacity: 0, scaleY: 0.15, scaleX: 0.72, y: -24 }}
              animate={{ opacity: 1, scaleY: 1, scaleX: 1, y: 0 }}
              exit={{ opacity: 0, scaleY: 0.12, scaleX: 0.75, y: -20 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              style={{ transformOrigin: '24px top' }}
              aria-label="Full navigation menu"
              className={`fixed top-16 sm:top-20 left-0 w-full sm:w-[400px] max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-5rem)] overflow-y-auto z-50 border-b sm:border-r shadow-2xl rounded-b-3xl sm:rounded-br-3xl sm:rounded-bl-none ${menuSurface}`}
            >
              {/* Liquid Spill Drip Decoration at Top Edge */}
              <div
                aria-hidden="true"
                className="w-full overflow-hidden pointer-events-none leading-none -mt-px"
              >
                <svg
                  viewBox="0 0 400 22"
                  className={`w-full h-5 ${isDark ? 'fill-zinc-900' : 'fill-zinc-950'}`}
                  preserveAspectRatio="none"
                >
                  <path d="M0 0H400V4C370 4 360 12 342 12C325 12 318 4 295 4C275 4 268 18 250 18C232 18 228 5 204 5C180 5 170 15 152 15C134 15 128 4 102 4C78 4 68 22 46 22C24 22 18 6 0 6V0Z" />
                </svg>
              </div>

              <div className="p-5 sm:p-6 space-y-6">
                {/* Menu Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <motion.div
                      animate={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isDark ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-950 text-white'
                      }`}
                    >
                      <GothicCrossIcon className="w-4 h-4" />
                    </motion.div>
                    <div>
                      <span className="font-display font-black text-sm tracking-wider uppercase block">
                        Z1758 Menu
                      </span>
                      <span className={`text-[11px] ${subText}`}>
                        Search, categories, profile &amp; tools
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                    className={`w-11 h-11 rounded-full border flex items-center justify-center cursor-pointer ${iconBtnClass}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${subText}`} />
                  <input
                    type="text"
                    placeholder="Search coats, denim, boots, bags, belts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full min-h-[44px] rounded-2xl py-2.5 pl-10 pr-9 text-sm font-medium border outline-none transition-colors ${
                      isDark
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-zinc-500'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-950 placeholder-zinc-400 focus:border-zinc-900'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${subText}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Account & Profile Card */}
                <div
                  className={`rounded-2xl border p-4 space-y-3 ${
                    isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {user ? (
                    <>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.photoURL || 'https://api.dicebear.com/7.x/shapes/svg?seed=Z1758'}
                          alt="Profile avatar"
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/40 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm truncate">
                            {user.displayName || 'Z1758 Member'}
                          </p>
                          <p className={`text-xs truncate ${subText}`}>{user.email}</p>
                        </div>
                      </div>

                      {!isEmailVerified && (
                        <button
                          type="button"
                          onClick={() => closeAndRun(openAuthModal)}
                          className="w-full min-h-[44px] px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          <span>Verify Email Address</span>
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => closeAndRun(onOpenOrders)}
                          className="min-h-[44px] px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <UserIcon className="w-3.5 h-3.5" />
                          <span>Profile &amp; Orders</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => closeAndRun(signOut)}
                          className={`min-h-[44px] px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                            isDark
                              ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                              : 'border-slate-300 text-slate-800 hover:bg-white'
                          }`}
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => closeAndRun(openAuthModal)}
                      className="w-full min-h-[44px] px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In / Create Account</span>
                    </button>
                  )}
                </div>

                {/* Categories Navigation */}
                <div className="space-y-2">
                  <span className={`text-[11px] font-mono uppercase tracking-[0.2em] font-bold block ${subText}`}>
                    Browse Hardware
                  </span>
                  <div className="space-y-1.5">
                    {categories.map((cat) => {
                      const active = activeCategory === cat.id && !isAdminView;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            onSelectCategory(cat.id);
                            closeAndRun(onNavigateHome);
                          }}
                          className={`w-full min-h-[44px] px-4 rounded-xl flex items-center justify-between text-sm font-bold transition-colors cursor-pointer ${
                            active
                              ? isDark
                                ? 'bg-zinc-100 text-zinc-950'
                                : 'bg-zinc-950 text-white'
                              : isDark
                              ? 'hover:bg-zinc-900 text-zinc-200'
                              : 'hover:bg-zinc-100 text-zinc-800'
                          }`}
                        >
                          <span>{cat.label}</span>
                          <ChevronRight className="w-4 h-4 opacity-60" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Direct Belt Spread Shortcuts */}
                <div className="space-y-2">
                  <span className={`text-[11px] font-mono uppercase tracking-[0.2em] font-bold block ${subText}`}>
                    Quick Product Spreads
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {products.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => closeAndRun(() => onSelectProduct(item))}
                        className={`min-h-[48px] p-2 rounded-xl border flex items-center gap-3 text-left transition-colors cursor-pointer ${
                          isDark
                            ? 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600'
                            : 'border-zinc-200 bg-zinc-50 hover:border-zinc-400'
                        }`}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className={`w-12 h-9 rounded-lg shrink-0 ${
                            item.imageUrl.includes('/images/catalog/')
                              ? 'bg-white object-contain p-0.5'
                              : 'object-cover'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold block truncate">{item.name}</span>
                          <span className={`text-[10px] font-mono uppercase ${subText}`}>
                            {item.category} · Open Spread
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-50 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions: Wishlist, Bag, Tracking */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleWishlistView();
                      closeAndRun(onNavigateHome);
                    }}
                    className={`relative min-h-[44px] px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                      showWishlist
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                        : iconBtnClass
                    }`}
                  >
                    <motion.span
                      key={`nav-heart-${wishlistPulseKey}`}
                      animate={
                        wishlistPulseKey > 0
                          ? { scale: [1, 1.32, 0.94, 1.18, 1] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="flex items-center justify-center"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          showWishlist || wishlistCount > 0 ? 'fill-current text-rose-500' : ''
                        } ${showWishlist ? '!text-white' : ''}`}
                      />
                    </motion.span>
                    <span>Saved ({wishlistCount})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => closeAndRun(onOpenCart)}
                    className={`min-h-[44px] px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${iconBtnClass}`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Bag ({cartCount})</span>
                  </button>
                </div>

                {/* Inline Preferences + Full Settings */}
                <div
                  className={`rounded-2xl border p-4 space-y-3 ${
                    isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase tracking-[0.18em] font-bold ${subText}`}>
                      Preferences
                    </span>
                    <button
                      type="button"
                      onClick={() => closeAndRun(onOpenSettings)}
                      className={`text-xs font-bold flex items-center gap-1 cursor-pointer hover:underline ${
                        isDark ? 'text-zinc-200' : 'text-zinc-900'
                      }`}
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>All Settings</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrency(currency === 'BDT' ? 'USD' : 'BDT')}
                      className={`min-h-[44px] px-3 rounded-xl border text-xs font-mono font-bold cursor-pointer ${iconBtnClass}`}
                    >
                      Currency: {currency}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme(isDark ? 'light' : 'dark')}
                      className={`min-h-[44px] px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${iconBtnClass}`}
                    >
                      {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                      <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                  </div>
                </div>

                {/* Admin & Support Footer Links */}
                <div className="space-y-2 pt-1">
                  {user && isEmailVerified && (
                    <button
                      type="button"
                      onClick={() => closeAndRun(onOpenOrders)}
                      className={`w-full min-h-[44px] px-4 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer ${iconBtnClass}`}
                    >
                      <span className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-indigo-500" />
                        <span>Live Order Tracking</span>
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  )}

                  {isAdmin && isEmailVerified && onNavigateAdmin && (
                    <button
                      type="button"
                      onClick={() => closeAndRun(isAdminView ? onNavigateHome : onNavigateAdmin)}
                      className="w-full min-h-[44px] px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{isAdminView ? 'Return to Storefront' : 'Protected Admin Console'}</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  <a
                    href="https://wa.me/8801705128340"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full min-h-[44px] px-4 rounded-xl border text-xs font-bold flex items-center justify-between ${iconBtnClass}`}
                  >
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-500" />
                      <span>Support · 01705128340</span>
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </a>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
});
