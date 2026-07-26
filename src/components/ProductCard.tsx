import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { Product, Currency, Theme } from '../types';
import { formatPrice } from '../utils';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  currency: Currency;
  theme: Theme;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export const ProductCard = React.memo(function ProductCard({ product, onAddToCart, onViewDetails, currency, theme, isWishlisted, onToggleWishlist }: ProductCardProps) {
  const isDark = theme === 'dark' || theme === 'gothic';
  const cardBg = theme === 'dark' ? 'bg-zinc-900/80 border-zinc-800' : theme === 'gothic' ? 'bg-black border-red-900/50' : 'bg-white/80 border-white';
  const textColor = theme === 'gothic' ? 'text-red-100' : isDark ? 'text-zinc-100' : 'text-gray-700';
  const descColor = theme === 'gothic' ? 'text-red-800' : isDark ? 'text-zinc-400' : 'text-gray-400';
  const priceColor = theme === 'gothic' ? 'text-red-500' : isDark ? 'text-zinc-100' : 'text-gray-800';
  const imageBg = theme === 'dark' ? 'from-zinc-800 to-zinc-900' : theme === 'gothic' ? 'from-black to-red-950' : 'from-pink-50 to-purple-50';
  const iconBg = theme === 'gothic' ? 'bg-black text-red-600 border border-red-900' : isDark ? 'bg-zinc-800/90 text-pink-500' : 'bg-white/90 text-pink-400';

  return (
    <motion.div 
      layoutId={`product-${product.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`${cardBg} backdrop-blur-sm rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border flex flex-col hover-3d cursor-pointer`}
      onClick={() => onViewDetails(product)}
    >
      <div className={`aspect-square rounded-2xl bg-gradient-to-br ${imageBg} mb-4 overflow-hidden relative group-hover:scale-[1.05] transition-transform duration-500`}>
        <div 
          className={`absolute top-3 right-3 w-9 h-9 ${iconBg} backdrop-blur-md rounded-full flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all z-10 shadow-lg hover:scale-110`} 
          onClick={(e) => { 
            e.stopPropagation(); 
            onToggleWishlist(product.id);
          }}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-pink-500' : ''}`} />
        </div>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <span 
          className="text-[10px] uppercase tracking-widest mb-1 block font-bold"
          style={{ color: product.themeColor }}
        >
          {product.category}
        </span>
        <h3 className={`font-bold leading-tight mb-1 ${textColor}`}>
          {product.name}
        </h3>
        <p className={`text-xs mb-4 line-clamp-2 ${descColor}`}>
          {product.description}
        </p>
        <div className="mt-auto flex justify-between items-center">
          <span className={`text-xl font-black drop-shadow-sm ${priceColor}`}>
            {formatPrice(product.price, currency)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="text-white font-bold px-5 py-2.5 rounded-xl text-xs hover:brightness-110 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.2)] shine-effect hover:scale-105 active:scale-95"
            style={{ backgroundColor: product.themeColor }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
});
