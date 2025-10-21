import { Card, Suit, Rank } from '../types/game';
import { RANKS, SUITS } from './constants';
import { nanoid } from 'nanoid';

/**
 * Crée un jeu de 52 cartes + 1 joker (Le Léon)
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];

  // Créer les 52 cartes normales
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: nanoid(8),
        suit,
        rank,
      });
    }
  }

  // Ajouter le Léon (joker)
  deck.push({
    id: nanoid(8),
    suit: 'joker',
    rank: 'LEON',
  });

  return deck;
}

/**
 * Mélange un paquet de cartes (algorithme Fisher-Yates)
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Distribue les cartes aux joueurs
 * @param deck Paquet mélangé
 * @param numPlayers Nombre de joueurs
 * @param cardsPerPlayer Nombre de cartes par joueur
 * @returns Tableau de mains + carte d'atout + sabot restant
 */
export function dealCards(
  deck: Card[],
  numPlayers: number,
  cardsPerPlayer: number
): {
  hands: Card[][];
  trumpCard: Card | null;
  remaining: Card[];
} {
  const hands: Card[][] = Array.from({ length: numPlayers }, () => []);
  let currentCardIndex = 0;

  // Distribuer les cartes
  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let playerIndex = 0; playerIndex < numPlayers; playerIndex++) {
      if (currentCardIndex < deck.length) {
        hands[playerIndex].push(deck[currentCardIndex]);
        currentCardIndex++;
      }
    }
  }

  // Carte d'atout (première carte du sabot restant)
  const trumpCard = currentCardIndex < deck.length ? deck[currentCardIndex] : null;
  currentCardIndex++;

  // Cartes restantes (sabot)
  const remaining = deck.slice(currentCardIndex);

  return { hands, trumpCard, remaining };
}

/**
 * Détermine l'atout à partir de la carte retournée
 */
export function determineTrump(trumpCard: Card | null): Suit | null {
  if (!trumpCard) return null;
  if (trumpCard.suit === 'joker') return null; // Le distributeur choisit
  return trumpCard.suit;
}

/**
 * Trie une main de cartes par couleur puis par rang
 */
export function sortHand(hand: Card[]): Card[] {
  const suitOrder: Record<string, number> = {
    hearts: 0,
    diamonds: 1,
    clubs: 2,
    spades: 3,
    joker: 4,
  };

  return [...hand].sort((a, b) => {
    // Trier par couleur d'abord
    const suitDiff = suitOrder[a.suit] - suitOrder[b.suit];
    if (suitDiff !== 0) return suitDiff;

    // Puis par rang (As = 14, Roi = 13, etc.)
    const rankValueA = a.rank === 'LEON' ? 15 : parseInt(a.rank) ||
      (a.rank === 'A' ? 14 : a.rank === 'K' ? 13 : a.rank === 'Q' ? 12 : 11);
    const rankValueB = b.rank === 'LEON' ? 15 : parseInt(b.rank) ||
      (b.rank === 'A' ? 14 : b.rank === 'K' ? 13 : b.rank === 'Q' ? 12 : 11);

    return rankValueB - rankValueA;
  });
}
