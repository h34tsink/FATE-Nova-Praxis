-- vault_notes: full-vault markdown index for catch-all search
-- Covers Characters, Factions, Locations, Plot, Campaign Overview, GM AI (non-entity)
-- Specialized tables (sessions, entity_cards, glossary, rules_sections) take priority

CREATE TABLE IF NOT EXISTS vault_notes (
    id          SERIAL PRIMARY KEY,
    file_path   TEXT NOT NULL UNIQUE,
    title       TEXT NOT NULL,
    folder      TEXT,                  -- top-level vault folder (Characters, Factions, etc.)
    tags        TEXT[] DEFAULT '{}',
    content     TEXT NOT NULL,
    file_mtime  BIGINT,                -- epoch ms — used to skip unchanged files on re-sync
    indexed_at  TIMESTAMPTZ DEFAULT now(),
    search_vec  TSVECTOR
);

CREATE INDEX IF NOT EXISTS idx_vault_notes_search ON vault_notes USING GIN (search_vec);
CREATE INDEX IF NOT EXISTS idx_vault_notes_folder ON vault_notes (folder);
CREATE INDEX IF NOT EXISTS idx_vault_notes_path ON vault_notes (file_path);

CREATE OR REPLACE FUNCTION vault_notes_search_vec_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vec :=
    setweight(to_tsvector('english', NEW.title), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'B') ||
    setweight(to_tsvector('english', NEW.content), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS vault_notes_search_update ON vault_notes;
CREATE TRIGGER vault_notes_search_update
  BEFORE INSERT OR UPDATE ON vault_notes
  FOR EACH ROW EXECUTE FUNCTION vault_notes_search_vec_trigger();
