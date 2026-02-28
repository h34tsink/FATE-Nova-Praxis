---
tags:
  - type/session
  - type/dashboard
  - type/dataview
session: 9
aliases:
  - "Session 9 Dashboard"
---

# Session 9: Live Dashboard

Use this page as your at-table cockpit.

## Open Core Notes

- [[Session 9 - Ops Index]]
- [[Session 9 - Guide]]
- [[Session 9 - GM Command Board]]
- [[Session 9 - Scenes and Zones]]
- [[Session 9 - Part 3 - Civil Unrest - The Nowak Situation]]

## Dataview: Session 9 Notes

```dataview
TABLE tags
FROM "Sessions/Session 9"
WHERE session = 9
SORT file.name ASC
```

## Dataview: Quick GM References

```dataview
LIST
FROM "Sessions/Session 9"
WHERE contains(tags, "type/gm-reference") OR contains(tags, "type/gm-runtime")
SORT file.name ASC
```

## Dataview: Prep and Runtime Notes

```dataview
LIST
FROM "Sessions/Session 9"
WHERE contains(tags, "type/session-guide") OR contains(tags, "type/session-prep") OR contains(tags, "type/gm-ops")
SORT file.name ASC
```

## Live Prompt Cycle

- What changed in the fiction since the last roll?
- What pressure is visible now?
- What meaningful choice do the PCs get next?
- What cost lands if they fail or stall?

<!-- conni: session 9 live cockpit -->
