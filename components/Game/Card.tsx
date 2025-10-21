'use client';

import { Card as CardType } from '@/lib/types/game';
import { SUIT_SYMBOLS, RANK_NAMES } from '@/lib/game/constants';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  faceDown?: boolean;
  isWinning?: boolean;
}

export function Card({ card, onClick, disabled, size = 'medium', faceDown, isWinning }: CardProps) {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  const isLeon = card.rank === 'LEON';

  const sizeClasses = {
    small: 'w-12 h-16 text-xs',
    medium: 'w-16 h-24 text-sm',
    large: 'w-20 h-28 text-base',
  };

  if (faceDown) {
    return (
      <motion.div
        className={clsx(
          'rounded-lg border-2 border-gray-400 bg-gradient-to-br from-blue-900 to-blue-700',
          'flex items-center justify-center cursor-pointer shadow-lg',
          sizeClasses[size]
        )}
        initial={{ rotateY: 180 }}
        animate={{ rotateY: 0 }}
        whileHover={{ scale: onClick ? 1.05 : 1, rotateY: onClick ? 5 : 0 }}
        whileTap={{ scale: onClick ? 0.95 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={onClick}
      >
        <div className="text-white text-2xl font-bold">🎴</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={clsx(
        'rounded-lg border-2 bg-white shadow-lg cursor-pointer transition-all relative overflow-hidden',
        sizeClasses[size],
        isLeon ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-100' : 'border-gray-300',
        isRed ? 'text-red-600' : 'text-gray-900',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && onClick && 'hover:shadow-xl',
        isWinning && 'ring-4 ring-yellow-400 shadow-2xl'
      )}
      initial={{ rotateY: 180, scale: 0.8 }}
      animate={{
        rotateY: 0,
        scale: 1,
        y: isWinning ? [-5, 0, -5] : 0
      }}
      whileHover={{
        scale: !disabled && onClick ? 1.1 : 1,
        rotate: !disabled && onClick ? [0, -2, 2, -2, 0] : 0,
        y: !disabled && onClick ? -10 : 0
      }}
      whileTap={{ scale: !disabled && onClick ? 0.95 : 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        y: { repeat: isWinning ? Infinity : 0, duration: 1.5 }
      }}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Effet de brillance pour le Léon */}
      {isLeon && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/50 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
        />
      )}

      {/* Effet de victoire */}
      {isWinning && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/30 to-yellow-400/0"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        />
      )}

      <div className="h-full flex flex-col justify-between p-2 relative z-10">
        {/* Top corner */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isLeon ? (
            <>
              <motion.div
                className="text-2xl"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              >
                🃏
              </motion.div>
              <div className="text-xs font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">LEON</div>
            </>
          ) : (
            <>
              <div className="font-bold">{card.rank}</div>
              <motion.div
                className="text-xl"
                animate={onClick && !disabled ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {SUIT_SYMBOLS[card.suit as keyof typeof SUIT_SYMBOLS]}
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Center symbol */}
        <div className="flex-1 flex items-center justify-center">
          {isLeon ? (
            <motion.div
              className="text-4xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ⭐
            </motion.div>
          ) : (
            <div className="text-3xl">{SUIT_SYMBOLS[card.suit as keyof typeof SUIT_SYMBOLS]}</div>
          )}
        </div>

        {/* Bottom corner (rotated) */}
        <motion.div
          className="flex flex-col items-center rotate-180"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isLeon ? (
            <>
              <motion.div
                className="text-2xl"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              >
                🃏
              </motion.div>
              <div className="text-xs font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">LEON</div>
            </>
          ) : (
            <>
              <div className="font-bold">{card.rank}</div>
              <div className="text-xl">{SUIT_SYMBOLS[card.suit as keyof typeof SUIT_SYMBOLS]}</div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
