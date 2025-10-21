'use client';

import { Player } from '@/lib/types/game';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ScoreboardProps {
  players: Player[];
  myPlayerId: string | null;
}

export function Scoreboard({ players, myPlayerId }: ScoreboardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Scores</h3>

      <div className="space-y-2">
        {players
          .sort((a, b) => b.score - a.score)
          .map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={clsx(
                'flex items-center justify-between p-3 rounded-lg transition-all',
                player.id === myPlayerId
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-50 border-2 border-transparent',
                player.isCurrentPlayer && 'ring-2 ring-green-500 ring-offset-2'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center font-bold text-white',
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                )}>
                  {index + 1}
                </div>

                <div>
                  <div className="font-semibold text-gray-800 flex items-center gap-2">
                    {player.name}
                    {player.id === myPlayerId && (
                      <span className="text-xs text-blue-600">(Vous)</span>
                    )}
                    {player.isDealer && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        Distributeur
                      </span>
                    )}
                    {player.isCurrentPlayer && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full animate-pulse">
                        À jouer
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    {player.bet !== null ? `Pari: ${player.bet}` : 'Pas encore parié'}
                    {' • '}
                    Plis: {player.tricksWon}
                  </div>
                </div>
              </div>

              <div className="text-2xl font-bold text-gray-800">
                {player.score}
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
