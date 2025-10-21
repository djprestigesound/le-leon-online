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
  const totalCards = cards.length;
  const maxRotation = 20; // Degrés max de rotation
  const maxSpread = 60; // Pixels max d'espacement horizontal

  return (
    <div className="relative flex justify-center items-end" style={{ minHeight: '150px' }}>
      {cards.map((card, index) => {
        // Calculer la rotation et position pour l'effet fan
        const centerIndex = (totalCards - 1) / 2;
        const offsetFromCenter = index - centerIndex;
        const rotation = (offsetFromCenter / totalCards) * maxRotation;
        const xOffset = offsetFromCenter * (maxSpread / totalCards);
        const yOffset = Math.abs(offsetFromCenter) * 5; // Légère courbe verticale

        return (
          <motion.div
            key={card.id}
            initial={{
              opacity: 0,
              y: 100,
              x: 0,
              rotate: 0,
              scale: 0.5
            }}
            animate={{
              opacity: 1,
              y: yOffset,
              x: xOffset,
              rotate: rotation,
              scale: 1
            }}
            whileHover={{
              y: -20,
              rotate: 0,
              scale: 1.1,
              zIndex: 50,
              transition: { duration: 0.2 }
            }}
            exit={{
              opacity: 0,
              y: -200,
              rotate: rotation * 2,
              scale: 0.8,
              transition: { duration: 0.5 }
            }}
            transition={{
              delay: index * 0.08,
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
            style={{
              position: 'absolute',
              left: '50%',
              marginLeft: '-32px', // Half width of medium card
              zIndex: index
            }}
          >
            <Card
              card={card}
              onClick={onCardClick ? () => onCardClick(card) : undefined}
              disabled={disabled}
              size="medium"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
