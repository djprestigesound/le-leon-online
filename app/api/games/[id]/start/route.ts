import { NextRequest, NextResponse } from 'next/server';
import { getGameState, saveGameState } from '@/lib/db/kv';
import { startGame } from '@/lib/game/engine';

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
    const updatedGame = startGame(game);

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
