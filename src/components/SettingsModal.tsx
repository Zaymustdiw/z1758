import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, Moon } from 'lucide-react';
import { Currency, Theme } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export function SettingsModal({ isOpen, onClose, currency, setCurrency, theme, setTheme }: SettingsModalProps) {
  const isDark = theme === 'dark';
  const modalBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-300' : 'text-zinc-700';
  const selectedBtn = isDark
    ? 'bg-zinc-100 border-zinc-100 text-zinc-950 shadow-sm'
    : 'bg-zinc-950 border-zinc-950 text-white shadow-sm';
  const unselectedBg = isDark
    ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
    : 'bg-[#F7F7F5] border-zinc-200 text-zinc-700 hover:bg-zinc-100';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            className={`relative w-full max-w-sm rounded-3xl shadow-2xl p-6 border ${modalBg}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold flex items-center gap-2 ${textColor}`}>
                <Globe className="w-5 h-5" />
                Settings
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className={`text-sm font-bold block mb-3 ${subTextColor}`}>Currency</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCurrency('BDT')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border cursor-pointer ${
                      currency === 'BDT' ? selectedBtn : unselectedBg
                    }`}
                  >
                    ৳ BDT (Taka)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border cursor-pointer ${
                      currency === 'USD' ? selectedBtn : unselectedBg
                    }`}
                  >
                    $ USD
                  </button>
                </div>
              </div>

              <div>
                <label className={`text-sm font-bold flex items-center gap-2 mb-3 ${subTextColor}`}>
                  <Moon className="w-4 h-4" />
                  Theme Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border cursor-pointer ${
                      theme === 'light' ? selectedBtn : unselectedBg
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border cursor-pointer ${
                      theme === 'dark' ? selectedBtn : unselectedBg
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`mt-8 pt-4 border-t text-center text-xs ${
                isDark ? 'border-zinc-800 text-zinc-500' : 'border-zinc-200 text-zinc-500'
              }`}
            >
              Z1758 preferences are applied immediately.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
