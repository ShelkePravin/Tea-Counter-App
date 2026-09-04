import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HardDrive } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  appName?: string;
  subtitle?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  appName = 'Tea Counter',
  subtitle = 'Daily Chai & Tea Tracker',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Splash screen visible for ~1.8s then smooth exit transition
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="splash-screen"
          id="app-splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: 'blur(4px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-gradient-to-b from-amber-950 via-amber-900 to-stone-950 text-white p-8 select-none"
        >
          {/* Top subtle badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-200/90 text-xs font-medium backdrop-blur-sm border border-white/10"
          >
            <HardDrive className="w-3 h-3 text-amber-300" />
            <span>100% Offline Device Storage</span>
          </motion.div>

          {/* Central Logo & Brand Animation */}
          <div className="flex flex-col items-center text-center my-auto">
            {/* Animated Tea Cup with Steam */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              {/* Subtle ambient glow */}
              <div className="absolute -inset-4 bg-amber-500/20 rounded-full blur-xl animate-pulse" />

              {/* App Icon Container */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-amber-600 to-amber-950 p-1 shadow-2xl border border-amber-500/30 flex items-center justify-center overflow-hidden">
                <img
                  src="/pwa-192x192.png"
                  alt="Tea Counter Logo"
                  className="w-full h-full object-contain rounded-[22px] drop-shadow-md"
                  onError={(e) => {
                    // Fallback to SVG if PNG is not immediately ready
                    (e.target as HTMLImageElement).src = '/icon.svg';
                  }}
                />
              </div>

              {/* Animated rising steam wisps */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0.3, 0.8, 0.3], y: [-4, -14, -4] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none"
              >
                <div className="w-1.5 h-4 bg-amber-200/60 rounded-full blur-[0.5px]" />
                <div className="w-2 h-6 bg-amber-100/70 rounded-full blur-[0.5px]" />
                <div className="w-1.5 h-4 bg-amber-200/60 rounded-full blur-[0.5px]" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-50"
            >
              {appName}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-sm text-amber-200/80 font-medium mt-1.5 max-w-xs"
            >
              {subtitle}
            </motion.p>
          </div>

          {/* Bottom Loading Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="w-full max-w-xs flex flex-col items-center gap-3"
          >
            {/* Progress bar */}
            <div className="w-48 h-1.5 bg-white/15 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-amber-400 to-amber-200 rounded-full"
              />
            </div>
            <p className="text-[11px] text-amber-300/70 tracking-wide font-mono">
              Loading local storage...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
