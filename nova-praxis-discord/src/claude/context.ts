import { getEntityCard, getEntityCardByName, searchRules, searchGameData, searchGlossary, getLatestSessionNum, getSessionSections, listEntityCards } from '../db/queries.js';
import { getActiveAspects } from '../db/aspect-queries.js';

export async function buildNpcContext(token: string, situation: string): Promise<string> {
  const card = await getEntityCard(token) || await getEntityCardByName(token);

  let context = '';
  if (card) {
    context += `## Entity Card for ${card.name}\n\n${card.full_card}\n\n`;
  }

  context += `## Dialogue Request\n\n`;
  context += `Generate in-character dialogue for ${card?.name || token}.\n`;
  if (situation) {
    context += `Situation: ${situation}\n`;
  }
  context += `\nRespond using the /npc command format from the nova-praxis-gm plugin.`;

  return context;
}

export async function buildSceneContext(description: string): Promise<string> {
  let context = `## Scene Framing Request\n\n`;
  context += `Frame a scene: ${description}\n\n`;
  context += `Respond using the /scene command format from the nova-praxis-gm plugin.`;
  return context;
}

export async function buildRulesContext(question: string): Promise<{ fastAnswer: string | null; fullPrompt: string }> {
  // Try fast path — pg tsvector search
  const results = await searchRules(question);

  if (results.length > 0 && results[0].rank > 0.1) {
    // High confidence — return pg result directly
    const top = results[0];
    const answer = `**${top.heading}**\n\n${top.content}`;
    const source = `${top.file_path} (${top.subsystem || 'general'})`;
    return { fastAnswer: `${answer}\n\n**Source:** ${source}`, fullPrompt: '' };
  }

  // Low confidence — escalate to Claude CLI
  let context = `## Rules Question\n\n${question}\n\n`;
  if (results.length > 0) {
    context += `## Possibly Relevant Rules Sections\n\n`;
    for (const r of results.slice(0, 3)) {
      context += `### ${r.heading} (${r.file_path})\n${r.content}\n\n`;
    }
  }
  context += `Respond using the /rules command format from the nova-praxis-gm plugin.`;

  return { fastAnswer: null, fullPrompt: context };
}

export async function buildRecapContext(): Promise<string> {
  const sessionNum = await getLatestSessionNum();
  if (!sessionNum) return `Generate a session recap using the /recap command format from the nova-praxis-gm plugin.`;

  const sections: string[] = [];

  // Get state files first (GM Command Board, Live Dashboard)
  const stateSections = await getSessionSections(sessionNum, 'state');
  if (stateSections.length > 0) {
    sections.push(`## Session ${sessionNum} — Live State\n\n${stateSections.map((s) => `### ${s.heading}\n${s.content}`).join('\n\n')}`);
  }

  // Get guide/index
  const guideSections = await getSessionSections(sessionNum, 'guide');
  if (guideSections.length > 0) {
    sections.push(`## Session Guide\n\n${guideSections.slice(0, 5).map((s) => `### ${s.heading}\n${s.content}`).join('\n\n')}`);
  }

  // Get scenes
  const sceneSections = await getSessionSections(sessionNum, 'scenes');
  if (sceneSections.length > 0) {
    sections.push(`## Scenes\n\n${sceneSections.slice(0, 5).map((s) => `### ${s.heading}\n${s.content}`).join('\n\n')}`);
  }

  // Get active aspects
  const aspects = await getActiveAspects(sessionNum);
  if (aspects.length > 0) {
    const aspectLines = aspects.map((a) => {
      let line = `- [${a.type}] ${a.text}`;
      if (a.severity) line += ` — ${a.severity}`;
      if (a.source) line += ` (${a.source})`;
      return line;
    });
    sections.push(`## Active Aspects\n\n${aspectLines.join('\n')}`);
  }

  const context = sections.join('\n\n---\n\n');
  return `Using the following session ${sessionNum} data from the database, generate a recap using the /recap command format from the nova-praxis-gm plugin.\n\n${context}`;
}

export async function buildAspectsContext(subject: string): Promise<string> {
  return `Generate FATE Aspects for: ${subject}\n\nRespond using the /aspects command format from the nova-praxis-gm plugin.`;
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
