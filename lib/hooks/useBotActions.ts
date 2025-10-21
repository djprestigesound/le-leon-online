'use client';

import { useEffect, useRef } from 'react';
import { Game } from '../types/game';

/**
 * Hook pour faire jouer automatiquement les bots
 */
export function useBotActions(game: Game | null) {
  const lastBotActionRef = useRef<string | null>(null);
  const processingRef = useRef(false);

  useEffect(() => {
    if (!game || processingRef.current) return;

    const currentPlayer = game.players.find(p => p.isCurrentPlayer);

    // Si ce n'est pas le tour d'un bot, ne rien faire
    if (!currentPlayer?.isBot) {
      return;
    }

    // Créer une clé unique pour éviter de jouer deux fois la même action
    const trickLength = game.currentRound?.currentTrick.cards.length || 0;
    const actionKey = `${game.id}-${currentPlayer.id}-${game.status}-${trickLength}-${currentPlayer.bet}`;

    // Si on a déjà fait cette action, ne pas la refaire
    if (lastBotActionRef.current === actionKey) {
      return;
    }

    // Marquer comme en cours de traitement
    processingRef.current = true;
    lastBotActionRef.current = actionKey;

    // Petit délai pour que ce soit plus réaliste
    const delay = setTimeout(async () => {
      try {
        const response = await fetch(`/api/games/${game.id}/bot-action`, {
          method: 'POST',
        });

        if (!response.ok) {
          console.error('Bot action failed:', await response.text());
        }
      } catch (error) {
        console.error('Error executing bot action:', error);
      } finally {
        processingRef.current = false;
      }
    }, 1000 + Math.random() * 1000); // Délai entre 1 et 2 secondes

    return () => {
      clearTimeout(delay);
      processingRef.current = false;
    };
    // On utilise updatedAt comme dépendance pour détecter les changements d'état
    // game.id est ajouté pour satisfaire les règles de linting
  }, [game?.updatedAt, game?.id]);
}
