// Types pour le jeu Le Léon

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

export interface Card {
  suit: Suit | 'joker';
  rank: Rank | 'LEON';
  id: string;
}

export interface LeonedCard extends Card {
  leonedAs?: {
    suit: Suit;
    rank: Rank;
  };
}

export interface PlayedCard {
  playerId: string;
  card: LeonedCard;
}

export type GameMode = 'simplified' | 'audace' | 'securite';

export type GamePhase = 'montee' | 'descente';

export type GameStatus = 'waiting' | 'betting' | 'playing' | 'scoring' | 'finished';

export interface Player {
  id: string;
  name: string;
  position: number;
  score: number;
  hand: Card[];
  tricksWon: number;
  bet: number | null;
  isDealer: boolean;
  isCurrentPlayer: boolean;
  connected: boolean;
  isBot?: boolean;
  botPersonality?: 'aggressive' | 'cautious' | 'balanced';
}

export interface Trick {
  cards: Array<{
    playerId: string;
    card: LeonedCard;
  }>;
  winnerId: string | null;
  leadSuit: Suit | null;
}

export interface Round {
  roundNumber: number;
  cardsPerPlayer: number;
  phase: GamePhase;
  trump: Suit | null;
  dealerId: string;
  currentTrick: Trick;
  completedTricks: Trick[];
  bets: Record<string, number>;
  status: 'betting' | 'playing' | 'completed';
}

export interface Game {
  id: string;
  code: string;
  mode: GameMode;
  status: GameStatus;
  players: Player[];
  currentRound: Round | null;
  maxPlayers: number;
  createdAt: string;
  updatedAt: string;
}

export interface GameState {
  game: Game;
  myPlayerId: string | null;
}

// Sanctions
export type SanctionType =
  | 'leon_es_vergeite'    // -5pts : Oubli d'annoncer le Léon
  | 'maldonne'            // -8pts : Mauvaise distribution
  | 'flave'               // -2pts : Mauvais nombre de cartes
  | 'smokeleir_repenti'   // -2pts : Avoue ne pas avoir suivi
  | 'smokeleir_demasque'; // -5pts : Pris en flagrant délit

export interface Sanction {
  type: SanctionType;
  playerId: string;
  points: number;
  description: string;
}

// Configuration de partie
export interface GameConfig {
  mode: GameMode;
  maxPlayers: number;
  enableSanctions: boolean;
}

// Actions de jeu
export type GameAction =
  | { type: 'JOIN_GAME'; playerId: string; playerName: string }
  | { type: 'START_GAME' }
  | { type: 'PLACE_BET'; playerId: string; bet: number }
  | { type: 'PLAY_CARD'; playerId: string; card: LeonedCard }
  | { type: 'ANNOUNCE_LEON'; playerId: string; leonedAs: { suit: Suit; rank: Rank } }
  | { type: 'APPLY_SANCTION'; sanction: Sanction }
  | { type: 'NEXT_ROUND' }
  | { type: 'END_GAME' };
