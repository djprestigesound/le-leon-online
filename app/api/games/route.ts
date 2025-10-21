import { NextRequest, NextResponse } from 'next/server';
import { createGame, addPlayer } from '@/lib/game/engine';
import { saveGameState, getGameByCode } from '@/lib/db/kv';
import { GameMode } from '@/lib/types/game';

/**
 * POST /api/games
 * Crée une nouvelle partie
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, playerName, maxPlayers = 4 } = body;

    if (!mode || !['simplified', 'audace', 'securite'].includes(mode)) {
      return NextResponse.json(
        { error: 'Mode de jeu invalide' },
        { status: 400 }
      );
    }

    if (!playerName || playerName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nom du joueur requis' },
        { status: 400 }
      );
    }

    // Créer la partie
    const game = createGame(mode as GameMode, maxPlayers);

    // Ajouter le premier joueur
    const { game: updatedGame, playerId } = addPlayer(game, playerName.trim());

    // Sauvegarder dans Redis
    await saveGameState(updatedGame);

    return NextResponse.json({
      game: updatedGame,
      playerId,
    });
  } catch (error: any) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la partie' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/games?code=ABC123
 * Récupère une partie par son code
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Code de partie requis' },
        { status: 400 }
      );
    }

    const game = await getGameByCode(code);

    if (!game) {
      return NextResponse.json(
        { error: 'Partie introuvable' },
        { status: 404 }
      );
    }

    return NextResponse.json({ game });
  } catch (error: any) {
    console.error('Error fetching game:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération de la partie' },
      { status: 500 }
    );
  }
}
