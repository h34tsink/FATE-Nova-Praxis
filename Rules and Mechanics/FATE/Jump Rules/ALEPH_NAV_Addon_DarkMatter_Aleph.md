# ALEPH NAV — Dark Matter Alephs (Addon v1.0)
*A plug-in for **ALEPH NAV: A Multiverse Navigation Framework for TTRPGs***  
**Premise:** Aleph Beacons are implemented as **dark-matter couplers**—devices that interrogate or stimulate the local dark sector (axions, dark photons, ultralight fields, sterile neutrinos, etc.) to create a **cross-brane reference signal**.

> Use this with the core book. Drop it into **Play Mode** as a rules overlay, or pull the crunchy bits into the **Appendix A** canon.

---

## PART I — TABLE RULES (DROP-IN)

### 1) Beacon Lock Now Depends on the Halo
Before a jump, the GM declares the **Halo Profile** at the origin and destination: `calm / clumpy / caustic / void`.

- **Calm:** +1 Beacon Lock
- **Clumpy:** no change
- **Caustic (streams, folds):** +1 die to lock **or** +1 Strain (pilot choice)
- **Void (under-dense):** −1 Beacon Lock; blind-jump rules apply if you drop to 0

**Quick Oracle (d6):** 1–2 calm, 3–4 clumpy, 5 caustic, 6 void

> Fiction: caustics act like waveguides; voids starve your couplers.

---

### 2) Five Beacon Modalities
Pick what your ship mounts (or mix with tags). Each grants a **boon** and a **risk**.

1. **Axion Lattice (haloscope)**  
   - **Boon:** Once/jump, convert **Glitch → Intel** (axion line is clean).  
   - **Risk:** Strong magnetic quench risks **Strain +1** on Mixed/Fail.

2. **Fuzzy-Field Interferometer (ultralight DM)**  
   - **Boon:** Advantage on **Law-Gradient** steps ≤1 (phase-tracking helps).  
   - **Risk:** **Temporal Slip** triggers one extra weird side-effect (GM pick).

3. **Dark Photon Cavity**  
   - **Boon:** +1 Beacon Lock in **clumpy** regions.  
   - **Risk:** Spoofable: hostile gates gain +1 to spoof attempts unless you burn a **Cavity Seal** (consumable).

4. **Sterile Neutrino Oscillator**  
   - **Boon:** Ignore **Void** penalty once/mission.  
   - **Risk:** On Fail, someone gets light nausea: mark **Sick** (clears after a rest).

5. **WIMP Scintillation Array**  
   - **Boon:** On **Survey**, gain +1 extra **Intel** from particle echoes.  
   - **Risk:** The array soaks heat: +1 **Strain** if you also fought this scene.

*(You can stat these as playbook choices, ship modules, or purchase tags.)*

---

### 3) New Minor Move: **Tune the Halo**
When you spend a scene to **retune** your couplers to the local halo:
- Roll +Tech (or equivalent).  
- **Success:** Gain +1 Beacon Lock (cap 4) and clear **Drift 1**.  
- **Mixed:** Gain +1 Beacon Lock but mark **Glitch**.  
- **Fail:** No lock; mark **Strain 1** or trigger a **Halo Event** (see Oracles).

---

### 4) Path Modifiers (replace or stack with core)
- If **origin and destination** share the **same Halo Profile**, reduce Path TN by **1** (or grant +1 die).  
- Crossing **void → caustic** in one jump increases **risk band** by one step (Safe→Standard, etc.) unless using **Sterile Neutrino** modality.

---

### 5) Quick Gear
- **SQUID Readout (1-slot):** Downgrade 1 **Glitch** on arrival.  
- **Cryo Pump (ship tag):** You may ignore a single **Strain** from DM beacons per mission.  
- **Cavity Seal (consumable):** Prevent a single spoof against Dark Photon Cavity.  
- **Phase Knife (oddity):** Once/session, cut a short-lived **micro-gate** (1 action) in the same universe—costs **Strain 1**.

---

### 6) Encounters & Complications
- **Quiet Halo Cult:** Wants you to power down beacons; they believe halos are sentient.  
- **Stream Riders:** Pirates that surf caustics; they appear at advantage near **caustic** zones.  
- **Dark Sector Bloom:** Temporary amplification—treat region as **clumpy → caustic** for 1–3 scenes, then **void** for 1 scene.

---

## PART II — GM TOOLS

### 7) Halo Events (d6)
1. **Phase Chime:** Harmless ringing; +1 Intel if you listen
2. **Stream Shear:** Displace 1 zone at arrival site (environment shifts)
3. **Cavity Ringdown:** Your beacon pings a nearby gate—attention drawn
4. **Cold Spot:** −1 die to Beacon Lock until you move
5. **Mirror Echo:** A doppel-communication tries to complete a sentence you didn’t say
6. **Anomalous Recoil:** Choose: **Strain 1** or drop a tool

### 8) Dark-Matter Distribution (d6 per locale)
1 halo **calm**, 2 halos **clumpy**, 3 **caustic web**, 4 **void pockets**, 5 **layered streams**, 6 **resonant core** (all beacon modalities +1 die but any Fail → **Catastrophe 1** tier up)

### 9) Factions
- **Cartographers of the Quiet Halo** (ascetic engineers): stabilize caustics into corridors.
- **Cavity Trust** (corporate): controls dark-photon keys & licenses; will sue you *midrift*.
- **The Bloom** (eco-mystics): trigger blooms to awaken “halo spirits.”

---

## APPENDIX — LORE & CRUNCH (Diegetic)

### A) Why Dark Matter Works as a Cross-Brane Medium
- **Permeability:** Weakly coupled fields (axions, dark photons) can leak through branes better than EM.  
- **Coherence:** Ultralight DM behaves like a classical wave over kiloparsecs—great for interference and **spectral fingerprinting**.  
- **Universality:** Most universes with familiar large-scale structure still form halos; even when baryons differ, the dark sector persists.

### B) Beacon Physics (in-setting)
- **Axion Lattice:** Tunable microwave cavities in high fields; sweep frequency to catch the line.  
- **Fuzzy-Field Interferometer:** Two long-baseline sensors read a shared phase of the ultralight field.  
- **Dark Photon Cavity:** Kinetic-mixing ε lets you build a “shadow-EM” resonator.  
- **Sterile Oscillator:** Baseline with reactors or cosmic sources to catch oscillation patterns through brane substrates.  
- **WIMP Array:** Dense scintillator tiling corralled by brane-shear reflectors.

### C) Address & Packet Extensions
- Add **DM Halo Profile** to the pilot-readable alias and packet:
  - **Alias Suffix:** `DM:calm|clumpy|caustic|void`  
  - **Packet:** `HALO 1 byte` (00 calm, 01 clumpy, 10 caustic, 11 void)
- Optional **DM Spectral Hash (DMSH 8 bytes):** short hash of the measured line(s) used for anti-spoofing.

**Example (pilot):**  
`LSP:v6/ICF:af3c…/TOP:h1/CGAs:σ92/DM:caustic/prec:12`

**Example (packet delta):**
```text
ADDR+: [DMSH 8][HALO 1]
```

### D) Balancing Notes
- Give **real choices**: caustic = faster nav but higher mishap pressure; void = safer narrative tempo but navigation hunger.
- Keep **beacon spoof** rare unless it’s a planned arc; telegraph the risk via NPC chatter or sensor weirdness.

---

## QUICK REFERENCE (PRINTABLE)

- **Halo Profile → Lock mod:** calm +1, caustic +1 die or +1 Strain (pick), void −1 lock.  
- **Modality boons/risks:** pick one set per ship.  
- **Tune the Halo move:** retune for +Lock, risking Glitch/Strain/Event.  
- **Packet Suffix:** add `DM:` tag & optional `DMSH`.

> Dark as velvet, precise as a razor. Ride the caustics, love. 💋
