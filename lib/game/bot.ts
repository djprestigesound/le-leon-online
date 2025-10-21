import { Card, Game, Player, PlayedCard, Suit } from '../types/game';
import { canPlayCard, getCardValue } from './rules';

/**
 * Personnalités des bots
 */
export type BotPersonality = 'aggressive' | 'cautious' | 'balanced';

/**
 * Noms aléatoires pour les bots
 */
const BOT_NAMES = [
  '🤖 RoboCartes',
  '🎮 CyberJoueur',
  '⚡ TurboBot',
  '🌟 MasterBot',
  '🎯 PréciBot',
  '🔥 FlameBot',
  '💎 DiamondBot',
  '🚀 AstroBot',
  '🎪 CircusBot',
  '🌈 RainbowBot',
];

let usedBotNames: string[] = [];

/**
 * Génère un nom unique pour un bot
 */
export function generateBotName(): string {
  const availableNames = BOT_NAMES.filter(name => !usedBotNames.includes(name));

  if (availableNames.length === 0) {
    usedBotNames = [];
    return BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
  }

  const name = availableNames[Math.floor(Math.random() * availableNames.length)];
  usedBotNames.push(name);
  return name;
}

/**
 * Réinitialise les noms de bots utilisés
 */
export function resetBotNames(): void {
  usedBotNames = [];
}

/**
 * Calcule un pari intelligent pour un bot
 */
export function calculateBotBet(
  hand: Card[],
  personality: BotPersonality,
  gameMode: string
): number {
  // Évaluer la force de la main
  let strongCards = 0;
  let hasLeon = false;

  hand.forEach(card => {
    if (card.rank === 'LEON') {
      hasLeon = true;
      strongCards += 1.5; // Le Léon compte beaucoup
    } else if (['A', 'K', 'Q', 'J'].includes(card.rank)) {
      strongCards += 1;
    } else if (['10', '9'].includes(card.rank)) {
      strongCards += 0.5;
    }
  });

  // Estimation de base
  let estimatedTricks = Math.floor(strongCards);

  // Ajuster selon la personnalité
  if (personality === 'aggressive') {
    // Les bots agressifs parient plus haut
    estimatedTricks = Math.min(hand.length, estimatedTricks + 1);
  } else if (personality === 'cautious') {
    // Les bots prudents parient plus bas
    estimatedTricks = Math.max(0, estimatedTricks - 1);
  }

  // En mode Audace & Attaque, parfois parier haut pour doubler les points
  if (gameMode === 'audace' && hasLeon && Math.random() > 0.7) {
    estimatedTricks = Math.min(hand.length, estimatedTricks + 2);
  }

  return Math.max(0, Math.min(hand.length, estimatedTricks));
}

/**
 * Choisit la meilleure carte à jouer pour un bot
 */
export function chooseBotCard(
  hand: Card[],
  currentTrick: PlayedCard[],
  game: Game,
  botPlayer: Player,
  personality: BotPersonality
): Card {
  // Filtrer les cartes jouables
  const leadSuit = currentTrick.length > 0 ? currentTrick[0].card.suit : null;
  const currentTrickForRules = {
    cards: currentTrick,
    winnerId: null,
    leadSuit: leadSuit === 'joker' ? null : leadSuit as (Suit | null)
  };

  const playableCards = hand.filter(card =>
    canPlayCard(card, hand, currentTrickForRules, game.currentRound?.trump || null).valid
  );

  if (playableCards.length === 0) {
    // Normalement impossible, mais au cas où
    return hand[0];
  }

  if (playableCards.length === 1) {
    return playableCards[0];
  }

  // Si premier à jouer
  if (currentTrick.length === 0) {
    return chooseLeadCard(playableCards, botPlayer, personality);
  }

  // Si doit suivre
  const trickLeadSuit = currentTrick[0].card.suit;
  const followingCards = playableCards.filter(c => c.suit === trickLeadSuit || c.rank === 'LEON');

  if (followingCards.length > 0) {
    return chooseFollowCard(followingCards, currentTrick, game, botPlayer, personality);
  }

  // Si peut couper avec atout
  const trump = game.currentRound?.trump;
  if (trump) {
    const trumpCards = playableCards.filter(c => c.suit === trump);
    if (trumpCards.length > 0) {
      return chooseTrumpCard(trumpCards, currentTrick, personality);
    }
  }

  // Sinon, défausser
  return chooseDiscardCard(playableCards, personality);
}

/**
 * Choisit une carte pour mener le pli
 */
function chooseLeadCard(cards: Card[], player: Player, personality: BotPersonality): Card {
  // Si on a fait tous nos plis, jouer faible
  if (player.tricksWon >= (player.bet || 0)) {
    const weakest = findWeakestCard(cards);
    return weakest || cards[0];
  }

  // Si on doit encore gagner des plis
  if (personality === 'aggressive') {
    const strongest = findStrongestCard(cards);
    return strongest || cards[0];
  } else if (personality === 'cautious') {
    // Jouer moyen
    const mid = Math.floor(cards.length / 2);
    return cards[mid];
  } else {
    // Équilibré : forte carte si besoin, sinon moyenne
    const needTricks = (player.bet || 0) - player.tricksWon;
    if (needTricks > 2) {
      return findStrongestCard(cards) || cards[0];
    } else {
      return cards[Math.floor(cards.length / 2)];
    }
  }
}

/**
 * Choisit une carte pour suivre
 */
function chooseFollowCard(
  cards: Card[],
  currentTrick: PlayedCard[],
  game: Game,
  player: Player,
  personality: BotPersonality
): Card {
  const trump = game.currentRound?.trump || null;
  // Trouver la carte la plus forte jouée
  const currentWinningCard = getCurrentWinningCard(currentTrick, trump);

  // Si on a déjà atteint notre pari, jouer faible
  if (player.tricksWon >= (player.bet || 0)) {
    return findWeakestCard(cards) || cards[0];
  }

  // Si on peut gagner le pli
  const winningCards = cards.filter(card =>
    canBeatCard(card, currentWinningCard, trump)
  );

  if (winningCards.length > 0) {
    // On a besoin de gagner ce pli ?
    const needTricks = (player.bet || 0) - player.tricksWon;
    if (needTricks > 0) {
      // Gagner avec la carte la plus faible possible
      return findWeakestCard(winningCards) || winningCards[0];
    } else {
      // Ne pas gagner
      const losingCards = cards.filter(card => !canBeatCard(card, currentWinningCard, trump));
      if (losingCards.length > 0) {
        return findWeakestCard(losingCards) || losingCards[0];
      }
    }
  }

  // Sinon jouer la plus faible
  return findWeakestCard(cards) || cards[0];
}

/**
 * Choisit un atout à jouer
 */
function chooseTrumpCard(cards: Card[], currentTrick: PlayedCard[], personality: BotPersonality): Card {
  if (personality === 'aggressive') {
    return findStrongestCard(cards) || cards[0];
  } else {
    return findWeakestCard(cards) || cards[0];
  }
}

/**
 * Choisit une carte à défausser
 */
function chooseDiscardCard(cards: Card[], personality: BotPersonality): Card {
  // Toujours défausser la plus faible
  return findWeakestCard(cards) || cards[0];
}

/**
 * Trouve la carte la plus forte
 */
function findStrongestCard(cards: Card[]): Card | null {
  if (cards.length === 0) return null;

  return cards.reduce((strongest, card) => {
    const strongestValue = getCardValue(strongest);
    const cardValue = getCardValue(card);
    return cardValue > strongestValue ? card : strongest;
  });
}

/**
 * Trouve la carte la plus faible
 */
function findWeakestCard(cards: Card[]): Card | null {
  if (cards.length === 0) return null;

  return cards.reduce((weakest, card) => {
    const weakestValue = getCardValue(weakest);
    const cardValue = getCardValue(card);
    return cardValue < weakestValue ? card : weakest;
  });
}

/**
 * Trouve la carte gagnante actuelle dans le pli
 */
function getCurrentWinningCard(trick: PlayedCard[], trumpSuit: string | null): Card {
  if (trick.length === 0) {
    throw new Error('No cards in trick');
  }

  let winningCard = trick[0].card;
  const leadSuit = trick[0].card.suit;

  for (let i = 1; i < trick.length; i++) {
    const card = trick[i].card;
    if (canBeatCard(card, winningCard, trumpSuit)) {
      winningCard = card;
    }
  }

  return winningCard;
}

/**
 * Vérifie si une carte peut battre une autre
 */
function canBeatCard(card: Card, targetCard: Card, trumpSuit: string | null): boolean {
  // Si les deux sont atouts
  if (trumpSuit && card.suit === trumpSuit && targetCard.suit === trumpSuit) {
    return getCardValue(card) > getCardValue(targetCard);
  }

  // Si seulement la carte testée est atout
  if (trumpSuit && card.suit === trumpSuit) {
    return true;
  }

  // Si même couleur
  if (card.suit === targetCard.suit) {
    return getCardValue(card) > getCardValue(targetCard);
  }

  return false;
}

/**
 * Génère une personnalité aléatoire pour un bot
 */
export function getRandomPersonality(): BotPersonality {
  const personalities: BotPersonality[] = ['aggressive', 'cautious', 'balanced'];
  return personalities[Math.floor(Math.random() * personalities.length)];
}
