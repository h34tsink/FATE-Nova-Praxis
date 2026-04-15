import { SlashCommandBuilder, ChatInputCommandInteraction, TextChannel, MessageFlags } from 'discord.js';
import { requireGM } from '../middleware/permissions.js';
import { streamApi } from '../claude/api.js';
import { buildNpcContext } from '../claude/context.js';
import { gmResponseEmbed } from '../embeds/gm-response.js';
import { sendAsNpc } from '../webhooks.js';
import { cacheForShare } from '../share-cache.js';
import { shareButton } from '../embeds/share-button.js';

export const data = new SlashCommandBuilder()
  .setName('npc')
  .setDescription('[GM] Generate NPC dialogue')
  .addStringOption((opt) =>
    opt.setName('token').setDescription('NPC token (e.g., nowak, kestrel)').setRequired(true).setAutocomplete(true)
  )
  .addStringOption((opt) =>
    opt.setName('situation').setDescription('Scene context or player question').setRequired(false)
  );

/**
 * Split Claude output into dialogue (for webhook) and GM notes (for embed).
 * Dialogue is lines starting with > (blockquote).
 * Everything else (Intent, Hidden truth) is GM-only.
 */
function splitDialogueAndNotes(output: string): { dialogue: string; gmNotes: string } {
  const lines = output.split('\n');
  const dialogueLines: string[] = [];
  const noteLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('>')) {
      // Strip the > prefix for webhook display
      dialogueLines.push(line.replace(/^>\s*/, ''));
    } else {
      noteLines.push(line);
    }
  }

  return {
    dialogue: dialogueLines.join('\n').trim(),
    gmNotes: noteLines.join('\n').trim(),
  };
}

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  if (!(await requireGM(interaction))) return;

  const token = interaction.options.getString('token', true);
  const situation = interaction.options.getString('situation') || '';

  try {
    const prompt = await buildNpcContext(token, situation);
    const result = await streamApi(prompt, 'quality', undefined, async (text) => {
      await interaction.editReply({ embeds: gmResponseEmbed(`NPC: ${token}`, text) }).catch(() => {});
    });

    const { dialogue, gmNotes } = splitDialogueAndNotes(result.output);
    const channel = interaction.channel;
    const customId = cacheForShare(`NPC: ${token}`, result.output, interaction.user.id);

    // Try webhook mode for NPC dialogue, fall back to embed
    let webhookSent = false;
    if (dialogue && channel instanceof TextChannel) {
      try {
        await sendAsNpc(channel, token, dialogue);
        webhookSent = true;
      } catch {
        // Webhook failed (missing permissions) — fall back to embed
      }
    }

    // If webhook failed or no dialogue split, send full response as embed
    if (!webhookSent) {
      const embeds = gmResponseEmbed(`NPC: ${token}`, result.output);
      await interaction.editReply({ embeds, components: [shareButton(customId)] });
      return;
    }

    // Send GM notes as ephemeral reply (only GM sees)
    if (gmNotes) {
      const embeds = gmResponseEmbed(`GM Notes: ${token}`, gmNotes);
      await interaction.editReply({ embeds, components: [shareButton(customId)] });
    } else {
      await interaction.editReply({
        content: 'Dialogue sent.',
        components: [shareButton(customId)],
      });
    }
  } catch (err) {
    await interaction.editReply({
      content: `Claude CLI error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
