'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useGameState } from '@/lib/hooks/useGameState';
import { useGameActions } from '@/lib/hooks/useGameActions';
import { GameLobby } from '@/components/Lobby/GameLobby';
import { Hand } from '@/components/Game/Hand';
import { Table } from '@/components/Game/Table';
import { Scoreboard } from '@/components/Game/Scoreboard';
import { Card as CardType, LeonedCard, Suit, Rank } from '@/lib/types/game';
import { SUIT_NAMES } from '@/lib/game/constants';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function GamePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const gameId = params.id as string;

  const { game, loading, error, refresh } = useGameState(gameId);
  const { joinGame, startGame, placeBet, playCard } = useGameActions();

  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [betInput, setBetInput] = useState<number>(0);
  const [showLeonModal, setShowLeonModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [leonSuit, setLeonSuit] = useState<Suit>('hearts');
  const [leonRank, setLeonRank] = useState<Rank>('A');

  // Auto-join si paramètres présents
  useEffect(() => {
    const shouldJoin = searchParams.get('join') === 'true';
    const playerName = searchParams.get('name');

    if (shouldJoin && playerName && !myPlayerId) {
      joinGame(gameId, playerName)
        .then(({ playerId }) => {
          setMyPlayerId(playerId);
          localStorage.setItem(`game_${gameId}_player`, playerId);
        })
        .catch(console.error);
    } else if (!myPlayerId) {
      // Récupérer l'ID du joueur depuis localStorage
      const savedPlayerId = localStorage.getItem(`game_${gameId}_player`);
      if (savedPlayerId) {
        setMyPlayerId(savedPlayerId);
      }
    }
  }, [searchParams, gameId, myPlayerId, joinGame]);

  const handleStartGame = async () => {
    try {
      await startGame(gameId);
      // Rafraîchir immédiatement pour voir les actions des bots
      await refresh();
    } catch (err) {
      console.error('Error starting game:', err);
    }
  };

  const handlePlaceBet = async () => {
    if (!myPlayerId) return;

    try {
      await placeBet(gameId, myPlayerId, betInput);
      // Rafraîchir immédiatement pour voir les actions des bots
      await refresh();
    } catch (err) {
      console.error('Error placing bet:', err);
    }
  };

  const handleCardClick = async (card: CardType) => {
    if (!myPlayerId) return;

    // Si c'est le Léon, ouvrir le modal
    if (card.rank === 'LEON') {
      setSelectedCard(card);
      setShowLeonModal(true);
      return;
    }

    // Jouer la carte normalement
    try {
      await playCard(gameId, myPlayerId, card as LeonedCard);
      // Rafraîchir immédiatement pour voir les actions des bots
      await refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePlayLeon = async () => {
    if (!selectedCard || !myPlayerId) return;

    const leonedCard: LeonedCard = {
      ...selectedCard,
      leonedAs: {
        suit: leonSuit,
        rank: leonRank,
      },
    };

    try {
      await playCard(gameId, myPlayerId, leonedCard);
      setShowLeonModal(false);
      setSelectedCard(null);
      // Rafraîchir immédiatement pour voir les actions des bots
      await refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-green-900">
        <div className="text-white text-2xl">Chargement...</div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-green-900">
        <div className="bg-white rounded-xl p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-700 mb-4">{error || 'Partie introuvable'}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  const me = game.players.find(p => p.id === myPlayerId);

  // Lobby (en attente)
  if (game.status === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-green-900 flex items-center justify-center p-4">
        {myPlayerId ? (
          <GameLobby game={game} myPlayerId={myPlayerId} onStart={handleStartGame} />
        ) : (
          <div className="text-white">Connexion...</div>
        )}
      </div>
    );
  }

  // Game view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-green-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Le Léon</h1>
            <p className="text-sm text-gray-600">
              Tour {game.currentRound?.roundNumber} - {game.currentRound?.phase === 'montee' ? 'Montée' : 'Descente'}
              {game.currentRound?.trump && (
                <> • Atout: {SUIT_NAMES[game.currentRound.trump]}</>
              )}
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-600">Code: <span className="font-mono font-bold">{game.code}</span></div>
            <div className="text-xs text-gray-500">
              {game.status === 'betting' && 'Phase de paris'}
              {game.status === 'playing' && 'Partie en cours'}
              {game.status === 'finished' && 'Partie terminée'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Scoreboard */}
          <div className="lg:col-span-1">
            <Scoreboard players={game.players} myPlayerId={myPlayerId} />
          </div>

          {/* Center: Game area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Betting phase */}
            {game.status === 'betting' && me && me.bet === null && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">Placez votre pari</h2>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de plis ({game.currentRound?.cardsPerPlayer} cartes)
                    </label>
                    <input
                      type="number"
                      value={betInput}
                      onChange={(e) => setBetInput(Math.max(0, Math.min(game.currentRound?.cardsPerPlayer || 0, parseInt(e.target.value) || 0)))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      min={0}
                      max={game.currentRound?.cardsPerPlayer || 0}
                    />
                  </div>
                  <button
                    onClick={handlePlaceBet}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Parier
                  </button>
                </div>
              </motion.div>
            )}

            {/* Table */}
            {game.status === 'playing' && game.currentRound && (
              <Table
                currentTrick={game.currentRound.currentTrick}
                players={game.players}
                myPosition={me?.position || 0}
              />
            )}

            {/* My hand */}
            {me && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Votre main</h2>
                <Hand
                  cards={me.hand}
                  onCardClick={me.isCurrentPlayer && game.status === 'playing' ? handleCardClick : undefined}
                  disabled={!me.isCurrentPlayer || game.status !== 'playing'}
                />
              </div>
            )}

            {/* Finished */}
            {game.status === 'finished' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Partie terminée !</h2>
                <button
                  onClick={() => router.push('/')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Retour à l&apos;accueil
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Leon Modal */}
      {showLeonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Jouer le Léon</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
              <select
                value={leonSuit}
                onChange={(e) => setLeonSuit(e.target.value as Suit)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300"
              >
                <option value="hearts">Cœur ♥</option>
                <option value="diamonds">Carreau ♦</option>
                <option value="clubs">Trèfle ♣</option>
                <option value="spades">Pique ♠</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rang</label>
              <select
                value={leonRank}
                onChange={(e) => setLeonRank(e.target.value as Rank)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300"
              >
                {['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'].map(rank => (
                  <option key={rank} value={rank}>{rank}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLeonModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handlePlayLeon}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg"
              >
                Jouer LEON
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
