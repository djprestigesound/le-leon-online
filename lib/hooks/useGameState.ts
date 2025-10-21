'use client';

import { useEffect, useState, useRef } from 'react';
import { Game } from '../types/game';
import { POLLING_INTERVAL } from '../game/constants';

/**
 * Hook pour synchroniser l'état d'une partie en temps réel
 */
export function useGameState(gameId: string | null) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const gameIdRef = useRef(gameId);

  // Mettre à jour la ref quand gameId change
  useEffect(() => {
    gameIdRef.current = gameId;
  }, [gameId]);

  // Fonction de fetch stable (ne change jamais)
  const fetchGameStateRef = useRef(async () => {
    const currentGameId = gameIdRef.current;
    if (!currentGameId) return;

    try {
      const response = await fetch(`/api/games/${currentGameId}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error('Impossible de récupérer l\'état de la partie');
      }

      const data = await response.json();
      setGame(data.game);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  });

  // Fonction refresh exposée qui ne change jamais
  const refreshRef = useRef(() => {
    return fetchGameStateRef.current();
  });

  useEffect(() => {
    if (!gameId) {
      setLoading(false);
      return;
    }

    // Première récupération
    fetchGameStateRef.current();

    // Polling toutes les 2 secondes
    const interval = setInterval(() => {
      fetchGameStateRef.current();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [gameId]); // Seulement gameId dans les dépendances

  return {
    game,
    loading,
    error,
    refresh: refreshRef.current
  };
}
