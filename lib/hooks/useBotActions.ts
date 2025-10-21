'use client';

import { useEffect, useRef } from 'react';
import { Game } from '../types/game';

/**
 * Hook pour faire jouer automatiquement les bots
 */
export function useBotActions(game: Game | null) {
  const lastBotActionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!game) return;

    const currentPlayer = game.players.find(p => p.isCurrentPlayer);

    // Si c'est le tour d'un bot
    if (currentPlayer?.isBot) {
      // Créer une clé unique pour éviter de jouer deux fois la même action
      const actionKey = `${game.id}-${currentPlayer.id}-${game.status}-${game.currentRound?.currentTrick.cards.length || 0}`;

      // Si on a déjà fait cette action, ne pas la refaire
      if (lastBotActionRef.current === actionKey) {
        return;
      }

      // Petit délai pour que ce soit plus réaliste
      const delay = setTimeout(async () => {
        try {
          const response = await fetch(`/api/games/${game.id}/bot-action`, {
            method: 'POST',
          });

          if (response.ok) {
            lastBotActionRef.current = actionKey;
          }
        } catch (error) {
          console.error('Error executing bot action:', error);
        }
      }, 1000 + Math.random() * 1000); // Délai entre 1 et 2 secondes

      return () => clearTimeout(delay);
    }
  }, [game]);
}
