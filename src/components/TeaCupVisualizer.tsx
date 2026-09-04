import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface TeaCupVisualizerProps {
  count: number;
  dailyGoal: number;
  onAddCup?: () => void;
  selectedTeaColor?: string;
  isAdding?: boolean;
}

export const TeaCupVisualizer: React.FC<TeaCupVisualizerProps> = ({
  count,
  dailyGoal,
  onAddCup,
  selectedTeaColor = '#b45309',
  isAdding = false,
}) => {
  const progressRatio = Math.min(1, Math.max(0.15, count / Math.max(1, dailyGoal)));
  // SVG cup height is 120, liquid height range: 18 (empty) to 90 (full)
  const liquidHeight = Math.min(96, Math.max(18, count === 0 ? 12 : Math.min(94, 20 + (count / dailyGoal) * 74)));

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      {/* Steaming vapor particles if count > 0 */}
      <div className="h-10 relative w-32 flex justify-center items-end overflow-hidden mb-1 pointer-events-none">
        {count > 0 && (
          <>
            <motion.div
              initial={{ y: 15, opacity: 0, scale: 0.8 }}
              animate={{
                y: [-2, -24],
                opacity: [0, 0.7, 0],
                x: [-4, 6, -2],
                scale: [0.8, 1.2, 1.4],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-2.5 h-7 rounded-full bg-amber-400/40 blur-[2px]"
            />
            <motion.div
              initial={{ y: 15, opacity: 0, scale: 0.8 }}
              animate={{
                y: [-2, -28],
                opacity: [0, 0.8, 0],
                x: [4, -6, 2],
                scale: [0.8, 1.3, 1.5],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                delay: 0.7,
                ease: 'easeInOut',
              }}
              className="absolute w-3 h-8 rounded-full bg-orange-300/45 blur-[2.5px]"
            />
            <motion.div
              initial={{ y: 15, opacity: 0, scale: 0.8 }}
              animate={{
                y: [-2, -22],
                opacity: [0, 0.6, 0],
                x: [-8, 2, -4],
                scale: [0.7, 1.1, 1.3],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: 1.3,
                ease: 'easeInOut',
              }}
              className="absolute w-2 h-6 rounded-full bg-amber-200/50 blur-[2px]"
            />
          </>
        )}
      </div>

      {/* Main Cup Button Container */}
      <motion.button
        id="tea-cup-main-tap"
        type="button"
        onClick={onAddCup}
        whileTap={{ scale: 0.94 }}
        animate={isAdding ? { scale: [1, 1.08, 0.97, 1] } : { scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative group cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-500/20 rounded-full p-2 transition-transform"
        aria-label="Tap to add a cup of tea"
      >
        <svg
          width="170"
          height="140"
          viewBox="0 0 170 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg filter transition-all duration-300 group-hover:drop-shadow-xl"
        >
          <defs>
            {/* Liquid Gradient */}
            <linearGradient id="teaLiquidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.95" />
              <stop offset="40%" stopColor={selectedTeaColor} stopOpacity="0.98" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="1" />
            </linearGradient>

            {/* Cup Ceramic Gloss */}
            <linearGradient id="cupCeramic" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fafaf9" />
              <stop offset="80%" stopColor="#f5f5f4" />
              <stop offset="100%" stopColor="#e7e5e4" />
            </linearGradient>

            {/* Saucer Gradient */}
            <linearGradient id="saucerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#d6d3d1" />
            </linearGradient>

            {/* Clip path to keep liquid strictly inside the ceramic cup body */}
            <clipPath id="cupInteriorClip">
              <path d="M 28 28 L 38 108 C 40 118, 106 118, 108 108 L 118 28 Z" />
            </clipPath>
          </defs>

          {/* Saucer Base */}
          <ellipse cx="73" cy="126" rx="64" ry="10" fill="url(#saucerGrad)" stroke="#d6d3d1" strokeWidth="2" />
          <ellipse cx="73" cy="125" rx="46" ry="5" fill="#e7e5e4" opacity="0.6" />

          {/* Cup Handle (Right) */}
          <path
            d="M 108 42 C 142 42, 145 92, 104 94"
            fill="none"
            stroke="url(#cupCeramic)"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path
            d="M 108 42 C 142 42, 145 92, 104 94"
            fill="none"
            stroke="#d6d3d1"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Outer Cup Body */}
          <path
            d="M 26 26 L 37 110 C 39 122, 107 122, 109 110 L 120 26 Z"
            fill="url(#cupCeramic)"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />

          {/* Cup Liquid (masked inside cup) */}
          <g clipPath="url(#cupInteriorClip)">
            {/* Background Empty Cup Shadow */}
            <rect x="20" y="20" width="110" height="105" fill="#f1f5f9" />

            {/* Tea Liquid Level */}
            {count > 0 && (
              <motion.g
                initial={{ y: 20 }}
                animate={{ y: 115 - liquidHeight }}
                transition={{ type: 'spring', damping: 18, stiffness: 140 }}
              >
                {/* Liquid Rectangle */}
                <rect x="20" y="0" width="110" height="120" fill="url(#teaLiquidGrad)" />

                {/* Foam / Tea surface meniscus */}
                <ellipse cx="73" cy="0" rx="38" ry="6" fill="#fef08a" opacity="0.85" />
                <ellipse cx="73" cy="1" rx="35" ry="4" fill="#fef9c3" opacity="0.65" />
                {/* Small bubble dots */}
                <circle cx="58" cy="-1" r="1.5" fill="#ffffff" opacity="0.8" />
                <circle cx="84" cy="0" r="1.8" fill="#ffffff" opacity="0.75" />
                <circle cx="72" cy="1" r="1.2" fill="#ffffff" opacity="0.9" />
              </motion.g>
            )}
          </g>

          {/* Cup Rim Highlight */}
          <ellipse cx="73" cy="26" rx="47" ry="9" fill="none" stroke="#f8fafc" strokeWidth="3" />
          <ellipse cx="73" cy="26" rx="47" ry="9" fill="none" stroke="#cbd5e1" strokeWidth="1" />

          {/* Gloss Reflection overlay on cup */}
          <path
            d="M 33 34 L 41 104 C 41 104, 46 108, 50 108 L 43 34 Z"
            fill="#ffffff"
            opacity="0.45"
          />
        </svg>

        {/* Count Overlay Badge on the cup */}
        <div className="absolute top-[52%] left-[43%] -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center justify-center">
          <motion.span
            key={count}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
            className={`font-black tracking-tight ${
              count > 0 ? 'text-amber-950 drop-shadow-sm' : 'text-stone-400'
            } ${count > 99 ? 'text-2xl' : 'text-3xl'}`}
          >
            {count}
          </motion.span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70 -mt-1">
            {count === 1 ? 'Cup' : 'Cups'}
          </span>
        </div>

        {/* Milestone Sparkle Icon when goal is reached */}
        {count >= dailyGoal && dailyGoal > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-8 right-5 bg-amber-500 text-white rounded-full p-1.5 shadow-md border-2 border-white"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        )}
      </motion.button>

      {/* Helper text under the cup */}
      <div className="text-center mt-1">
        <p className="text-xs font-medium text-stone-500">
          Tap cup or <span className="font-semibold text-amber-800">+1</span> button to log tea
        </p>
      </div>
    </div>
  );
};
