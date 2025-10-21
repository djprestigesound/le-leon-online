import { sql } from '@vercel/postgres';
import { Game, Player } from '../types/game';

/**
 * Sauvegarde une partie terminée dans Postgres (historique)
 */
export async function saveGameHistory(game: Game): Promise<void> {
  const client = await sql.connect();

  try {
    await client.query('BEGIN');

    // Insérer la partie
    const gameResult = await client.query(
      `INSERT INTO games (id, code, mode, status, created_at, finished_at, total_rounds)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         status = $4,
         finished_at = $6`,
      [
        game.id,
        game.code,
        game.mode,
        game.status,
        game.createdAt,
        game.status === 'finished' ? new Date().toISOString() : null,
        game.currentRound?.roundNumber || 0,
      ]
    );

    // Insérer les joueurs
    for (const player of game.players) {
      await client.query(
        `INSERT INTO players (id, game_id, name, position, final_score)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET
           final_score = $5`,
        [player.id, game.id, player.name, player.position, player.score]
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Récupère l'historique des parties d'un joueur
 */
export async function getPlayerHistory(playerName: string, limit: number = 10): Promise<any[]> {
  const result = await sql`
    SELECT g.*, p.final_score, p.position
    FROM games g
    JOIN players p ON g.id = p.game_id
    WHERE p.name = ${playerName}
    ORDER BY g.finished_at DESC
    LIMIT ${limit}
  `;

  return result.rows;
}

/**
 * Récupère les statistiques globales
 */
export async function getGlobalStats(): Promise<{
  totalGames: number;
  totalPlayers: number;
  avgGameDuration: number;
}> {
  const result = await sql`
    SELECT
      COUNT(DISTINCT g.id) as total_games,
      COUNT(DISTINCT p.id) as total_players,
      AVG(EXTRACT(EPOCH FROM (g.finished_at - g.created_at))) as avg_duration
    FROM games g
    LEFT JOIN players p ON g.id = p.game_id
    WHERE g.status = 'finished'
  `;

  return {
    totalGames: parseInt(result.rows[0]?.total_games || '0'),
    totalPlayers: parseInt(result.rows[0]?.total_players || '0'),
    avgGameDuration: parseFloat(result.rows[0]?.avg_duration || '0'),
  };
}

/**
 * Récupère le classement des meilleurs joueurs
 */
export async function getLeaderboard(limit: number = 10): Promise<any[]> {
  const result = await sql`
    SELECT
      p.name,
      COUNT(*) as games_played,
      SUM(CASE WHEN p.position = 0 THEN 1 ELSE 0 END) as wins,
      AVG(p.final_score) as avg_score
    FROM players p
    JOIN games g ON p.game_id = g.id
    WHERE g.status = 'finished'
    GROUP BY p.name
    ORDER BY avg_score DESC
    LIMIT ${limit}
  `;

  return result.rows;
}
