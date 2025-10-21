'use client';

import { Trick, Player } from '@/lib/types/game';
import { Card } from './Card';
import { motion, AnimatePresence } from 'framer-motion';

interface TableProps {
  currentTrick: Trick;
  players: Player[];
  myPosition: number;
}

export function Table({ currentTrick, players, myPosition }: TableProps) {
  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-green-700 via-green-800 to-green-900 rounded-2xl shadow-2xl overflow-hidden">
      {/* Motif de fond animé */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '30px 30px']
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: 'linear'
          }}
        />
      </div>

      {/* Cercles décoratifs animés */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-40 h-40 border-4 border-white/20 rounded-full"
        style={{ x: '-50%', y: '-50%' }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-52 h-52 border-2 border-white/10 rounded-full"
        style={{ x: '-50%', y: '-50%' }}
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
      />

      {/* Cartes jouées */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {currentTrick.cards.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 p-4">
              {currentTrick.cards.map((playedCard, index) => {
                const player = players.find(p => p.id === playedCard.playerId);

                return (
                  <motion.div
                    key={`${playedCard.playerId}-${index}`}
                    initial={{
                      scale: 0,
                      rotate: -180,
                      y: -100,
                      opacity: 0
                    }}
                    animate={{
                      scale: 1,
                      rotate: [0, 5, -5, 0],
                      y: 0,
                      opacity: 1
                    }}
                    exit={{
                      scale: 0,
                      rotate: 180,
                      y: 100,
                      opacity: 0
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                      delay: index * 0.1
                    }}
                    className="flex flex-col items-center gap-2"
                  >
                    <Card card={playedCard.card} size="medium" />
                    <motion.div
                      className="text-white text-sm font-semibold bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {player?.name || 'Joueur'}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <motion.div
                className="text-white/70 text-lg font-semibold mb-4"
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2
                }}
              >
                En attente du premier joueur...
              </motion.div>
              <motion.div
                className="text-6xl"
                animate={{
                  rotate: 360
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'linear'
                }}
              >
                🎴
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Particules flottantes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            repeat: Infinity,
            duration: 3 + i,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}
