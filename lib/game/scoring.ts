import { GameMode, Player } from '../types/game';

export interface ScoringResult {
  playerId: string;
  bet: number;
  tricksWon: number;
  points: number;
  success: boolean;
  description: string;
}

/**
 * Calcule les points pour un joueur selon le mode de jeu
 */
export function calculatePlayerScore(
  bet: number,
  tricksWon: number,
  mode: GameMode
): { points: number; success: boolean; description: string } {
  const difference = Math.abs(bet - tricksWon);
  const success = bet === tricksWon;

  if (mode === 'simplified' || mode === 'securite') {
    return calculateSimplifiedScore(bet, tricksWon, difference, success);
  } else if (mode === 'audace') {
    return calculateAudaceScore(bet, tricksWon, difference, success);
  }

  return { points: 0, success: false, description: 'Mode invalide' };
}

/**
 * Calcul des points en mode Simplifié ou Sécurité & Défense
 */
function calculateSimplifiedScore(
  bet: number,
  tricksWon: number,
  difference: number,
  success: boolean
): { points: number; success: boolean; description: string } {
  if (success) {
    return {
      points: 1,
      success: true,
      description: `Pari réussi : ${bet} plis`,
    };
  }

  // Pari raté
  const points = -difference;
  const tooMany = tricksWon > bet;

  return {
    points,
    success: false,
    description: `Pari raté : ${bet} pariés, ${tricksWon} réalisés (${difference} ${tooMany ? 'en trop' : 'en moins'})`,
  };
}

/**
 * Calcul des points en mode Audace & Attaque
 */
function calculateAudaceScore(
  bet: number,
  tricksWon: number,
  difference: number,
  success: boolean
): { points: number; success: boolean; description: string } {
  if (success) {
    // Pari réussi : +1 point + nombre de plis pariés
    let points = 1 + bet;

    // Les points sont DOUBLES si le pari atteint 10 plis ou plus
    if (bet >= 10) {
      points *= 2;
    }

    return {
      points,
      success: true,
      description: bet >= 10
        ? `Pari réussi (x2) : ${bet} plis = ${points} points`
        : `Pari réussi : ${bet} plis + 1 = ${points} points`,
    };
  }

  // Pari raté : -nombre de plis de différence
  const points = -difference;
  const tooMany = tricksWon > bet;

  return {
    points,
    success: false,
    description: `Pari raté : ${bet} pariés, ${tricksWon} réalisés (-${difference} pts)`,
  };
}

/**
 * Calcule les scores pour tous les joueurs à la fin d'un tour
 */
export function calculateRoundScores(
  players: Player[],
  bets: Record<string, number>,
  mode: GameMode
): ScoringResult[] {
  return players.map(player => {
    const bet = bets[player.id] ?? 0;
    const tricksWon = player.tricksWon;
    const { points, success, description } = calculatePlayerScore(bet, tricksWon, mode);

    return {
      playerId: player.id,
      bet,
      tricksWon,
      points,
      success,
      description,
    };
  });
}

/**
 * Applique les scores d'un tour aux joueurs
 */
export function applyScoresToPlayers(
  players: Player[],
  scoringResults: ScoringResult[]
): Player[] {
  return players.map(player => {
    const result = scoringResults.find(r => r.playerId === player.id);
    if (!result) return player;

    return {
      ...player,
      score: player.score + result.points,
      tricksWon: 0, // Reset pour le prochain tour
      bet: null,
    };
  });
}

/**
 * Détermine le classement final
 */
export function getFinalRanking(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.score - a.score);
}
