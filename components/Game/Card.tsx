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
}

export function Card({ card, onClick, disabled, size = 'medium', faceDown }: CardProps) {
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
        whileHover={{ scale: onClick ? 1.05 : 1 }}
        whileTap={{ scale: onClick ? 0.95 : 1 }}
        onClick={onClick}
      >
        <div className="text-white text-2xl font-bold">🎴</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={clsx(
        'rounded-lg border-2 bg-white shadow-lg cursor-pointer transition-all',
        sizeClasses[size],
        isLeon ? 'border-leon-gold bg-gradient-to-br from-yellow-50 to-yellow-100' : 'border-gray-300',
        isRed ? 'text-red-600' : 'text-gray-900',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && onClick && 'hover:shadow-xl hover:-translate-y-1'
      )}
      whileHover={{ scale: !disabled && onClick ? 1.05 : 1 }}
      whileTap={{ scale: !disabled && onClick ? 0.95 : 1 }}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="h-full flex flex-col justify-between p-2">
        {/* Top corner */}
        <div className="flex flex-col items-center">
          {isLeon ? (
            <>
              <div className="text-2xl">🃏</div>
              <div className="text-xs font-bold">LEON</div>
            </>
          ) : (
            <>
              <div className="font-bold">{card.rank}</div>
              <div className="text-xl">{SUIT_SYMBOLS[card.suit as keyof typeof SUIT_SYMBOLS]}</div>
            </>
          )}
        </div>

        {/* Center symbol */}
        <div className="flex-1 flex items-center justify-center">
          {isLeon ? (
            <div className="text-4xl">⭐</div>
          ) : (
            <div className="text-3xl">{SUIT_SYMBOLS[card.suit as keyof typeof SUIT_SYMBOLS]}</div>
          )}
        </div>

        {/* Bottom corner (rotated) */}
        <div className="flex flex-col items-center rotate-180">
          {isLeon ? (
            <>
              <div className="text-2xl">🃏</div>
              <div className="text-xs font-bold">LEON</div>
            </>
          ) : (
            <>
              <div className="font-bold">{card.rank}</div>
              <div className="text-xl">{SUIT_SYMBOLS[card.suit as keyof typeof SUIT_SYMBOLS]}</div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
