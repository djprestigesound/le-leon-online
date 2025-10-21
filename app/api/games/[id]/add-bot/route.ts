import { NextRequest, NextResponse } from 'next/server';
import { getGameState, saveGameState } from '@/lib/db/kv';
import { generateBotName, getRandomPersonality } from '@/lib/game/bot';
import { nanoid } from 'nanoid';

/**
 * POST /api/games/[id]/add-bot
 * Ajoute un bot à la partie
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

    // Vérifier que la partie est en attente
    if (game.status !== 'waiting') {
      return NextResponse.json(
        { error: 'La partie a déjà commencé' },
        { status: 400 }
      );
    }

    // Vérifier qu'il reste de la place
    if (game.players.length >= game.maxPlayers) {
      return NextResponse.json(
        { error: 'La partie est complète' },
        { status: 400 }
      );
    }

    // Créer le bot
    const botId = nanoid();
    const botName = generateBotName();
    const botPersonality = getRandomPersonality();

    const newPlayer = {
      id: botId,
      name: botName,
      position: game.players.length,
      score: 0,
      hand: [],
      tricksWon: 0,
      bet: null,
      isDealer: false,
      isCurrentPlayer: false,
      connected: true,
      isBot: true,
      botPersonality,
    };

    game.players.push(newPlayer);
    game.updatedAt = new Date().toISOString();

    await saveGameState(game);

    return NextResponse.json({
      success: true,
      botId,
      botName,
      game
    });
  } catch (error: any) {
    console.error('Error adding bot:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'ajout du bot' },
      { status: 500 }
    );
  }
}
