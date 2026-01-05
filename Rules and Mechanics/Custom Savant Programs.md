---
tags:
  - type/game-reference
  - type/rules
  - rules-system: FATE
  - character-class: Savant
  - homebrew
aliases:
  - "Custom Savant Programs"
  - "Homebrew Savant Programs"
  - "Campaign Savant Programs"
---

# Custom Savant Programs

**System:** Nova Praxis FATE  
**Type:** Homebrew / Campaign-Specific Programs  
**Base:** Official Savant Program structure

---

## OVERVIEW

These are custom Savant Programs created for specific campaign NPCs and situations. They follow the same mechanical structure as official Savant Programs but provide specialized functionality not covered by the core list.

All programs follow standard Savant Program rules:
- Require **Savant Stunt** as prerequisite
- Cost like normal Stunts
- Use SINC skill vs. difficulty
- Failure causes System Stress

---

## CUSTOM PROGRAMS

### Track Eraser

**Difficulty:** 3 + highest of target system's security rating or monitoring AI  
**Action:** Simple Action (initial) + Extended (cleanup phase)  
**Duration:** Permanent (evidence removal)  
**Related Official Program:** Similar to **Access Memory** but for system logs instead of personal memories

Removes digital evidence and traces from computer systems, security logs, and monitoring networks. This is the digital equivalent of wiping fingerprints and destroying surveillance footage.

**Phase 1 - Immediate Scrub (Simple Action):**
When you execute this Program, you launch a targeted attack against recent activity logs in accessible systems.

To execute, make a SINC test against difficulty equal to 3 + the highest of:
- Target system's security rating
- Monitoring AI's awareness level
- Network administrator's Software Engineering skill

**Results:**
- **Success:** Erase the last 1 hour of your digital activity from accessible logs
- **Spin:** Forego Effect Aspect to erase up to 1 day of activity OR extend coverage to include one other person's activity
- **5+ Shifts:** Erase up to 1 week of activity OR cover multiple people's tracks OR embed false activity to mislead investigators

**Phase 2 - Deep Scrub (Extended, 1 hour per test):**
If you have physical or remote access to the system for an extended period, you can perform a more thorough cleansing.

Each hour, make another SINC test:
- **Success:** Remove evidence of a single event/scene of moderate importance
- **Spin:** Remove evidence of a full day OR a very important event
- **5+ Shifts:** Remove evidence of a week OR create entirely false logs to replace what was removed

**Detection:**
- If you fail but don't Stall on Phase 1, administrators may notice gaps in logs (requires Investigation test)
- If you Stall on Phase 1, system immediately flags intrusion attempt
- Deep Scrub gives administrators more time to detect the intrusion (one chance per hour of work)

**Limitations:**
- Cannot erase logs stored on air-gapped or offline backup systems
- Cannot erase evidence already copied by investigators
- High-security Mimir-tech systems may have redundant logging that requires multiple passes

**Upgrades:**

**Phantom Replacement**  
When erasing evidence, you automatically create plausible false logs that fill the gap. Investigators must succeed at a Software Engineering test (Diff: equal to your SINC) to identify the logs as fabricated.

**Retroactive Cleaner**  
You can target logs up to 1 month old instead of only recent activity. Increase execution difficulty by +2.

**Network Cascade**  
Your Track Eraser automatically propagates to connected systems, erasing evidence across an entire network segment instead of just one system. Works on systems within the same mesh or intranet.

---

### Ghost Protocol

**Difficulty:** 2 + security awareness level  
**Action:** Simple Action  
**Duration:** Scene or until detected  
**Related Official Program:** Combination of elements from **Security Skim** and **System Invasion**

Creates a digital "invisibility cloak" that prevents your activity from being flagged, logged, or detected by monitoring systems while you work in digital environments.

**Execution:**
Make a SINC test against difficulty equal to 2 + the awareness level of security systems:
- Low security (public networks, civilian systems): +0
- Standard security (House subsidiaries, police networks): +2
- High security (House headquarters, military networks): +4
- Extreme security (Mimir-tech core systems, AI monitoring): +6

**Results:**
- **Success:** Your digital activity is not flagged by automated monitoring for the rest of the scene. You appear as legitimate authorized traffic.
- **Spin:** Forego Effect Aspect to extend duration to 1 hour OR reduce difficulty of other Savant Programs you execute while "ghosted" by -2
- **5+ Shifts:** Extend duration to 1 day OR become completely invisible even to active human monitoring

**What Ghost Protocol Covers:**
- Intrusion detection systems won't flag your access attempts
- Automated logging systems record you as authorized traffic
- AI monitoring systems deprioritize your activity as routine
- Security alerts are suppressed for your activities

**What It Doesn't Cover:**
- Human administrators actively watching screens in real-time (requires Perception test to notice anomalies)
- Physical security (cameras, biometrics, etc.)
- Programs that directly attack or modify systems (those still generate alerts, but harder to trace)

**Detection:**
- If you Stall, systems immediately become aware of the intrusion and your Ghost Protocol drops
- If you fail but don't Stall, you gain partial coverage but administrators gain +2 on tests to detect you
- Taking aggressive actions (System Error, System Invasion, etc.) while ghosted gives administrators a chance to notice (Software Engineering test, Diff: your SINC +2)

**Duration:**
Ghost Protocol lasts for a scene or until you are detected, whichever comes first. You can drop it voluntarily as a Free Action.

**Upgrades:**

**Adaptive Camouflage**  
Your Ghost Protocol automatically adjusts to security responses. The first time you would be detected in a scene, make an immediate SINC test (Diff: 3). Success means your Ghost Protocol adapts and remains active.

**False Positive Generator**  
While Ghost Protocol is active, you create dozens of false alerts that flood monitoring systems, making it harder to identify real threats. Administrators suffer -2 on tests to detect intrusions by anyone while your Ghost Protocol is active.

**Multitasking Ghost**  
You can extend your Ghost Protocol to cover one additional person's digital activity in the same mesh. Each additional person beyond the first increases execution difficulty by +1.

---

### Data Miner

**Difficulty:** 2 + data security level  
**Action:** Simple Action (quick search) OR Extended (deep dive)  
**Duration:** Instant (retrieval)  
**Related Official Program:** Enhanced version of **Delve** that works on systems instead of people

Extracts hidden, deleted, or secured information from computer systems. Goes beyond standard access to find data that's been buried, encrypted, or marked for deletion.

**Quick Search (Simple Action):**
Make a SINC test against difficulty equal to 2 + data security:
- Public data (unencrypted, accessible): +0
- Private data (user-level encryption): +2
- Secured data (admin-level encryption): +4
- Classified data (military/House encryption): +6

**Results:**
- **Success:** Find and extract one piece of hidden information (a file, message, transaction record, etc.)
- **Spin:** Forego Effect Aspect to extract multiple related files OR automatically decrypt the data without additional tests
- **5+ Shifts:** Extract entire database sections OR recover data that was permanently deleted

**Deep Dive (Extended, 1 hour per test):**
If you have sustained access, you can perform a comprehensive data mining operation.

Each hour, make a SINC test:
- **Success:** Extract comprehensive information about a specific topic (all related files, communications, transactions)
- **Spin:** Extract information AND metadata (who accessed it, when, from where, connection patterns)
- **5+ Shifts:** Reconstruct deleted databases OR break complex multi-layer encryption

**What You Can Find:**
- Deleted files (recently deleted or overwritten data)
- Hidden files (steganography, hidden partitions, camouflaged data)
- Encrypted communications (requires successful test to decrypt)
- Transaction records (financial, data transfers, access logs)
- Connection maps (who communicated with whom, network relationships)

**Limitations:**
- Data that's been securely wiped (military-grade deletion) is unrecoverable
- Air-gapped systems require physical access
- Quantum-encrypted data may require multiple passes or be impossible to break

**Detection:**
- Quick Search: If you Stall, system logs the intrusion attempt
- Deep Dive: Each hour of work gives administrators one chance to detect you (Software Engineering test)

**Upgrades:**

**Archaeological Recovery**  
You can recover data that was deleted up to 1 year ago (normally limited to recent deletions). This includes data that's been partially overwritten. Increase execution difficulty by +2.

**Pattern Recognition**  
Your Daemon automatically identifies patterns and connections in extracted data. When you successfully execute Data Miner, you gain a free Assessment or Declaration about the data's context or meaning.

**Parallel Processing**  
You can run multiple Data Miner operations simultaneously across different systems in the same mesh. Roll once and apply the result to all targeted systems.

---

## USING CUSTOM PROGRAMS IN PLAY

### Building Custom Programs

When creating custom Savant Programs for your campaign, follow this structure:

1. **Define the core concept** - What does this program do that official programs don't?
2. **Set base difficulty** - Usually 2-4, +modifiers for security/complexity
3. **Determine action type** - Simple (most common), Extended (for long operations), or Instant
4. **Establish duration** - Instant, Scene, Hour, Permanent
5. **Write success tiers:**
   - Basic success: Minimum useful effect
   - Spin: Enhanced effect (usually forego Effect Aspect for upgrade)
   - 5+ Shifts: Exceptional effect
6. **Define limitations** - What can't this do? What are failure consequences?
7. **Create 1-3 upgrades** - Additional Stunt purchases that enhance the program

### Balance Guidelines

Custom programs should be roughly equivalent to official programs:
- **Don't make them strictly better** - Each should have a niche
- **Maintain costs** - System Stress on failure keeps Savants from spamming
- **Respect security levels** - High-security systems should remain challenging
- **Allow counterplay** - Defenders should have chances to detect/counter

### Program Categories

Official programs fall into these categories:
- **Information Gathering** (Delve, Pattern Scan, Security Skim, Access Memory)
- **Control & Manipulation** (System Invasion, Puppeteer, Eminent Domain)
- **Stealth & Subterfuge** (Ghost Protocol*, Track Eraser*)
- **Attack & Defense** (System Error, Overload, Blackout)
- **Sensory** (Stream of Consciousness, Augmented Unreality)
- **Mental Manipulation** (Memory Hack)
- **Physical Manifestation** (Esper Lord)
- **Prediction & Analysis** (Oracle Patterning, Pattern Scan)

*Custom programs fill stealth/subterfuge niche

---

## CAMPAIGN NOTES

### Valare's Specialization

[[Valare]] is a **cover-up specialist** who worked for House Tsarya during the Shadow War. Her program selection reflects this role:

- **Track Eraser** - Her signature ability; critical for post-operation cleanup
- **Ghost Protocol** - Allows her to work undetected during active operations
- **Data Miner** - Finds evidence that needs erasing; understands what happened

This combination makes her exceptionally valuable for:
- Covering up House operations
- Removing evidence of Shadow War activities
- Protecting covert agents
- Cleaning up after botched missions
- Investigating what went wrong before cleaning it up

### Why She Defected

Her mastery of Track Eraser and Data Miner meant she **saw everything** House Tsarya was doing:
- Corrupt dealings with other Houses
- Betrayals of loyal operatives
- Civilian casualties covered up
- Systematic exploitation of apostates

She couldn't unknow what she'd learned. The more evidence she erased, the more disgusted she became.

### Campaign Usage

**For GMs:**
- Valare's programs are defensive/support-focused, not combat
- She's incredibly valuable alive (can clean up PC's tracks)
- She's dangerous as an enemy (can expose anyone's secrets)
- Her Data Miner makes her difficult to lie to (she finds the truth)

**For Players:**
- Getting Valare's cooperation = access to top-tier cleanup specialist
- Forcing her cooperation = she may leave evidence of *your* crimes
- Killing her = losing access to unique capabilities
- Earning her trust = powerful ally for covert operations

