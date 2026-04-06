import { getEntityCard, getEntityCardByName, searchRules, getLatestSessionNum, getSessionSections, listEntityCards } from '../db/queries.js';
import { getActiveAspects } from '../db/aspect-queries.js';

function formatAspects(aspects: Awaited<ReturnType<typeof getActiveAspects>>): string {
  return aspects.map((a) => {
    let line = `- [${a.type}] ${a.text}`;
    if (a.severity) line += ` — ${a.severity}`;
    if (a.source) line += ` (${a.source})`;
    return line;
  }).join('\n');
}

export async function buildNpcContext(token: string, situation: string): Promise<string> {
  const sessionNum = await getLatestSessionNum();

  const [card, stateSections, aspects] = await Promise.all([
    getEntityCard(token).then((c) => c ?? getEntityCardByName(token)),
    sessionNum ? getSessionSections(sessionNum, 'state') : Promise.resolve([]),
    sessionNum ? getActiveAspects(sessionNum) : Promise.resolve([]),
  ]);

  const sections: string[] = [];

  if (card) {
    sections.push(`## Entity Card: ${card.name}\n\n${card.full_card}`);
  }

  if (stateSections.length > 0) {
    sections.push(`## Current Session State\n\n${stateSections.slice(0, 2).map((s) => `### ${s.heading}\n${s.content}`).join('\n\n')}`);
  }

  if (aspects.length > 0) {
    sections.push(`## Active Aspects in Play\n\n${formatAspects(aspects)}`);
  }

  const context = sections.join('\n\n---\n\n');

  return `You are a Nova Praxis TTRPG assistant generating in-character NPC dialogue.

${context}

## Dialogue Request

Generate in-character dialogue for **${card?.name || token}** responding to this situation: ${situation || 'a general encounter with the party'}

Respond in this format:
1. **In-character line(s)** (1-4 lines, voice-accurate — use > blockquote format)
2. **Intent:** one line — what the NPC is trying to achieve
3. **Hidden truth (GM only):** one short line

Keep voice consistent with the entity card. Ground the response in the active session state and aspects if relevant.`;
}

export async function buildSceneContext(description: string): Promise<string> {
  const sessionNum = await getLatestSessionNum();

  const [guideSections, stateSections, aspects, entityCards] = await Promise.all([
    sessionNum ? getSessionSections(sessionNum, 'guide') : Promise.resolve([]),
    sessionNum ? getSessionSections(sessionNum, 'state') : Promise.resolve([]),
    sessionNum ? getActiveAspects(sessionNum) : Promise.resolve([]),
    listEntityCards(),
  ]);

  const sections: string[] = [];

  if (guideSections.length > 0) {
    sections.push(`## Session Guide\n\n${guideSections.slice(0, 3).map((s) => `### ${s.heading}\n${s.content}`).join('\n\n')}`);
  }

  if (stateSections.length > 0) {
    sections.push(`## Live Session State\n\n${stateSections.slice(0, 2).map((s) => `### ${s.heading}\n${s.content}`).join('\n\n')}`);
  }

  if (aspects.length > 0) {
    sections.push(`## Active Aspects\n\n${formatAspects(aspects)}`);
  }

  if (entityCards.length > 0) {
    const roster = entityCards.map((e) => `- **${e.name}** (R${e.rank}) \`${e.token}\`${e.faction ? ` [${e.faction}]` : ''}`);
    sections.push(`## NPC Roster\n\n${roster.join('\n')}`);
  }

  const context = sections.join('\n\n---\n\n');

  return `You are a Nova Praxis TTRPG GM assistant framing a scene.

${context || 'No session data loaded.'}

## Scene to Frame

${description}

Respond with:
1. **Scene:** 2-3 sentence atmospheric opener
2. **Zones:** relevant zones with one trait each
3. **Aspects:** 2-3 scene aspects (double-edged FATE aspects)
4. **NPCs Present:** which NPCs are here and their initial stance
5. **Compel opportunity:** one immediate compel hook

Format for Discord. Keep it punchy and table-ready.`;
}

export async function buildRulesContext(question: string): Promise<{ fastAnswer: string | null; fullPrompt: string }> {
  const results = await searchRules(question);

  if (results.length > 0 && results[0].rank > 0.1) {
    const top = results[0];
    const answer = `**${top.heading}**\n\n${top.content}`;
    const source = `${top.file_path} (${top.subsystem || 'general'})`;
    return { fastAnswer: `${answer}\n\n**Source:** ${source}`, fullPrompt: '' };
  }

  let context = `## Rules Question\n\n${question}\n\n`;
  if (results.length > 0) {
    context += `## Possibly Relevant Rules Sections\n\n`;
    for (const r of results.slice(0, 3)) {
      context += `### ${r.heading} (${r.file_path})\n${r.content}\n\n`;
    }
  }
  context += `Answer using the /rules command format: **Answer**, **Exceptions/Modifiers**, **Source**, **Confidence**.`;

  return { fastAnswer: null, fullPrompt: context };
}

export async function buildRecapContext(): Promise<string> {
  const sessionNum = await getLatestSessionNum();
  if (!sessionNum) return `Generate a session recap. No session data found — has the vault been synced?`;

  // Parallel queries — was sequential before
  const [stateSections, guideSections, sceneSections, aspects] = await Promise.all([
    getSessionSections(sessionNum, 'state'),
    getSessionSections(sessionNum, 'guide'),
    getSessionSections(sessionNum, 'scenes'),
    getActiveAspects(sessionNum),
  ]);

  const sections: string[] = [];

  if (stateSections.length > 0) {
    sections.push(`## Session ${sessionNum} — Live State\n\n${stateSections.map((s) => `### ${s.heading}\n${s.content}`).join('\n\n')}`);
  }
  if (guideSections.length > 0) {
    sections.push(`## Session Guide\n\n${guideSections.slice(0, 5).map((s) => `### ${s.heading}\n${s.content}`).join('\n\n')}`);
  }
  if (sceneSections.length > 0) {
    sections.push(`## Scenes\n\n${sceneSections.slice(0, 5).map((s) => `### ${s.heading}\n${s.content}`).join('\n\n')}`);
  }
  if (aspects.length > 0) {
    sections.push(`## Active Aspects\n\n${formatAspects(aspects)}`);
  }

  const context = sections.join('\n\n---\n\n');
  return `Using session ${sessionNum} data below, generate a concise GM recap. Cover: what happened, where things stand, active aspects, and what's next. Under 20 lines. Format for Discord.\n\n${context}`;
}

export async function buildAspectsContext(subject: string): Promise<string> {
  const sessionNum = await getLatestSessionNum();

  const [stateSections, aspects] = await Promise.all([
    sessionNum ? getSessionSections(sessionNum, 'state') : Promise.resolve([]),
    sessionNum ? getActiveAspects(sessionNum) : Promise.resolve([]),
  ]);

  const sections: string[] = [];

  if (stateSections.length > 0) {
    sections.push(`## Current Session State\n\n${stateSections.slice(0, 2).map((s) => `### ${s.heading}\n${s.content}`).join('\n\n')}`);
  }
  if (aspects.length > 0) {
    sections.push(`## Already Active Aspects\n\n${formatAspects(aspects)}`);
  }

  const context = sections.join('\n\n---\n\n');

  return `You are generating FATE Aspects for a Nova Praxis campaign.

${context || ''}

## Request

Generate 3-5 double-edged FATE Aspects for: **${subject}**

Each aspect should:
- Be 3-8 words, punchy phrasing
- Work as both an invoke (benefit) AND a compel (complication)
- Fit the Nova Praxis transhuman sci-fi setting
- Not duplicate the already-active aspects listed above

Format as a numbered list with a brief note on how each can be invoked and compelled.`;
}

export async function buildGmStartContext(sessionNum?: number): Promise<string> {
  const num = sessionNum ?? (await getLatestSessionNum());
  if (!num) return 'No session data found in the database. Has the vault been synced?';

  // Load guide, scenes, state, and aspects in parallel
  const [guideSections, sceneSections, stateSections, aspects, entityCards] = await Promise.all([
    getSessionSections(num, 'guide'),
    getSessionSections(num, 'scenes'),
    getSessionSections(num, 'state'),
    getActiveAspects(num),
    listEntityCards(),
  ]);

  const sections: string[] = [];

  // Session guide (core runbook content)
  if (guideSections.length > 0) {
    sections.push(`## Session ${num} — Guide\n\n${guideSections.map((s) => `### ${s.heading}\n${s.content}`).join('\n\n')}`);
  }

  // Scene lineup
  if (sceneSections.length > 0) {
    sections.push(`## Scenes\n\n${sceneSections.map((s) => `### ${s.heading}\n${s.content}`).join('\n\n')}`);
  }

  // Live state (command board, dashboard)
  if (stateSections.length > 0) {
    sections.push(`## Live State\n\n${stateSections.map((s) => `### ${s.heading}\n${s.content}`).join('\n\n')}`);
  }

  // Active aspects
  if (aspects.length > 0) {
    const aspectLines = aspects.map((a) => {
      let line = `- [${a.type}] ${a.text}`;
      if (a.severity) line += ` — ${a.severity}`;
      if (a.source) line += ` (${a.source})`;
      return line;
    });
    sections.push(`## Active Aspects\n\n${aspectLines.join('\n')}`);
  }

  // NPC roster (names + ranks for quick reference)
  if (entityCards.length > 0) {
    const roster = entityCards.map((e) => `- **${e.name}** (R${e.rank} ${e.class || 'NPC'}) — \`${e.token}\`${e.faction ? ` [${e.faction}]` : ''}`);
    sections.push(`## NPC Roster\n\n${roster.join('\n')}`);
  }

  const context = sections.join('\n\n---\n\n');

  return `You are bootstrapping Session ${num} for a Nova Praxis FATE campaign. Using the session data below, produce a GM-ready briefing.

Format:
1. **Session Intent** — 2-3 sentence summary of what this session is about
2. **Scene Lineup** — numbered list of scenes with one-line summaries
3. **Key NPCs** — who matters this session, their stance, and command tokens
4. **Active Aspects** — any aspects already in play
5. **Exposure Clock** — current state and tick triggers
6. **Pre-Session Checklist** — decisions the GM needs to make before play starts
7. **Opening Line** — a suggested first narration line to kick off the session

Keep it scannable. Format for Discord: **bold**, *italic*, \`code\`, > blockquotes.

${context}`;
}
