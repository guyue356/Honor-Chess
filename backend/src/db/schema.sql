CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS heroes (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  class TEXT NOT NULL,
  hp INTEGER NOT NULL,
  attack INTEGER NOT NULL,
  skill_name TEXT NOT NULL,
  skill_desc TEXT NOT NULL,
  skill_effect TEXT NOT NULL,
  image_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  hero_id INTEGER,
  mana_cost INTEGER NOT NULL,
  effect TEXT NOT NULL,
  description TEXT NOT NULL,
  FOREIGN KEY (hero_id) REFERENCES heroes(id)
);

CREATE TABLE IF NOT EXISTS user_decks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  hero_id INTEGER NOT NULL,
  name TEXT NOT NULL DEFAULT '默认卡组',
  card_ids TEXT NOT NULL,
  is_active INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (hero_id) REFERENCES heroes(id)
);

CREATE TABLE IF NOT EXISTS battle_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  hero_id INTEGER NOT NULL,
  opponent_hero_id INTEGER NOT NULL,
  result TEXT NOT NULL,
  rounds INTEGER NOT NULL,
  damage_dealt INTEGER DEFAULT 0,
  damage_taken INTEGER DEFAULT 0,
  played_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS leaderboard (
  user_id INTEGER PRIMARY KEY,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  win_rate REAL DEFAULT 0,
  total_damage INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
