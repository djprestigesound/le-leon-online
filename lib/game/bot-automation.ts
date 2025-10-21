import { Game } from '../types/game';
import { calculateBotBet, chooseBotCard } from './bot';
import { placeBet, playCard } from './engine';

/**
 * Fait jouer automatiquement les bots jusqu'à ce qu'un humain doive jouer
 * Retourne le game state mis à jour
 */
export function processBotTurns(game: Game): Game {
  let updatedGame = { ...game };
  let botPlayed = true;

  // Continuer tant que c'est le tour d'un bot
  while (botPlayed) {
    const currentPlayer = updatedGame.players.find(p => p.isCurrentPlayer);

    // Si ce n'est pas un bot, arrêter
    if (!currentPlayer?.isBot) {
      botPlayed = false;
      break;
    }

    // Phase de paris
    if (updatedGame.status === 'betting' && currentPlayer.bet === null) {
      const bet = calculateBotBet(
        currentPlayer.hand,
        currentPlayer.botPersonality || 'balanced',
        updatedGame.mode
      );
      updatedGame = placeBet(updatedGame, currentPlayer.id, bet);
      continue;
    }

    // Phase de jeu
    if (updatedGame.status === 'playing' && updatedGame.currentRound) {
      // Vérifier que le bot n'a pas déjà joué dans ce pli
      const hasPlayed = updatedGame.currentRound.currentTrick.cards.some(
        pc => pc.playerId === currentPlayer.id
      );

      if (!hasPlayed && currentPlayer.hand.length > 0) {
        const cardToPlay = chooseBotCard(
          currentPlayer.hand,
          updatedGame.currentRound.currentTrick.cards,
          updatedGame,
          currentPlayer,
          currentPlayer.botPersonality || 'balanced'
        );
        updatedGame = playCard(updatedGame, currentPlayer.id, cardToPlay);
        continue;
      }
    }

    // Si on arrive ici, le bot ne peut pas jouer
    botPlayed = false;
  }

  return updatedGame;
}
