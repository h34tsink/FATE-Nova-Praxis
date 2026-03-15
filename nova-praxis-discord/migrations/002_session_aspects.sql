-- Aspect Manager: session_aspects + aspect_usage tables
-- Run: npm run migrate

-- Aspect types enum
CREATE TYPE aspect_type AS ENUM (
    'scene', 'hidden', 'dynamic', 'consequence',
    'persistent', 'zone', 'maneuver', 'character', 'equipment'
);

-- Consequence severity enum
CREATE TYPE aspect_severity AS ENUM ('mild', 'moderate', 'severe', 'extreme');

-- Active aspects tracked per session
CREATE TABLE session_aspects (
    id              SERIAL PRIMARY KEY,
    session_num     INT NOT NULL,
    text            TEXT NOT NULL,
    type            aspect_type NOT NULL DEFAULT 'scene',
    source          TEXT,
    severity        aspect_severity,
    free_invokes    INT NOT NULL DEFAULT 0,
    active          BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now(),
    removed_at      TIMESTAMPTZ
);

CREATE INDEX idx_session_aspects_session ON session_aspects (session_num);
CREATE INDEX idx_session_aspects_active ON session_aspects (session_num, active);

-- Track invocations and compels
CREATE TABLE aspect_usage (
    id              SERIAL PRIMARY KEY,
    aspect_id       INT NOT NULL REFERENCES session_aspects(id) ON DELETE CASCADE,
    usage_type      TEXT NOT NULL CHECK (usage_type IN ('invoke', 'compel')),
    player_name     TEXT NOT NULL,
    discord_user_id TEXT,
    free            BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_aspect_usage_aspect ON aspect_usage (aspect_id);
