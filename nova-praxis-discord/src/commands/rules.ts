import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { isGM } from '../middleware/permissions.js';
import { callApi } from '../claude/api.js';
import { buildRulesContext } from '../claude/context.js';
import { gmResponseEmbed, rulesEmbed } from '../embeds/gm-response.js';
import { playerResponseEmbed } from '../embeds/player-response.js';
import { cacheForShare } from '../share-cache.js';
import { shareButton } from '../embeds/share-button.js';

export const data = new SlashCommandBuilder()
  .setName('rules')
  .setDescription('Look up game rules')
  .addStringOption((opt) =>
    opt.setName('question').setDescription('Rules question').setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const question = interaction.options.getString('question', true);
  const gm = isGM(interaction);

  // Defer immediately so Discord doesn't expire the interaction
  await interaction.deferReply({ flags: gm ? MessageFlags.Ephemeral : undefined });

  try {
    // Try fast path first
    const { fastAnswer, fullPrompt } = await buildRulesContext(question);

    if (fastAnswer) {
      const parts = fastAnswer.split('\n\n**Source:**');
      const answer = parts[0];
      const source = parts[1]?.trim() || 'Indexed rules';
      if (gm) {
        const customId = cacheForShare('Rules Lookup', fastAnswer, interaction.user.id);
        await interaction.editReply({
          embeds: [rulesEmbed(answer, source)],
          components: [shareButton(customId)],
        });
      } else {
        await interaction.editReply({
          embeds: [rulesEmbed(answer, source)],
        });
      }
      return;
    }

    // Escalate to Claude CLI
    const result = await callApi(fullPrompt, 'fast');
    if (gm) {
      const customId = cacheForShare('Rules', result.output, interaction.user.id);
      const embeds = gmResponseEmbed('Rules', result.output);
      await interaction.editReply({ embeds, components: [shareButton(customId)] });
    } else {
      const embeds = playerResponseEmbed('Rules', result.output);
      await interaction.editReply({ embeds });
    }
  } catch (err) {
    await interaction.editReply({
      content: `Claude CLI error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
