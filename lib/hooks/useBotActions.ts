'use client';

import { useEffect, useRef } from 'react';
import { Game } from '../types/game';

/**
 * Hook pour faire jouer automatiquement les bots
 */
export function useBotActions(game: Game | null) {
  const lastBotActionRef = useRef<string | null>(null);

  // Calculer les dépendances spécifiques plutôt que d'utiliser updatedAt
  const currentPlayerId = game?.players.find(p => p.isCurrentPlayer)?.id;
  const currentPlayerIsBot = game?.players.find(p => p.isCurrentPlayer)?.isBot;
  const gameStatus = game?.status;
  const trickLength = game?.currentRound?.currentTrick.cards.length || 0;
  const currentPlayerBet = game?.players.find(p => p.isCurrentPlayer)?.bet;

  useEffect(() => {
    if (!game) return;

    const currentPlayer = game.players.find(p => p.isCurrentPlayer);

    // Si ce n'est pas le tour d'un bot, ne rien faire
    if (!currentPlayer?.isBot) {
      lastBotActionRef.current = null;
      return;
    }

    // Créer une clé unique pour éviter de jouer deux fois la même action
    const actionKey = `${game.id}-${currentPlayer.id}-${game.status}-${trickLength}-${currentPlayer.bet}`;

    // Si on a déjà fait cette action, ne pas la refaire
    if (lastBotActionRef.current === actionKey) {
      return;
    }

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
      }
    }, 1000 + Math.random() * 1000); // Délai entre 1 et 2 secondes

    return () => {
      clearTimeout(delay);
    };
  }, [game?.id, currentPlayerId, currentPlayerIsBot, gameStatus, trickLength, currentPlayerBet]);
}
