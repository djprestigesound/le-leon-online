import { Game, Player, Round, Trick, GameMode, LeonedCard, Card, Suit } from '../types/game';
import { createDeck, shuffleDeck, dealCards, determineTrump, sortHand } from './deck';
import { canPlayCard, determineTrickWinner, calculateRoundConfig, isTrickComplete, isRoundComplete } from './rules';
import { calculateRoundScores, applyScoresToPlayers } from './scoring';
import { MAX_ROUNDS } from './constants';
import { nanoid } from 'nanoid';

/**
 * Crée une nouvelle partie
 */
export function createGame(mode: GameMode, maxPlayers: number = 4): Game {
  const code = generateGameCode();

  return {
    id: nanoid(),
    code,
    mode,
    status: 'waiting',
    players: [],
    currentRound: null,
    maxPlayers,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Génère un code de partie unique (6 caractères)
 */
function generateGameCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sans I, O, 0, 1 pour éviter confusion
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Ajoute un joueur à la partie
 */
export function addPlayer(game: Game, playerName: string): { game: Game; playerId: string } {
  if (game.players.length >= game.maxPlayers) {
    throw new Error('La partie est complète');
  }

  if (game.status !== 'waiting') {
    throw new Error('La partie a déjà commencé');
  }

  const playerId = nanoid();
  const position = game.players.length;

  const newPlayer: Player = {
    id: playerId,
    name: playerName,
    position,
    score: 0,
    hand: [],
    tricksWon: 0,
    bet: null,
    isDealer: position === 0, // Le premier joueur est le distributeur initial
    isCurrentPlayer: false,
    connected: true,
  };

  return {
    game: {
      ...game,
      players: [...game.players, newPlayer],
      updatedAt: new Date().toISOString(),
    },
    playerId,
  };
}

/**
 * Démarre la partie
 */
export function startGame(game: Game): Game {
  if (game.players.length < 2) {
    throw new Error('Il faut au moins 2 joueurs pour commencer');
  }

  if (game.status !== 'waiting') {
    throw new Error('La partie a déjà commencé');
  }

  // Démarrer le premier tour
  const updatedGame = startNewRound(game, 1);

  return {
    ...updatedGame,
    status: 'betting',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Démarre un nouveau tour
 */
function startNewRound(game: Game, roundNumber: number): Game {
  const numPlayers = game.players.length;
  const maxRounds = MAX_ROUNDS[numPlayers] || 13;
  const { phase, cardsPerPlayer } = calculateRoundConfig(roundNumber, maxRounds);

  // Créer et mélanger le deck
  const deck = shuffleDeck(createDeck());

  // Distribuer les cartes
  const { hands, trumpCard, remaining } = dealCards(deck, numPlayers, cardsPerPlayer);

  // Déterminer l'atout
  const trump = determineTrump(trumpCard);

  // Trouver le distributeur actuel
  const dealerIndex = game.players.findIndex(p => p.isDealer);
  const nextDealerIndex = (dealerIndex + 1) % numPlayers;

  // Mettre à jour les joueurs
  const updatedPlayers = game.players.map((player, index) => ({
    ...player,
    hand: sortHand(hands[index]),
    tricksWon: 0,
    bet: null,
    isDealer: index === nextDealerIndex,
    isCurrentPlayer: index === (nextDealerIndex + 1) % numPlayers, // Le joueur après le distributeur commence
  }));

  const round: Round = {
    roundNumber,
    cardsPerPlayer,
    phase,
    trump,
    dealerId: updatedPlayers[nextDealerIndex].id,
    currentTrick: createEmptyTrick(),
    completedTricks: [],
    bets: {},
    status: 'betting',
  };

  return {
    ...game,
    players: updatedPlayers,
    currentRound: round,
    status: 'betting',
  };
}

/**
 * Crée un pli vide
 */
function createEmptyTrick(): Trick {
  return {
    cards: [],
    winnerId: null,
    leadSuit: null,
  };
}

/**
 * Place un pari
 */
export function placeBet(game: Game, playerId: string, bet: number): Game {
  if (!game.currentRound || game.currentRound.status !== 'betting') {
    throw new Error('Ce n\'est pas le moment de parier');
  }

  if (bet < 0 || bet > game.currentRound.cardsPerPlayer) {
    throw new Error('Pari invalide');
  }

  const updatedBets = {
    ...game.currentRound.bets,
    [playerId]: bet,
  };

  const allBetsPlaced = Object.keys(updatedBets).length === game.players.length;

  // Passer au joueur suivant
  const currentPlayerIndex = game.players.findIndex(p => p.id === playerId);
  const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;

  const updatedPlayers = game.players.map((p, index) => {
    if (p.id === playerId) {
      return { ...p, bet, isCurrentPlayer: false };
    }
    if (!allBetsPlaced && index === nextPlayerIndex) {
      return { ...p, isCurrentPlayer: true };
    }
    return p;
  });

  return {
    ...game,
    players: updatedPlayers,
    currentRound: {
      ...game.currentRound,
      bets: updatedBets,
      status: allBetsPlaced ? 'playing' : 'betting',
    },
    status: allBetsPlaced ? 'playing' : 'betting',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Joue une carte
 */
export function playCard(game: Game, playerId: string, card: LeonedCard): Game {
  if (!game.currentRound || game.currentRound.status !== 'playing') {
    throw new Error('Ce n\'est pas le moment de jouer');
  }

  const player = game.players.find(p => p.id === playerId);
  if (!player) {
    throw new Error('Joueur introuvable');
  }

  if (!player.isCurrentPlayer) {
    throw new Error('Ce n\'est pas votre tour');
  }

  // Vérifier si la carte est valide
  const validation = canPlayCard(card, player.hand, game.currentRound.currentTrick, game.currentRound.trump);
  if (!validation.valid) {
    throw new Error(validation.reason || 'Carte invalide');
  }

  // Ajouter la carte au pli
  const leadSuit = game.currentRound.currentTrick.cards.length === 0
    ? (card.leonedAs?.suit || card.suit as Suit)
    : game.currentRound.currentTrick.leadSuit;

  const updatedTrick: Trick = {
    ...game.currentRound.currentTrick,
    cards: [...game.currentRound.currentTrick.cards, { playerId, card }],
    leadSuit,
  };

  // Retirer la carte de la main du joueur
  const updatedPlayers = game.players.map(p => {
    if (p.id === playerId) {
      return {
        ...p,
        hand: p.hand.filter(c => c.id !== card.id),
        isCurrentPlayer: false,
      };
    }
    return p;
  });

  // Vérifier si le pli est complet
  if (isTrickComplete(updatedTrick, game.players.length)) {
    return completeTrick(game, updatedTrick, updatedPlayers);
  }

  // Passer au joueur suivant
  const currentPlayerIndex = game.players.findIndex(p => p.id === playerId);
  const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;

  updatedPlayers[nextPlayerIndex].isCurrentPlayer = true;

  return {
    ...game,
    players: updatedPlayers,
    currentRound: {
      ...game.currentRound,
      currentTrick: updatedTrick,
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Termine un pli
 */
function completeTrick(game: Game, trick: Trick, players: Player[]): Game {
  if (!game.currentRound) {
    throw new Error('Aucun tour en cours');
  }

  // Déterminer le vainqueur
  const winnerId = determineTrickWinner(trick, game.currentRound.trump, players);

  const completedTrick = { ...trick, winnerId };

  // Mettre à jour le nombre de plis gagnés
  const updatedPlayers = players.map(p => {
    if (p.id === winnerId) {
      return {
        ...p,
        tricksWon: p.tricksWon + 1,
        isCurrentPlayer: true, // Le vainqueur joue en premier au prochain pli
      };
    }
    return { ...p, isCurrentPlayer: false };
  });

  const updatedCompletedTricks = [...game.currentRound.completedTricks, completedTrick];

  // Vérifier si le tour est terminé
  if (isRoundComplete(updatedCompletedTricks.length, game.currentRound.cardsPerPlayer)) {
    return completeRound(game, updatedPlayers, updatedCompletedTricks);
  }

  return {
    ...game,
    players: updatedPlayers,
    currentRound: {
      ...game.currentRound,
      currentTrick: createEmptyTrick(),
      completedTricks: updatedCompletedTricks,
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Termine un tour et calcule les scores
 */
function completeRound(game: Game, players: Player[], completedTricks: Trick[]): Game {
  if (!game.currentRound) {
    throw new Error('Aucun tour en cours');
  }

  // Calculer les scores
  const scoringResults = calculateRoundScores(players, game.currentRound.bets, game.mode);
  const updatedPlayers = applyScoresToPlayers(players, scoringResults);

  // Vérifier si la partie est terminée
  const numPlayers = game.players.length;
  const maxRounds = MAX_ROUNDS[numPlayers] || 13;
  const totalRounds = maxRounds * 2; // Montée + Descente

  const isGameOver = game.currentRound.roundNumber >= totalRounds;

  if (isGameOver) {
    return {
      ...game,
      players: updatedPlayers,
      status: 'finished',
      updatedAt: new Date().toISOString(),
    };
  }

  // Démarrer le prochain tour
  const nextRoundNumber = game.currentRound.roundNumber + 1;
  return startNewRound(
    {
      ...game,
      players: updatedPlayers,
    },
    nextRoundNumber
  );
}
