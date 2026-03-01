# Redundancy Audit — 2026-02-28

## Scope
- Vault content review focused on single-purpose files.
- Excluded: `.git/`, `.obsidian/`, `.trash/`, `_Quarantine/`.
- Priority area: `Rules and Mechanics/Pneuma Rules/`.

## Executive Summary
- **High redundancy cluster #1:** Parallel mechanics folders (`Mechanics/` and `Rules and Mechanics/`) contain duplicate rule files.
- **High redundancy cluster #2:** Pneuma has multiple compendium/bundle files that repeat canonical rules content.
- **Intentional references:** Redirect stubs are valid and should remain.

## Top Findings

### 1) Parallel mechanics folders (HIGH)
- Verified exact duplicate content for at least:
  - `Mechanics/Equipment.md`
  - `Rules and Mechanics/Equipment.md`
- File inventory strongly indicates full duplicate set across core rules:
  - `Armor`, `Augmentations`, `Character Augmentations Guide`, `Character States`, `Drones Overview`, `Equipment`, `Explosives`, `Firearms`, `Melee Weapons`, `Mnemonic Editing`, `Savant Programs Guide`, `Skills`, `Sleeves` (+ index variants).

**Recommendation:**
- Keep `Rules and Mechanics/` as canonical active folder.
- Archive `Mechanics/` as legacy snapshot (do not hard-delete first pass).

---

### 2) Pneuma canonical vs bundle redundancy (HIGH)
- Canonical source exists:
  - `Rules and Mechanics/Pneuma Rules/Pneuma_Architects_Echo_Rules.md`.
- Overlapping bundle/reference files repeat large portions:
  - `Pneuma_MD_Compendium.md`
  - `Pneuma Compendium for Storyteller.md`
  - `Pneuma Compendium.md` (legacy)

**Recommendation:**
- Keep canonical rules file as sole mechanical authority.
- Keep compendiums only as export/reference bundles (or archive if not needed at table).
- Keep `Pneuma.md` as optional variant module (already tagged optional).

---

### 3) Intentional redirect notes (LOW / keep)
- Redirect stubs with `redirect: true` are intentional compatibility links.
- These are single-purpose files and **not** problematic redundancy.

**Recommendation:**
- Keep all redirect stubs.

---

### 4) Audience separation in Pneuma docs is good (LOW / keep)
- `Pneuma Player Handout.md` and `Pneuma GM Adjudication Matrix.md` are cleanly separated by purpose.

**Recommendation:**
- Keep as-is.

## Pneuma Canonical Map (Recommended)

### Canonical
- `Index.md`
- `Pneuma_Architects_Echo_Rules.md`
- `Pneuma Player Handout.md`
- `Pneuma GM Adjudication Matrix.md`

### Reference / Optional
- `gm_data_cache_encounter.md`
- `Pneuma Backlash Consequences.md`
- `The Physics of Pneuma.md`
- `Pneuma.md` (optional variant)
- `mimir_advanced_engineering_logs.jsonl`

### Legacy / Archive Candidates
- `Pneuma Compendium.md`
- `Pneuma_MD_Compendium.md`
- `Pneuma Compendium for Storyteller.md`

## Minimal Safe Action Plan
1. Move `Mechanics/` → `Archive/Mechanics-Legacy/`.
2. Move 3 redundant Pneuma compendiums to `Archive/` (or keep but clearly mark export-only).
3. Keep `Rules and Mechanics/Pneuma Rules/Index.md` as source navigation and authority map.
4. Run vault-wide link check for `[[Mechanics/` references and update to `[[Rules and Mechanics/`.
5. Add short status metadata to any untagged rules files (`canonical/reference/optional/legacy`).
6. Record final consolidation in `VAULT_REORGANIZATION_TRACKER.md`.

## Risks If Over-Aggressive
- Breaking old links if `Mechanics/` is deleted before link migration.
- Losing convenient print/export bundles if compendiums are removed outright.

## Suggested Next Command Batch (if approved)
- Archive legacy mechanics folder.
- Archive Pneuma legacy compendiums.
- Run and report remaining `[[Mechanics/` link count.
