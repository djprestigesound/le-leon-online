'use client';

import { Trick, Player } from '@/lib/types/game';
import { Card } from './Card';
import { motion } from 'framer-motion';

interface TableProps {
  currentTrick: Trick;
  players: Player[];
  myPosition: number;
}

export function Table({ currentTrick, players, myPosition }: TableProps) {
  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-green-700 to-green-900 rounded-2xl shadow-inner flex items-center justify-center">
      {/* Cartes jouées */}
      <div className="grid grid-cols-2 gap-4">
        {currentTrick.cards.map((playedCard, index) => {
          const player = players.find(p => p.id === playedCard.playerId);

          return (
            <motion.div
              key={index}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="flex flex-col items-center gap-2"
            >
              <Card card={playedCard.card} size="medium" />
              <div className="text-white text-sm font-semibold bg-black/30 px-3 py-1 rounded-full">
                {player?.name || 'Joueur'}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Message si aucune carte jouée */}
      {currentTrick.cards.length === 0 && (
        <div className="text-white/60 text-lg font-semibold">
          En attente du premier joueur...
        </div>
      )}
    </div>
  );
}
