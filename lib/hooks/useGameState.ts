'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Game } from '../types/game';
import { POLLING_INTERVAL } from '../game/constants';

/**
 * Hook pour synchroniser l'état d'une partie en temps réel
 */
export function useGameState(gameId: string | null) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef(false); // Pour le polling automatique
  const manualFetchRef = useRef(false); // Pour les refreshes manuels

  const fetchGameState = useCallback(async (isManual: boolean = false) => {
    if (!gameId) return;

    // Pour les refreshes manuels, ne pas bloquer même si un polling est en cours
    // Pour le polling, ne pas exécuter si un autre polling est déjà en cours
    if (!isManual && pollingRef.current) return;
    if (isManual && manualFetchRef.current) return;

    if (isManual) {
      manualFetchRef.current = true;
    } else {
      pollingRef.current = true;
    }

    try {
      const response = await fetch(`/api/games/${gameId}`, {
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
      if (isManual) {
        manualFetchRef.current = false;
      } else {
        pollingRef.current = false;
      }
    }
  }, [gameId]);

  // Fonction de refresh manuel qui force le fetch
  const refresh = useCallback(async () => {
    await fetchGameState(true);
  }, [fetchGameState]);

  useEffect(() => {
    if (!gameId) {
      setLoading(false);
      return;
    }

    // Première récupération
    fetchGameState(false);

    // Polling toutes les 2 secondes
    const interval = setInterval(() => fetchGameState(false), POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [gameId, fetchGameState]);

  return { game, loading, error, refresh };
}
