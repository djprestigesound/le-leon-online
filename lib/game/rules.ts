import { Card, LeonedCard, Suit, Rank, Trick, Player } from '../types/game';
import { RANK_VALUES } from './constants';

/**
 * Retourne la valeur numérique d'une carte pour la comparaison
 */
export function getCardValue(card: Card): number {
  if (card.rank === 'LEON') {
    return 15; // Le Léon est la carte la plus forte
  }
  return RANK_VALUES[card.rank as Rank] || 0;
}

/**
 * Vérifie si un joueur peut jouer une carte donnée
 */
export function canPlayCard(
  card: Card,
  playerHand: Card[],
  currentTrick: Trick,
  trump: Suit | null
): { valid: boolean; reason?: string } {
  // Si c'est le premier joueur du pli, il peut jouer n'importe quelle carte
  if (currentTrick.cards.length === 0) {
    return { valid: true };
  }

  const leadSuit = currentTrick.leadSuit;
  if (!leadSuit) {
    return { valid: true };
  }

  // Si c'est le Léon, toujours valide
  if (card.rank === 'LEON') {
    return { valid: true };
  }

  // Vérifier si le joueur a des cartes de la couleur demandée
  const hasSuitInHand = playerHand.some(
    c => c.suit === leadSuit && c.id !== card.id
  );

  // Si le joueur joue la couleur demandée, c'est valide
  if (card.suit === leadSuit) {
    return { valid: true };
  }

  // Si le joueur n'a pas la couleur demandée (en renom), il peut jouer n'importe quoi
  if (!hasSuitInHand) {
    return { valid: true };
  }

  // Le joueur a la couleur demandée mais ne la joue pas
  return {
    valid: false,
    reason: 'Vous devez suivre la couleur demandée',
  };
}

/**
 * Détermine le vainqueur d'un pli
 */
export function determineTrickWinner(
  trick: Trick,
  trump: Suit | null,
  players: Player[]
): string {
  if (trick.cards.length === 0) {
    throw new Error('Le pli est vide');
  }

  const leadSuit = trick.leadSuit;
  let winningCard = trick.cards[0];
  let winnerId = winningCard.playerId;

  for (let i = 1; i < trick.cards.length; i++) {
    const currentCard = trick.cards[i];

    if (shouldCardWin(currentCard.card, winningCard.card, leadSuit, trump)) {
      winningCard = currentCard;
      winnerId = currentCard.playerId;
    }
  }

  return winnerId;
}

/**
 * Détermine si une carte bat une autre carte
 */
function shouldCardWin(
  challenger: LeonedCard,
  current: LeonedCard,
  leadSuit: Suit | null,
  trump: Suit | null
): boolean {
  // Gérer les Léons
  const challengerEffective = challenger.leonedAs || {
    suit: challenger.suit as Suit,
    rank: challenger.rank as Rank,
  };
  const currentEffective = current.leonedAs || {
    suit: current.suit as Suit,
    rank: current.rank as Rank,
  };

  const challengerIsLeon = challenger.rank === 'LEON';
  const currentIsLeon = current.rank === 'LEON';

  // Cas spéciaux de Léon : en cas d'égalité parfaite
  if (
    challengerEffective.suit === currentEffective.suit &&
    challengerEffective.rank === currentEffective.rank
  ) {
    // As léoné > As normal
    if (challengerEffective.rank === 'A' || challengerEffective.rank === 'K' ||
        challengerEffective.rank === 'Q' || challengerEffective.rank === 'J' ||
        challengerEffective.rank === '10') {
      return challengerIsLeon && !currentIsLeon;
    }
    // 2-9 : carte léonée perd contre la vraie
    return !challengerIsLeon && currentIsLeon;
  }

  // L'atout bat toujours les autres couleurs
  if (trump) {
    const challengerIsTrump = challengerEffective.suit === trump;
    const currentIsTrump = currentEffective.suit === trump;

    if (challengerIsTrump && !currentIsTrump) return true;
    if (!challengerIsTrump && currentIsTrump) return false;

    // Si les deux sont atout, comparer les rangs
    if (challengerIsTrump && currentIsTrump) {
      return RANK_VALUES[challengerEffective.rank] > RANK_VALUES[currentEffective.rank];
    }
  }

  // Si les deux cartes suivent la couleur demandée
  if (leadSuit) {
    const challengerFollows = challengerEffective.suit === leadSuit;
    const currentFollows = currentEffective.suit === leadSuit;

    if (challengerFollows && !currentFollows) return true;
    if (!challengerFollows && currentFollows) return false;

    // Si les deux suivent, comparer les rangs
    if (challengerFollows && currentFollows) {
      return RANK_VALUES[challengerEffective.rank] > RANK_VALUES[currentEffective.rank];
    }
  }

  // Par défaut, la carte actuelle gagne
  return false;
}

/**
 * Calcule la phase (montée/descente) et le nombre de cartes pour un tour donné
 */
export function calculateRoundConfig(
  roundNumber: number,
  maxRounds: number
): {
  phase: 'montee' | 'descente';
  cardsPerPlayer: number;
} {
  if (roundNumber <= maxRounds) {
    // Montée : 1, 2, 3, ..., maxRounds
    return {
      phase: 'montee',
      cardsPerPlayer: roundNumber,
    };
  } else {
    // Descente : maxRounds-1, ..., 2, 1
    const descendingRound = roundNumber - maxRounds;
    return {
      phase: 'descente',
      cardsPerPlayer: maxRounds - descendingRound,
    };
  }
}

/**
 * Vérifie si un pli est complet
 */
export function isTrickComplete(trick: Trick, numPlayers: number): boolean {
  return trick.cards.length === numPlayers;
}

/**
 * Vérifie si un tour est terminé
 */
export function isRoundComplete(
  completedTricks: number,
  cardsPerPlayer: number
): boolean {
  return completedTricks >= cardsPerPlayer;
}
