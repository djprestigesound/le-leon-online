import { kv } from '@vercel/kv';
import { Game } from '../types/game';

/**
 * Sauvegarde l'état d'une partie dans Vercel KV (Redis)
 * Utilisé pour le temps réel et les parties en cours
 */
export async function saveGameState(game: Game): Promise<void> {
  const key = `game:${game.id}`;
  const codeKey = `game:code:${game.code}`;

  // Sauvegarder par ID
  await kv.set(key, JSON.stringify(game), {
    ex: 86400, // Expire après 24h
  });

  // Sauvegarder l'association code -> ID
  await kv.set(codeKey, game.id, {
    ex: 86400,
  });
}

/**
 * Récupère l'état d'une partie par son ID
 */
export async function getGameState(gameId: string): Promise<Game | null> {
  const key = `game:${gameId}`;
  const data = await kv.get<string>(key);

  if (!data) return null;

  return JSON.parse(data);
}

/**
 * Récupère l'état d'une partie par son code
 */
export async function getGameByCode(code: string): Promise<Game | null> {
  const codeKey = `game:code:${code.toUpperCase()}`;
  const gameId = await kv.get<string>(codeKey);

  if (!gameId) return null;

  return getGameState(gameId);
}

/**
 * Supprime une partie du cache
 */
export async function deleteGame(gameId: string): Promise<void> {
  const game = await getGameState(gameId);
  if (!game) return;

  const key = `game:${gameId}`;
  const codeKey = `game:code:${game.code}`;

  await kv.del(key);
  await kv.del(codeKey);
}

/**
 * Vérifie si un code de partie existe déjà
 */
export async function gameCodeExists(code: string): Promise<boolean> {
  const codeKey = `game:code:${code.toUpperCase()}`;
  const gameId = await kv.get<string>(codeKey);
  return gameId !== null;
}

/**
 * Liste toutes les parties actives (pour le debugging)
 */
export async function listActiveGames(): Promise<string[]> {
  const keys = await kv.keys('game:*');
  return keys.filter(k => !k.includes(':code:'));
}
