-- Nova Praxis Discord Bot — Database Schema

-- game_data: gear, augmentations, sleeves, skills, states, houses, fate ladder
CREATE TABLE game_data (
    id          SERIAL PRIMARY KEY,
    category    TEXT NOT NULL,
    name        TEXT NOT NULL,
    description TEXT,
    metadata    JSONB,
    search_vec  TSVECTOR GENERATED ALWAYS AS (
        setweight(to_tsvector('english', name), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(metadata::text, '')), 'C')
    ) STORED
);
CREATE INDEX idx_game_data_search ON game_data USING GIN (search_vec);
CREATE INDEX idx_game_data_category ON game_data (category);

-- glossary terms (uses trigger for tsvector since array_to_string isn't immutable)
CREATE TABLE glossary (
    id          SERIAL PRIMARY KEY,
    term        TEXT NOT NULL UNIQUE,
    aliases     TEXT[] DEFAULT '{}',
    short_def   TEXT,
    long_def    TEXT,
    tags        TEXT[] DEFAULT '{}',
    search_vec  TSVECTOR
);
CREATE INDEX idx_glossary_search ON glossary USING GIN (search_vec);

CREATE OR REPLACE FUNCTION glossary_search_vec_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vec :=
    setweight(to_tsvector('english', NEW.term), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.aliases, ' '), '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.short_def, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.long_def, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER glossary_search_update
  BEFORE INSERT OR UPDATE ON glossary
  FOR EACH ROW EXECUTE FUNCTION glossary_search_vec_trigger();

-- rules sections (chunked by heading)
CREATE TABLE rules_sections (
    id          SERIAL PRIMARY KEY,
    file_path   TEXT NOT NULL,
    heading     TEXT NOT NULL,
    subsystem   TEXT,
    content     TEXT NOT NULL,
    search_vec  TSVECTOR GENERATED ALWAYS AS (
        setweight(to_tsvector('english', heading), 'A') ||
        setweight(to_tsvector('english', content), 'B')
    ) STORED
);
CREATE INDEX idx_rules_search ON rules_sections USING GIN (search_vec);
CREATE INDEX idx_rules_subsystem ON rules_sections (subsystem);

-- NPC entity cards
CREATE TABLE entity_cards (
    id              SERIAL PRIMARY KEY,
    token           TEXT NOT NULL UNIQUE,
    name            TEXT NOT NULL,
    rank            INT NOT NULL,
    class           TEXT,
    faction         TEXT,
    voice_profile   JSONB,
    full_card       TEXT NOT NULL,
    search_vec      TSVECTOR GENERATED ALWAYS AS (
        setweight(to_tsvector('english', name), 'A') ||
        setweight(to_tsvector('english', coalesce(token, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(faction, '')), 'B')
    ) STORED
);
CREATE INDEX idx_entity_token ON entity_cards (token);
CREATE INDEX idx_entity_search ON entity_cards USING GIN (search_vec);

-- player characters
CREATE TABLE characters (
    id              SERIAL PRIMARY KEY,
    discord_user_id TEXT,
    name            TEXT NOT NULL,
    data            JSONB NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX idx_characters_name ON characters (lower(name));
CREATE INDEX idx_characters_discord ON characters (discord_user_id);

-- session data (chunked by heading)
CREATE TABLE sessions (
    id          SERIAL PRIMARY KEY,
    session_num INT NOT NULL,
    file_path   TEXT NOT NULL,
    file_type   TEXT,
    heading     TEXT NOT NULL,
    content     TEXT NOT NULL,
    search_vec  TSVECTOR GENERATED ALWAYS AS (
        setweight(to_tsvector('english', heading), 'A') ||
        setweight(to_tsvector('english', content), 'B')
    ) STORED
);
CREATE INDEX idx_sessions_search ON sessions USING GIN (search_vec);
CREATE INDEX idx_sessions_num ON sessions (session_num);
