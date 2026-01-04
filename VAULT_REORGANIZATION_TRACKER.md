# Vault Reorganization Tracker

**Started:** January 4, 2026
**Status:** In Progress

## ⚠️ IMPORTANT: Link Updates Required

**Note:** After reorganization, Obsidian's automatic link updates may not catch all references. Manual verification required for:

- Links in `/Glossary/` files referencing moved locations
- Links in `/Plot/` files referencing moved factions
- Links in `/Sessions/` files referencing moved locations/factions
- Canvas files (`.canvas`) which may not auto-update
- Any external reference documents

## Completed Actions

### Phase 1: Root Cleanup ✅
- [x] Created `_Assets/` directory structure
- [x] Moved PDF files to `_Assets/PDFs/`
- [x] Moved scripts to `_Assets/Scripts/`
- [x] Moved source data to `_Assets/Source Material/`
- [x] Removed duplicate Character Creation files
- [x] Archived/deleted `Untitled*.md` and `*.base` files
- [x] Renamed `Nova Praxis Vault Index.md` → `Index.md`

### Phase 2: Location Reorganization ✅
- [x] Moved `/Locations/Planets/*` → `/Archive/Old Locations/Planets/`
- [x] Created `/Locations/Sol System/Cities/`
- [x] Created `/Locations/Sol System/Stations/`
- [x] Moved `Asola.md` to Cities
- [x] Moved `Europa Station.md` to Stations
- [x] Moved `Naesock Processing Hub.md` to Stations
- [x] Deleted duplicate `/Locations/Exo Planets/` directory
- [x] Created `/Locations/Sol System/_Overview.md`
- [x] Created `/Locations/Exoplanets/_Overview.md`

### Phase 3: Faction Reorganization ✅
- [x] Moved all contents from `/Groups/` → `/Factions/`
- [x] Created `/Factions/Ideologies/`
- [x] Moved Apostates, Transhumans, Purists, Purifiers to Ideologies
- [x] Removed duplicate Apostate.md file
- [x] Removed empty Groups directory

### Phase 4: Final Cleanup ✅
- [x] Renamed `/Rules and Mechanics/` → `/Mechanics/`
- [x] Created navigation overview files
- [x] Updated reorganization tracker

## Files That Need Link Updates

### High Priority (Referenced Frequently)
- [ ] `/Index.md` - Main vault index
- [ ] All Canvas files in `/Locations/`
- [ ] `/Campaign Overview/` files
- [ ] `/Plot/` files

### Medium Priority
- [ ] `/Sessions/` notes
- [ ] `/Characters/NPCs/` files
- [ ] `/Characters/Players/` files

### Low Priority (Auto-update likely sufficient)
- [ ] `/Glossary/` cross-references
- [ ] Internal location cross-references

## File Moves Log

### Locations Moved
| Original Path | New Path | Links Updated? |
|--------------|----------|----------------|
| `/Locations/Planets/Mercury.md` | `/Archive/Old Locations/Planets/` | N/A (archived) |
| `/Asola.md` | `/Locations/Sol System/Cities/Asola.md` | ⏳ Pending |
| `/Europa Station.md` | `/Locations/Sol System/Stations/Europa Station.md` | ⏳ Pending |
| `/Naesock Processing Hub.md` | `/Locations/Sol System/Stations/Naesock Processing Hub.md` | ⏳ Pending |

### Factions Moved
| Original Path | New Path | Links Updated? |
|--------------|----------|----------------|
| `/Groups/Apostates.md` | `/Factions/Ideologies/Apostates.md` | ⏳ Pending |
| `/Groups/Transhumans.md` | `/Factions/Ideologies/Transhumans.md` | ⏳ Pending |
| `/Groups/Purists.md` | `/Factions/Ideologies/Purists.md` | ⏳ Pending |
| `/Groups/Purifiers.md` | `/Factions/Ideologies/Purifiers.md` | ⏳ Pending |

### Assets Moved
| Original Path | New Path | Notes |
|--------------|----------|-------|
| `Agendas.txt` | `_Assets/Source Material/` | Source material archive |
| `create_glossary.py` | `_Assets/Scripts/` | Utility script |
| `conni_audit.ps1` | `_Assets/Scripts/` | Utility script |

## Obsidian Link Update Strategy

**Automatic Updates:**
- Obsidian will auto-update most `[[WikiLinks]]` when files are moved within the app
- Must use Obsidian's file move functionality, not OS file manager

**Manual Updates Required:**
- Canvas files (`.canvas`) - Check all location maps
- Embedded images/attachments
- External links (not wiki-links)
- Dataview queries referencing old paths
- Any hardcoded paths in frontmatter

**Post-Migration Checklist:**
1. Run Obsidian "Check for broken links" 
2. Search for old path patterns: `/Groups/`, `/Locations/Planets/`
3. Update canvas files manually
4. Test dataview queries
5. Verify all location/faction cross-references

## Notes
- Keep `/Archive/Old Locations/` for reference during transition
- Can delete archive after confirming all links updated
- Consider creating redirects for most-referenced old paths
