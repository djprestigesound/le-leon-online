import { NextRequest, NextResponse } from 'next/server';
import { getGameState, saveGameState } from '@/lib/db/kv';
import { placeBet } from '@/lib/game/engine';
import { processBotTurns } from '@/lib/game/bot-automation';

/**
 * POST /api/games/[id]/bet
 * Place un pari
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { playerId, bet } = body;

    if (!playerId) {
      return NextResponse.json(
        { error: 'ID du joueur requis' },
        { status: 400 }
      );
    }

    if (typeof bet !== 'number' || bet < 0) {
      return NextResponse.json(
        { error: 'Pari invalide' },
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

    // Placer le pari
    let updatedGame = placeBet(game, playerId, bet);

    // Faire jouer automatiquement les bots qui suivent
    updatedGame = processBotTurns(updatedGame);

    // Sauvegarder
    await saveGameState(updatedGame);

    return NextResponse.json({ game: updatedGame });
  } catch (error: any) {
    console.error('Error placing bet:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors du pari' },
      { status: 500 }
    );
  }
}
