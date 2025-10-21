'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameActions } from '@/lib/hooks/useGameActions';
import { GameMode } from '@/lib/types/game';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function HomePage() {
  const router = useRouter();
  const { createGame, getGameByCode } = useGameActions();

  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [gameMode, setGameMode] = useState<GameMode>('simplified');
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateGame = async () => {
    if (!playerName.trim()) {
      setError('Veuillez entrer votre nom');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { game, playerId } = await createGame(gameMode, playerName.trim(), maxPlayers);

      // Sauvegarder l'ID du joueur dans localStorage
      localStorage.setItem(`game_${game.id}_player`, playerId);

      // Rediriger vers la partie
      router.push(`/game/${game.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    if (!playerName.trim()) {
      setError('Veuillez entrer votre nom');
      return;
    }

    if (!gameCode.trim()) {
      setError('Veuillez entrer un code de partie');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { game } = await getGameByCode(gameCode.trim().toUpperCase());

      // Rejoindre la partie via la page de jeu
      router.push(`/game/${game.id}?join=true&name=${encodeURIComponent(playerName.trim())}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2"
          >
            Le Léon
          </motion.h1>
          <p className="text-gray-600">Jeu de cartes en ligne</p>
        </div>

        {/* Mode selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('create')}
            className={clsx(
              'flex-1 py-3 rounded-lg font-semibold transition-all',
              mode === 'create'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            Créer une partie
          </button>
          <button
            onClick={() => setMode('join')}
            className={clsx(
              'flex-1 py-3 rounded-lg font-semibold transition-all',
              mode === 'join'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            Rejoindre
          </button>
        </div>

        {/* Player name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Votre nom
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Entrez votre nom"
            maxLength={20}
          />
        </div>

        {mode === 'create' ? (
          <>
            {/* Game mode */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode de jeu
              </label>
              <select
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value as GameMode)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="simplified">Simplifié</option>
                <option value="audace">Audace & Attaque</option>
                <option value="securite">Sécurité & Défense</option>
              </select>
            </div>

            {/* Max players */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de joueurs (2-10)
              </label>
              <input
                type="number"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Math.min(10, Math.max(2, parseInt(e.target.value) || 4)))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={2}
                max={10}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateGame}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer la partie'}
            </motion.button>
          </>
        ) : (
          <>
            {/* Game code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code de partie
              </label>
              <input
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xl text-center"
                placeholder="ABC123"
                maxLength={6}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoinGame}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Recherche...' : 'Rejoindre la partie'}
            </motion.button>
          </>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Rules link */}
        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Règles du jeu
          </a>
        </div>
      </motion.div>
    </div>
  );
}
