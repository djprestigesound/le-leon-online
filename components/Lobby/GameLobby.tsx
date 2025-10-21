'use client';

import { useState } from 'react';
import { Game, GameMode } from '@/lib/types/game';
import { useGameActions } from '@/lib/hooks/useGameActions';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface GameLobbyProps {
  game: Game;
  myPlayerId: string;
  onStart: () => void;
}

export function GameLobby({ game, myPlayerId, onStart }: GameLobbyProps) {
  const isHost = game.players[0]?.id === myPlayerId;
  const canStart = game.players.length >= 2;
  const [addingBot, setAddingBot] = useState(false);

  const handleAddBot = async () => {
    setAddingBot(true);
    try {
      const response = await fetch(`/api/games/${game.id}/add-bot`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du bot');
      }
    } catch (error) {
      console.error('Error adding bot:', error);
      alert('Impossible d\'ajouter un bot');
    } finally {
      setAddingBot(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-8 border-2 border-blue-100 relative overflow-hidden"
      >
        {/* Effet de brillance animé */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/20 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
        />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <motion.div
            className="flex items-center justify-center gap-3 mb-3"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <motion.span
              className="text-4xl"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            >
              🃏
            </motion.span>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Le Léon
            </h1>
            <motion.span
              className="text-4xl"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            >
              ⭐
            </motion.span>
          </motion.div>
          <motion.div
            className="text-lg text-gray-600"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Code de partie:{' '}
            <motion.span
              className="font-mono font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
              animate={{
                backgroundPosition: ['0%', '100%', '0%']
              }}
              transition={{ repeat: Infinity, duration: 3 }}
              style={{ backgroundSize: '200% auto' }}
            >
              {game.code}
            </motion.span>
          </motion.div>
          <motion.div
            className="text-sm text-gray-500 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Mode: <span className="font-semibold text-purple-600">
              {game.mode === 'simplified' && '🎯 Simplifié'}
              {game.mode === 'audace' && '⚔️ Audace & Attaque'}
              {game.mode === 'securite' && '🛡️ Sécurité & Défense'}
            </span>
          </motion.div>
        </div>

        {/* Players */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Joueurs ({game.players.length}/{game.maxPlayers})
          </h2>

          <div className="space-y-3">
            {game.players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={clsx(
                  'flex items-center gap-3 p-4 rounded-lg border-2',
                  player.id === myPlayerId
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-gray-50 border-gray-200'
                )}
              >
                <div className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg",
                  player.isBot
                    ? "bg-gradient-to-br from-gray-500 to-gray-700"
                    : "bg-gradient-to-br from-blue-500 to-purple-600"
                )}>
                  {player.isBot ? '🤖' : player.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-gray-800 flex items-center gap-2 flex-wrap">
                    <span>{player.name}</span>
                    {player.id === myPlayerId && (
                      <span className="text-xs text-blue-600 font-bold">(Vous)</span>
                    )}
                    {player.isBot && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                        🤖 Bot {player.botPersonality === 'aggressive' ? '⚔️' : player.botPersonality === 'cautious' ? '🛡️' : '⚖️'}
                      </span>
                    )}
                  </div>
                  {index === 0 && (
                    <div className="text-xs text-purple-600 font-medium">Hôte de la partie</div>
                  )}
                </div>

                {player.connected && (
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                )}
              </motion.div>
            ))}

            {/* Slots vides */}
            {Array.from({ length: game.maxPlayers - game.players.length }).map((_, index) => (
              <motion.div
                key={`empty-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [0.98, 1, 0.98]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: index * 0.2
                }}
                className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100"
              >
                <motion.div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center text-gray-500 text-xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  ?
                </motion.div>
                <div className="text-gray-400 font-medium">⏳ En attente d&apos;un joueur...</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 relative z-10">
          <p className="text-sm text-blue-800">
            📋 Partagez le code <span className="font-mono font-bold">{game.code}</span> avec vos amis pour qu&apos;ils rejoignent la partie !
          </p>
        </div>

        {/* Add bot button */}
        {isHost && game.players.length < game.maxPlayers && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddBot}
            disabled={addingBot}
            className="w-full py-3 rounded-xl font-semibold text-base transition-all bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg hover:shadow-xl mb-3 relative z-10 disabled:opacity-50"
          >
            {addingBot ? '⏳ Ajout en cours...' : '🤖 Ajouter un Bot'}
          </motion.button>
        )}

        {/* Start button */}
        {isHost && (
          <motion.button
            whileHover={{ scale: canStart ? 1.02 : 1 }}
            whileTap={{ scale: canStart ? 0.98 : 1 }}
            onClick={onStart}
            disabled={!canStart}
            className={clsx(
              'w-full py-4 rounded-xl font-bold text-lg transition-all relative z-10',
              canStart
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            {canStart ? '🎮 Démarrer la partie' : 'En attente de joueurs (min. 2)'}
          </motion.button>
        )}

        {!isHost && (
          <div className="text-center text-gray-600">
            En attente que l&apos;hôte démarre la partie...
          </div>
        )}
      </motion.div>
    </div>
  );
}
