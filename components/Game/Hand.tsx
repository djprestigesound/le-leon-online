'use client';

import { Card as CardType } from '@/lib/types/game';
import { Card } from './Card';
import { motion } from 'framer-motion';

interface HandProps {
  cards: CardType[];
  onCardClick?: (card: CardType) => void;
  disabled?: boolean;
}

export function Hand({ cards, onCardClick, disabled }: HandProps) {
  return (
    <div className="flex justify-center items-end gap-2 flex-wrap">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card
            card={card}
            onClick={onCardClick ? () => onCardClick(card) : undefined}
            disabled={disabled}
            size="medium"
          />
        </motion.div>
      ))}
    </div>
  );
}
