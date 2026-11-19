import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Truck, RotateCcw, Gem, ShieldCheck } from 'lucide-react';
import { Theme } from '../types';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'shipping',
    question: 'How long does shipping take and what are the delivery fees?',
    answer:
      'Orders are processed within 24 hours after verification and delivered within 3–5 business days. Shipping is ৳70 inside Dhaka and ৳130 outside Dhaka. You can track live status updates anytime in your Profile under Order Tracking.',
    icon: Truck,
  },
  {
    id: 'returns',
    question: 'What is your return, exchange, and cancellation policy?',
    answer:
      'You can cancel any order directly from your Profile while its status is Processing. For delivered items, we offer a 7-day return or exchange window for unworn pieces in original condition and packaging. Reach out to our customer service line with your Order ID to initiate a return.',
    icon: RotateCcw,
  },
  {
    id: 'materials',
    question: 'What materials are used and how should I care for my pieces?',
    answer:
      'Z1758 belts, grillz, gothic rings, and wallet chains are crafted from 4mm vegetable-tanned full-grain bridle leather, oxidized sterling-toned hardware, and body-safe 316L stainless steel. Wipe chrome hardware with a dry microfiber cloth, condition leather periodically, and store grillz in their protective case after rinsing.',
    icon: Gem,
  },
  {
    id: 'security',
    question: 'Why is email verification required before placing an order?',
    answer:
      'Email verification protects your account, prevents unauthorized orders, and ensures your purchase history, delivery details, and order cancellation controls remain accessible only to you.',
    icon: ShieldCheck,
  },
];

interface FooterFAQProps {
  theme: Theme;
}

export function FooterFAQ({ theme }: FooterFAQProps) {
  const [openId, setOpenId] = useState<string | null>('shipping');
  const isDark = theme === 'dark';

  const footerBg = isDark
    ? 'bg-zinc-950/90 border-zinc-800 text-zinc-100'
    : 'bg-white/85 border-zinc-200 text-zinc-900';
  const itemBg = isDark
    ? 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
    : 'bg-[#F7F7F5]/70 border-zinc-200 hover:border-zinc-400';
  const subText = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const iconWrap = isDark
    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
    : 'bg-zinc-950 text-white';

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <footer className={`w-full border-t backdrop-blur-md relative z-10 transition-colors duration-300 ${footerBg}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <span className={`text-xs font-mono font-bold uppercase tracking-[0.2em] ${subText}`}>
            Z1758 Archive &amp; Support
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight mt-2">
            Frequently Asked Questions
          </h2>
          <p className={`text-sm mt-2 ${subText}`}>
            Essential details on shipping, returns, material quality, and order verification.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-colors overflow-hidden ${itemBg}`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconWrap}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm sm:text-base leading-snug">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-300 ${subText} ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className={`px-5 pb-5 pl-[4.25rem] text-sm leading-relaxed ${subText}`}>
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div
          className={`mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
            isDark ? 'border-zinc-800 text-zinc-500' : 'border-zinc-200 text-zinc-500'
          }`}
        >
          <span className="font-display font-bold tracking-widest uppercase">Z1758</span>
          <span className="font-mono">Support: +880 1705-128340</span>
        </div>
      </div>
    </footer>
  );
}
