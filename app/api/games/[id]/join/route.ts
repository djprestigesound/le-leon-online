import { NextRequest, NextResponse } from 'next/server';
import { getGameState, saveGameState } from '@/lib/db/kv';
import { addPlayer } from '@/lib/game/engine';

/**
 * POST /api/games/[id]/join
 * Rejoint une partie existante
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { playerName } = body;

    if (!playerName || playerName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nom du joueur requis' },
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

    // Ajouter le joueur
    const { game: updatedGame, playerId } = addPlayer(game, playerName.trim());

    // Sauvegarder
    await saveGameState(updatedGame);

    return NextResponse.json({
      game: updatedGame,
      playerId,
    });
  } catch (error: any) {
    console.error('Error joining game:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la jonction à la partie' },
      { status: 500 }
    );
  }
}
