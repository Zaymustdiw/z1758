import React from 'react';
import { Cat, Search, ShoppingBag, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Currency, Theme } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currency: Currency;
  onOpenSettings: () => void;
  theme: Theme;
}

const BatIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22 6c-2 0-3.5 1-5 2.5-1.5 1.5-2.5 2.5-5 2.5s-3.5-1-5-2.5C5.5 7 4 6 2 6c1 2 2 3.5 1 5-.5 1-2 2-2 2 1.5 0 3.5.5 5 2 1.5 1.5 2.5 3 4 5l2 3 2-3c1.5-2 2.5-3.5 4-5 1.5-1.5 3.5-2 5-2 0 0-1.5-1-2-2-.5-1.5.5-3 1-5z" />
  </svg>
);

export const Navbar = React.memo(function Navbar({ cartCount, onOpenCart, searchQuery, setSearchQuery, currency, onOpenSettings, theme }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const getNavBg = () => {
    if (theme === 'dark') return 'bg-zinc-900/80 border-zinc-800';
    if (theme === 'gothic') return 'bg-black/90 border-red-900/50';
    return 'bg-gradient-to-r from-pink-200 via-[#FFB6C1] to-purple-200 animate-gradient-xy border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.1)]';
  };

  return (
    <nav className={`h-20 flex-none sticky top-0 z-40 w-full border-b transition-all duration-300 backdrop-blur-md ${getNavBg()}`}>
      <div className="w-full h-full px-8 flex items-center justify-between">
        <div className="flex justify-between items-center w-full">
          {/* Logo and Settings */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 180, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={`w-12 h-10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg relative ${theme === 'dark' ? 'bg-zinc-800' : theme === 'gothic' ? 'bg-black' : 'bg-white/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_2px_10px_rgba(255,255,255,0.8)]'}`}
              >
                {theme === 'gothic' ? (
                  <BatIcon className="w-6 h-6 drop-shadow-md text-red-600" />
                ) : (
                  <Cat className={`w-6 h-6 drop-shadow-md text-pink-500`} />
                )}
              </motion.div>
              <h1 className="font-bold text-2xl tracking-tight hidden sm:block">
                <span className="text-white drop-shadow-sm">Pusheen</span>
                <span className={`${theme === 'gothic' ? 'text-red-600' : 'text-[#FF1493]'} italic ml-1`}>Sparkle</span>
              </h1>
            </div>
            
            {/* Settings Button */}
            <motion.div 
              whileHover={{ rotate: 90, scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`w-12 h-10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg relative cursor-pointer ml-1 ${theme === 'dark' ? 'bg-zinc-800' : theme === 'gothic' ? 'bg-purple-900' : 'bg-white/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_2px_10px_rgba(255,255,255,0.8)]'}`}
              onClick={onOpenSettings}
            >
              <Settings className={`w-6 h-6 drop-shadow-md ${theme === 'gothic' ? 'text-purple-300' : 'text-purple-500'}`} />
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md px-4 sm:px-10 hidden sm:block w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for your sparkle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/70 backdrop-blur-md border border-white/50 rounded-full py-2.5 px-6 text-sm font-medium focus:ring-4 focus:ring-white/50 focus:bg-white transition-all outline-none shadow-[inset_0_2px_5px_rgba(0,0,0,0.05)] text-gray-800 placeholder-gray-400"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-pink-500 font-bold cursor-pointer hover:scale-110 transition-transform">
                  <Search className="w-5 h-5 drop-shadow-sm" />
                </div>
              </div>
            </div>

            <div className="flex items-center sm:hidden">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 160, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden mr-1"
                  >
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/90 border-none rounded-full py-2 px-4 text-sm focus:ring-2 focus:ring-pink-300 transition-all outline-none text-gray-800"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/30 rounded-full transition-colors flex-shrink-0"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            </div>

            {/* Cart & Avatar */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative cursor-pointer group" onClick={onOpenCart}>
                <div className="w-11 h-11 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/80 transition-all duration-300 shadow-sm border border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:-translate-y-1">
                  <ShoppingBag className="w-5 h-5 text-white group-hover:text-pink-500 transition-colors drop-shadow-sm" />
                </div>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="w-11 h-11 rounded-full bg-white border-2 border-white/80 overflow-hidden hidden sm:block shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Pusheen" alt="Avatar" className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
});
