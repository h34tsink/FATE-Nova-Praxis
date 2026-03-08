---
aliases:
  - pc overview
  - player overview
  - party overview
tags:
  - pc
  - dashboard
  - runtime
---

# PC Overview

Live reference for all player characters. Auto-updates from frontmatter.

---

## Party At a Glance

```dataview
TABLE WITHOUT ID
  file.link as "Character",
  state as "State",
  house as "House",
  refresh as "Refresh",
  fate-points as "FP",
  rep-rating as "Rep"
FROM "Characters/Players"
WHERE contains(tags, "pc")
SORT file.name ASC
```

---

## High Concepts

```dataview
TABLE WITHOUT ID
  file.link as "Character",
  high-concept as "High Concept",
  skill-distribution as "Build"
FROM "Characters/Players"
WHERE contains(tags, "pc")
SORT file.name ASC
```

---

## Stress Tracks

```dataview
TABLE WITHOUT ID
  file.link as "Character",
  physical-stress as "Physical",
  mental-stress as "Mental",
  system-stress as "System"
FROM "Characters/Players"
WHERE contains(tags, "pc")
SORT file.name ASC
```

---

## Active Consequences

```dataview
LIST consequences
FROM "Characters/Players"
WHERE contains(tags, "pc") AND consequences != null
SORT file.name ASC
```

---

## Quick Links

| Character | Sheet | Interlude |
|-----------|-------|-----------|
| Aeddarius Crucial | [[Aeddarius Crucial - FATE Character]] | — |
| Azaria Dawson | [[Azaria Dawson - FATE Character]] | [[Characters/Players/Azaria Dawson/Interlude\|Interlude]] |
| Dr. Lorem "Doc" Ipsum | — *(needs export)* | [[Characters/Players/Dr. Lorem (Doc) Ipsum/Interlude\|Interlude]] |
| Dustin "Grift" Halloway | [[Dustin Halloway - FATE Character]] | [[Characters/Players/Dustin (Grift) Halloway/Interlude\|Interlude]] |
| Grace Pryzbylski | [[Grace Pryzbylski - FATE Character]] | — |
| Kallius | [[Kallius - FATE Character]] | [[Characters/Players/Kallius/Interlude\|Interlude]] |

---

#ttrpg #nova-praxis #pc #dashboard
