import { NextRequest, NextResponse } from 'next/server';
import { getGameState, saveGameState } from '@/lib/db/kv';
import { playCard } from '@/lib/game/engine';
import { saveGameHistory } from '@/lib/db/postgres';
import { LeonedCard } from '@/lib/types/game';
import { processBotTurns } from '@/lib/game/bot-automation';

/**
 * POST /api/games/[id]/play
 * Joue une carte
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { playerId, card } = body;

    if (!playerId) {
      return NextResponse.json(
        { error: 'ID du joueur requis' },
        { status: 400 }
      );
    }

    if (!card) {
      return NextResponse.json(
        { error: 'Carte requise' },
        { status: 400 }
      );
    }

    // Récupérer la partie
    const game = await getGameState(id);

    if (!game) {
      return NextResponse.json(
        { error: 'Partie introuvable' },
        { status: 404 }
      );
    }

    // Jouer la carte
    let updatedGame = playCard(game, playerId, card as LeonedCard);

    // Faire jouer automatiquement les bots qui suivent
    updatedGame = processBotTurns(updatedGame);

    // Sauvegarder dans Redis
    await saveGameState(updatedGame);

    // Si la partie est terminée, sauvegarder dans Postgres
    if (updatedGame.status === 'finished') {
      try {
        await saveGameHistory(updatedGame);
      } catch (historyError) {
        console.error('Error saving game history:', historyError);
        // Ne pas bloquer le jeu si l'historique échoue
      }
    }

    return NextResponse.json({ game: updatedGame });
  } catch (error: any) {
    console.error('Error playing card:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors du jeu de la carte' },
      { status: 500 }
    );
  }
}
