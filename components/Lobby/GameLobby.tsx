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

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Le Léon</h1>
          <div className="text-lg text-gray-600">Code de partie: <span className="font-mono font-bold text-2xl text-blue-600">{game.code}</span></div>
          <div className="text-sm text-gray-500 mt-2">
            Mode: <span className="font-semibold">
              {game.mode === 'simplified' && 'Simplifié'}
              {game.mode === 'audace' && 'Audace & Attaque'}
              {game.mode === 'securite' && 'Sécurité & Défense'}
            </span>
          </div>
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {player.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-gray-800">
                    {player.name}
                    {player.id === myPlayerId && (
                      <span className="ml-2 text-sm text-blue-600">(Vous)</span>
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
              <div
                key={`empty-${index}`}
                className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
              >
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                  ?
                </div>
                <div className="text-gray-400">En attente d&apos;un joueur...</div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            📋 Partagez le code <span className="font-mono font-bold">{game.code}</span> avec vos amis pour qu&apos;ils rejoignent la partie !
          </p>
        </div>

        {/* Start button */}
        {isHost && (
          <motion.button
            whileHover={{ scale: canStart ? 1.02 : 1 }}
            whileTap={{ scale: canStart ? 0.98 : 1 }}
            onClick={onStart}
            disabled={!canStart}
            className={clsx(
              'w-full py-4 rounded-xl font-bold text-lg transition-all',
              canStart
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            {canStart ? 'Démarrer la partie' : 'En attente de joueurs (min. 2)'}
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
