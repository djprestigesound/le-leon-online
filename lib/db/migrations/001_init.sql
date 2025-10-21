-- Migration initiale pour Le Léon
-- Création des tables pour l'historique des parties

-- Table des parties
CREATE TABLE IF NOT EXISTS games (
  id VARCHAR(255) PRIMARY KEY,
  code VARCHAR(6) NOT NULL,
  mode VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMP,
  total_rounds INTEGER DEFAULT 0,
  CONSTRAINT unique_code UNIQUE (code)
);

-- Index pour rechercher par code
CREATE INDEX IF NOT EXISTS idx_games_code ON games(code);

-- Index pour rechercher par date
CREATE INDEX IF NOT EXISTS idx_games_finished_at ON games(finished_at DESC);

-- Table des joueurs
CREATE TABLE IF NOT EXISTS players (
  id VARCHAR(255) PRIMARY KEY,
  game_id VARCHAR(255) NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  position INTEGER NOT NULL,
  final_score INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index pour rechercher par partie
CREATE INDEX IF NOT EXISTS idx_players_game_id ON players(game_id);

-- Index pour rechercher par nom
CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);

-- Table des statistiques (optionnel, pour des agrégations futures)
CREATE TABLE IF NOT EXISTS game_stats (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_games INTEGER DEFAULT 0,
  total_players INTEGER DEFAULT 0,
  CONSTRAINT unique_date UNIQUE (date)
);

-- Fonction pour mettre à jour les stats (trigger)
CREATE OR REPLACE FUNCTION update_game_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'finished' AND OLD.status != 'finished' THEN
    INSERT INTO game_stats (date, total_games, total_players)
    VALUES (CURRENT_DATE, 1, (SELECT COUNT(*) FROM players WHERE game_id = NEW.id))
    ON CONFLICT (date) DO UPDATE SET
      total_games = game_stats.total_games + 1,
      total_players = game_stats.total_players + EXCLUDED.total_players;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour les stats automatiquement
DROP TRIGGER IF EXISTS trigger_update_stats ON games;
CREATE TRIGGER trigger_update_stats
AFTER UPDATE ON games
FOR EACH ROW
EXECUTE FUNCTION update_game_stats();
