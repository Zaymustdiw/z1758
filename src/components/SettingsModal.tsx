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
  const isDark = theme === 'dark' || theme === 'gothic';
  const modalBg = theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : theme === 'gothic' ? 'bg-black border-red-900' : 'bg-white/90 border-white';
  const textColor = theme === 'gothic' ? 'text-red-100' : isDark ? 'text-zinc-100' : 'text-gray-800';
  const subTextColor = theme === 'gothic' ? 'text-red-300' : isDark ? 'text-zinc-300' : 'text-gray-700';
  const unselectedBg = theme === 'gothic' ? 'bg-black border-red-900 text-red-300 hover:bg-red-950' : isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-sm backdrop-blur-xl rounded-3xl shadow-2xl p-6 border ${modalBg}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold flex items-center gap-2 ${textColor}`}>
                <Globe className="w-5 h-5 text-pink-500" />
                Settings
              </h2>
              <button 
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
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
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border ${
                      currency === 'BDT' 
                        ? 'bg-pink-50 border-pink-400 text-pink-600 shadow-sm' 
                        : unselectedBg
                    }`}
                  >
                    ৳ BDT (Taka)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border ${
                      currency === 'USD' 
                        ? 'bg-pink-50 border-pink-400 text-pink-600 shadow-sm' 
                        : unselectedBg
                    }`}
                  >
                    $ USD
                  </button>
                </div>
              </div>

              <div>
                <label className={`text-sm font-bold flex items-center gap-2 mb-3 ${subTextColor}`}>
                  <Moon className="w-4 h-4 text-purple-500" />
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border ${
                      theme === 'light' 
                        ? 'bg-pink-50 border-pink-400 text-pink-600 shadow-sm' 
                        : unselectedBg
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border ${
                      theme === 'dark' 
                        ? 'bg-zinc-800 border-zinc-500 text-zinc-100 shadow-sm ring-2 ring-zinc-500' 
                        : unselectedBg
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setTheme('gothic')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border ${
                      theme === 'gothic' 
                        ? 'bg-black border-red-500 text-red-500 shadow-sm ring-2 ring-red-500' 
                        : unselectedBg
                    }`}
                  >
                    Gothic
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`mt-8 pt-4 border-t text-center text-xs ${isDark ? 'border-zinc-800 text-zinc-500' : 'border-gray-100 text-gray-400'}`}>
              Settings are saved automatically.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
