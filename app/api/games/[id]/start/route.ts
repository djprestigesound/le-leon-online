import { NextRequest, NextResponse } from 'next/server';
import { getGameState, saveGameState } from '@/lib/db/kv';
import { startGame } from '@/lib/game/engine';
import { processBotTurns } from '@/lib/game/bot-automation';

/**
 * POST /api/games/[id]/start
 * Démarre la partie
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Récupérer la partie
    const game = await getGameState(id);

    if (!game) {
      return NextResponse.json(
        { error: 'Partie introuvable' },
        { status: 404 }
      );
    }

    // Démarrer la partie
    let updatedGame = startGame(game);

    // Faire jouer automatiquement les bots si le premier joueur est un bot
    updatedGame = processBotTurns(updatedGame);

    // Sauvegarder
    await saveGameState(updatedGame);

    return NextResponse.json({ game: updatedGame });
  } catch (error: any) {
    console.error('Error starting game:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors du démarrage de la partie' },
      { status: 500 }
    );
  }
}
