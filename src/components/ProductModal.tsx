import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Product, Currency, Theme } from '../types';
import { formatPrice } from '../utils';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  currency: Currency;
  theme: Theme;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
}

export const ProductModal = React.memo(function ProductModal({ product, onClose, onAddToCart, currency, theme, isWishlisted, onToggleWishlist }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isDark = theme === 'dark' || theme === 'gothic';
  const modalBg = theme === 'dark' ? 'bg-zinc-900/95 border-zinc-800' : theme === 'gothic' ? 'bg-black/95 border-red-900' : 'bg-white/90 border-white/50';
  const textColor = theme === 'gothic' ? 'text-red-100' : isDark ? 'text-zinc-100' : 'text-gray-900';
  const descColor = theme === 'gothic' ? 'text-red-800' : isDark ? 'text-zinc-300' : 'text-gray-600';
  const imageBg = theme === 'dark' ? 'from-zinc-800 to-zinc-900' : theme === 'gothic' ? 'from-black to-red-950' : 'from-gray-50 to-pink-50/30';
  const infoBg = theme === 'dark' ? 'bg-zinc-800/50 text-zinc-300' : theme === 'gothic' ? 'bg-red-900/30 text-red-200' : 'bg-pink-50/50 text-gray-600';

  // Reset index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product) {
      setCurrentImageIndex((prev) => (prev + 1) % product.galleryImages.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product) {
      setCurrentImageIndex((prev) => (prev - 1 + product.galleryImages.length) % product.galleryImages.length);
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            layoutId={`product-${product.id}`}
            className={`relative w-full max-w-4xl ${modalBg} backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row max-h-[90vh] border`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Image Gallery */}
            <div className={`w-full md:w-1/2 relative bg-gradient-to-br ${imageBg} flex items-center justify-center min-h-[350px] md:min-h-full group p-8`}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  src={product.galleryImages[currentImageIndex]}
                  alt={`${product.name} view ${currentImageIndex + 1}`}
                  className={`w-full h-[350px] md:h-[500px] object-contain p-4 drop-shadow-2xl hover:scale-105 transition-transform duration-500 ${isDark ? '' : 'mix-blend-multiply'}`}
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {product.galleryImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Dots */}
              {product.galleryImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {product.galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col overflow-y-auto relative">
              <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
                {onToggleWishlist && (
                  <button 
                    onClick={() => onToggleWishlist(product.id)}
                    className={`p-2 backdrop-blur-md rounded-full transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:scale-110 ${isDark ? 'bg-zinc-800/80 hover:bg-zinc-700 text-pink-500' : 'bg-white/80 hover:bg-white text-pink-500'}`}
                  >
                    <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className={`p-2 backdrop-blur-md rounded-full transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:rotate-90 hover:scale-110 ${isDark ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-100' : 'bg-white/80 hover:bg-white text-gray-800'}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-8 md:mt-0 flex-1">
                <div className="flex justify-between items-center mb-4">
                  <span 
                    className={`text-xs font-black uppercase tracking-widest block px-3 py-1 rounded-full shadow-sm ${isDark ? 'bg-zinc-800/80' : 'bg-white/50'}`}
                    style={{ color: product.themeColor }}
                  >
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <span className={`text-sm font-bold ${textColor}`}>{product.rating}</span>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  </div>
                </div>
                <h2 className={`text-4xl sm:text-5xl font-black mb-4 leading-tight drop-shadow-sm ${textColor}`}>
                  {product.name}
                </h2>
                <div className={`text-3xl font-black mb-8 flex items-center gap-4 ${textColor}`}>
                  {formatPrice(product.price, currency)}
                  <span className={`text-sm font-medium px-3 py-1 rounded-full border animate-pulse ${isDark ? 'text-pink-400 bg-pink-500/10 border-pink-500/20' : 'text-pink-500 bg-pink-50 border-pink-100'}`}>In Stock</span>
                </div>
                
                <div className={`prose prose-sm sm:prose-base mb-8 space-y-4 ${descColor}`}>
                  <p className={`font-bold text-lg leading-relaxed ${textColor}`}>{product.description}</p>
                  <p className="leading-relaxed opacity-80">{product.longDescription}</p>
                </div>
              </div>

              <div className={`mt-auto pt-8 border-t ${isDark ? 'border-zinc-800' : 'border-gray-100/50'}`}>
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="w-full py-5 px-6 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:opacity-95 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)] shine-effect hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: product.themeColor, shadowColor: product.themeColor }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
