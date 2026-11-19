import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ArrowUpRight, Sparkles } from 'lucide-react';
import { Product, Currency, Theme } from '../types';
import { formatPrice } from '../utils';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  index?: number;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  currency: Currency;
  theme: Theme;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export const ProductCard = React.memo(function ProductCard({
  product,
  index = 0,
  onAddToCart,
  onViewDetails,
  currency,
  theme,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  const [pulseCount, setPulseCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isDark = theme === 'dark';
  const isReserve = product.tier === 'reserve';
  const isWhiteStudio = product.imageUrl.includes('/images/catalog/');
  const cardBg = isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-zinc-200';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-950';
  const descColor = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const priceColor = isDark ? 'text-zinc-100' : 'text-zinc-950';
  const imageBg = isWhiteStudio ? 'bg-white' : isDark ? 'bg-zinc-950' : 'bg-[#F2F2EE]';
  const iconBg = isDark
    ? 'bg-zinc-900/90 text-zinc-200 border border-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
    : 'bg-white/90 text-zinc-800 border border-zinc-200 hover:bg-zinc-950 hover:text-white';
  const ctaBtn = isDark
    ? 'bg-zinc-100 text-zinc-950 hover:bg-white'
    : 'bg-zinc-950 text-white hover:bg-zinc-800';

  const displayImage =
    isHovered && product.galleryImages.length > 1
      ? product.galleryImages[1]
      : product.imageUrl;

  const inspectLabel =
    product.category === 'belt'
      ? 'Inspect Belt Spread'
      : product.category === 'denim'
      ? 'Inspect Flare Cut'
      : product.category === 'outerwear' || product.category === 'top'
      ? 'Inspect Garment'
      : product.category === 'footwear'
      ? 'Inspect Footwear'
      : product.category === 'bag'
      ? 'Inspect Bag'
      : 'Interactive View';

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isWishlisted) {
      setPulseCount((c) => c + 1);
    }
    onToggleWishlist(product.id);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.34, delay: Math.min(index * 0.03, 0.24), ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`${cardBg} rounded-3xl p-4 sm:p-5 shadow-sm border flex flex-col cursor-pointer group relative overflow-hidden ${
        isReserve
          ? isDark
            ? 'ring-1 ring-amber-400/25'
            : 'ring-1 ring-amber-600/20'
          : ''
      }`}
      onClick={() => onViewDetails(product)}
    >
      <div className={`aspect-[4/3] rounded-2xl ${imageBg} mb-4 overflow-hidden relative`}>
        {/* Wishlist Button with Subtle Heart-Pulsing Animation */}
        <button
          type="button"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 w-11 h-11 ${
            isWishlisted
              ? 'bg-rose-500 text-white border border-rose-400 shadow-md shadow-rose-500/25'
              : iconBg
          } backdrop-blur-md rounded-full flex items-center justify-center transition-colors z-20 cursor-pointer`}
          onClick={handleHeartClick}
        >
          <AnimatePresence>
            {pulseCount > 0 && isWishlisted && (
              <motion.span
                key={pulseCount}
                initial={{ scale: 0.85, opacity: 0.65 }}
                animate={{ scale: 1.65, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border-2 border-rose-400 pointer-events-none"
              />
            )}
          </AnimatePresence>
          <motion.span
            key={`heart-${pulseCount}-${isWishlisted}`}
            animate={
              isWishlisted && pulseCount > 0
                ? { scale: [1, 1.34, 0.92, 1.2, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.58, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </motion.span>
        </button>

        {/* Product Image with Smooth Micro-Zoom & Angle Switch */}
        <motion.img
          src={displayImage}
          alt={product.name}
          animate={{ scale: isHovered ? 1.04 : 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full h-full ${
            isWhiteStudio ? 'object-contain p-2' : 'object-cover object-center'
          }`}
        />

        {/* Specular Light Shine Sweep on Hover */}
        <motion.div
          aria-hidden="true"
          initial={{ x: '-130%', opacity: 0 }}
          animate={{
            x: isHovered ? '160%' : '-130%',
            opacity: isHovered ? [0, 0.35, 0] : 0,
          }}
          transition={{ duration: 0.85, ease: 'easeInOut' }}
          className="absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10"
        />

        {/* Architectural Corner Target Reticles on Hover */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.94 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-2.5 pointer-events-none z-10"
        >
          <span
            className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 rounded-tl-sm block ${
              isWhiteStudio ? 'border-zinc-900/60' : 'border-white/80'
            }`}
          />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 rounded-br-sm block ${
              isWhiteStudio ? 'border-zinc-900/60' : 'border-white/80'
            }`}
          />
        </motion.div>

        {/* Interactive Spread / View Tag */}
        <motion.div
          animate={{ y: isHovered ? 0 : 4, opacity: isHovered ? 1 : 0.92 }}
          transition={{ duration: 0.2 }}
          className={`absolute bottom-2.5 left-2.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 z-10 ${
            isDark && !isWhiteStudio
              ? 'bg-zinc-950/85 text-zinc-100 border border-zinc-700'
              : 'bg-white/95 text-zinc-950 border border-zinc-200 shadow-xs'
          }`}
        >
          <span>{inspectLabel}</span>
          <ArrowUpRight className="w-3 h-3" />
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className={`text-[11px] font-mono uppercase tracking-[0.18em] font-semibold ${descColor}`}>
            {product.category} · {product.weightGrams}g
          </span>
          {isReserve && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500">
              <Sparkles className="w-3 h-3" />
              <span>Archive Reserve</span>
            </span>
          )}
        </div>

        <h3 className={`font-display text-base sm:text-lg font-bold leading-snug mb-1.5 ${textColor}`}>
          {product.name}
        </h3>
        <p className={`text-xs sm:text-sm mb-3 line-clamp-2 ${descColor}`}>
          {product.description}
        </p>

        {/* Staggered Sizes & Finish Preview on Hover */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0.72 }}
          className={`text-[11px] font-mono mb-3 flex items-center justify-between gap-2 ${descColor}`}
        >
          <span className="truncate">{product.finish}</span>
          <span className="shrink-0">{product.sizes.length} sizes</span>
        </motion.div>

        <div className="mt-auto flex justify-between items-center pt-2 gap-3 border-t border-zinc-500/10">
          <span className={`text-lg font-mono font-bold tabular-nums ${priceColor}`}>
            {formatPrice(product.price, currency)}
          </span>
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`min-h-[44px] font-bold px-4 sm:px-5 rounded-xl text-xs transition-colors cursor-pointer whitespace-nowrap ${ctaBtn}`}
          >
            Add to Bag
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
});
