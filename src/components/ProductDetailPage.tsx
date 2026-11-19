import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Heart,
  Plus,
  RotateCcw,
  Maximize2,
  Minimize2,
  Star,
  Check,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';
import { Product, Currency, Theme } from '../types';
import { formatPrice } from '../utils';
import { Reviews } from './Reviews';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, selectedSize?: string) => void;
  currency: Currency;
  theme: Theme;
  isWishlisted: boolean;
  wishlistPulseKey: number;
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  relatedProducts: Product[];
}

export const ProductDetailPage = React.memo(function ProductDetailPage({
  product,
  onBack,
  onAddToCart,
  currency,
  theme,
  isWishlisted,
  wishlistPulseKey,
  onToggleWishlist,
  onSelectProduct,
  relatedProducts,
}: ProductDetailPageProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [spreadPercent, setSpreadPercent] = useState(0);
  const [spreadKey, setSpreadKey] = useState(0);
  const [activeSpecIndex, setActiveSpecIndex] = useState(0);

  const isDark = theme === 'dark';
  const isSpread = spreadPercent >= 50;

  // Choreographed coil-to-spread entrance on product change
  useEffect(() => {
    setSelectedImageIdx(0);
    setSelectedSize(product.sizes[0] || '');
    setActiveSpecIndex(0);
    setSpreadPercent(0);
    const timer = setTimeout(() => {
      setSpreadPercent(100);
    }, 180);
    return () => clearTimeout(timer);
  }, [product]);

  const replaySpread = () => {
    setSpreadPercent(0);
    setSpreadKey((prev) => prev + 1);
    setTimeout(() => setSpreadPercent(100), 220);
  };

  const toggleSpread = () => {
    setSpreadPercent((prev) => (prev >= 50 ? 0 : 100));
  };

  const panelBg = isDark
    ? 'bg-zinc-900/90 border-zinc-800'
    : 'bg-white/95 border-zinc-200';
  const subtleBg = isDark ? 'bg-zinc-950/90 border-zinc-800' : 'bg-[#F7F7F5] border-zinc-200';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-950';
  const mutedText = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const primaryBtn = isDark
    ? 'bg-zinc-100 text-zinc-950 hover:bg-white'
    : 'bg-zinc-950 text-white hover:bg-zinc-800';
  const outlineBtn = isDark
    ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800'
    : 'bg-white border-zinc-300 text-zinc-900 hover:bg-zinc-100';

  const activeSpec = product.hardwareSpecs[activeSpecIndex] || product.hardwareSpecs[0];
  const isStuddedBelt = product.id === '2';
  const isPlatinumBelt = product.id === '6';
  const isDiamondGrillz = product.id === '7';
  const isOnyxRing = product.id === '8';
  const isImperialChain = product.id === '9';
  const isReserve = product.tier === 'reserve';

  const spreadFraction = Math.max(0.14, spreadPercent / 100);
  const selectedSizeIndex = Math.max(0, product.sizes.indexOf(selectedSize));

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      className="w-full space-y-6 sm:space-y-10"
    >
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className={`min-h-[44px] px-4 rounded-full border flex items-center gap-2 text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${outlineBtn}`}
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Back to Archive</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className={`hidden sm:inline text-xs font-mono uppercase tracking-[0.2em] ${mutedText}`}>
            Z1758 · {product.category} · {product.weightGrams}g
          </span>

          {/* Saved Button with Subtle Heart-Pulsing Animation */}
          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`relative min-w-[44px] min-h-[44px] px-4 rounded-full border flex items-center justify-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
              isWishlisted
                ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25'
                : outlineBtn
            }`}
          >
            <AnimatePresence>
              {isWishlisted && wishlistPulseKey > 0 && (
                <motion.span
                  key={`pulse-ring-${wishlistPulseKey}`}
                  initial={{ scale: 0.9, opacity: 0.6 }}
                  animate={{ scale: 1.45, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border-2 border-rose-400 pointer-events-none"
                />
              )}
            </AnimatePresence>
            <motion.span
              key={`heart-beat-${wishlistPulseKey}-${isWishlisted}`}
              animate={
                isWishlisted && wishlistPulseKey > 0
                  ? { scale: [1, 1.35, 0.92, 1.2, 1] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.62, ease: 'easeOut' }}
              className="flex items-center justify-center"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.span>
            <span>{isWishlisted ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Centerpiece Super-Detailed Interactive Hardware Stage */}
      <section className={`rounded-3xl border overflow-hidden shadow-sm ${panelBg}`}>
        <div
          className={`px-4 sm:px-7 py-4 border-b flex flex-wrap items-center justify-between gap-3 ${
            isDark ? 'border-zinc-800' : 'border-zinc-200'
          }`}
        >
          <div>
            <span className={`text-[11px] font-mono uppercase tracking-[0.22em] font-semibold flex items-center gap-1.5 ${mutedText}`}>
              {isReserve && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
              <span>
                {product.category === 'belt'
                  ? 'Interactive Belt Spread Anatomy'
                  : product.category === 'grillz'
                  ? 'Interactive 12-Piece Arch & Pavé Stage'
                  : product.category === 'chain'
                  ? 'Articulated Link Catenary Stage'
                  : product.category === 'outerwear' || product.category === 'top'
                  ? 'Articulated Garment & Closure Stage'
                  : product.category === 'denim'
                  ? 'Flare Cut & Hardware Spread Stage'
                  : product.category === 'footwear'
                  ? 'Exploded Footwear & Welt Stage'
                  : product.category === 'bag'
                  ? 'Bellows Gusset & Cross Clasp Stage'
                  : product.category === 'bracelet'
                  ? 'Curb Link & Onyx Bar Tension Stage'
                  : 'Exploded 3-Layer Relief Stage'}
              </span>
            </span>
            <h2 className={`font-display text-base sm:text-xl font-black tracking-tight ${textColor}`}>
              {product.category === 'belt'
                ? 'Full-Length Strap & Hardware Unfurl'
                : product.category === 'grillz'
                ? 'Upper & Lower Arch Separation'
                : product.category === 'chain'
                ? 'Swivel Clasp & Link-by-Link Extension'
                : product.category === 'outerwear' || product.category === 'top'
                ? 'Collar, Sleeve Gusset & Closure Breakdown'
                : product.category === 'denim'
                ? 'Waistband, Leather Panel & Hem Unfurl'
                : product.category === 'footwear'
                ? 'Shaft Collar, Buckle Straps & Sole Separation'
                : product.category === 'bag'
                ? 'Cross Clasp, Strap & Twin Cargo Spread'
                : product.category === 'bracelet'
                ? 'Onyx Bar, Curb Links & Cross Charm Extension'
                : 'Crown, Relief & Hallmark Breakdown'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Live Scrubber Slider */}
            <label className="hidden sm:flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider">
              <span className={mutedText}>Unfurl</span>
              <input
                type="range"
                min={0}
                max={100}
                value={spreadPercent}
                onChange={(e) => setSpreadPercent(Number(e.target.value))}
                aria-label="Hardware spread progress"
                className="w-24 accent-indigo-600 cursor-pointer"
              />
              <span className={`w-9 text-right tabular-nums ${textColor}`}>{spreadPercent}%</span>
            </label>

            <button
              type="button"
              onClick={toggleSpread}
              className={`min-h-[44px] px-4 rounded-full border text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${primaryBtn} border-transparent`}
            >
              {isSpread ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>
                    {product.category === 'belt'
                      ? 'Coil Belt'
                      : product.category === 'denim'
                      ? 'Fold Silhouette'
                      : product.category === 'outerwear' || product.category === 'top'
                      ? 'Fold Garment'
                      : product.category === 'footwear'
                      ? 'Assemble Profile'
                      : product.category === 'bag'
                      ? 'Close Gussets'
                      : 'Compact View'}
                  </span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>
                    {product.category === 'belt'
                      ? 'Spread Belt'
                      : product.category === 'denim'
                      ? 'Spread Flare Cut'
                      : product.category === 'outerwear' || product.category === 'top'
                      ? 'Spread Garment'
                      : product.category === 'footwear'
                      ? 'Explode Layers'
                      : product.category === 'bag'
                      ? 'Open Gussets'
                      : 'Spread View'}
                  </span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={replaySpread}
              aria-label="Replay spread animation"
              title="Replay spread animation"
              className={`min-w-[44px] min-h-[44px] rounded-full border flex items-center justify-center transition-colors cursor-pointer ${outlineBtn}`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Animated Stage Canvas */}
        <div
          key={spreadKey}
          className={`relative px-4 sm:px-8 py-8 sm:py-12 overflow-hidden ${
            isDark
              ? 'bg-[radial-gradient(circle_at_50%_45%,rgba(99,102,241,0.10),transparent_70%)] bg-zinc-950'
              : 'bg-[radial-gradient(circle_at_50%_45%,rgba(99,102,241,0.06),transparent_70%)] bg-[#F2F2EE]'
          }`}
        >
          {/* Architectural Precision Grid Lines */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-25 flex justify-between px-6 sm:px-12"
          >
            {[0, 1, 2, 3, 4, 5, 6].map((line) => (
              <div
                key={line}
                className={`w-px h-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-300'}`}
              />
            ))}
          </div>

          {/* STAGE 1: SUPER DETAILED BELT SPREADING ANATOMY */}
          {product.category === 'belt' && (
            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="min-h-[168px] sm:min-h-[210px] flex items-center justify-center">
                <div className="w-full flex items-center justify-center relative">
                  {/* Coiled Shadow Loops */}
                  <motion.div
                    animate={{
                      opacity: Math.max(0, 1 - spreadPercent / 55),
                      scale: 1 + (spreadPercent / 100) * 0.22,
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className={`absolute w-32 h-32 sm:w-44 sm:h-44 rounded-full border-[14px] sm:border-[18px] pointer-events-none ${
                      isDark
                        ? 'border-zinc-800 shadow-[0_0_0_2px_rgba(255,255,255,0.12)]'
                        : 'border-zinc-900 shadow-[0_0_0_2px_rgba(0,0,0,0.18)]'
                    }`}
                  />

                  <div className="w-full flex items-center justify-center">
                    {/* 1. Sculpted Buckle Head + Hinged Pin Prong + Sheen */}
                    <motion.button
                      type="button"
                      onClick={() => setActiveSpecIndex(0)}
                      animate={{
                        x: (1 - spreadPercent / 100) * 44,
                        scale: 0.92 + (spreadPercent / 100) * 0.08,
                        rotate: (1 - spreadPercent / 100) * -14,
                      }}
                      transition={{ type: 'spring', stiffness: 170, damping: 20 }}
                      aria-label="Inspect buckle hardware"
                      className={`relative z-20 shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded-2xl border-4 flex items-center justify-center cursor-pointer overflow-hidden ${
                        activeSpecIndex === 0
                          ? 'ring-3 ring-indigo-500 ring-offset-2 ring-offset-zinc-950/30'
                          : ''
                      } ${
                        isPlatinumBelt
                          ? 'bg-gradient-to-br from-white via-slate-200 to-slate-400 border-amber-200 text-slate-900 shadow-2xl'
                          : isDark
                          ? 'bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 border-zinc-100 text-zinc-950 shadow-xl'
                          : 'bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 border-zinc-900 text-zinc-950 shadow-lg'
                      }`}
                    >
                      {/* Buckle Specular Sweep */}
                      <motion.span
                        aria-hidden="true"
                        animate={{ x: isSpread ? ['-140%', '180%'] : '-140%' }}
                        transition={{ duration: 1.2, delay: 0.35, repeat: isSpread ? Infinity : 0, repeatDelay: 3.5 }}
                        className="absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/75 to-transparent pointer-events-none"
                      />

                      {isStuddedBelt ? (
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg border-4 border-zinc-900 flex flex-col justify-center gap-1.5 px-1 relative">
                          <motion.div
                            animate={{ rotate: isSpread ? 0 : -24 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 16 }}
                            style={{ transformOrigin: 'left center' }}
                            className="h-1 w-full bg-zinc-900 rounded-full"
                          />
                          <motion.div
                            animate={{ rotate: isSpread ? 0 : -24 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.04 }}
                            style={{ transformOrigin: 'left center' }}
                            className="h-1 w-full bg-zinc-900 rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="relative w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center">
                          <div className="w-2.5 sm:w-3.5 h-full bg-zinc-950 rounded-sm" />
                          <div className="h-2.5 sm:h-3.5 w-full bg-zinc-950 rounded-sm absolute" />
                          {/* Center Diamond / Pin Pivot */}
                          <motion.div
                            animate={{ scale: isSpread ? [1, 1.35, 1] : 1 }}
                            transition={{ duration: 1.8, repeat: isSpread ? Infinity : 0, repeatDelay: 2 }}
                            className={`w-2.5 h-2.5 rotate-45 absolute ${
                              isPlatinumBelt ? 'bg-amber-200 ring-1 ring-white' : 'bg-zinc-200'
                            }`}
                          />
                        </div>
                      )}
                    </motion.button>

                    {/* 2. Spreading Bridle/Alligator Leather Strap with Saddle Stitching & Keeper Loops */}
                    <motion.div
                      animate={{
                        scaleX: spreadFraction,
                        opacity: 0.25 + (spreadPercent / 100) * 0.75,
                      }}
                      transition={{ type: 'spring', stiffness: 120, damping: 19 }}
                      style={{ transformOrigin: 'left center' }}
                      className={`relative -ml-2 h-12 sm:h-16 flex-1 max-w-2xl rounded-r-full border-y-2 border-r-2 flex items-center justify-between px-3 sm:px-6 overflow-hidden ${
                        activeSpecIndex === 1
                          ? 'ring-3 ring-indigo-500 ring-offset-2 ring-offset-zinc-950/30'
                          : ''
                      } ${
                        isPlatinumBelt
                          ? 'bg-gradient-to-r from-zinc-950 via-slate-900 to-zinc-950 border-slate-500 shadow-2xl'
                          : isDark
                          ? 'bg-zinc-900 border-zinc-600 shadow-2xl'
                          : 'bg-zinc-950 border-zinc-800 shadow-xl'
                      }`}
                    >
                      {/* Top & Bottom Saddle Stitch Threads */}
                      <div className="absolute top-1.5 left-4 right-8 border-t border-dashed border-zinc-500/45 pointer-events-none" />
                      <div className="absolute bottom-1.5 left-4 right-8 border-b border-dashed border-zinc-500/45 pointer-events-none" />

                      {/* Sliding Twin Keeper Loops */}
                      <div className="flex items-center gap-1.5 shrink-0 z-10">
                        <motion.div
                          animate={{ x: isSpread ? 0 : -14, opacity: isSpread ? 1 : 0.2 }}
                          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                          className="w-2.5 sm:w-3.5 h-12 sm:h-16 bg-zinc-700 border-x border-zinc-500"
                        />
                        <motion.div
                          animate={{ x: isSpread ? 0 : -22, opacity: isSpread ? 1 : 0.2 }}
                          transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.06 }}
                          className="w-2 sm:w-3 h-12 sm:h-16 bg-zinc-800 border-x border-zinc-600"
                        />
                      </div>

                      {/* Staggered Studs / Cross Medallions / Diamond Plates */}
                      <button
                        type="button"
                        onClick={() => setActiveSpecIndex(2)}
                        aria-label="Inspect belt hardware medallions and studs"
                        className={`flex-1 flex items-center justify-evenly gap-1 sm:gap-2 px-2 cursor-pointer relative z-10 py-2 rounded-lg ${
                          activeSpecIndex === 2 ? 'bg-indigo-500/15' : ''
                        }`}
                      >
                        {(isStuddedBelt ? [0, 1, 2, 3, 4, 5, 6, 7] : isPlatinumBelt ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 4]).map((idx) => (
                          <motion.div
                            key={idx}
                            animate={{
                              scale: isSpread ? 1 : 0,
                              opacity: isSpread ? 1 : 0,
                              rotate: isSpread ? 0 : -25,
                            }}
                            transition={{
                              type: 'spring',
                              stiffness: 320,
                              damping: 19,
                              delay: isSpread ? 0.12 + idx * 0.045 : 0,
                            }}
                            className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 relative"
                          >
                            {isStuddedBelt ? (
                              <>
                                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rotate-45 bg-gradient-to-br from-white to-zinc-400 border border-zinc-700 block" />
                                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rotate-45 bg-gradient-to-br from-white to-zinc-400 border border-zinc-700 block" />
                                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rotate-45 bg-gradient-to-br from-white to-zinc-400 border border-zinc-700 block" />
                              </>
                            ) : (
                              <span className="relative w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                                <span
                                  className={`w-1 sm:w-1.5 h-full rounded-full block ${
                                    isPlatinumBelt
                                      ? 'bg-gradient-to-b from-white via-amber-100 to-slate-300 shadow-[0_0_8px_rgba(255,255,255,0.65)]'
                                      : 'bg-gradient-to-b from-white to-zinc-400'
                                  }`}
                                />
                                <span
                                  className={`h-1 sm:h-1.5 w-full rounded-full absolute block ${
                                    isPlatinumBelt
                                      ? 'bg-gradient-to-r from-white via-amber-100 to-slate-300'
                                      : 'bg-gradient-to-r from-white to-zinc-400'
                                  }`}
                                />
                              </span>
                            )}
                          </motion.div>
                        ))}
                      </button>

                      {/* Tapered End Eyelets Mapped to Sizes */}
                      <button
                        type="button"
                        onClick={() => setActiveSpecIndex(3)}
                        aria-label="Inspect reinforced eyelets and tip"
                        className={`flex items-center gap-1.5 sm:gap-2.5 shrink-0 cursor-pointer relative z-10 py-2 px-1.5 rounded-lg ${
                          activeSpecIndex === 3 ? 'bg-indigo-500/20' : ''
                        }`}
                      >
                        {product.sizes.map((sz, holeIdx) => {
                          const isSelectedHole = holeIdx === selectedSizeIndex;
                          return (
                            <motion.span
                              key={sz}
                              animate={{ scale: isSpread ? (isSelectedHole ? 1.25 : 1) : 0 }}
                              transition={{
                                delay: isSpread ? 0.34 + holeIdx * 0.04 : 0,
                                type: 'spring',
                                stiffness: 360,
                                damping: 20,
                              }}
                              className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full block ${
                                isSelectedHole
                                  ? 'bg-indigo-500 border-2 border-white shadow-[0_0_8px_rgba(99,102,241,0.9)]'
                                  : 'bg-zinc-950 border-2 border-zinc-300'
                              }`}
                            />
                          );
                        })}
                      </button>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Architectural Millimeter Scale & Active Size Needle */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between px-2">
                  {product.sizes.map((sz, idx) => {
                    const active = idx === selectedSizeIndex;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`relative px-2 py-1 text-[11px] font-mono font-bold cursor-pointer transition-colors ${
                          active ? 'text-indigo-500' : mutedText
                        }`}
                      >
                        <span>{sz}</span>
                        {active && (
                          <motion.span
                            layoutId="waistNeedle"
                            className="block h-0.5 w-full bg-indigo-500 rounded-full mt-0.5"
                            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className={`flex items-center justify-between text-[10px] font-mono uppercase tracking-widest ${mutedText}`}>
                  <span>00 mm · Buckle Frame</span>
                  <span className="hidden sm:inline">38mm Strap · 4.0mm Gauge</span>
                  <span>Selected Fit: {selectedSize}</span>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: SUPER DETAILED GRILLZ ARCH SEPARATION + IMPRESSION BAR */}
          {product.category === 'grillz' && (
            <div className="relative z-10 max-w-2xl mx-auto min-h-[195px] flex flex-col items-center justify-center gap-2.5">
              {/* Upper 6-Tooth Arch with Facet Glints */}
              <motion.div
                animate={{
                  y: isSpread ? -14 : 12,
                  scale: 0.92 + (spreadPercent / 100) * 0.08,
                }}
                transition={{ type: 'spring', stiffness: 170, damping: 18 }}
                className="flex items-end gap-1.5 sm:gap-2.5"
              >
                {[
                  'h-9 sm:h-11',
                  'h-12 sm:h-16',
                  'h-9 sm:h-11',
                  'h-9 sm:h-11',
                  'h-12 sm:h-16',
                  'h-9 sm:h-11',
                ].map((heightCls, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`relative w-8 sm:w-11 ${heightCls} rounded-t-lg rounded-b-2xl border-2 flex items-center justify-center overflow-hidden shadow-lg ${
                      isDiamondGrillz
                        ? 'border-amber-200 bg-gradient-to-b from-white via-slate-100 to-slate-300'
                        : 'border-zinc-400 bg-gradient-to-b from-white via-zinc-300 to-zinc-500'
                    }`}
                  >
                    {/* Vertical Facet Cut */}
                    <span className="w-px h-4/5 bg-slate-500/40 block" />
                    {/* Animated Pavé Diamond Sparkle */}
                    <motion.span
                      animate={{
                        scale: isSpread ? [0.6, 1.35, 0.6] : 0.7,
                        opacity: isSpread ? [0.35, 1, 0.35] : 0.25,
                      }}
                      transition={{
                        duration: 1.6,
                        repeat: isSpread ? Infinity : 0,
                        delay: idx * 0.22,
                      }}
                      className={`absolute top-2 w-2 h-2 rotate-45 block ${
                        isDiamondGrillz ? 'bg-indigo-300 shadow-[0_0_6px_#fff]' : 'bg-white/80'
                      }`}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Silicone Molding Bar Layer Reveal */}
              <motion.div
                animate={{
                  scaleX: isSpread ? 1 : 0.2,
                  opacity: isSpread ? 1 : 0,
                }}
                transition={{ duration: 0.35 }}
                className={`px-4 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-[0.2em] ${
                  isDark
                    ? 'bg-indigo-500/15 border-indigo-500/35 text-indigo-300'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                }`}
              >
                {isDiamondGrillz ? '18K Open Bridge · 5.8ct VVS Fit' : 'Silicone Mold Impression Channel'}
              </motion.div>

              {/* Lower 6-Tooth Arch */}
              <motion.div
                animate={{
                  y: isSpread ? 14 : -12,
                  scale: 0.92 + (spreadPercent / 100) * 0.08,
                }}
                transition={{ type: 'spring', stiffness: 170, damping: 18 }}
                className="flex items-start gap-1.5 sm:gap-2.5"
              >
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    className={`relative w-8 sm:w-11 h-9 sm:h-11 rounded-b-lg rounded-t-2xl border-2 shadow-lg overflow-hidden ${
                      isDiamondGrillz
                        ? 'border-amber-200 bg-gradient-to-t from-white via-slate-100 to-slate-300'
                        : 'border-zinc-400 bg-gradient-to-t from-white via-zinc-300 to-zinc-500'
                    }`}
                  >
                    <motion.span
                      animate={{
                        opacity: isSpread ? [0.25, 0.9, 0.25] : 0.2,
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: isSpread ? Infinity : 0,
                        delay: 0.3 + idx * 0.18,
                      }}
                      className="w-1.5 h-1.5 rotate-45 bg-white block mx-auto mt-2"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* STAGE 3: EXPLODED 3-LAYER RING BLUEPRINT */}
          {product.category === 'ring' && (
            <div className="relative z-10 max-w-2xl mx-auto min-h-[185px] flex items-center justify-center gap-3 sm:gap-9">
              {[
                { title: isOnyxRing ? 'Onyx Crown' : 'Top Crown', sub: isOnyxRing ? '18mm Cabochon' : '17mm Cross' },
                { title: isOnyxRing ? 'Diamond Inlay' : 'Side Shank', sub: isOnyxRing ? '0.9ct Pavé' : '7mm Taper' },
                { title: 'Inner Core', sub: `${product.weightGrams}g Cast` },
              ].map((band, idx) => (
                <motion.button
                  key={band.title}
                  type="button"
                  onClick={() => setActiveSpecIndex(Math.min(idx, product.hardwareSpecs.length - 1))}
                  animate={{
                    x: (1 - spreadPercent / 100) * (1 - idx) * 48,
                    scale: isSpread ? 1 : idx === 1 ? 1.06 : 0.84,
                  }}
                  transition={{ type: 'spring', stiffness: 170, damping: 20, delay: idx * 0.05 }}
                  className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-[10px] sm:border-[12px] flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden ${
                    activeSpecIndex === idx
                      ? 'border-indigo-500 ring-3 ring-indigo-500/35'
                      : isOnyxRing && idx === 0
                      ? 'border-slate-300 bg-zinc-950 text-white'
                      : isDark
                      ? 'border-zinc-500 bg-zinc-900'
                      : 'border-zinc-400 bg-white'
                  }`}
                >
                  <motion.span
                    aria-hidden="true"
                    animate={{ x: isSpread ? ['-140%', '180%'] : '-140%' }}
                    transition={{ duration: 1.4, delay: idx * 0.25, repeat: isSpread ? Infinity : 0, repeatDelay: 3 }}
                    className="absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none"
                  />
                  <span
                    className={`text-[10px] font-mono font-bold uppercase relative z-10 ${
                      isOnyxRing && idx === 0 ? 'text-white' : textColor
                    }`}
                  >
                    {band.title}
                  </span>
                  <span className={`text-[10px] font-mono relative z-10 ${mutedText}`}>{band.sub}</span>
                </motion.button>
              ))}
            </div>
          )}

          {/* STAGE 4: ARTICULATED CATENARY WALLET CHAIN EXTENSION */}
          {product.category === 'chain' && (
            <div className="relative z-10 max-w-3xl mx-auto min-h-[175px] flex flex-col items-center justify-center gap-3">
              <motion.div
                animate={{ scaleX: 0.42 + (spreadPercent / 100) * 0.58 }}
                transition={{ type: 'spring', stiffness: 145, damping: 18 }}
                className="flex items-center justify-center gap-1 sm:gap-2 w-full"
              >
                {/* Left Swivel Clasp */}
                <motion.span
                  animate={{ rotate: isSpread ? -15 : 0 }}
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full border-4 shrink-0 shadow-lg flex items-center justify-center ${
                    isImperialChain
                      ? 'border-amber-200 bg-gradient-to-br from-white to-slate-400'
                      : 'border-zinc-400 bg-gradient-to-br from-white to-zinc-500'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-zinc-900 block" />
                </motion.span>

                {[0, 1, 2, 3, 4, 5, 6, 7].map((linkIdx) => {
                  const catenaryDrop = Math.sin((linkIdx / 7) * Math.PI) * (isSpread ? 18 : 4);
                  return (
                    <motion.div
                      key={linkIdx}
                      animate={{
                        y: catenaryDrop,
                        rotate: linkIdx % 2 === 0 ? 0 : 90,
                        scale: isSpread ? 1 : 0.85,
                      }}
                      transition={{
                        delay: isSpread ? linkIdx * 0.04 : 0,
                        type: 'spring',
                        stiffness: 230,
                        damping: 20,
                      }}
                      className={`w-7 h-4 sm:w-10 sm:h-6 rounded-full border-[3px] sm:border-4 shrink-0 shadow-sm ${
                        isImperialChain
                          ? 'border-slate-200 bg-amber-100/20'
                          : 'border-zinc-400 bg-zinc-200/20'
                      }`}
                    />
                  );
                })}

                {/* Right Swivel Clasp */}
                <motion.span
                  animate={{ rotate: isSpread ? 15 : 0 }}
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full border-4 shrink-0 shadow-lg flex items-center justify-center ${
                    isImperialChain
                      ? 'border-amber-200 bg-gradient-to-br from-white to-slate-400'
                      : 'border-zinc-400 bg-gradient-to-br from-white to-zinc-500'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-zinc-900 block" />
                </motion.span>
              </motion.div>

              <span className={`text-[10px] font-mono uppercase tracking-[0.22em] ${mutedText}`}>
                {isSpread ? `Extended Drop Span · ${selectedSize} · ${product.weightGrams}g` : 'Coiled Clasp View'}
              </span>
            </div>
          )}

          {/* STAGE 5: OUTERWEAR & ARCHIVAL TOP ARTICULATED SPREAD */}
          {(product.category === 'outerwear' || product.category === 'top') && (
            <div className="relative z-10 max-w-3xl mx-auto min-h-[200px] flex flex-col items-center justify-center gap-3">
              <div className="relative flex items-center justify-center w-full py-2">
                {/* Left Sleeve Panel */}
                <motion.button
                  type="button"
                  onClick={() => setActiveSpecIndex(Math.min(1, product.hardwareSpecs.length - 1))}
                  animate={{
                    x: -10 - (spreadPercent / 100) * 32,
                    rotate: 6 + (spreadPercent / 100) * 14,
                    opacity: 0.55 + (spreadPercent / 100) * 0.45,
                  }}
                  transition={{ type: 'spring', stiffness: 165, damping: 19 }}
                  aria-label="Inspect sleeve construction"
                  className={`w-14 sm:w-20 h-28 sm:h-36 rounded-l-2xl rounded-r-md border-2 flex flex-col items-center justify-between py-2.5 cursor-pointer ${
                    activeSpecIndex === 1 ? 'ring-2 ring-indigo-500 border-indigo-500' : ''
                  } ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-900 border-zinc-800 text-white'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-zinc-400 block" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 -rotate-90 whitespace-nowrap">
                    Left Sleeve
                  </span>
                  <span className="w-6 h-1.5 rounded-full bg-zinc-600 block" />
                </motion.button>

                {/* Central Torso / Collar & Closure Axis */}
                <motion.div
                  animate={{
                    scale: 0.92 + (spreadPercent / 100) * 0.08,
                  }}
                  transition={{ type: 'spring', stiffness: 170, damping: 20 }}
                  className={`relative z-10 w-36 sm:w-48 h-36 sm:h-44 rounded-2xl border-2 flex flex-col items-center justify-between py-3 px-4 overflow-hidden shadow-xl ${
                    isDark
                      ? 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 border-zinc-600'
                      : 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 border-zinc-900 text-white'
                  }`}
                >
                  {/* Unfolding Collar / Lapel Node */}
                  <motion.button
                    type="button"
                    onClick={() => setActiveSpecIndex(0)}
                    animate={{
                      scaleX: 0.72 + (spreadPercent / 100) * 0.28,
                      y: isSpread ? -2 : 3,
                    }}
                    className={`px-3 py-1 rounded-full border text-[9px] font-mono uppercase tracking-widest cursor-pointer ${
                      activeSpecIndex === 0
                        ? 'bg-indigo-500 text-white border-indigo-400'
                        : 'bg-zinc-950/80 text-zinc-200 border-zinc-600'
                    }`}
                  >
                    Collar / Trim
                  </motion.button>

                  {/* Center Zip / Placket Track + Sliding Pull */}
                  <div className="relative h-16 sm:h-20 w-8 flex items-center justify-center">
                    <div className="w-1 h-full border-x border-dashed border-zinc-400/70" />
                    <motion.button
                      type="button"
                      onClick={() => setActiveSpecIndex(Math.min(2, product.hardwareSpecs.length - 1))}
                      animate={{ y: isSpread ? 16 : -18 }}
                      transition={{ type: 'spring', stiffness: 190, damping: 18 }}
                      aria-label="Inspect closure hardware"
                      className={`absolute w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer shadow ${
                        activeSpecIndex === 2
                          ? 'bg-indigo-500 border-white text-white'
                          : 'bg-zinc-200 border-zinc-400 text-zinc-900'
                      }`}
                    >
                      <span className="w-1.5 h-2.5 bg-current rounded-sm block" />
                    </motion.button>
                  </div>

                  {/* Hem Tension Bar */}
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                    Z1758 · Size {selectedSize}
                  </span>
                </motion.div>

                {/* Right Sleeve Panel */}
                <motion.button
                  type="button"
                  onClick={() => setActiveSpecIndex(Math.min(3, product.hardwareSpecs.length - 1))}
                  animate={{
                    x: 10 + (spreadPercent / 100) * 32,
                    rotate: -6 - (spreadPercent / 100) * 14,
                    opacity: 0.55 + (spreadPercent / 100) * 0.45,
                  }}
                  transition={{ type: 'spring', stiffness: 165, damping: 19 }}
                  aria-label="Inspect pocket and hem details"
                  className={`w-14 sm:w-20 h-28 sm:h-36 rounded-r-2xl rounded-l-md border-2 flex flex-col items-center justify-between py-2.5 cursor-pointer ${
                    activeSpecIndex === 3 ? 'ring-2 ring-indigo-500 border-indigo-500' : ''
                  } ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-900 border-zinc-800 text-white'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-zinc-400 block" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 rotate-90 whitespace-nowrap">
                    Right Sleeve
                  </span>
                  <span className="w-6 h-1.5 rounded-full bg-zinc-600 block" />
                </motion.button>
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-[0.22em] ${mutedText}`}>
                {isSpread ? `Unfolded Silhouette · ${product.weightGrams}g Construction` : 'Compact Pattern Fold'}
              </span>
            </div>
          )}

          {/* STAGE 6: DENIM FLARE CUT & HARDWARE SPREAD */}
          {product.category === 'denim' && (
            <div className="relative z-10 max-w-2xl mx-auto min-h-[210px] flex flex-col items-center justify-center gap-3">
              {/* Top Waistband */}
              <motion.button
                type="button"
                onClick={() => setActiveSpecIndex(0)}
                animate={{ scaleX: 0.88 + (spreadPercent / 100) * 0.14 }}
                className={`w-48 sm:w-64 h-9 rounded-t-xl border-2 px-4 flex items-center justify-between cursor-pointer ${
                  activeSpecIndex === 0 ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-zinc-700'
                } bg-zinc-900 text-zinc-100`}
              >
                <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Waist {selectedSize}</span>
                <span className="w-3 h-3 rounded-full bg-zinc-300 border border-zinc-600 block" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">14oz</span>
              </motion.button>

              {/* Twin Articulated Flare Legs */}
              <div className="flex items-start justify-center gap-4 sm:gap-8">
                {[0, 1].map((legIdx) => {
                  const isLeft = legIdx === 0;
                  return (
                    <motion.button
                      key={legIdx}
                      type="button"
                      onClick={() => setActiveSpecIndex(Math.min(legIdx + 1, product.hardwareSpecs.length - 1))}
                      animate={{
                        rotate: isSpread ? (isLeft ? 9 : -9) : isLeft ? 1 : -1,
                        x: isSpread ? (isLeft ? -16 : 16) : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 155, damping: 18 }}
                      style={{ transformOrigin: 'top center' }}
                      aria-label={`Inspect ${isLeft ? 'left' : 'right'} denim leg cut and hardware`}
                      className={`w-20 sm:w-28 h-32 sm:h-36 rounded-b-2xl border-2 p-2.5 flex flex-col items-center justify-between cursor-pointer relative overflow-hidden ${
                        activeSpecIndex === legIdx + 1
                          ? 'ring-2 ring-indigo-500 border-indigo-500'
                          : 'border-zinc-700'
                      } bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-800 text-white`}
                    >
                      {/* Rivet & Grommet Vertical Line */}
                      <div className="flex flex-col items-center gap-1.5">
                        {[0, 1, 2, 3].map((dot) => (
                          <motion.span
                            key={dot}
                            animate={{ scale: isSpread ? 1.15 : 0.8 }}
                            transition={{ delay: dot * 0.05 }}
                            className="w-2 h-2 rounded-full bg-zinc-300 border border-zinc-600 block"
                          />
                        ))}
                      </div>
                      {/* Flared Gusset Hem Bar */}
                      <motion.span
                        animate={{ scaleX: 0.72 + (spreadPercent / 100) * 0.36 }}
                        className="w-full h-3 rounded-md bg-zinc-700/80 border border-zinc-500/60 flex items-center justify-center text-[8px] font-mono uppercase tracking-widest text-zinc-200"
                      >
                        Flare Hem
                      </motion.span>
                    </motion.button>
                  );
                })}
              </div>

              <span className={`text-[10px] font-mono uppercase tracking-[0.22em] ${mutedText}`}>
                {isSpread ? `Full Flare Sweep · Waist ${selectedSize}` : 'Neutral Straight Profile'}
              </span>
            </div>
          )}

          {/* STAGE 7: FOOTWEAR EXPLODED UPPER & WELT LAYER STAGE */}
          {product.category === 'footwear' && (
            <div className="relative z-10 max-w-2xl mx-auto min-h-[205px] flex flex-col items-center justify-center gap-2.5">
              {/* Shaft Collar & Twin Buckle Layer */}
              <motion.button
                type="button"
                onClick={() => setActiveSpecIndex(0)}
                animate={{
                  y: isSpread ? -14 : 8,
                  scale: 0.92 + (spreadPercent / 100) * 0.08,
                }}
                transition={{ type: 'spring', stiffness: 170, damping: 19 }}
                className={`w-48 sm:w-64 h-16 sm:h-20 rounded-t-2xl border-2 px-4 flex items-center justify-between cursor-pointer ${
                  activeSpecIndex === 0 ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-zinc-700'
                } bg-gradient-to-b from-zinc-800 to-zinc-900 text-white shadow-lg`}
              >
                <div className="text-left">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block">Upper Shaft</span>
                  <span className="text-xs font-bold">Straps & Collar</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="w-10 h-2 rounded-full bg-zinc-300 border border-zinc-600 block" />
                  <span className="w-8 h-2 rounded-full bg-zinc-400 border border-zinc-600 block ml-auto" />
                </div>
              </motion.button>

              {/* Side-Zip & Vamp Layer */}
              <motion.button
                type="button"
                onClick={() => setActiveSpecIndex(Math.min(1, product.hardwareSpecs.length - 1))}
                animate={{ scaleX: 0.88 + (spreadPercent / 100) * 0.12 }}
                className={`w-56 sm:w-72 h-10 rounded-xl border px-4 flex items-center justify-between cursor-pointer ${
                  activeSpecIndex === 1
                    ? 'bg-indigo-600 border-indigo-400 text-white'
                    : isDark
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
                    : 'bg-white border-zinc-300 text-zinc-900'
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Lasted Vamp</span>
                <span className="text-[10px] font-mono uppercase tracking-wider opacity-80">EU {selectedSize}</span>
              </motion.button>

              {/* Storm-Welt / Outsole Layer */}
              <motion.button
                type="button"
                onClick={() => setActiveSpecIndex(Math.min(2, product.hardwareSpecs.length - 1))}
                animate={{
                  y: isSpread ? 14 : -8,
                  scale: 0.92 + (spreadPercent / 100) * 0.08,
                }}
                transition={{ type: 'spring', stiffness: 170, damping: 19 }}
                className={`w-60 sm:w-80 h-11 rounded-b-2xl border-2 px-5 flex items-center justify-between cursor-pointer ${
                  activeSpecIndex === 2 ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-zinc-800'
                } bg-zinc-950 text-zinc-100 shadow-xl`}
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Welt & Sole</span>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((lug) => (
                    <span key={lug} className="w-3 h-2 rounded-b-sm bg-zinc-600 block" />
                  ))}
                </div>
              </motion.button>
            </div>
          )}

          {/* STAGE 8: BAG & BRACELET ARTICULATED HARDWARE SPREAD */}
          {(product.category === 'bag' || product.category === 'bracelet') && (
            <div className="relative z-10 max-w-2xl mx-auto min-h-[195px] flex flex-col items-center justify-center gap-3">
              {product.category === 'bag' ? (
                <>
                  {/* Lifting Flap & Strap Arch */}
                  <motion.button
                    type="button"
                    onClick={() => setActiveSpecIndex(0)}
                    animate={{ y: isSpread ? -12 : 6 }}
                    transition={{ type: 'spring', stiffness: 170, damping: 18 }}
                    className={`w-48 sm:w-64 h-12 rounded-t-3xl border-2 flex items-center justify-center gap-2 cursor-pointer ${
                      activeSpecIndex === 0 ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-zinc-700'
                    } bg-zinc-900 text-white`}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Cross Flap & Strap</span>
                  </motion.button>
                  <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">
                    <motion.button
                      type="button"
                      onClick={() => setActiveSpecIndex(Math.min(1, product.hardwareSpecs.length - 1))}
                      animate={{ x: isSpread ? -18 : 8 }}
                      transition={{ type: 'spring', stiffness: 165, damping: 18 }}
                      className={`w-20 sm:w-28 h-20 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer ${
                        activeSpecIndex === 1 ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-zinc-700'
                      } bg-zinc-950 text-zinc-200`}
                    >
                      <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">Left Bellows</span>
                      <span className="text-[11px] font-bold mt-0.5">Cargo Pocket</span>
                    </motion.button>
                    <motion.div
                      animate={{ scale: isSpread ? 1.08 : 0.92 }}
                      className="w-12 h-12 rounded-xl border-2 border-zinc-400 bg-zinc-800 flex items-center justify-center shadow-lg"
                    >
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        <span className="w-1.5 h-full bg-zinc-200 rounded-xs block" />
                        <span className="h-1.5 w-full bg-zinc-200 rounded-xs absolute block" />
                      </div>
                    </motion.div>
                    <motion.button
                      type="button"
                      onClick={() => setActiveSpecIndex(Math.min(2, product.hardwareSpecs.length - 1))}
                      animate={{ x: isSpread ? 18 : -8 }}
                      transition={{ type: 'spring', stiffness: 165, damping: 18 }}
                      className={`w-20 sm:w-28 h-20 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer ${
                        activeSpecIndex === 2 ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-zinc-700'
                      } bg-zinc-950 text-zinc-200`}
                    >
                      <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">Right Bellows</span>
                      <span className="text-[11px] font-bold mt-0.5">Cargo Pocket</span>
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ scaleX: 0.48 + (spreadPercent / 100) * 0.52 }}
                    transition={{ type: 'spring', stiffness: 150, damping: 18 }}
                    className="flex items-center justify-center gap-1.5 sm:gap-2.5"
                  >
                    {[0, 1, 2].map((l) => (
                      <span key={`l-${l}`} className="w-8 h-5 rounded-full border-4 border-zinc-400 bg-zinc-200/15 block" />
                    ))}
                    <motion.button
                      type="button"
                      onClick={() => setActiveSpecIndex(0)}
                      animate={{ scale: isSpread ? 1.08 : 0.95 }}
                      className={`px-5 py-3 rounded-xl border-2 bg-zinc-950 text-white cursor-pointer ${
                        activeSpecIndex === 0 ? 'border-indigo-500 ring-2 ring-indigo-500/40' : 'border-zinc-400'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest block">Onyx Bar</span>
                    </motion.button>
                    {[0, 1, 2].map((r) => (
                      <span key={`r-${r}`} className="w-8 h-5 rounded-full border-4 border-zinc-400 bg-zinc-200/15 block" />
                    ))}
                  </motion.div>
                  <motion.button
                    type="button"
                    onClick={() => setActiveSpecIndex(Math.min(1, product.hardwareSpecs.length - 1))}
                    animate={{ rotate: isSpread ? [0, -6, 6, 0] : 0 }}
                    transition={{ duration: 1.8, repeat: isSpread ? Infinity : 0, repeatDelay: 2 }}
                    className={`px-3.5 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-widest cursor-pointer ${
                      activeSpecIndex === 1 ? 'bg-indigo-600 text-white border-indigo-500' : outlineBtn
                    }`}
                  >
                    Hanging Cross Charm · Wrist {selectedSize}
                  </motion.button>
                </>
              )}
            </div>
          )}

          {/* Interactive Spec Callout Selector Bar */}
          <div className="relative z-10 mt-6 pt-5 border-t border-zinc-500/20 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-7 flex flex-wrap gap-2">
              {product.hardwareSpecs.map((spec, idx) => {
                const selected = idx === activeSpecIndex;
                return (
                  <button
                    key={spec.label}
                    type="button"
                    onClick={() => setActiveSpecIndex(idx)}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      selected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/25'
                        : outlineBtn
                    }`}
                  >
                    <span className="font-mono opacity-65 mr-1.5">0{idx + 1}</span>
                    {spec.label}
                  </button>
                );
              })}
            </div>
            {activeSpec && (
              <motion.div
                key={activeSpec.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className={`lg:col-span-5 rounded-2xl border p-3.5 ${
                  isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-[11px] font-mono uppercase tracking-wider font-bold ${mutedText}`}>
                    {activeSpec.label}
                  </span>
                  <span className={`text-xs font-mono font-bold ${textColor}`}>
                    {activeSpec.value}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed ${mutedText}`}>{activeSpec.detail}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Main 2-Column Photography + Purchase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Left: 4:3 Studio Photo Gallery (Full Color) */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          {(() => {
            const currentImg = product.galleryImages[selectedImageIdx] || product.imageUrl;
            const currentImgIsWhite = currentImg.includes('/images/catalog/');
            return (
              <div
                className={`aspect-[4/3] w-full rounded-3xl border overflow-hidden relative ${
                  currentImgIsWhite ? 'bg-white border-zinc-200' : subtleBg
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImg}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.28 }}
                    src={currentImg}
                    alt={`${product.name} studio photograph`}
                    className={`w-full h-full object-center ${
                      currentImgIsWhite ? 'object-contain p-3 sm:p-5' : 'object-cover'
                    }`}
                  />
                </AnimatePresence>
              </div>
            );
          })()}

          {product.galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.galleryImages.map((img, idx) => {
                const thumbIsWhite = img.includes('/images/catalog/');
                return (
                  <button
                    key={img + idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`aspect-[4/3] min-h-[44px] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      thumbIsWhite ? 'bg-white' : ''
                    } ${
                      idx === selectedImageIdx
                        ? 'border-indigo-500 ring-2 ring-indigo-500/25'
                        : isDark
                        ? 'border-zinc-800 opacity-65 hover:opacity-100'
                        : 'border-zinc-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className={`w-full h-full ${thumbIsWhite ? 'object-contain p-1' : 'object-cover'}`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Title, Price, Size Selector & Add to Bag */}
        <div className={`lg:col-span-5 rounded-3xl border p-5 sm:p-8 space-y-6 ${panelBg}`}>
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className={`text-xs font-mono uppercase tracking-[0.2em] font-semibold flex items-center gap-1.5 ${mutedText}`}>
                {isReserve && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                <span>{product.edition || `Z1758 · ${product.category}`}</span>
              </span>
              <span className={`flex items-center gap-1 text-xs font-mono font-bold ${textColor}`}>
                <span>{product.rating}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </span>
            </div>

            <h1 className={`font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight ${textColor}`}>
              {product.name}
            </h1>

            <div className={`mt-3 flex items-baseline gap-3 ${textColor}`}>
              <span className="text-2xl sm:text-3xl font-mono font-bold tabular-nums">
                {formatPrice(product.price, currency)}
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-500 font-bold">
                · In Stock
              </span>
            </div>
          </div>

          <div className="space-y-2.5 text-sm leading-relaxed">
            <p className={`font-semibold ${textColor}`}>{product.description}</p>
            <p className={mutedText}>{product.longDescription}</p>
          </div>

          {/* Spec Rows */}
          <div className={`border-y py-4 space-y-2.5 text-xs ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <div className="flex justify-between gap-4">
              <span className={`font-mono uppercase ${mutedText}`}>Material</span>
              <span className={`font-semibold text-right ${textColor}`}>{product.material}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className={`font-mono uppercase ${mutedText}`}>Finish</span>
              <span className={`font-semibold text-right ${textColor}`}>{product.finish}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className={`font-mono uppercase ${mutedText}`}>Hardware Weight</span>
              <span className={`font-mono font-bold ${textColor}`}>{product.weightGrams} g</span>
            </div>
          </div>

          {/* Size / Fit Selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className={`text-xs font-mono uppercase tracking-wider font-bold ${mutedText}`}>
                Select{' '}
                {product.category === 'belt' || product.category === 'denim'
                  ? 'Waist Size'
                  : product.category === 'grillz'
                  ? 'Fit Option'
                  : product.category === 'footwear'
                  ? 'EU Size'
                  : product.category === 'bracelet'
                  ? 'Wrist Size'
                  : product.category === 'bag'
                  ? 'Dimensions'
                  : product.category === 'outerwear' || product.category === 'top'
                  ? 'Garment Size'
                  : 'Size'}
              </span>
              <span className={`text-xs font-mono font-bold ${textColor}`}>{selectedSize}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-h-[44px] min-w-[48px] px-3.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      active ? primaryBtn + ' border-transparent' : outlineBtn
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5" />}
                    <span>{size}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Purchase Action */}
          <div className="space-y-3 pt-1">
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onAddToCart(product, selectedSize)}
              className={`w-full min-h-[52px] py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg ${primaryBtn}`}
            >
              <Plus className="w-5 h-5" />
              <span>Add to Bag · {formatPrice(product.price, currency)}</span>
            </motion.button>

            <div className={`grid grid-cols-2 gap-2 pt-1 text-[11px] ${mutedText}`}>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 shrink-0" />
                <span>Insured 3–5 day courier</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Authenticated Vault Piece</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Accessories */}
      {relatedProducts.length > 0 && (
        <section className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-display text-lg sm:text-xl font-black tracking-tight ${textColor}`}>
              Pair With Other Z1758 Hardware
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {relatedProducts.map((item) => (
              <motion.button
                key={item.id}
                type="button"
                whileHover={{ y: -3 }}
                onClick={() => onSelectProduct(item)}
                className={`text-left rounded-2xl border p-3.5 flex items-center gap-3.5 transition-shadow cursor-pointer ${panelBg}`}
              >
                <div
                  className={`w-20 aspect-[4/3] rounded-xl overflow-hidden shrink-0 ${
                    item.imageUrl.includes('/images/catalog/') ? 'bg-white border border-zinc-200' : subtleBg
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className={`w-full h-full ${
                      item.imageUrl.includes('/images/catalog/') ? 'object-contain p-1' : 'object-cover'
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className={`text-[10px] font-mono uppercase tracking-widest block ${mutedText}`}>
                    {item.category}
                  </span>
                  <p className={`font-display font-bold text-sm truncate ${textColor}`}>
                    {item.name}
                  </p>
                  <p className={`text-xs font-mono font-bold mt-1 ${textColor}`}>
                    {formatPrice(item.price, currency)}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* Product Reviews */}
      <section className={`rounded-3xl border p-5 sm:p-8 ${panelBg}`}>
        <Reviews productId={product.id} theme={theme} />
      </section>
    </motion.div>
  );
});
