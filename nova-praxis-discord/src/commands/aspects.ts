import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { isGM, requireGM } from '../middleware/permissions.js';
import { callApi } from '../claude/api.js';
import { buildAspectsContext } from '../claude/context.js';
import { gmResponseEmbed } from '../embeds/gm-response.js';
import { getLatestSessionNum, getCharacter } from '../db/queries.js';
import {
  createAspect,
  getActiveAspects,
  getVisibleAspects,
  getHiddenAspects,
  getAspectById,
  invokeAspect,
  compelAspect,
  removeAspect,
  clearSessionAspects,
} from '../db/aspect-queries.js';
import {
  aspectListEmbed,
  hiddenAspectListEmbed,
  aspectAddedEmbed,
  aspectInvokedEmbed,
  aspectCompelledEmbed,
  aspectClearedEmbed,
  aspectRemovedText,
} from '../embeds/aspect-embeds.js';
import { cacheAspectSuggestions } from '../aspect-cache.js';

const ASPECT_TYPES = [
  { name: 'Scene', value: 'scene' },
  { name: 'Hidden (GM-only)', value: 'hidden' },
  { name: 'Dynamic', value: 'dynamic' },
  { name: 'Consequence', value: 'consequence' },
  { name: 'Persistent', value: 'persistent' },
  { name: 'Zone', value: 'zone' },
  { name: 'Maneuver', value: 'maneuver' },
  { name: 'Character', value: 'character' },
  { name: 'Equipment', value: 'equipment' },
];

const SEVERITY_CHOICES = [
  { name: 'Mild', value: 'mild' },
  { name: 'Moderate', value: 'moderate' },
  { name: 'Severe', value: 'severe' },
  { name: 'Extreme', value: 'extreme' },
];

export const data = new SlashCommandBuilder()
  .setName('aspects')
  .setDescription('Manage FATE Aspects during play')

  .addSubcommand((sub) =>
    sub
      .setName('generate')
      .setDescription('[GM] Generate suggested aspects via Claude')
      .addStringOption((opt) =>
        opt.setName('subject').setDescription('What to generate aspects for').setRequired(true)
      )
  )

  .addSubcommand((sub) =>
    sub.setName('suggest').setDescription('[GM] Pull aspects from active scene/entity data')
  )

  .addSubcommand((sub) =>
    sub
      .setName('add')
      .setDescription('[GM] Add an aspect to the active scene')
      .addStringOption((opt) =>
        opt.setName('text').setDescription('The aspect text').setRequired(true)
      )
      .addStringOption((opt) =>
        opt
          .setName('type')
          .setDescription('Aspect type')
          .setRequired(true)
          .addChoices(...ASPECT_TYPES)
      )
      .addStringOption((opt) =>
        opt.setName('source').setDescription('Who/what this is attached to')
      )
      .addStringOption((opt) =>
        opt
          .setName('severity')
          .setDescription('Consequence severity (required for consequence type)')
          .addChoices(...SEVERITY_CHOICES)
      )
  )

  .addSubcommand((sub) =>
    sub.setName('list').setDescription('Show active aspects')
  )

  .addSubcommand((sub) =>
    sub
      .setName('invoke')
      .setDescription('Invoke an aspect')
      .addStringOption((opt) =>
        opt
          .setName('aspect')
          .setDescription('Aspect to invoke')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption((opt) =>
        opt
          .setName('player')
          .setDescription('Character invoking')
          .setRequired(true)
          .setAutocomplete(true)
      )
  )

  .addSubcommand((sub) =>
    sub
      .setName('compel')
      .setDescription('[GM] Compel an aspect on a player')
      .addStringOption((opt) =>
        opt
          .setName('aspect')
          .setDescription('Aspect to compel')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption((opt) =>
        opt
          .setName('player')
          .setDescription('Character being compelled')
          .setRequired(true)
          .setAutocomplete(true)
      )
  )

  .addSubcommand((sub) =>
    sub
      .setName('remove')
      .setDescription('[GM] Remove an aspect')
      .addStringOption((opt) =>
        opt
          .setName('aspect')
          .setDescription('Aspect to remove')
          .setRequired(true)
          .setAutocomplete(true)
      )
  )

  .addSubcommand((sub) =>
    sub.setName('clear').setDescription('[GM] Clear scene aspects (scene transition)')
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand();

  switch (sub) {
    case 'generate':
      return handleGenerate(interaction);
    case 'suggest':
      return handleSuggest(interaction);
    case 'add':
      return handleAdd(interaction);
    case 'list':
      return handleList(interaction);
    case 'invoke':
      return handleInvoke(interaction);
    case 'compel':
      return handleCompel(interaction);
    case 'remove':
      return handleRemove(interaction);
    case 'clear':
      return handleClear(interaction);
  }
}

async function handleGenerate(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  await interaction.deferReply({ ephemeral: true });

  const subject = interaction.options.getString('subject', true);

  try {
    const prompt = await buildAspectsContext(subject);
    const result = await callApi(prompt, 'quality');
    const embeds = gmResponseEmbed('Aspects', result.output);

    // Parse aspect lines and create "Add to Scene" buttons
    const aspects = parseAspectLines(result.output);
    const components = buildAddButtons(aspects, interaction.id);

    await interaction.editReply({ embeds, components });
  } catch (err) {
    await interaction.editReply({
      content: `Claude CLI error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}

async function handleSuggest(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  await interaction.deferReply({ ephemeral: true });

  try {
    const { getSessionSections, getLatestSessionNum: getNum } = await import('../db/queries.js');
    const sessionNum = await getNum();
    if (!sessionNum) {
      await interaction.editReply({ content: 'No active session data found. Use `/aspects generate` instead.' });
      return;
    }

    const sceneSections = await getSessionSections(sessionNum, 'scenes');
    if (sceneSections.length === 0) {
      await interaction.editReply({ content: 'No active scene data found. Use `/aspects generate` instead.' });
      return;
    }

    // Get the most recent scene
    const latestScene = sceneSections[sceneSections.length - 1];
    const extracted = extractAspectsFromContent(latestScene.content);

    if (extracted.length === 0) {
      await interaction.editReply({ content: 'No aspects found in scene data. Use `/aspects generate` instead.' });
      return;
    }

    const desc = extracted.map((a) => `- **${a}**`).join('\n');
    const embed = new (await import('discord.js')).EmbedBuilder()
      .setTitle('Suggested Aspects')
      .setDescription(desc)
      .setColor(0xed4245)
      .setFooter({ text: 'GM Only | Click to add to scene' });

    const components = buildAddButtons(extracted, interaction.id);

    await interaction.editReply({ embeds: [embed], components });
  } catch (err) {
    await interaction.editReply({
      content: `Error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}

async function handleAdd(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  const text = interaction.options.getString('text', true);
  const type = interaction.options.getString('type', true);
  const source = interaction.options.getString('source') ?? undefined;
  const severity = interaction.options.getString('severity') ?? undefined;

  if (type === 'consequence' && !severity) {
    await interaction.reply({
      content: 'Consequence aspects require a severity (mild/moderate/severe/extreme).',
      ephemeral: true,
    });
    return;
  }

  const sessionNum = await getLatestSessionNum();
  if (!sessionNum) {
    await interaction.reply({ content: 'No active session found.', ephemeral: true });
    return;
  }

  await createAspect(sessionNum, text, type, source, severity);

  const hidden = type === 'hidden';
  const embed = aspectAddedEmbed(text, type, source, hidden);
  await interaction.reply({ embeds: [embed], ephemeral: hidden });
}

async function handleList(interaction: ChatInputCommandInteraction) {
  const sessionNum = await getLatestSessionNum();
  if (!sessionNum) {
    await interaction.reply({ content: 'No active session found.', ephemeral: true });
    return;
  }

  const gm = isGM(interaction);

  const visible = await getVisibleAspects(sessionNum);
  const visibleEmbed = aspectListEmbed(visible, sessionNum);

  if (visible.length === 0 && !gm) {
    await interaction.reply({ content: 'No active aspects this session.', ephemeral: true });
    return;
  }

  await interaction.reply({ embeds: [visibleEmbed] });

  if (gm) {
    const hidden = await getHiddenAspects(sessionNum);
    if (hidden.length > 0) {
      const hiddenEmbed = hiddenAspectListEmbed(hidden, sessionNum);
      await interaction.followUp({ embeds: [hiddenEmbed], ephemeral: true });
    }
  }
}

async function handleInvoke(interaction: ChatInputCommandInteraction) {
  const aspectId = parseInt(interaction.options.getString('aspect', true));
  const playerName = interaction.options.getString('player', true);

  if (isNaN(aspectId)) {
    await interaction.reply({ content: 'Invalid aspect selection.', ephemeral: true });
    return;
  }

  // Permission check: GM can invoke for anyone, players only for their own character
  const gm = isGM(interaction);
  if (!gm) {
    const character = await getCharacter(playerName);
    if (!character || character.discord_user_id !== interaction.user.id) {
      await interaction.reply({
        content: 'You can only invoke aspects on your own character.',
        ephemeral: true,
      });
      return;
    }
  }

  try {
    const aspect = await getAspectById(aspectId);
    if (!aspect || !aspect.active) {
      await interaction.reply({ content: 'Aspect not active.', ephemeral: true });
      return;
    }

    const { free } = await invokeAspect(aspectId, playerName, interaction.user.id);
    const embed = aspectInvokedEmbed(aspect.text, playerName, free);
    await interaction.reply({ embeds: [embed] });
  } catch (err) {
    await interaction.reply({
      content: `Error: ${err instanceof Error ? err.message : 'unknown'}`,
      ephemeral: true,
    });
  }
}

async function handleCompel(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  const aspectId = parseInt(interaction.options.getString('aspect', true));
  const playerName = interaction.options.getString('player', true);

  if (isNaN(aspectId)) {
    await interaction.reply({ content: 'Invalid aspect selection.', ephemeral: true });
    return;
  }

  try {
    const aspect = await getAspectById(aspectId);
    if (!aspect || !aspect.active) {
      await interaction.reply({ content: 'Aspect not active.', ephemeral: true });
      return;
    }

    await compelAspect(aspectId, playerName, interaction.user.id);
    const embed = aspectCompelledEmbed(aspect.text, playerName);
    await interaction.reply({ embeds: [embed] });
  } catch (err) {
    await interaction.reply({
      content: `Error: ${err instanceof Error ? err.message : 'unknown'}`,
      ephemeral: true,
    });
  }
}

async function handleRemove(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  const aspectId = parseInt(interaction.options.getString('aspect', true));

  if (isNaN(aspectId)) {
    await interaction.reply({ content: 'Invalid aspect selection.', ephemeral: true });
    return;
  }

  const removed = await removeAspect(aspectId);
  if (!removed) {
    await interaction.reply({ content: 'Aspect not found or already removed.', ephemeral: true });
    return;
  }

  await interaction.reply({ content: aspectRemovedText(removed.text), ephemeral: true });
}

async function handleClear(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  const sessionNum = await getLatestSessionNum();
  if (!sessionNum) {
    await interaction.reply({ content: 'No active session found.', ephemeral: true });
    return;
  }

  // Check if there are any clearable aspects
  const active = await getActiveAspects(sessionNum);
  const clearable = active.filter(
    (a) =>
      ['scene', 'hidden', 'dynamic', 'zone', 'maneuver'].includes(a.type) ||
      (a.type === 'consequence' && a.severity === 'mild')
  );

  if (clearable.length === 0) {
    await interaction.reply({ content: 'No aspects to clear.', ephemeral: true });
    return;
  }

  // Send confirmation button
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`aspect_clear_confirm_${sessionNum}`)
      .setLabel(`Clear ${clearable.length} aspect${clearable.length === 1 ? '' : 's'}`)
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('aspect_clear_cancel')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary)
  );

  await interaction.reply({
    content: `This will remove **${clearable.length}** scene/transient aspects. Persistent, character, equipment, and moderate+ consequence aspects will survive.`,
    components: [row],
    ephemeral: true,
  });
}

// --- Helpers ---

export function parseAspectLines(text: string): string[] {
  const aspects: string[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    // Match "- **Aspect Text**" or "- *Aspect Text*" or "- Aspect Text"
    const boldMatch = line.match(/^[-*]\s+\*{1,2}([^*]+)\*{1,2}/);
    if (boldMatch) {
      aspects.push(boldMatch[1].trim());
      continue;
    }
    // Match "Aspect:" labeled lines
    const labelMatch = line.match(/Aspect:\s*(.+)/i);
    if (labelMatch) {
      aspects.push(labelMatch[1].trim());
    }
  }

  return aspects.slice(0, 10); // cap at 10
}

function extractAspectsFromContent(content: string): string[] {
  return parseAspectLines(content);
}

function buildAddButtons(
  aspects: string[],
  interactionId: string
): ActionRowBuilder<ButtonBuilder>[] {
  const toShow = aspects.slice(0, 5);
  if (toShow.length === 0) return [];

  // Cache the aspect texts for button handler
  cacheAspectSuggestions(interactionId, toShow);

  const row = new ActionRowBuilder<ButtonBuilder>();
  for (let i = 0; i < toShow.length; i++) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`aspect_add_${interactionId}_${i}`)
        .setLabel(toShow[i].slice(0, 80))
        .setStyle(ButtonStyle.Primary)
    );
  }

  return [row];
}
