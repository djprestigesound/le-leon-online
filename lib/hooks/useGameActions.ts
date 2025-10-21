'use client';

import { useCallback } from 'react';
import { GameMode, LeonedCard } from '../types/game';

/**
 * Hook pour effectuer des actions sur une partie
 */
export function useGameActions() {
  const createGame = useCallback(async (mode: GameMode, playerName: string, maxPlayers: number = 4) => {
    const response = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, playerName, maxPlayers }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la création de la partie');
    }

    return response.json();
  }, []);

  const joinGame = useCallback(async (gameId: string, playerName: string) => {
    const response = await fetch(`/api/games/${gameId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la jonction à la partie');
    }

    return response.json();
  }, []);

  const startGame = useCallback(async (gameId: string) => {
    const response = await fetch(`/api/games/${gameId}/start`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors du démarrage de la partie');
    }

    return response.json();
  }, []);

  const placeBet = useCallback(async (gameId: string, playerId: string, bet: number) => {
    const response = await fetch(`/api/games/${gameId}/bet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, bet }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors du pari');
    }

    return response.json();
  }, []);

  const playCard = useCallback(async (gameId: string, playerId: string, card: LeonedCard) => {
    const response = await fetch(`/api/games/${gameId}/play`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, card }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors du jeu de la carte');
    }

    return response.json();
  }, []);

  const getGameByCode = useCallback(async (code: string) => {
    const response = await fetch(`/api/games?code=${code}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Partie introuvable');
    }

    return response.json();
  }, []);

  return {
    createGame,
    joinGame,
    startGame,
    placeBet,
    playCard,
    getGameByCode,
  };
}
