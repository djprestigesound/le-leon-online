import { NextRequest, NextResponse } from 'next/server';
import { getGameState, saveGameState } from '@/lib/db/kv';
import { calculateBotBet, chooseBotCard } from '@/lib/game/bot';
import { placeBet, playCard } from '@/lib/game/engine';

/**
 * POST /api/games/[id]/bot-action
 * Fait jouer automatiquement les bots dans la partie
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const game = await getGameState(id);

    if (!game) {
      return NextResponse.json(
        { error: 'Partie introuvable' },
        { status: 404 }
      );
    }

    let actionTaken = false;

    // Trouver le joueur actuel
    const currentPlayer = game.players.find(p => p.isCurrentPlayer);

    if (!currentPlayer || !currentPlayer.isBot) {
      return NextResponse.json({
        success: false,
        message: 'Aucun bot ne doit jouer actuellement'
      });
    }

    // Si on est en phase de paris
    if (game.status === 'betting') {
      if (currentPlayer.bet === null) {
        const bet = calculateBotBet(
          currentPlayer.hand,
          currentPlayer.botPersonality || 'balanced',
          game.mode
        );

        placeBet(game, currentPlayer.id, bet);
        actionTaken = true;
      }
    }

    // Si on est en phase de jeu
    if (game.status === 'playing' && game.currentRound) {
      // Vérifier que le bot n'a pas déjà joué dans ce pli
      const hasPlayed = game.currentRound.currentTrick.cards.some(
        pc => pc.playerId === currentPlayer.id
      );

      if (!hasPlayed) {
        const cardToPlay = chooseBotCard(
          currentPlayer.hand,
          game.currentRound.currentTrick.cards,
          game,
          currentPlayer,
          currentPlayer.botPersonality || 'balanced'
        );

        playCard(game, currentPlayer.id, cardToPlay);
        actionTaken = true;
      }
    }

    if (actionTaken) {
      game.updatedAt = new Date().toISOString();
      await saveGameState(game);
    }

    return NextResponse.json({
      success: true,
      actionTaken,
      game
    });
  } catch (error: any) {
    console.error('Error executing bot action:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'action du bot' },
      { status: 500 }
    );
  }
}
