'use client';

import { Player } from '@/lib/types/game';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

interface ScoreboardProps {
  players: Player[];
  myPlayerId: string | null;
}

export function Scoreboard({ players, myPlayerId }: ScoreboardProps) {
  const [prevScores, setPrevScores] = useState<Record<string, number>>({});
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  useEffect(() => {
    // Mettre à jour les scores précédents
    const scores: Record<string, number> = {};
    players.forEach(p => { scores[p.id] = p.score; });
    setPrevScores(scores);
  }, [players]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 overflow-hidden">
      <motion.h3
        className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        🏆 Scores
      </motion.h3>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {sortedPlayers.map((player, index) => {
            const scoreChanged = prevScores[player.id] !== undefined && prevScores[player.id] !== player.score;
            const scoreIncreased = scoreChanged && player.score > prevScores[player.id];

            return (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1
                }}
                exit={{ opacity: 0, x: 50, scale: 0.8 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  delay: index * 0.05
                }}
                className={clsx(
                  'relative flex items-center justify-between p-3 rounded-lg transition-all overflow-hidden',
                  player.id === myPlayerId
                    ? 'bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-500'
                    : 'bg-gradient-to-r from-gray-50 to-white border-2 border-transparent',
                  player.isCurrentPlayer && 'ring-2 ring-green-500 ring-offset-2 shadow-lg'
                )}
              >
                {/* Effet de flash quand le score change */}
                {scoreChanged && (
                  <motion.div
                    className={clsx(
                      'absolute inset-0',
                      scoreIncreased ? 'bg-green-400' : 'bg-red-400'
                    )}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}

                <div className="flex items-center gap-3 z-10">
                  <motion.div
                    className={clsx(
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-md',
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                      index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                      'bg-gradient-to-br from-gray-200 to-gray-400'
                    )}
                    animate={index === 0 ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {index === 0 ? '👑' : index + 1}
                  </motion.div>

                  <div>
                    <div className="font-semibold text-gray-800 flex items-center gap-2 flex-wrap">
                      <span>{player.name}</span>
                      {player.id === myPlayerId && (
                        <motion.span
                          className="text-xs text-blue-600 font-bold"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          (Vous)
                        </motion.span>
                      )}
                      {player.isDealer && (
                        <motion.span
                          className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium"
                          animate={{ rotate: [0, -5, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          🎴 Distrib.
                        </motion.span>
                      )}
                      {player.isCurrentPlayer && (
                        <motion.span
                          className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium"
                          animate={{
                            scale: [1, 1.1, 1],
                            boxShadow: [
                              '0 0 0 0 rgba(34, 197, 94, 0)',
                              '0 0 0 8px rgba(34, 197, 94, 0)',
                            ]
                          }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          ▶ À jouer
                        </motion.span>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <span>
                        {player.bet !== null ? `🎯 Pari: ${player.bet}` : '⏳ Pas encore parié'}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>🃏 Plis: {player.tricksWon}</span>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="text-2xl font-bold text-gray-800 z-10"
                  animate={scoreChanged ? {
                    scale: [1, 1.5, 1],
                    color: [
                      '#1f2937',
                      scoreIncreased ? '#10b981' : '#ef4444',
                      '#1f2937'
                    ]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {player.score}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
