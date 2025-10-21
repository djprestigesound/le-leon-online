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
  const fetchingRef = useRef(false);

  const fetchGameState = async () => {
    if (!gameId || fetchingRef.current) return;

    fetchingRef.current = true;
    try {
      const response = await fetch(`/api/games/${gameId}`, {
        cache: 'no-store',
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
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (!gameId) {
      setLoading(false);
      return;
    }

    // Première récupération
    fetchGameState();

    // Polling toutes les 2 secondes
    const interval = setInterval(fetchGameState, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [gameId]); // Retirer fetchGameState des dépendances

  return { game, loading, error, refresh: fetchGameState };
}
