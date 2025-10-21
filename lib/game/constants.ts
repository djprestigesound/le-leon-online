import { Rank, Suit } from '../types/game';

// Valeurs des cartes (ordre décroissant de force)
export const RANK_VALUES: Record<Rank, number> = {
  'A': 14,
  'K': 13,
  'Q': 12,
  'J': 11,
  '10': 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
};

export const RANKS: Rank[] = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

export const SUIT_NAMES: Record<Suit, string> = {
  hearts: 'Cœur',
  diamonds: 'Carreau',
  clubs: 'Trèfle',
  spades: 'Pique',
};

export const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

export const RANK_NAMES: Record<Rank, string> = {
  'A': 'As',
  'K': 'Roi',
  'Q': 'Dame',
  'J': 'Valet',
  '10': '10',
  '9': '9',
  '8': '8',
  '7': '7',
  '6': '6',
  '5': '5',
  '4': '4',
  '3': '3',
  '2': '2',
};

// Nombre maximum de tours selon le nombre de joueurs
export const MAX_ROUNDS: Record<number, number> = {
  2: 26,  // 53 / 2 = 26 tours
  3: 17,  // 53 / 3 = 17 tours
  4: 13,  // 53 / 4 = 13 tours
  5: 10,  // 53 / 5 = 10 tours
  6: 8,   // 53 / 6 = 8 tours
  7: 7,   // 53 / 7 = 7 tours
  8: 6,   // 53 / 8 = 6 tours
  9: 5,   // 53 / 9 = 5 tours
  10: 5,  // 53 / 10 = 5 tours
};

// Sanctions
export const SANCTIONS = {
  leon_es_vergeite: -5,    // Oubli d'annoncer le Léon
  maldonne: -8,            // Mauvaise distribution
  flave: -2,               // Mauvais nombre de cartes
  smokeleir_repenti: -2,   // Avoue ne pas avoir suivi
  smokeleir_demasque: -5,  // Pris en flagrant délit
} as const;

export const SANCTION_DESCRIPTIONS = {
  leon_es_vergeite: 'Oubli d\'annoncer "LEON" avant de jouer la carte',
  maldonne: 'Mauvaise distribution des cartes',
  flave: 'Nombre de cartes incorrect en main',
  smokeleir_repenti: 'N\'a pas suivi la couleur (aveu)',
  smokeleir_demasque: 'N\'a pas suivi la couleur (démasqué)',
} as const;

// Durée de polling pour le temps réel (ms)
export const POLLING_INTERVAL = 2000;

// Longueur du code de partie
export const GAME_CODE_LENGTH = 6;
