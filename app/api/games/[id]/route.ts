import { NextRequest, NextResponse } from 'next/server';
import { getGameState } from '@/lib/db/kv';

/**
 * GET /api/games/[id]
 * Récupère l'état actuel de la partie (pour le polling temps réel)
 */
export async function GET(
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

    return NextResponse.json({ game });
  } catch (error: any) {
    console.error('Error fetching game state:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération de l\'état' },
      { status: 500 }
    );
  }
}
